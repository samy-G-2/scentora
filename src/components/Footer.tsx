import { MapPin, Phone, Mail, MessageCircle, Camera, Globe, Send } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer = ({ onNavigate }: FooterProps) => {
  return (
    <footer className="bg-primary text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold mb-2">
                Rejoignez Notre Newsletter
              </h3>
              <p className="text-gray-400 text-sm">
                Recevez nos offres exclusives et nouveautés en avant-première
              </p>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 md:w-64 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold"
              />
              <button className="px-6 py-3 bg-gold text-primary font-bold rounded-lg hover:bg-gold-light transition-colors">
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-serif font-bold mb-4">
              SCENT<span className="text-gold">ORA</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Votre boutique de parfums orientaux authentiques en Algérie. Lattafa, Rasasi, Afnan, Armaf et plus encore.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-primary transition-colors">
                <Camera size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-primary transition-colors">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-primary transition-colors">
                <Send size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-5">Navigation</h4>
            <ul className="space-y-3">
              <li><button onClick={() => onNavigate('home')} className="text-gray-400 hover:text-gold text-sm transition-colors">Accueil</button></li>
              <li><button onClick={() => onNavigate('home')} className="text-gray-400 hover:text-gold text-sm transition-colors">Boutique</button></li>
              <li><button onClick={() => onNavigate('about')} className="text-gray-400 hover:text-gold text-sm transition-colors">À Propos</button></li>
              <li><button onClick={() => onNavigate('contact')} className="text-gray-400 hover:text-gold text-sm transition-colors">Contact</button></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-5">Services</h4>
            <ul className="space-y-3">
              <li className="text-gray-400 text-sm flex items-center gap-2">✅ Parfums 100% originaux</li>
              <li className="text-gray-400 text-sm flex items-center gap-2">🚚 Livraison 58 wilayas</li>
              <li className="text-gray-400 text-sm flex items-center gap-2">💳 Paiement à la livraison</li>
              <li className="text-gray-400 text-sm flex items-center gap-2">📦 Emballage premium</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <MessageCircle size={18} className="text-green-500" />
                <a href="https://wa.me/213555741929" className="text-gray-400 hover:text-gold text-sm transition-colors">+213 555 741 929</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-gold" />
                <span className="text-gray-400 text-sm">+213 555 741 929</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gold" />
                <span className="text-gray-400 text-sm">contact@scentora.dz</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-gold" />
                <span className="text-gray-400 text-sm">Alger, Algérie 🇩🇿</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} SCENTORA. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-gray-500 text-xs">
            <span>100% Authentique</span>
            <span>•</span>
            <span>Livraison Express</span>
            <span>•</span>
            <span>Paiement Sécurisé</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
