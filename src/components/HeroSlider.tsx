import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, Star } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Khamrah",
    subtitle: "Best-Seller N°1 en Algérie",
    description: "Un chef-d'œuvre oriental gourmand aux notes envoûtantes de cannelle, vanille et dattes. Sillage puissant, tenue 10h+.",
    image: "https://www.lattafa-usa.com/cdn/shop/files/Khamrah-1.png?v=1747418862&width=900",
    price: "7 500",
    brand: "Lattafa",
  },
  {
    id: 2,
    title: "Asad",
    subtitle: "L'alternative à Dior Sauvage Elixir",
    description: "Masculin, sombre et addictif. Notes de tabac, café et vanille. La puissance niche à un prix accessible.",
    image: "https://www.lattafa-usa.com/cdn/shop/files/Asad-1.png?v=1747416375&width=900",
    price: "6 900",
    brand: "Lattafa",
  },
  {
    id: 3,
    title: "9PM",
    subtitle: "Le parfum de soirée parfait",
    description: "Frais et sensuel. Un mélange addictif de lavande, cannelle et vanille qui ne laisse personne indifférent.",
    image: "https://ma.afnan.com/cdn/shop/files/9PM-Product-01_2.jpg?v=1765370654&width=900",
    price: "6 500",
    brand: "Afnan",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent(prev => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  const textVariants = {
    enter: (d: number) => ({ x: d * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * -60, opacity: 0 }),
  };

  const imageVariants = {
    enter: { scale: 0.85, opacity: 0, rotate: -2 },
    center: { scale: 1, opacity: 1, rotate: 0 },
    exit: { scale: 0.85, opacity: 0, rotate: 2 },
  };

  return (
    <section className="relative overflow-hidden bg-navy" aria-label="Parfums vedettes">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light/50 to-navy" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/3 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[560px] md:min-h-[640px] lg:min-h-[700px] flex flex-col-reverse md:flex-row items-center py-12 md:py-0">

          {/* Text */}
          <div className="flex-1 text-center md:text-left z-10 pb-8 md:pb-0">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <motion.span
                  className="inline-flex items-center gap-2 bg-gold/15 text-gold px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] mb-6"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <Star size={12} className="fill-gold" />
                  {slide.subtitle}
                </motion.span>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-white mb-5 leading-[0.95]">
                  {slide.title}
                  <span className="block text-gold/40 text-lg sm:text-xl font-sans font-medium tracking-wider mt-2">{slide.brand}</span>
                </h1>

                <p className="text-white/50 text-sm sm:text-base max-w-md mb-8 leading-relaxed mx-auto md:mx-0">
                  {slide.description}
                </p>

                <div className="flex items-center gap-4 mb-8 justify-center md:justify-start">
                  <span className="text-3xl sm:text-4xl font-bold text-white">{slide.price}</span>
                  <span className="text-white/30 text-lg font-medium">DA</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <a
                    href="#boutique"
                    className="group inline-flex items-center justify-center px-8 py-4 bg-gold hover:bg-gold-light text-navy font-bold uppercase tracking-[0.1em] text-sm rounded-lg transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/40"
                  >
                    Acheter maintenant
                  </a>
                  <a
                    href="#boutique"
                    className="inline-flex items-center justify-center px-8 py-4 border border-white/20 hover:border-white/40 text-white font-semibold uppercase tracking-[0.1em] text-sm rounded-lg transition-all duration-300 hover:bg-white/5"
                  >
                    Découvrir les collections
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Trust micro-badges */}
            <div className="flex items-center gap-5 mt-10 justify-center md:justify-start">
              {[
                { icon: <ShieldCheck size={14} />, text: '100% Authentique' },
                { icon: <Truck size={14} />, text: 'Livraison 58 wilayas' },
              ].map((b, i) => (
                <span key={i} className="flex items-center gap-1.5 text-white/30 text-[11px] font-medium">
                  <span className="text-gold/60">{b.icon}</span>
                  {b.text}
                </span>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 flex justify-center items-center relative z-10">
            {/* Glow */}
            <div className="absolute w-[280px] h-[280px] md:w-[400px] md:h-[400px] bg-gold/8 rounded-full blur-[80px]" />

            <AnimatePresence mode="wait">
              <motion.img
                key={slide.id}
                src={slide.image}
                alt={slide.title}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="relative max-h-[280px] sm:max-h-[360px] md:max-h-[460px] lg:max-h-[540px] object-contain drop-shadow-[0_20px_60px_rgba(212,175,55,0.15)]"
              />
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <button onClick={prev} className="w-10 h-10 rounded-full border border-white/10 hover:border-gold/40 flex items-center justify-center text-white/40 hover:text-gold transition-all" aria-label="Précédent">
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-gold' : 'w-3 bg-white/15 hover:bg-white/30'}`}
            />
          ))}
        </div>
        <button onClick={next} className="w-10 h-10 rounded-full border border-white/10 hover:border-gold/40 flex items-center justify-center text-white/40 hover:text-gold transition-all" aria-label="Suivant">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
};

export default HeroSlider;
