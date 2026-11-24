#!/usr/bin/env python3
"""Serveur statique pour la page de téléchargement Scentora.

- écoute sur 0.0.0.0:8100 (accessible via l'aperçu Arena / e2b)
- support des requêtes HTTP Range (206) → lecture et déplacement dans les vidéos
- en-têtes ouverts pour l'iframe d'aperçu (frame-ancestors *, CORS *)
- "/" redirige vers /telecharger.html
"""
import os
import re
import shutil
import http.server
import socketserver

PORT = int(os.environ.get("PORT", "8100"))
ROOT = os.path.dirname(os.path.abspath(__file__))
HOME_PAGE = "/telecharger.html"
RANGE_RE = re.compile(r"bytes=(\d*)-(\d*)$")


class Handler(http.server.SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    # ---- redirections -------------------------------------------------
    def _redirect_home(self):
        self.send_response(302)
        self.send_header("Location", HOME_PAGE)
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        if self.path in ("/", "/index.html"):
            return self._redirect_home()
        super().do_GET()

    def do_HEAD(self):
        if self.path in ("/", "/index.html"):
            return self._redirect_home()
        super().do_HEAD()

    # ---- en-têtes communs --------------------------------------------
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Content-Security-Policy", "frame-ancestors *")
        super().end_headers()

    # ---- types MIME ---------------------------------------------------
    def guess_type(self, path):
        ext = os.path.splitext(path)[1].lower()
        return {
            ".mp4": "video/mp4",
            ".mp3": "audio/mpeg",
            ".zip": "application/zip",
            ".svg": "image/svg+xml",
            ".woff2": "font/woff2",
        }.get(ext) or super().guess_type(path)

    # ---- HTTP Range ---------------------------------------------------
    def send_head(self):
        rng = self.headers.get("Range")
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        if not os.path.isfile(path):
            return super().send_head()

        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        size = os.fstat(f.fileno()).st_size
        ctype = self.guess_type(path)
        m = RANGE_RE.match((rng or "").strip())

        if m and (m.group(1) or m.group(2)):
            start = int(m.group(1)) if m.group(1) else None
            end = int(m.group(2)) if m.group(2) else None
            if start is None:                       # suffixe : bytes=-N
                start = max(0, size - (end or 0))
                end = size - 1
            else:
                end = size - 1 if end is None else min(end, size - 1)
            if start >= size or start > end:
                self.send_response(416)
                self.send_header("Content-Range", f"bytes */{size}")
                self.send_header("Content-Length", "0")
                self.end_headers()
                f.close()
                return None

            length = end - start + 1
            f.seek(start)
            self.send_response(206)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
            self.send_header("Content-Length", str(length))
            self.send_header("Accept-Ranges", "bytes")
            self.end_headers()
            self._range_bytes = length
            return f

        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(size))
        self.send_header("Accept-Ranges", "bytes")
        self.end_headers()
        self._range_bytes = size
        return f

    def copyfile(self, source, outputfile):
        limit = getattr(self, "_range_bytes", None)
        if limit is None:
            return super().copyfile(source, outputfile)
        remaining = limit
        while remaining > 0:
            chunk = source.read(min(256 * 1024, remaining))
            if not chunk:
                break
            try:
                outputfile.write(chunk)
            except (ConnectionResetError, BrokenPipeError):
                break
            remaining -= len(chunk)

    # ---- robustesse réseau -------------------------------------------
    def handle_one_request(self):
        try:
            super().handle_one_request()
        except (ConnectionResetError, BrokenPipeError):
            self.close_connection = True

    # ---- logs sobres --------------------------------------------------
    def log_message(self, fmt, *args):
        print("%s - %s" % (self.address_string(), fmt % args), flush=True)


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True

    def handle_error(self, request, client_address):
        # le navigateur coupe souvent les flux vidéo : pas de traceback dans les logs
        import sys
        exc = sys.exc_info()[1]
        if isinstance(exc, (ConnectionResetError, BrokenPipeError, TimeoutError)):
            return
        super().handle_error(request, client_address)


if __name__ == "__main__":
    with Server(("0.0.0.0", PORT), Handler) as httpd:
        print(f"Scentora — http://0.0.0.0:{PORT}{HOME_PAGE}", flush=True)
        httpd.serve_forever()
