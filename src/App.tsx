import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import ProductGrid from './components/ProductGrid';
import Categories from './components/Categories';
import Brands from './components/Brands';
import Collections from './components/Collections';
import Alternatives from './components/Alternatives';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FragranceFinder from './components/FragranceFinder';
import ProductModal from './components/ProductModal';
import Cart from './components/Cart';
import { useCart } from './store/cart';
import type { Product } from './data/products';
import { Sparkles, MessageCircle, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const PHONE = '213555741929';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showFinder, setShowFinder] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const cart = useCart();

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return (
          <HomePage
            onOpenFinder={() => setShowFinder(true)}
            onSelectProduct={setSelectedProduct}
            onAddToCart={cart.addItem}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar
        onNavigate={setCurrentPage}
        currentPage={currentPage}
        cartCount={cart.totalItems}
        onOpenCart={() => setShowCart(true)}
        onSelectProduct={setSelectedProduct}
      />
      <main id="main-content" role="main">{renderPage()}</main>
      <Footer onNavigate={setCurrentPage} />
      <WhatsAppButton />

      {/* Global Modals */}
      <AnimatePresence>
        {showFinder && (
          <FragranceFinder
            onClose={() => setShowFinder(false)}
            onSelectProduct={(p) => { setShowFinder(false); setSelectedProduct(p); }}
          />
        )}
      </AnimatePresence>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p) => { cart.addItem(p); }}
        />
      )}

      <AnimatePresence>
        {showCart && (
          <Cart
            items={cart.items}
            subtotal={cart.subtotal}
            totalItems={cart.totalItems}
            isFreeDelivery={cart.isFreeDelivery}
            deliveryFee={cart.deliveryFee}
            total={cart.total}
            selectedWilaya={cart.selectedWilaya}
            deliveryType={cart.deliveryType}
            onSetWilaya={cart.setSelectedWilaya}
            onSetDeliveryType={cart.setDeliveryType}
            onUpdateQuantity={cart.updateQuantity}
            onRemoveItem={cart.removeItem}
            onClearCart={cart.clearCart}
            buildWhatsAppMessage={cart.buildWhatsAppMessage}
            onClose={() => setShowCart(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface HomeProps {
  onOpenFinder: () => void;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

function HomePage({ onOpenFinder, onSelectProduct, onAddToCart }: HomeProps) {
  return (
    <>
      <HeroSlider />

      {/* Trust Bar */}
      <section className="py-5 bg-navy text-white" aria-label="Garanties">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: <ShieldCheck size={20} />, text: '100% Authentique', sub: 'Hologramme vérifié' },
              { icon: <Truck size={20} />, text: 'Livraison 58 Wilayas', sub: 'Expédition rapide' },
              { icon: <CreditCard size={20} />, text: 'Paiement à la livraison', sub: 'Zéro risque' },
              { icon: <MessageCircle size={20} />, text: 'Support WhatsApp', sub: '7j/7' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 py-2">
                <span className="text-gold">{item.icon}</span>
                <span className="text-xs font-semibold">{item.text}</span>
                <span className="text-[10px] text-white/40">{item.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fragrance Finder CTA */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-gold/5 via-cream to-gold/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-3xl mb-4 block">✨</span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-navy mb-3">
              Vous ne savez pas quel parfum choisir ?
            </h2>
            <p className="text-navy/50 text-sm md:text-base mb-6 max-w-md mx-auto">
              Répondez à 4 questions simples et recevez une sélection personnalisée adaptée à votre style.
            </p>
            <button
              onClick={onOpenFinder}
              className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 shadow-lg shadow-navy/20"
            >
              <Sparkles size={16} />
              Trouver mon parfum idéal
            </button>
          </motion.div>
        </div>
      </section>

      <ProductGrid onAddToCart={onAddToCart} />

      <Collections onSelectProduct={onSelectProduct} />
      <Alternatives onSelectProduct={onSelectProduct} />
      <Categories />
      <Brands />

      {/* Promo Banner */}
      <section className="py-16 md:py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Offre Spéciale</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Livraison Gratuite dès 8000 DA</h2>
          <p className="text-white/50 mb-8 max-w-xl mx-auto text-sm">
            Profitez de la livraison offerte sur toutes vos commandes supérieures à 8000 DA. Paiement à la livraison disponible.
          </p>
          <a href="#boutique" className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-navy px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition-colors">
            Voir la Boutique
          </a>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-cream-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Commander Maintenant</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-6">Votre Parfum Vous Attend</h2>
          <p className="text-navy/50 mb-10 max-w-xl mx-auto text-sm">
            Commandez en toute sérénité. Produits 100% authentiques, paiement à la livraison, service client premium.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#boutique" className="px-8 py-4 bg-navy hover:bg-navy-light text-white font-bold uppercase tracking-wider text-sm rounded-xl transition-colors">
              🛒 Voir la Boutique
            </a>
            <a href={`https://wa.me/${PHONE}`} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-wider text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
              💬 Commander via WhatsApp
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-navy/30 text-xs">
            <span>✅ 100% Authentique</span>
            <span>🚚 Livraison 58 wilayas</span>
            <span>💳 Paiement à la livraison</span>
            <span>📦 Emballage premium</span>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
