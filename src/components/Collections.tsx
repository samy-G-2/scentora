import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { products, collections } from '../data/products';
import type { Product } from '../data/products';

const PHONE = '213555741929';

interface CollectionsProps {
  onSelectProduct: (p: Product) => void;
}

const Collections = ({ onSelectProduct }: CollectionsProps) => {
  const [active, setActive] = useState(collections[0].id);
  const current = collections.find(c => c.id === active)!;
  const filtered = products.filter(current.filter).slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-3 block">
            Sélections Thématiques
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-4">
            Nos Collections
          </h2>
          <p className="text-navy/50 max-w-lg mx-auto text-sm">
            Des sélections pensées pour chaque moment de votre vie. Trouvez le parfum parfait sans chercher.
          </p>
        </div>

        {/* Collection Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {collections.map(col => (
            <button
              key={col.id}
              onClick={() => setActive(col.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                active === col.id
                  ? 'bg-navy text-white shadow-lg shadow-navy/20'
                  : 'bg-white text-navy/60 hover:bg-navy/5 border border-navy/10'
              }`}
            >
              {col.label}
            </button>
          ))}
        </div>

        {/* Products Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filtered.map((p, i) => {
            const msg = encodeURIComponent(`Salam, je souhaite commander :\n\n🧴 ${p.name} - ${p.brand}\n💰 Prix : ${p.price.toLocaleString('fr-DZ')} DA`);
            return (
              <motion.div
                key={p.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="bg-white rounded-xl overflow-hidden border border-navy/5 hover:border-gold/20 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                onClick={() => onSelectProduct(p)}
              >
                <div className="aspect-square bg-gradient-to-br from-cream to-cream-dark p-3 relative overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  {p.badge && (
                    <span className="absolute top-2 left-2 bg-navy text-white text-[8px] font-bold px-2 py-0.5 rounded-full">{p.badge}</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[9px] text-gold font-semibold uppercase tracking-wider">{p.brand}</p>
                  <p className="text-sm font-bold text-navy truncate group-hover:text-gold transition-colors">{p.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-navy text-sm">{p.price.toLocaleString('fr-DZ')} <span className="text-[10px] font-normal text-navy/40">DA</span></span>
                    <a
                      href={`https://wa.me/${PHONE}?text=${msg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="w-7 h-7 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
                      aria-label={`Commander ${p.name}`}
                    >
                      <MessageCircle size={12} className="text-white" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-navy/40 py-12 text-sm">Aucun parfum dans cette sélection pour le moment.</p>
        )}
      </div>
    </section>
  );
};

export default Collections;
