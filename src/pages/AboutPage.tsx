import { ShieldCheck, Heart, Users, Award, CheckCircle } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Notre Histoire</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            À Propos de <span className="text-gold">Scentora</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            La référence des parfums orientaux authentiques en Algérie
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://www.lattafa-usa.com/cdn/shop/files/Khamrah-1.png?v=1747418862&width=900"
                alt="Scentora Collection"
                className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Notre Mission</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                Des Parfums d'Exception à Prix Accessible
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-900">Scentora</strong> est née d'une passion profonde pour les parfums orientaux et d'une volonté de rendre accessible en Algérie les plus belles créations olfactives.
                </p>
                <p>
                  Basée en <strong className="text-gold">Algérie</strong>, notre boutique est spécialisée dans les marques orientales les plus reconnues : <strong className="text-gray-900">Lattafa, Rasasi, Afnan, Armaf</strong> et bien d'autres.
                </p>
                <p>
                  Nous garantissons l'authenticité de chaque flacon grâce à un approvisionnement direct auprès des distributeurs agréés. Chaque produit est livré avec son <strong className="text-gold">hologramme de vérification</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-2 block">Nos Valeurs</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Ce Qui Nous Distingue</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <ShieldCheck size={32} />, title: "Authenticité", desc: "100% originaux avec hologramme" },
              { icon: <Heart size={32} />, title: "Passion", desc: "L'amour des parfums orientaux" },
              { icon: <Users size={32} />, title: "Proximité", desc: "Service client 7j/7 sur WhatsApp" },
              { icon: <Award size={32} />, title: "Excellence", desc: "Qualité premium, prix juste" },
            ].map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto mb-4">
                  {v.icon}
                </div>
                <h3 className="font-serif font-bold text-lg text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-2 block">Garanties</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Nos Engagements</h2>
          </div>
          <div className="space-y-3">
            {[
              "Tous nos parfums sont 100% authentiques et originaux",
              "Approvisionnement direct auprès de distributeurs agréés",
              "Hologramme de vérification sur chaque produit",
              "Livraison sécurisée dans les 58 wilayas d'Algérie",
              "Paiement uniquement à la réception de votre colis",
              "Emballage premium pour une protection maximale",
              "Service client disponible 7j/7 via WhatsApp",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 hover:bg-gold/5 transition-colors">
                <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                <p className="text-gray-700 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Prêt à Découvrir Votre Prochain Parfum ?
          </h2>
          <p className="text-gray-400 mb-8">
            Contactez-nous sur WhatsApp pour des recommandations personnalisées
          </p>
          <a
            href="https://wa.me/213555741929?text=Salam%2C%20je%20souhaite%20des%20recommandations%20de%20parfums"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition-colors"
          >
            💬 Contactez-nous sur WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
