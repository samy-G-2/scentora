import { ShieldCheck, Truck, CreditCard, MessageCircle } from 'lucide-react';

const features = [
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "100% Authentique",
    description: "Hologramme vérifié sur chaque produit"
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Livraison 58 Wilayas",
    description: "Expédition rapide partout en Algérie"
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: "Paiement à la Livraison",
    description: "Payez uniquement à la réception"
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: "Support WhatsApp",
    description: "Service client 7j/7"
  }
];

const Features = () => {
  return (
    <section className="py-12 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4 text-gold">
                {feature.icon}
              </div>
              <h3 className="font-bold text-sm md:text-base mb-1">{feature.title}</h3>
              <p className="text-gray-400 text-xs md:text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
