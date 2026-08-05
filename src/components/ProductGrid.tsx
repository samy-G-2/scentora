import { useState } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { products } from '../data/products';
import type { Product } from '../data/products';

const categories = [
  { id: 'all', label: 'Tous', icon: '🛍️' },
  { id: 'bestseller', label: 'Best-Sellers', icon: '🔥' },
  { id: 'homme', label: 'Homme', icon: '👨' },
  { id: 'femme', label: 'Femme', icon: '👩' },
  { id: 'unisex', label: 'Unisex', icon: '✨' },
  { id: 'coffret', label: 'Coffrets Cadeaux', icon: '🎁' },
];

interface ProductGridProps {
  onAddToCart?: (product: Product) => void;
}

const ProductGrid = ({ onAddToCart }: ProductGridProps) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((p) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'bestseller') return p.badge?.includes('Best-Seller');
    return p.category === activeCategory;
  });

  return (
    <>
      <section id="boutique" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-2 block">
              Notre Collection
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Parfums Orientaux Authentiques
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Cliquez sur un parfum pour découvrir ses notes olfactives, sa puissance et la saison recommandée.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelectedProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <a
              href="https://wa.me/213555741929?text=Salam%2C%20je%20voudrais%20voir%20plus%20de%20parfums"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary font-bold uppercase tracking-wider text-sm hover:bg-primary hover:text-white transition-all rounded-lg"
            >
              Voir plus de parfums
            </a>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </>
  );
};

export default ProductGrid;
