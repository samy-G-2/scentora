import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { products, inspirationMap } from '../data/products';
import type { Product } from '../data/products';

const PHONE = '213555741929';

interface AlternativesProps {
  onSelectProduct: (p: Product) => void;
}

const Alternatives = ({ onSelectProduct }: AlternativesProps) => {
  const entries = Object.entries(inspirationMap);

  return (
    <section className="py-16 md:py-24 bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-3 block">
            Alternatives Intelligentes
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Si vous aimez...
          </h2>
          <p className="text-white/50 max-w-lg mx-auto text-sm">
            Retrouvez les sensations de vos parfums de luxe préférés à un prix accessible. Qualité orientale, performance identique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {entries.map(([luxuryName, data], i) => {
            const matchedProducts = data.ids
              .map(id => products.find(p => p.id === id))
              .filter((p): p is Product => p !== undefined);

            if (matchedProducts.length === 0) return null;

            return (
              <motion.div
                key={luxuryName}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-gold/20 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-gold text-lg">✨</span>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Vous aimez</p>
                    <h3 className="font-serif font-bold text-white text-lg">{luxuryName}</h3>
                  </div>
                </div>

                <p className="text-white/50 text-xs leading-relaxed mb-5">{data.label}</p>

                <div className="space-y-3">
                  {matchedProducts.map(p => {
                    const whatsappMsg = encodeURIComponent(
                      `Salam, je souhaite commander :\n\n🧴 ${p.name} - ${p.brand}\n💰 Prix : ${p.price.toLocaleString('fr-DZ')} DA\n\nMerci de confirmer la disponibilité.`
                    );
                    return (
                      <div key={p.id} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 object-contain rounded-lg bg-white/10 p-1 flex-shrink-0 cursor-pointer"
                          loading="lazy"
                          onClick={() => onSelectProduct(p)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] text-gold uppercase tracking-wider font-semibold">{p.brand}</p>
                          <p
                            className="font-bold text-white text-sm truncate cursor-pointer hover:text-gold transition-colors"
                            onClick={() => onSelectProduct(p)}
                          >
                            {p.name}
                          </p>
                          <p className="text-white/40 text-[11px]">{p.longevity}h+ · {p.family}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="font-bold text-gold text-sm">{p.price.toLocaleString('fr-DZ')} DA</span>
                          <a
                            href={`https://wa.me/${PHONE}?text=${whatsappMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] text-green-400 hover:text-green-300 font-semibold transition-colors"
                            onClick={e => e.stopPropagation()}
                          >
                            <MessageCircle size={10} /> Commander
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Alternatives;
