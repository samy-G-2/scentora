import { useState } from 'react';
import { Eye, ShoppingCart, Check } from 'lucide-react';
import type { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

const ProductCard = ({ product, onSelect, onAddToCart }: ProductCardProps) => {
  const [justAdded, setJustAdded] = useState(false);

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  };

  return (
    <div className="product-card group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gold/30 hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div
        className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden cursor-pointer"
        onClick={() => onSelect(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="product-image w-full h-full object-contain p-4 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.badge && (
            <span className="bg-navy text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick Actions on hover */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(product); }}
            className="w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gold hover:text-white transition-colors"
            aria-label="Voir les détails"
          >
            <Eye size={16} />
          </button>
          {onAddToCart && (
            <button
              onClick={handleAddToCart}
              className={`w-9 h-9 rounded-full shadow-lg flex items-center justify-center transition-all ${
                justAdded
                  ? 'bg-green-500 text-white'
                  : 'bg-white hover:bg-navy hover:text-white'
              }`}
              aria-label="Ajouter au panier"
            >
              {justAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
            </button>
          )}
        </div>

        {/* Overlay */}
        <div className="product-overlay absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 p-4 pt-16">
          <button
            onClick={handleAddToCart}
            className="card-actions w-full bg-white hover:bg-navy hover:text-white text-navy py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-wider transition-all transform translate-y-4 opacity-0"
          >
            <ShoppingCart size={16} />
            Ajouter au panier
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-gold text-[11px] font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
        <h3
          className="font-serif text-lg text-navy mb-1 group-hover:text-gold transition-colors line-clamp-1 cursor-pointer"
          onClick={() => onSelect(product)}
        >
          {product.name}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="text-[9px] bg-cream-dark text-navy/50 px-2 py-0.5 rounded-full font-medium">{product.family}</span>
          {product.season.slice(0, 2).map((s, i) => (
            <span key={i} className="text-[9px] bg-cream-dark text-navy/50 px-2 py-0.5 rounded-full font-medium">{s}</span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-navy">
            {product.price.toLocaleString('fr-DZ')} <span className="text-sm font-medium text-navy/50">DA</span>
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">{product.oldPrice.toLocaleString('fr-DZ')}</span>
          )}
        </div>

        {/* CTA */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-1.5 font-bold text-xs uppercase tracking-wider transition-all ${
              justAdded
                ? 'bg-green-500 text-white'
                : 'bg-navy hover:bg-navy-light text-white'
            }`}
          >
            {justAdded ? (
              <><Check size={14} /> Ajouté !</>
            ) : (
              <><ShoppingCart size={14} /> <span className="hidden sm:inline">Ajouter au</span> Panier</>
            )}
          </button>
          <button
            onClick={() => onSelect(product)}
            className="px-3 py-2.5 border border-navy/10 hover:border-gold hover:text-gold rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
            aria-label="Voir les détails"
          >
            <Eye size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
