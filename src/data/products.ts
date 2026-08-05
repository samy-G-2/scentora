export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: 'homme' | 'femme' | 'unisex' | 'coffret';
  badge?: string;
  description: string;
  notes: FragranceNotes;
  concentration: string;
  volume: string;
  sillage: number;
  longevity: number;
  intensity: 'Légère' | 'Modérée' | 'Forte' | 'Très Forte' | 'Bête de Sillage';
  season: string[];
  occasion: string[];
  family: string;
  inspiredBy?: string;
  targetAge?: string;
  style?: string[];
  fragranticaUrl?: string;
}

export const collections = [
  { id: 'ete', label: '☀️ Parfums d\'été', icon: '☀️', filter: (p: Product) => p.season.includes('Été') && p.category !== 'coffret' },
  { id: 'hiver', label: '❄️ Parfums d\'hiver', icon: '❄️', filter: (p: Product) => p.season.includes('Hiver') && !p.season.includes('Été') && p.category !== 'coffret' },
  { id: 'soiree', label: '🌙 Soirée', icon: '🌙', filter: (p: Product) => p.occasion.includes('Soirée') && p.category !== 'coffret' },
  { id: 'bureau', label: '💼 Bureau', icon: '💼', filter: (p: Product) => (p.occasion.includes('Bureau') || p.occasion.includes('Quotidien')) && p.category !== 'coffret' },
  { id: 'budget', label: '💰 Moins de 6000 DA', icon: '💰', filter: (p: Product) => p.price < 6000 && p.category !== 'coffret' },
  { id: 'puissant', label: '👑 Les plus puissants', icon: '👑', filter: (p: Product) => p.sillage >= 5 && p.category !== 'coffret' },
  { id: 'cadeau', label: '🎁 Coffrets cadeaux', icon: '🎁', filter: (p: Product) => p.category === 'coffret' },
  { id: 'bestseller', label: '🔥 Meilleures ventes', icon: '🔥', filter: (p: Product) => (p.badge?.includes('Best-Seller') ?? false) },
];

export const inspirationMap: Record<string, { ids: number[]; label: string }> = {
  'Dior Sauvage Elixir': { ids: [2], label: 'Asad offre la même puissance épicée-boisée à un prix 5x inférieur' },
  'Baccarat Rouge 540': { ids: [1, 9], label: 'Khamrah et Raghba partagent cette douceur ambrée-vanillée caractéristique' },
  'Creed Aventus': { ids: [4, 11], label: 'Club de Nuit Intense et Supremacy Silver capturent cet ADN fruité-boisé' },
  'JPG Ultra Male': { ids: [3], label: '9PM reproduit fidèlement ce mélange lavande-cannelle-vanille addictif' },
  'Invictus Aqua': { ids: [5], label: 'Hawas offre cette fraîcheur aquatique puissante avec une tenue supérieure' },
  'YSL Libre': { ids: [6, 8], label: 'Yara et Ajwad Pink to Pink partagent cette élégance florale-gourmande' },
  'Parfums de Marly Delina': { ids: [14], label: 'Ameerat Al Arab Privé Rose capture cette noblesse florale-rosée' },
};

