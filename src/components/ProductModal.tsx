import { X, MessageCircle, ShieldCheck, Truck, Droplets, Sun, Snowflake, Leaf, Flower2, Clock, Wind, Zap, Heart } from 'lucide-react';
import type { Product } from '../data/products';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

const seasonIcons: Record<string, React.ReactNode> = {
  'Printemps': <Flower2 size={16} className="text-pink-400" />,
  'Été': <Sun size={16} className="text-yellow-500" />,
  'Automne': <Leaf size={16} className="text-orange-500" />,
  'Hiver': <Snowflake size={16} className="text-blue-400" />,
};

const ProductModal = ({ product, onClose, onAddToCart }: ProductModalProps) => {
  const whatsappMessage = encodeURIComponent(
    `Salam, je souhaite commander :\n\n🧴 ${product.name} - ${product.brand}\n💰 Prix : ${product.price.toLocaleString('fr-DZ')} DA\n\nMerci de confirmer la disponibilité.`
  );

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-10 flex items-center justify-center min-h-[300px] md:min-h-[500px] rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
            {product.badge && (
              <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase">
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="absolute top-4 right-14 md:right-4 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full">
                -{discount}%
              </span>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[250px] sm:max-h-[350px] md:max-h-[420px] object-contain drop-shadow-xl"
            />
          </div>

          {/* Details */}
          <div className="p-5 sm:p-8">
            {/* Header */}
            <p className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-1">{product.brand}</p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-2">{product.name}</h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-3xl font-bold text-primary">{product.price.toLocaleString('fr-DZ')} <span className="text-base">DA</span></span>
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through">{product.oldPrice.toLocaleString('fr-DZ')} DA</span>
              )}
            </div>

            {/* Quick Info Pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
                <Droplets size={12} className="text-blue-500" /> {product.concentration}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
                📦 {product.volume}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
                <Heart size={12} className="text-pink-500" /> {product.family}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-5">{product.description}</p>

            {/* Inspiration & profil */}
            {product.inspiredBy && (
              <div className="flex items-start gap-2.5 mb-5 px-3.5 py-3 bg-gold/5 border border-gold/25 rounded-xl">
                <span className="text-base leading-none mt-0.5">✨</span>
                <p className="text-xs text-navy/70 leading-relaxed">
                  Même ADN olfactif que <strong className="text-navy">{product.inspiredBy}</strong> — à une fraction du prix.
                </p>
              </div>
            )}

            {(product.targetAge || product.style?.length) && (
              <div className="flex flex-wrap items-center gap-1.5 mb-5">
                {product.targetAge && (
                  <span className="bg-navy/5 text-navy/60 text-[11px] font-medium px-2.5 py-1 rounded-full">
                    👤 {product.targetAge === 'Tous âges' ? 'Tous âges' : `${product.targetAge} ans`}
                  </span>
                )}
                {product.style?.map((tag) => (
                  <span key={tag} className="bg-gold/10 text-gold-dark text-[11px] font-medium px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* ═══ PYRAMID OF NOTES ═══ */}
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 bg-gold/10 rounded flex items-center justify-center text-gold text-xs">🧪</span>
                Pyramide Olfactive
              </h3>
              <div className="space-y-3">
                {/* Top Notes */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                    <span className="text-xs font-bold uppercase tracking-wider text-yellow-700">Notes de Tête</span>
                    <span className="text-[10px] text-yellow-600 ml-auto italic">Première impression</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.notes.top.map((note, i) => (
                      <span key={i} className="bg-white/80 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full border border-yellow-200">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Heart Notes */}
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-pink-400 rounded-full" />
                    <span className="text-xs font-bold uppercase tracking-wider text-pink-700">Notes de Cœur</span>
                    <span className="text-[10px] text-pink-600 ml-auto italic">L'âme du parfum</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.notes.heart.map((note, i) => (
                      <span key={i} className="bg-white/80 text-pink-800 text-xs font-medium px-2.5 py-1 rounded-full border border-pink-200">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Base Notes */}
                <div className="bg-gradient-to-r from-stone-100 to-amber-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-amber-700 rounded-full" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Notes de Fond</span>
                    <span className="text-[10px] text-amber-700 ml-auto italic">Tenue longue durée</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.notes.base.map((note, i) => (
                      <span key={i} className="bg-white/80 text-amber-900 text-xs font-medium px-2.5 py-1 rounded-full border border-amber-200">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ PERFORMANCE ═══ */}
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 bg-gold/10 rounded flex items-center justify-center text-gold text-xs">📊</span>
                Performance
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {/* Sillage */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Wind size={14} className="text-blue-500" />
                    <span className="text-xs font-bold text-gray-700">Sillage</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={`h-2 flex-1 rounded-full ${i < product.sillage ? 'bg-gold' : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">{product.sillage >= 4 ? 'Monstrueux' : product.sillage >= 3 ? 'Bon' : 'Intime'}</p>
                </div>

                {/* Longevity */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Clock size={14} className="text-green-500" />
                    <span className="text-xs font-bold text-gray-700">Tenue</span>
                  </div>
                  <p className="text-xl font-bold text-primary">{product.longevity}h<span className="text-xs font-normal text-gray-500">+</span></p>
                  <p className="text-[10px] text-gray-500">{product.longevity >= 10 ? 'Exceptionnelle' : product.longevity >= 7 ? 'Très bonne' : 'Bonne'}</p>
                </div>

                {/* Intensity */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Zap size={14} className="text-orange-500" />
                    <span className="text-xs font-bold text-gray-700">Puissance</span>
                  </div>
                  <p className="text-sm font-bold text-primary">{product.intensity}</p>
                </div>

                {/* Concentration */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Droplets size={14} className="text-purple-500" />
                    <span className="text-xs font-bold text-gray-700">Concentration</span>
                  </div>
                  <p className="text-sm font-bold text-primary">{product.concentration}</p>
                </div>
              </div>
            </div>

            {/* ═══ SEASON & OCCASION ═══ */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              {/* Seasons */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2 flex items-center gap-1.5">
                  ☀️ Saisons
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {product.season.map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-[11px] font-medium px-2.5 py-1.5 rounded-full">
                      {seasonIcons[s]}
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Occasions */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2 flex items-center gap-1.5">
                  🎯 Occasions
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {product.occasion.map((o, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 text-[11px] font-medium px-2.5 py-1.5 rounded-full">
                      {o}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══ FRAGRANTICA ═══ */}
            {product.fragranticaUrl && (
              <a
                href={product.fragranticaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mb-5 px-4 py-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors group"
              >
                <span className="text-lg">📖</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-amber-900">Composition détaillée sur Fragrantica</p>
                  <p className="text-[10px] text-amber-700">Notes, accords, avis de la communauté mondiale</p>
                </div>
                <svg className="w-4 h-4 text-amber-400 group-hover:text-amber-600 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}

            {/* ═══ TRUST + CTA ═══ */}
            <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-5">
              <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-green-500" /> 100% Authentique</span>
              <span className="flex items-center gap-1"><Truck size={13} className="text-blue-500" /> 58 Wilayas</span>
            </div>

            <div className="space-y-2.5">
              {onAddToCart && (
                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-navy hover:bg-navy-light text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-colors"
                >
                  🛒 Ajouter au panier — {product.price.toLocaleString('fr-DZ')} DA
                </button>
              )}
              <a
                href={`https://wa.me/213555741929?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm transition-colors"
              >
                <MessageCircle size={16} />
                Ou commander via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
