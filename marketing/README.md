# 🎬 Spot publicitaire Scentora

Vidéo publicitaire verticale **1080 × 1920 (9:16), 30 s, 30 fps** avec montage dynamique,
animations, zooms, stickers « cute », et une **musique originale synthétisée** (aucun sample
tiers → zéro problème de droits, monetisation OK).

## Fichiers livrés (`marketing/video/`)

| Fichier | Usage |
| --- | --- |
| `scentora-pub-vo-1080x1920.mp4` | **Version avec voix off** — Reels, TikTok, Shorts, Stories |
| `scentora-pub-1080x1920.mp4` | Version **musique seule** (idéale pour poster avec un son tendance de la plateforme) |
| `scentora-pub-vo-1080x1080.mp4` / `scentora-pub-1080x1080.mp4` | Recadrages carrés (feed Instagram / Facebook) |
| `scentora-soundtrack-vo.mp3` / `scentora-soundtrack.mp3` | La bande son seule (avec / sans voix) |

## Storyboard (30 s)

| Temps | Séquence | Visuel / animation |
| --- | --- | --- |
| 0 – 2,4 s | **Hook** | Logo Scentora sculpté or, anneaux dorés en rotation, particules, flash d'ouverture |
| 2,4 – 6 s | **Héros — Khamrah** | Flacon en pop-in élastique, prix qui rebondit, badge « Best-seller N°1 », balayage de lumière |
| 6 – 8,8 s | **Quiz parfum** | Carte glassmorphism, « ? » flottant, chips qui apparaissent en cascade, CTA, cœurs roses |
| 8,8 – 12,2 s | **Best-sellers** | Trio Asad / 9PM / Club de Nuit en cartes 3D, badges −%, zoom sur le « -24% » en fond |
| 12,2 – 15,4 s | **Performance** | Zoom macro, ondes de sillage, barres de stats animées (tenue, sillage, intensité) |
| 15,4 – 18,2 s | **Yara « cute »** | Fond pastel rose, médaillon circulaire, cœurs et étincelles flottants, badge tendance |
| 18,2 – 21,4 s | **Livraison** | Carte de points dorés, pin qui tombe, 3 cartes icônes (paiement à la livraison…) |
| 21,4 – 24,6 s | **Authenticité** | Sceau doré qui tourne, coche dessinée, puces « hologramme / scellé / import » |
| 24,6 – 27,2 s | **Preuve sociale** | 4,9/5 géant, étoiles en pop, 2 bulles d'avis clients |
| 27,2 – 30 s | **Outro CTA** | Confettis dorés, gros bouton WhatsApp « COMMANDER », URL, garanties |

Transitions : flashs blancs courts, whip de lumière, punch-zooms sur les impacts musicaux
(kick/boom) placés exactement sur les changements de carton.

## Musique

Amapiano / pop moderne **120 BPM** en La majeur, synthétisée note par note
(`marketing/audio-engine.js`) :

- kick 4/4 + kick « off » amapiano, claps, hats 16ᵉ, shakers
- **log drum** mélodique (le son signature afrobeats/amapiano) + sub bass
- nappes de pads, hook de cloches avec delay, risers, whooshes, impacts
- intro riser + drop à 4 s, break « cute » à 20 s, final large à 28 s
- masterisé : compression + limiteur, ≈ −11,6 LUFS intégré (niveau réseaux sociaux)

## Voix off (optionnelle)

`marketing/vo/script.json` décrit les 5 répliques placées dans le spot
(intro, performance, Yara, livraison, CTA final) avec leur point d'entrée et leur tempo.
`node mix.mjs` nettoie chaque prise (silences coupés, compression, fondu), les place,
puis applique un **ducking** : la musique baisse automatiquement sous la voix (sidechain),
le tout normalisé à −14 LUFS.

Les répliques trop longues pour leur carton (« Khamrah… », « Asad, 9PM… », « 1 200 clients… »)
sont conservées dans `marketing/vo/` et notées dans `script.json > reserve` : avec une voix
plus rapide, on peut les intégrer pour une version « tout commenté ».

## Régénérer / personnaliser

```bash
cd marketing
npm install          # puppeteer-core + chromium serverless + ffmpeg
node render.mjs      # produit out/scentora-pub.mp4 (+ soundtrack.wav)
node snapshot.mjs 3.5 10 17   # aperçus PNG à des instants précis (debug)
```

- **Textes, prix, séquences** → `render/film.js` (un objet par scène dans `scenes`)
- **Musique** → `audio-engine.js` (tempo, accords `PROG`, patterns `LOG_PATTERN`, `HOOK`)
- **Images** → `assets/` (photos produits découpées en PNG transparents + fonds flous)
  et `sources/` (photos d'origine)
- Polices : Montserrat, Playfair Display, Caveat, Bebas Neue (`fonts/`, licences OFL)

## ⚠️ À vérifier avant diffusion

Les tarifs, le numéro WhatsApp et la mention « + de 1 200 clients / 4,9/5 » sont repris
du site : vérifiez qu'ils sont à jour et exacts (une pub ne doit pas afficher d'avis inventés).
Les photos produits proviennent des fiches produit du site ; l'usage commercial de visuels
de marques tierces (Lattafa, Afnan, Armaf) reste à valider de votre côté.
