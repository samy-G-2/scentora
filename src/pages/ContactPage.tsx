import { MessageCircle, Phone, MapPin, Mail, Clock, Camera, Globe } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Support</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            Contactez-<span className="text-gold">Nous</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Notre équipe est disponible 7j/7 pour vous accompagner
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* WhatsApp */}
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle size={36} className="text-white" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">WhatsApp</h3>
              <p className="text-gray-500 text-sm mb-2">Le moyen le plus rapide</p>
              <p className="text-green-600 text-xl font-bold mb-6">+213 555 741 929</p>
              <a
                href="https://wa.me/213555741929?text=Salam%2C%20je%20vous%20contacte%20depuis%20votre%20site"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold uppercase tracking-wider transition-colors"
              >
                Ouvrir WhatsApp
              </a>
              <p className="text-gray-400 text-xs mt-4 flex items-center justify-center gap-1">
                <Clock size={12} />
                Réponse en moins de 30 min • 7j/7
              </p>
            </div>

            {/* Other Contacts */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-5 flex items-center gap-4 hover:bg-gold/5 transition-colors">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone size={22} className="text-gold" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Téléphone</h4>
                  <p className="text-gold font-bold">+213 555 741 929</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 flex items-center gap-4 hover:bg-gold/5 transition-colors">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={22} className="text-gold" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-gray-600">contact@scentora.dz</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 flex items-center gap-4 hover:bg-gold/5 transition-colors">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={22} className="text-gold" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Localisation</h4>
                  <p className="text-gray-600">Alger, Algérie 🇩🇿</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-3">Suivez-nous</h4>
                <div className="flex gap-3">
                  <a href="#" className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-lg text-gray-600 hover:border-gold hover:text-gold transition-colors text-sm font-medium">
                    <Camera size={16} /> Instagram
                  </a>
                  <a href="#" className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-lg text-gray-600 hover:border-gold hover:text-gold transition-colors text-sm font-medium">
                    <Globe size={16} /> Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-2 block">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Questions Fréquentes</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "Comment passer une commande ?", a: "Cliquez sur « Commander via WhatsApp » sur le produit souhaité. Notre équipe confirmera votre commande et les détails de livraison." },
              { q: "Vos parfums sont-ils authentiques ?", a: "Oui, 100% ! Tous nos parfums sont originaux avec hologramme de vérification, provenant de distributeurs agréés." },
              { q: "Quels sont les délais de livraison ?", a: "Expédition sous 24h. Livraison en 2 à 5 jours selon votre wilaya. Vous recevrez un numéro de suivi." },
              { q: "Puis-je payer à la livraison ?", a: "Absolument ! Le paiement se fait exclusivement à la réception. Zéro avance, c'est notre garantie." },
              { q: "Livrez-vous dans toute l'Algérie ?", a: "Oui, nous livrons dans les 58 wilayas. À domicile ou en point relais selon votre préférence." },
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl overflow-hidden shadow-sm">
                <summary className="p-5 cursor-pointer font-semibold text-gray-900 flex items-center justify-between list-none">
                  {faq.q}
                  <span className="text-gold text-xl transform group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
