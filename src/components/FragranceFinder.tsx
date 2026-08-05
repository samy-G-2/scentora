import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles, MessageCircle } from 'lucide-react';
import { products } from '../data/products';
import type { Product } from '../data/products';

const PHONE = '213555741929';

interface Step {
  id: string;
  question: string;
  options: { label: string; value: string; icon: string }[];
}

const steps: Step[] = [
  {
    id: 'gender',
    question: 'Pour qui cherchez-vous ?',
    options: [
      { label: 'Homme', value: 'homme', icon: '👨' },
      { label: 'Femme', value: 'femme', icon: '👩' },
      { label: 'Peu importe', value: 'all', icon: '✨' },
    ]
  },
  {
    id: 'occasion',
    question: 'Pour quelle occasion ?',
    options: [
      { label: 'Quotidien', value: 'Quotidien', icon: '☀️' },
      { label: 'Soirée', value: 'Soirée', icon: '🌙' },
      { label: 'Bureau', value: 'Bureau', icon: '💼' },
      { label: 'Rendez-vous', value: 'Rendez-vous', icon: '❤️' },
      { label: 'Mariage', value: 'Mariage', icon: '💍' },
      { label: 'Cadeau', value: 'Cadeau', icon: '🎁' },
    ]
  },
  {
    id: 'style',
    question: 'Quel style vous attire ?',
    options: [
      { label: 'Frais & Aquatique', value: 'frais', icon: '🌊' },
      { label: 'Oriental & Épicé', value: 'oriental', icon: '🕌' },
      { label: 'Boisé & Cuir', value: 'boise', icon: '🪵' },
      { label: 'Gourmand & Vanillé', value: 'gourmand', icon: '🍯' },
      { label: 'Floral & Fruité', value: 'floral', icon: '🌸' },
    ]
  },
  {
    id: 'budget',
    question: 'Votre budget ?',
    options: [
      { label: 'Moins de 6 000 DA', value: 'low', icon: '💰' },
      { label: '6 000 — 8 000 DA', value: 'mid', icon: '💎' },
      { label: 'Plus de 8 000 DA', value: 'high', icon: '👑' },
    ]
  },
];

const styleKeywords: Record<string, string[]> = {
  frais: ['Aquatique', 'Fruité', 'frais'],
  oriental: ['Oriental', 'Épicé', 'Ambre', 'Oud'],
  boise: ['Boisé', 'Cuir'],
  gourmand: ['Gourmand', 'Vanillé'],
  floral: ['Floral', 'Rose', 'Fruité'],
};

interface FinderProps {
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
}

const FragranceFinder = ({ onClose, onSelectProduct }: FinderProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (stepId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [stepId]: value }));
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentStep(steps.length);
    }
  };

  const results = useMemo(() => {
    if (currentStep < steps.length) return [];

    return products.filter(p => {
      if (p.category === 'coffret' && answers.occasion !== 'Cadeau') return false;
      if (answers.occasion === 'Cadeau' && p.category === 'coffret') return true;

      if (answers.gender === 'homme' && p.category === 'femme') return false;
      if (answers.gender === 'femme' && p.category === 'homme') return false;

      if (answers.occasion && answers.occasion !== 'Cadeau' && !p.occasion.some(o => o.includes(answers.occasion))) return false;

      if (answers.style && styleKeywords[answers.style]) {
        const kw = styleKeywords[answers.style];
        if (!kw.some(k => p.family.toLowerCase().includes(k.toLowerCase()))) return false;
      }

      if (answers.budget === 'low' && p.price >= 6000) return false;
      if (answers.budget === 'mid' && (p.price < 6000 || p.price > 8000)) return false;
      if (answers.budget === 'high' && p.price <= 8000) return false;

      return true;
    }).slice(0, 5);
  }, [answers, currentStep]);

  const showResults = currentStep >= steps.length;
  const progress = Math.min(((currentStep) / steps.length) * 100, 100);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b border-gray-100">
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center" aria-label="Fermer">
            <X size={18} />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={20} className="text-gold" />
            <h2 className="text-lg font-bold text-navy">Trouvez votre parfum idéal</h2>
          </div>
          {/* Progress */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gold rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {showResults ? 'Vos recommandations' : `Question ${currentStep + 1} sur ${steps.length}`}
          </p>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key={currentStep}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="text-xl font-serif font-bold text-navy mb-6">
                  {steps[currentStep].question}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {steps[currentStep].options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(steps[currentStep].id, opt.value)}
                      className="flex flex-col items-center gap-2 p-4 bg-cream hover:bg-gold/10 border-2 border-transparent hover:border-gold/30 rounded-xl transition-all text-center group"
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <span className="text-sm font-semibold text-navy group-hover:text-gold transition-colors">{opt.label}</span>
                    </button>
                  ))}
                </div>
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="flex items-center gap-1 mt-4 text-sm text-gray-400 hover:text-navy transition-colors"
                  >
                    <ChevronLeft size={14} /> Précédent
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {results.length > 0 ? (
                  <>
                    <h3 className="text-xl font-serif font-bold text-navy mb-2">
                      {results.length === 1 ? 'Votre parfum idéal' : `${results.length} parfums pour vous`}
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">Sélection personnalisée selon vos préférences</p>
                    <div className="space-y-3">
                      {results.map((p, i) => (
                        <motion.div
                          key={p.id}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-4 p-3 bg-cream rounded-xl hover:bg-gold/5 transition-colors cursor-pointer group"
                          onClick={() => { onClose(); onSelectProduct(p); }}
                        >
                          <img src={p.image} alt={p.name} className="w-16 h-16 object-contain rounded-lg bg-white p-1" loading="lazy" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gold font-semibold uppercase tracking-wider">{p.brand}</p>
                            <p className="font-bold text-navy group-hover:text-gold transition-colors truncate">{p.name}</p>
                            <p className="text-xs text-gray-500">{p.family} · {p.longevity}h+</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-navy">{p.price.toLocaleString('fr-DZ')} DA</p>
                            <ChevronRight size={14} className="text-gray-300 ml-auto" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-4xl mb-4">🤔</p>
                    <h3 className="text-lg font-bold text-navy mb-2">Aucun résultat exact</h3>
                    <p className="text-sm text-gray-500 mb-6">Contactez-nous sur WhatsApp pour des recommandations personnalisées !</p>
                  </div>
                )}

                <a
                  href={`https://wa.me/${PHONE}?text=${encodeURIComponent('Salam, je cherche un parfum personnalisé. Pouvez-vous me conseiller ?')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full mt-4 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors"
                >
                  <MessageCircle size={16} /> Demander un conseil personnalisé
                </a>

                <button
                  onClick={() => { setCurrentStep(0); setAnswers({}); }}
                  className="w-full mt-3 py-2.5 text-sm text-gray-400 hover:text-navy transition-colors"
                >
                  Recommencer le quiz
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default FragranceFinder;
