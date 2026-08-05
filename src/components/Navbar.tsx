import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, MessageCircle, ShoppingBag, Search as SearchIcon } from 'lucide-react';
import { products } from '../data/products';
import type { Product } from '../data/products';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage?: string;
  cartCount?: number;
  onOpenCart?: () => void;
  onSelectProduct?: (p: Product) => void;
}

const PHONE = '213555741929';

const Navbar = ({ onNavigate, cartCount = 0, onOpenCart, onSelectProduct }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleNav = useCallback((page: string, hash?: string) => {
    setIsMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
    onNavigate(page);
    if (hash) {
      setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 120);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [onNavigate]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.family.toLowerCase().includes(q) ||
      p.notes.top.some(n => n.toLowerCase().includes(q)) ||
      p.notes.heart.some(n => n.toLowerCase().includes(q)) ||
      p.notes.base.some(n => n.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  const navLinks = [
    { label: 'Accueil', action: () => handleNav('home') },
    { label: 'Boutique', action: () => handleNav('home', '#boutique') },
    { label: 'À Propos', action: () => handleNav('about') },
    { label: 'Contact', action: () => handleNav('contact') },
  ];

  return (
    <header role="banner">
      {/* Announcement Bar */}
      <div className="bg-navy text-white/80 text-[11px] sm:text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <a href={`tel:+${PHONE}`} className="flex items-center gap-1.5 hover:text-gold transition-colors">
            <Phone size={11} />
            <span className="font-medium">+213 555 741 929</span>
          </a>
          <div className="hidden sm:flex items-center gap-3 text-white/50">
            <span>✅ 100% Authentique</span>
            <span className="text-gold/30">·</span>
            <span>🚚 Livraison 58 Wilayas</span>
            <span className="text-gold/30">·</span>
            <span>💳 Paiement à la livraison</span>
          </div>
          <a href={`https://wa.me/${PHONE}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors font-medium">
            <MessageCircle size={11} />
            <span className="hidden xs:inline">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Main Nav */}
      <nav
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-xl transition-all duration-500 ${isScrolled ? 'shadow-[0_2px_24px_rgba(8,28,58,0.06)]' : 'border-b border-navy/5'}`}
        role="navigation"
        aria-label="Navigation principale"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-[72px]">
            {/* Logo */}
            <button onClick={() => handleNav('home')} className="flex-shrink-0 group" aria-label="Accueil">
              <span className="text-[22px] md:text-[26px] font-serif font-bold tracking-[0.04em] text-navy group-hover:text-navy-light transition-colors">
                SCENT<span className="text-gold">ORA</span>
              </span>
            </button>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map(link => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="text-[13px] font-medium uppercase tracking-[0.12em] text-navy/60 hover:text-gold transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 hover:bg-cream-dark rounded-xl transition-colors"
                aria-label="Rechercher"
              >
                <SearchIcon size={20} className="text-navy/70" />
              </button>

              {/* Cart */}
              {onOpenCart && (
                <button
                  onClick={onOpenCart}
                  className="relative p-2.5 hover:bg-cream-dark rounded-xl transition-colors"
                  aria-label={`Panier (${cartCount} articles)`}
                >
                  <ShoppingBag size={20} className="text-navy/70" />
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gold text-white text-[10px] font-bold flex items-center justify-center rounded-full"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </button>
              )}

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${PHONE}?text=${encodeURIComponent('Salam, je souhaite passer une commande')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 bg-navy hover:bg-navy-light text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ml-1"
              >
                <MessageCircle size={14} />
                Commander
              </a>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2.5 hover:bg-cream-dark rounded-xl transition-colors"
                aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* ═══ SEARCH PANEL ═══ */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-navy/5 bg-white"
            >
              <div className="max-w-2xl mx-auto px-4 py-4">
                <div className="relative">
                  <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un parfum, une marque, une note..."
                    className="w-full pl-12 pr-4 py-3.5 bg-cream border border-navy/10 rounded-xl text-sm text-navy placeholder-navy/30 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy" aria-label="Effacer">
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Results */}
                {searchResults.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {searchResults.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          if (onSelectProduct) onSelectProduct(p);
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 w-full p-3 hover:bg-cream rounded-xl transition-colors text-left group"
                      >
                        <img src={p.image} alt={p.name} className="w-12 h-12 object-contain bg-cream-dark rounded-lg p-1 flex-shrink-0" loading="lazy" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gold font-semibold uppercase tracking-wider">{p.brand}</p>
                          <p className="text-sm font-bold text-navy group-hover:text-gold transition-colors truncate">{p.name}</p>
                          <p className="text-[11px] text-navy/40">{p.family}</p>
                        </div>
                        <span className="font-bold text-navy text-sm flex-shrink-0">{p.price.toLocaleString('fr-DZ')} DA</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchQuery.length >= 2 && searchResults.length === 0 && (
                  <p className="text-center text-navy/30 text-sm py-6">Aucun résultat pour « {searchQuery} »</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ MOBILE MENU ═══ */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="lg:hidden overflow-hidden border-t border-navy/5"
            >
              <div className="px-4 py-5 space-y-1 bg-white">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.label}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={link.action}
                    className="block w-full text-left py-3 px-4 text-[15px] font-medium text-navy hover:text-gold hover:bg-cream rounded-xl transition-colors"
                  >
                    {link.label}
                  </motion.button>
                ))}
                <motion.a
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  href={`https://wa.me/${PHONE}?text=${encodeURIComponent('Salam, je souhaite passer une commande')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full mt-3 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-sm tracking-wider uppercase transition-colors"
                >
                  <MessageCircle size={16} />
                  Commander via WhatsApp
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