export const products: Product[] = [
  {
    id: 1,
    name: "Khamrah",
    brand: "Lattafa",
    price: 7500,
    oldPrice: 8900,
    image: "https://www.lattafa-usa.com/cdn/shop/files/Khamrah-1.png?v=1747418862&width=900",
    category: "unisex",
    badge: "Best-Seller 🔥",
    description: "Chef-d'œuvre oriental gourmand. Un mélange enivrant d'épices chaudes, de dattes sucrées et de vanille crémeuse. Ce parfum captivant offre une expérience olfactive riche et complexe qui évolue magnifiquement sur la peau.",
    notes: {
      top: ["Cannelle", "Noix de muscade", "Bergamote"],
      heart: ["Dattes", "Praline", "Tubéreuse", "Muguet"],
      base: ["Vanille", "Tonka", "Myrrhe", "Ambre", "Benjoin"]
    },
    concentration: "Eau de Parfum",
    volume: "100 ML",
    sillage: 5,
    longevity: 10,
    intensity: "Très Forte",
    season: ["Automne", "Hiver"],
    occasion: ["Soirée", "Rendez-vous", "Occasion spéciale"],
    family: "Oriental Gourmand",
    fragranticaUrl: "https://www.fragrantica.fr/parfum/Lattafa-Perfumes/Khamrah-75805.html"
  },
  {
    id: 2,
    name: "Asad",
    brand: "Lattafa",
    price: 6900,
    oldPrice: 8200,
    image: "https://www.lattafa-usa.com/cdn/shop/files/Asad-1.png?v=1747416375&width=900",
    category: "homme",
    badge: "Best-Seller 🔥",
    description: "Masculin, sombre et addictif. Asad allie la puissance du poivre noir à la douceur du café et de la vanille. Un parfum de caractère inspiré des grandes créations niche, à un prix imbattable.",
    notes: {
      top: ["Poivre noir", "Ananas", "Tabac"],
      heart: ["Café", "Iris", "Patchouli"],
      base: ["Vanille", "Ambre", "Bois sec", "Benjoin", "Labdanum"]
    },
    concentration: "Eau de Parfum",
    volume: "100 ML",
    sillage: 5,
    longevity: 10,
    intensity: "Bête de Sillage",
    season: ["Automne", "Hiver"],
    occasion: ["Soirée", "Rendez-vous", "Quotidien"],
    family: "Oriental Boisé",
    fragranticaUrl: "https://www.fragrantica.fr/parfum/Lattafa-Perfumes/Asad-72821.html"
  },
  {
    id: 3,
    name: "9PM",
    brand: "Afnan",
    price: 6500,
    oldPrice: 7800,
    image: "https://ma.afnan.com/cdn/shop/files/9PM-Product-01_2.jpg?v=1765370654&width=900",
    category: "homme",
    badge: "Populaire ⭐",
    description: "Le compagnon parfait pour vos soirées. 9PM combine fraîcheur et sensualité avec un mélange addictif de lavande, cannelle et vanille qui ne laisse personne indifférent.",
    notes: {
      top: ["Bergamote", "Lavande", "Cannelle", "Pomme"],
      heart: ["Muguet", "Fleur d'oranger"],
      base: ["Patchouli", "Ambre", "Vanille", "Tonka"]
    },
    concentration: "Eau de Parfum",
    volume: "100 ML",
    sillage: 4,
    longevity: 8,
    intensity: "Forte",
    season: ["Automne", "Hiver", "Printemps"],
    occasion: ["Soirée", "Rendez-vous", "Club"],
    family: "Oriental Épicé",
    fragranticaUrl: "https://www.fragrantica.fr/parfum/Afnan/9pm-65414.html"
  },
  {
    id: 4,
    name: "Club de Nuit Intense",
    brand: "Armaf",
    price: 8500,
    oldPrice: 9900,
    image: "https://shop.simon.com/cdn/shop/files/89f4b142ec2b4f8c91e6665d59057ada.jpg?v=1749483651",
    category: "homme",
    badge: "Best-Seller 🔥",
    description: "Le légendaire CDNIM, l'un des parfums les plus vendus au monde. Son ouverture explosive de citron et d'ananas évolue vers un fond boisé et musqué irrésistible.",
    notes: {
      top: ["Citron", "Ananas", "Cassis", "Pomme", "Bergamote"],
      heart: ["Rose", "Bouleau", "Jasmin"],
      base: ["Musc", "Ambre gris", "Patchouli", "Vanille"]
    },
    concentration: "Eau de Parfum",
    volume: "105 ML",
    sillage: 5,
    longevity: 10,
    intensity: "Bête de Sillage",
    season: ["Printemps", "Été", "Automne"],
    occasion: ["Quotidien", "Bureau", "Soirée", "Rendez-vous"],
    family: "Boisé Fruité",
    fragranticaUrl: "https://www.fragrantica.fr/parfum/Armaf/Club-de-Nuit-Intense-Man-34696.html"
  },
  {
    id: 5,
    name: "Hawas",
    brand: "Rasasi",
    price: 9200,
    oldPrice: 10800,
    image: "https://shop.simon.com/cdn/shop/files/4c59d5740b9f4ee586a231def4afc822.jpg?v=1729278074",
    category: "homme",
    badge: "Premium ✨",
    description: "Un parfum aquatique oriental d'une puissance rare. Hawas capture l'énergie de l'océan avec des notes marines vibrantes, relevées par un fond ambré et boisé.",
    notes: {
      top: ["Bergamote", "Mangue", "Ambroxan"],
      heart: ["Notes marines", "Cannelle", "Cardamome"],
      base: ["Ambre", "Musc", "Bois de santal", "Patchouli"]
    },
    concentration: "Eau de Parfum",
    volume: "100 ML",
    sillage: 5,
    longevity: 12,
    intensity: "Bête de Sillage",
    season: ["Printemps", "Été"],
    occasion: ["Quotidien", "Plage", "Sport", "Rendez-vous"],
    family: "Aquatique Oriental",
    fragranticaUrl: "https://www.fragrantica.fr/parfum/Rasasi/Hawas-for-Him-46890.html"
  },
  {
    id: 6,
    name: "Yara",
    brand: "Lattafa",
    price: 6500,
    oldPrice: 7900,
    image: "https://www.lattafa-usa.com/cdn/shop/files/Yara-1.png?v=1747424447&width=900",
    category: "femme",
    badge: "Tendance 🌸",
    description: "Un voile gourmand et féminin. Yara enveloppe de douceur avec ses notes fruitées et sa base crémeuse de vanille et musc blanc. Un parfum addictif au quotidien.",
    notes: {
      top: ["Orchidée", "Héliotrope", "Fruit de la passion"],
      heart: ["Gourmand", "Fleurs blanches"],
      base: ["Vanille", "Musc blanc", "Bois de santal"]
    },
    concentration: "Eau de Parfum",
    volume: "100 ML",
    sillage: 3,
    longevity: 8,
    intensity: "Modérée",
    season: ["Printemps", "Été", "Automne"],
    occasion: ["Quotidien", "Bureau", "Brunch", "Rendez-vous"],
    family: "Floral Gourmand",
    fragranticaUrl: "https://www.fragrantica.fr/parfum/Lattafa-Perfumes/Yara-76880.html"
  },
  {
    id: 7,
    name: "Bade'e Al Oud Amethyst",
    brand: "Lattafa",
    price: 7900,
    oldPrice: 9500,
    image: "https://www.lattafa-usa.com/cdn/shop/files/Badee-Al-Oud-Amethyst-1.png?v=1747416479&width=900",
    category: "unisex",
    badge: "Exclusif 💎",
    description: "L'oud dans toute sa noblesse. Ce parfum d'exception marie la rose bulgare au safran et au bois d'agar, créant une symphonie olfactive riche et envoûtante.",
    notes: {
      top: ["Bergamote", "Poivre rose"],
      heart: ["Rose bulgare", "Rose turque", "Jasmin"],
      base: ["Ambre", "Vanille", "Bois d'agar (Oud)", "Musc"]
    },
    concentration: "Eau de Parfum",
    volume: "100 ML",
    sillage: 4,
    longevity: 9,
    intensity: "Forte",
    season: ["Automne", "Hiver"],
    occasion: ["Soirée", "Occasion spéciale", "Mariage"],
    family: "Oriental Oud",
    fragranticaUrl: "https://www.fragrantica.fr/parfum/Lattafa-Perfumes/Bade-e-Al-Oud-Amethyst-68214.html"
  },
  {
    id: 8,
    name: "Ajwad Pink to Pink",
    brand: "Lattafa",
    price: 6200,
    oldPrice: 7500,
    image: "https://www.lattafa-usa.com/cdn/shop/files/Ajwad-Pink-to-Pink-1_f07e8195-9952-48c7-8445-1779e409295b.png?v=1747415196&width=900",
    category: "femme",
    badge: "Populaire ⭐",
    description: "Floral fruité d'une élégance rare. Un jus rosé et lumineux qui mêle la fraîcheur de la framboise à la noblesse de la rose et la chaleur du bois de santal.",
    notes: {
      top: ["Framboise", "Litchi", "Orange"],
      heart: ["Rose", "Pivoine", "Jasmin"],
      base: ["Musc", "Bois de santal", "Vanille", "Cèdre"]
    },
    concentration: "Eau de Parfum",
    volume: "60 ML",
    sillage: 3,
    longevity: 7,
    intensity: "Modérée",
    season: ["Printemps", "Été"],
    occasion: ["Quotidien", "Bureau", "Brunch", "Mariage"],
    family: "Floral Fruité",
    fragranticaUrl: "https://www.fragrantica.fr/parfum/Lattafa-Perfumes/Ajwad-Pink-to-Pink-89766.html"
  },
  {
    id: 9,
    name: "Raghba",
    brand: "Lattafa",
    price: 5200,
    oldPrice: 6400,
    image: "https://www.lattafa-usa.com/cdn/shop/files/Raghba-1.png?v=1747421849&width=900",
    category: "unisex",
    badge: "Best-Seller 🔥",
    description: "L'icône orientale par excellence. Raghba séduit par sa gourmandise sucrée d'encens et de vanille, posée sur un fond d'oud noble et de musc sensuel.",
    notes: {
      top: ["Sucre", "Muscade"],
      heart: ["Encens", "Fleurs"],
      base: ["Vanille", "Oud", "Musc", "Bois de santal"]
    },
    concentration: "Eau de Parfum",
    volume: "100 ML",
    sillage: 4,
    longevity: 8,
    intensity: "Forte",
    season: ["Automne", "Hiver"],
    occasion: ["Soirée", "Quotidien", "Prière"],
    family: "Ambre Vanillé",
    fragranticaUrl: "https://www.fragrantica.fr/parfum/Lattafa-Perfumes/Raghba-25807.html"
  },
  {
    id: 10,
    name: "Oud Mood",
    brand: "Lattafa",
    price: 6200,
    oldPrice: 7500,
    image: "https://www.lattafa-usa.com/cdn/shop/files/Oud-Mood-1.png?v=1747420910&width=900",
    category: "unisex",
    badge: "Classique 👑",
    description: "Un oud noble et chaleureux. Oud Mood marie la puissance du safran et de la cannelle à la douceur du cuir et de l'ambre, pour un parfum signature inoubliable.",
    notes: {
      top: ["Noix de muscade", "Cannelle", "Safran"],
      heart: ["Bois de santal", "Bois d'oud", "Cuir"],
      base: ["Vanille", "Ambre"]
    },
    concentration: "Eau de Parfum",
    volume: "100 ML",
    sillage: 4,
    longevity: 9,
    intensity: "Forte",
    season: ["Automne", "Hiver"],
    occasion: ["Soirée", "Occasion spéciale", "Prière"],
    family: "Oriental Boisé",
    fragranticaUrl: "https://www.fragrantica.fr/parfum/Lattafa-Perfumes/Oud-Mood-46814.html"
  },
  {
    id: 11,
    name: "Supremacy Silver",
    brand: "Afnan",
    price: 7200,
    oldPrice: 8800,
    image: "https://us.afnan.com/cdn/shop/files/SupremacySilver-Product-01.jpg?v=1775552976&width=900",
    category: "homme",
    badge: "Premium ✨",
    description: "Clone premium d'un grand classique niche. Supremacy Silver offre une ouverture fruitée explosive suivie d'un cœur boisé élégant et d'un fond musqué longue tenue.",
    notes: {
      top: ["Ananas", "Bergamote", "Pomme verte", "Cassis"],
      heart: ["Bouleau", "Rose", "Jasmin"],
      base: ["Musc", "Ambre gris", "Cèdre", "Vétiver"]
    },
    concentration: "Eau de Parfum",
    volume: "100 ML",
    sillage: 4,
    longevity: 9,
    intensity: "Forte",
    season: ["Printemps", "Été", "Automne"],
    occasion: ["Quotidien", "Bureau", "Rendez-vous"],
    family: "Boisé Fruité",
    fragranticaUrl: "https://www.fragrantica.fr/parfum/Afnan/Supremacy-Silver-27352.html"
  },
  {
    id: 12,
    name: "Ana Abiyedh Rouge",
    brand: "Lattafa",
    price: 5800,
    oldPrice: 7200,
    image: "https://www.lattafa-usa.com/cdn/shop/files/Ana_Rouge.png?v=1750264009&width=900",
    category: "femme",
    badge: "Nouveau 🌸",
    description: "Un rouge passion. Ana Abiyedh Rouge est un parfum féminin audacieux qui mêle des accords floraux intenses à une base chaleureuse d'ambre et de bois précieux.",
    notes: {
      top: ["Rose rouge", "Safran", "Bergamote"],
      heart: ["Jasmin", "Tubéreuse", "Iris"],
      base: ["Ambre", "Musc", "Bois de cèdre", "Patchouli"]
    },
    concentration: "Eau de Parfum",
    volume: "100 ML",
    sillage: 3,
    longevity: 7,
    intensity: "Modérée",
    season: ["Automne", "Hiver", "Printemps"],
    occasion: ["Rendez-vous", "Soirée", "Occasion spéciale"],
    family: "Floral Oriental",
    fragranticaUrl: "https://www.fragrantica.fr/parfum/Lattafa-Perfumes/Ana-Abiyedh-Rouge-63062.html"
  },
  {
    id: 13,
    name: "Ameerat Al Arab",
    brand: "Asdaaf",
    price: 5500,
    oldPrice: 6800,
    image: "https://shop.simon.com/cdn/shop/files/8a8e135b196a48079f82ea93e3d83432_cb951482-5a03-4c86-9e41-7b704dd340a5.jpg?v=1727177822",
    category: "femme",
    badge: "Best-Seller 🔥",
    description: "Le joyau de la maison Asdaaf. Un parfum oriental floral envoûtant qui allie la sensualité du musc et du jasmin à la profondeur de l'oud. Exotique et irrésistible.",
    notes: {
      top: ["Agrumes", "Bergamote"],
      heart: ["Musc blanc", "Aloe vera"],
      base: ["Jasmin", "Bois", "Musc", "Oud"]
    },
    concentration: "Eau de Parfum",
    volume: "100 ML",
    sillage: 4,
    longevity: 9,
    intensity: "Forte",
    season: ["Automne", "Hiver", "Printemps"],
    occasion: ["Soirée", "Rendez-vous", "Occasion spéciale"],
    family: "Oriental Floral",
    fragranticaUrl: "https://www.fragrantica.fr/parfum/Asdaaf/Ameerat-Al-Arab-81376.html"
  },
  {
    id: 14,
    name: "Ameerat Al Arab Privé Rose",
    brand: "Asdaaf",
    price: 6200,
    oldPrice: 7500,
    image: "https://shop.simon.com/cdn/shop/files/a9338c98e2624838a2133d61309629ae_4a0234f5-c45a-4423-bae3-49d693db18c9.jpg?v=1754426519",
    category: "femme",
    badge: "Tendance 🌸",
    description: "La version rose de l'iconique Ameerat Al Arab. Un parfum floral oriental construit autour de la rose de Damas, porté par un fond ambré chaud et sensuel.",
    notes: {
      top: ["Rose de Damas", "Bergamote", "Poivre rose"],
      heart: ["Jasmin", "Muguet", "Pivoine"],
      base: ["Ambre", "Musc", "Bois de santal", "Vanille"]
    },
    concentration: "Eau de Parfum",
    volume: "100 ML",
    sillage: 3,
    longevity: 8,
    intensity: "Modérée",
    season: ["Printemps", "Été", "Automne"],
    occasion: ["Quotidien", "Rendez-vous", "Mariage"],
    family: "Floral Rose",
    fragranticaUrl: "https://www.fragrantica.fr/parfum/Asdaaf/Ameerat-Al-Arab-Prive-Rose-81967.html"
  },
  {
    id: 15,
    name: "Andaleeb",
    brand: "Asdaaf",
    price: 5800,
    oldPrice: 7200,
    image: "https://shop.simon.com/cdn/shop/files/79c5a01a74ec441cbb83828cf37a993f.jpg?v=1727885405",
    category: "unisex",
    badge: "Populaire ⭐",
    description: "Un chef-d'œuvre fruité floral de la maison Asdaaf. Andaleeb offre un mélange moderne et équilibré d'épices orientales et de fraîcheur florale, parfait pour toutes les occasions.",
    notes: {
      top: ["Poire", "Cassis", "Bergamote"],
      heart: ["Rose", "Jasmin", "Épices"],
      base: ["Ambre", "Musc blanc", "Bois de cèdre", "Vanille"]
    },
    concentration: "Eau de Parfum",
    volume: "100 ML",
    sillage: 4,
    longevity: 8,
    intensity: "Forte",
    season: ["Automne", "Hiver", "Printemps"],
    occasion: ["Quotidien", "Soirée", "Bureau"],
    family: "Fruité Oriental",
    fragranticaUrl: "https://www.fragrantica.fr/parfum/Asdaaf/Al-Andaleeb-70700.html"
  },
  {
    id: 16,
    name: "Ameer Al Arab",
    brand: "Asdaaf",
    price: 6500,
    oldPrice: 7900,
    image: "https://shop.simon.com/cdn/shop/files/5fe1009a86734abfabede585fb5de989_51253153-3718-4162-b6df-3946094d9ce9.jpg?v=1721183444",
    category: "homme",
    badge: "Premium ✨",
    description: "Le prince des parfums arabes. Un oriental boisé royal et puissant aux notes d'oud fumé, de bois précieux et d'ambre doré. Présence imposante et tenue remarquable.",
    notes: {
      top: ["Safran", "Poivre noir", "Bergamote"],
      heart: ["Oud", "Rose", "Encens"],
      base: ["Ambre", "Bois de santal", "Musc", "Vanille"]
    },
    concentration: "Eau de Parfum",
    volume: "100 ML",
    sillage: 5,
    longevity: 10,
    intensity: "Très Forte",
    season: ["Automne", "Hiver"],
    occasion: ["Soirée", "Occasion spéciale", "Prière"],
    family: "Oriental Boisé",
    fragranticaUrl: "https://www.fragrantica.fr/parfum/Asdaaf/Ameer-Al-Arab-105834.html"
  },
  {
    id: 17,
    name: "Coffret Discovery 9 Series",
    brand: "Afnan",
    price: 4500,
    oldPrice: 5800,
    image: "https://us.afnan.com/cdn/shop/files/9series.png?v=1775218823&width=900",
    category: "coffret",
    badge: "Idée Cadeau 🎁",
    description: "Le coffret découverte parfait. 5 miniatures de la collection 9AM/9PM d'Afnan dans un écrin élégant. Idéal pour offrir ou découvrir vos prochains favoris.",
    notes: {
      top: ["Bergamote", "Lavande", "Mandarine"],
      heart: ["Fleur d'oranger", "Rose", "Muguet"],
      base: ["Vanille", "Tonka", "Patchouli", "Ambre"]
    },
    concentration: "Eau de Parfum",
    volume: "5 x 2 ML",
    sillage: 4,
    longevity: 8,
    intensity: "Forte",
    season: ["Printemps", "Été", "Automne", "Hiver"],
    occasion: ["Cadeau", "Découverte", "Voyage"],
    family: "Collection Mixte"
  },
  {
    id: 18,
    name: "Coffret Lattafa Pride N°1",
    brand: "Lattafa",
    price: 8500,
    oldPrice: 10500,
    image: "https://www.lattafa-usa.com/cdn/shop/files/Al-Nashama-2_e6054b20-4f58-4448-8746-1e5016269081.png?v=1747415285&width=900",
    category: "coffret",
    badge: "Exclusif 🎁",
    description: "Coffret prestige Lattafa Pride avec 5 flacons de 20ml dans un emballage luxueux. Bike 1910, Shaheen Silver, African Drummer, Shuyukh Silver et Vintage Radio.",
    notes: {
      top: ["Bergamote", "Poivre", "Citron"],
      heart: ["Oud", "Rose", "Jasmin"],
      base: ["Ambre", "Musc", "Bois de santal", "Vanille"]
    },
    concentration: "Eau de Parfum",
    volume: "5 x 20 ML",
    sillage: 4,
    longevity: 9,
    intensity: "Forte",
    season: ["Printemps", "Été", "Automne", "Hiver"],
    occasion: ["Cadeau", "Mariage", "Occasion spéciale"],
    family: "Collection Oriental"
  },
  {
    id: 19,
    name: "Coffret Supremacy Homme",
    brand: "Afnan",
    price: 5200,
    oldPrice: 6800,
    image: "https://us.afnan.com/cdn/shop/files/SupremacySilver-Product-02.jpg?v=1775552976&width=900",
    category: "coffret",
    badge: "Premium 🎁",
    description: "Le coffret ultime pour homme. 5 miniatures de la collection Supremacy : In Heaven, Silver, Not Only Intense, Collector's Edition et In Oud. Un voyage olfactif complet.",
    notes: {
      top: ["Ananas", "Bergamote", "Pomme"],
      heart: ["Bouleau", "Rose", "Patchouli"],
      base: ["Musc", "Ambre gris", "Cèdre", "Vétiver"]
    },
    concentration: "Eau de Parfum / Extrait",
    volume: "5 x 2 ML",
    sillage: 5,
    longevity: 10,
    intensity: "Très Forte",
    season: ["Printemps", "Été", "Automne", "Hiver"],
    occasion: ["Cadeau", "Découverte", "Occasion spéciale"],
    family: "Collection Boisé"
  },
  {
    id: 20,
    name: "Coffret Yara Collection",
    brand: "Lattafa",
    price: 9500,
    oldPrice: 12000,
    image: "https://www.lattafa-usa.com/cdn/shop/files/Yara-1.png?v=1747424447&width=900",
    category: "coffret",
    badge: "Best-Seller 🎁",
    description: "Le coffret cadeau féminin par excellence. EDP Yara 100ml + Body Lotion parfumée + Brume cheveux dans un emballage cadeau premium. L'ensemble idéal à offrir.",
    notes: {
      top: ["Orchidée", "Héliotrope", "Fruit de la passion"],
      heart: ["Gourmand", "Fleurs blanches"],
      base: ["Vanille", "Musc blanc", "Bois de santal"]
    },
    concentration: "Eau de Parfum + Soins",
    volume: "100 ML + Extras",
    sillage: 3,
    longevity: 8,
    intensity: "Modérée",
    season: ["Printemps", "Été", "Automne"],
    occasion: ["Cadeau", "Mariage", "Anniversaire"],
    family: "Floral Gourmand"
  }
];
