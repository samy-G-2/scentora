import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ChevronRight, ChevronLeft, ShieldCheck, Truck, CreditCard, MessageCircle, CheckCircle, Package, Home, MapPin } from 'lucide-react';
import type { CartItem, OrderInfo, DeliveryType } from '../store/cart';
import { WILAYAS_DATA, FREE_DELIVERY_THRESHOLD, PHONE_NUMBER } from '../store/cart';

interface CartProps {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
  isFreeDelivery: boolean;
  deliveryFee: number;
  total: number;
  selectedWilaya: string;
  deliveryType: DeliveryType;
  onSetWilaya: (w: string) => void;
  onSetDeliveryType: (t: DeliveryType) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  buildWhatsAppMessage: (info: OrderInfo) => string;
  onClose: () => void;
}

type Step = 'cart' | 'info' | 'confirm';

const Cart = ({
  items, subtotal, totalItems, isFreeDelivery, deliveryFee, total,
  selectedWilaya, deliveryType, onSetWilaya, onSetDeliveryType,
  onUpdateQuantity, onRemoveItem, onClearCart, buildWhatsAppMessage, onClose,
}: CartProps) => {
  const [step, setStep] = useState<Step>('cart');
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    fullName: '', phone: '', wilaya: selectedWilaya, address: '', notes: '', deliveryType,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OrderInfo, string>>>({});

  const progressToFree = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;

  // When wilaya changes in cart step, sync with order info
  const handleWilayaChange = (wilayaName: string) => {
    onSetWilaya(wilayaName);
    setOrderInfo(p => ({ ...p, wilaya: wilayaName }));
  };

  const handleDeliveryTypeChange = (t: DeliveryType) => {
    onSetDeliveryType(t);
    setOrderInfo(p => ({ ...p, deliveryType: t }));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!orderInfo.fullName.trim()) e.fullName = 'Nom requis';
    if (!orderInfo.phone.trim() || orderInfo.phone.replace(/\D/g, '').length < 9) e.phone = 'Numéro invalide';
    if (!orderInfo.wilaya) e.wilaya = 'Wilaya requise';
    if (!orderInfo.address.trim()) e.address = 'Adresse requise';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmitOrder = () => {
    if (!validate()) return;
    const msg = buildWhatsAppMessage(orderInfo);
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${msg}`, '_blank');
    setStep('confirm');
  };

  const currentWilayaData = WILAYAS_DATA.find(w => selectedWilaya.includes(w.name));

  return (
    <div className="fixed inset-0 z-[100] flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {step === 'info' && (
              <button onClick={() => setStep('cart')} className="p-1 hover:bg-gray-100 rounded-lg" aria-label="Retour">
                <ChevronLeft size={20} />
              </button>
            )}
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <ShoppingBag size={20} />
              {step === 'cart' && `Panier (${totalItems})`}
              {step === 'info' && 'Vos informations'}
              {step === 'confirm' && 'Commande envoyée'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ═══ STEP: CART ═══ */}
            {step === 'cart' && (
              <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                    <ShoppingBag size={48} className="text-gray-200 mb-4" />
                    <h3 className="text-lg font-bold text-navy mb-2">Votre panier est vide</h3>
                    <p className="text-sm text-gray-400 mb-6">Parcourez notre collection et ajoutez vos parfums préférés.</p>
                    <button onClick={onClose} className="bg-navy text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-navy-light transition-colors">
                      Voir la boutique
                    </button>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {/* Free delivery progress */}
                    {!isFreeDelivery && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <p className="text-xs font-semibold text-amber-800 mb-2">
                          🚚 Plus que {remaining.toLocaleString('fr-DZ')} DA pour la livraison gratuite !
                        </p>
                        <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${progressToFree}%` }} />
                        </div>
                      </div>
                    )}
                    {isFreeDelivery && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span className="text-xs font-semibold text-green-700">Livraison gratuite débloquée ! ✅</span>
                      </div>
                    )}

                    {/* Items */}
                    {items.map(item => (
                      <div key={item.product.id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                        <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-contain bg-white rounded-lg p-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gold font-semibold uppercase tracking-wider">{item.product.brand}</p>
                          <p className="font-bold text-navy text-sm truncate">{item.product.name}</p>
                          <p className="text-xs text-gray-400">{item.product.volume}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg">
                              <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-50 rounded-l-lg" aria-label="Diminuer">
                                <Minus size={14} />
                              </button>
                              <span className="px-3 text-sm font-bold text-navy min-w-[28px] text-center">{item.quantity}</span>
                              <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} className="p-1.5 hover:bg-gray-50 rounded-r-lg" aria-label="Augmenter">
                                <Plus size={14} />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-navy text-sm">{(item.product.price * item.quantity).toLocaleString('fr-DZ')} DA</span>
                              <button onClick={() => onRemoveItem(item.product.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors" aria-label="Supprimer">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* ═══ WILAYA + DELIVERY TYPE SELECTOR ═══ */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Truck size={16} className="text-blue-600" />
                        <span className="text-sm font-bold text-blue-900">Livraison ZR Express</span>
                      </div>

                      {/* Wilaya select */}
                      <div>
                        <label className="block text-[11px] font-semibold text-blue-800 mb-1">Votre wilaya</label>
                        <select
                          value={selectedWilaya}
                          onChange={e => handleWilayaChange(e.target.value)}
                          className={`w-full px-3 py-2.5 bg-white border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${!selectedWilaya ? 'text-gray-400' : 'text-navy'}`}
                        >
                          <option value="">Sélectionnez votre wilaya</option>
                          {WILAYAS_DATA.map(w => (
                            <option key={w.code} value={`${w.code} - ${w.name}`}>
                              {w.code} - {w.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Delivery type */}
                      {selectedWilaya && currentWilayaData && (
                        <div className="space-y-2">
                          <label className="block text-[11px] font-semibold text-blue-800">Mode de livraison</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleDeliveryTypeChange('domicile')}
                              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
                                deliveryType === 'domicile'
                                  ? 'border-blue-500 bg-blue-100'
                                  : 'border-gray-200 bg-white hover:border-blue-300'
                              }`}
                            >
                              <Home size={18} className={deliveryType === 'domicile' ? 'text-blue-600' : 'text-gray-400'} />
                              <span className="text-xs font-bold text-navy">À domicile</span>
                              <span className={`text-sm font-bold ${isFreeDelivery ? 'text-green-600 line-through' : 'text-blue-600'}`}>
                                {currentWilayaData.domicile.toLocaleString('fr-DZ')} DA
                              </span>
                              {isFreeDelivery && <span className="text-[10px] text-green-600 font-bold">GRATUIT</span>}
                            </button>
                            <button
                              onClick={() => handleDeliveryTypeChange('stopdesk')}
                              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
                                deliveryType === 'stopdesk'
                                  ? 'border-blue-500 bg-blue-100'
                                  : 'border-gray-200 bg-white hover:border-blue-300'
                              }`}
                            >
                              <MapPin size={18} className={deliveryType === 'stopdesk' ? 'text-blue-600' : 'text-gray-400'} />
                              <span className="text-xs font-bold text-navy">Stop Desk</span>
                              <span className={`text-sm font-bold ${isFreeDelivery ? 'text-green-600 line-through' : 'text-blue-600'}`}>
                                {currentWilayaData.stopdesk.toLocaleString('fr-DZ')} DA
                              </span>
                              {isFreeDelivery && <span className="text-[10px] text-green-600 font-bold">GRATUIT</span>}
                            </button>
                          </div>
                          <p className="text-[10px] text-blue-600 text-center">
                            💡 Stop Desk = retrait en point relais · Moins cher !
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══ STEP: INFO ═══ */}
            {step === 'info' && (
              <motion.div key="info" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0 }} className="p-5 space-y-4">
                <div className="bg-navy/5 rounded-xl p-4">
                  <p className="text-xs text-navy/60 mb-1">Récapitulatif</p>
                  <p className="font-bold text-navy">{totalItems} article{totalItems > 1 ? 's' : ''} · {total.toLocaleString('fr-DZ')} DA</p>
                  <p className="text-[11px] text-navy/40 mt-1">
                    dont livraison {deliveryType === 'stopdesk' ? 'Stop Desk' : 'à domicile'} : {isFreeDelivery ? 'GRATUITE' : `${deliveryFee.toLocaleString('fr-DZ')} DA`}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">Nom complet *</label>
                  <input type="text" value={orderInfo.fullName} onChange={e => { setOrderInfo(p => ({ ...p, fullName: e.target.value })); setErrors(p => ({ ...p, fullName: undefined })); }}
                    placeholder="Mohamed Ben Ahmed" className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold ${errors.fullName ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.fullName && <p className="text-red-500 text-[11px] mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">Numéro de téléphone *</label>
                  <input type="tel" value={orderInfo.phone} onChange={e => { setOrderInfo(p => ({ ...p, phone: e.target.value })); setErrors(p => ({ ...p, phone: undefined })); }}
                    placeholder="0555 XX XX XX" className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold ${errors.phone ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">Wilaya *</label>
                  <select value={orderInfo.wilaya} onChange={e => { setOrderInfo(p => ({ ...p, wilaya: e.target.value })); setErrors(p => ({ ...p, wilaya: undefined })); }}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 ${errors.wilaya ? 'border-red-300' : 'border-gray-200'} ${!orderInfo.wilaya ? 'text-gray-400' : 'text-navy'}`}>
                    <option value="">Sélectionnez votre wilaya</option>
                    {WILAYAS_DATA.map(w => <option key={w.code} value={`${w.code} - ${w.name}`}>{w.code} - {w.name}</option>)}
                  </select>
                  {errors.wilaya && <p className="text-red-500 text-[11px] mt-1">{errors.wilaya}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">
                    {orderInfo.deliveryType === 'stopdesk' ? 'Commune / Point relais souhaité *' : 'Adresse de livraison *'}
                  </label>
                  <textarea value={orderInfo.address} onChange={e => { setOrderInfo(p => ({ ...p, address: e.target.value })); setErrors(p => ({ ...p, address: undefined })); }}
                    placeholder={orderInfo.deliveryType === 'stopdesk' ? 'Commune ou quartier pour le point relais...' : 'Rue, quartier, commune...'}
                    rows={2} className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none ${errors.address ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.address && <p className="text-red-500 text-[11px] mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">Notes (optionnel)</label>
                  <input type="text" value={orderInfo.notes} onChange={e => setOrderInfo(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Instructions particulières..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="flex items-center gap-1 text-[10px] text-gray-400"><ShieldCheck size={12} className="text-green-500" /> 100% Authentique</span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400"><Truck size={12} className="text-blue-500" /> ZR Express</span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400"><CreditCard size={12} className="text-gold" /> Paiement à la livraison</span>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP: CONFIRM ═══ */}
            {step === 'confirm' && (
              <motion.div key="confirm" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} className="text-green-500" />
                </motion.div>
                <h3 className="text-xl font-bold text-navy mb-2">Commande envoyée ! 🎉</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-xs">Votre commande a été transmise via WhatsApp. Notre équipe vous contactera pour confirmer.</p>
                <div className="bg-gray-50 rounded-xl p-4 w-full max-w-xs mb-6 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <Package size={18} className="text-gold" />
                    <span className="text-sm font-bold text-navy">Récapitulatif</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">👤 {orderInfo.fullName}</p>
                    <p className="text-xs text-gray-500">📞 {orderInfo.phone}</p>
                    <p className="text-xs text-gray-500">📍 {orderInfo.wilaya}</p>
                    <p className="text-xs text-gray-500">🚚 {orderInfo.deliveryType === 'stopdesk' ? 'Stop Desk' : 'À domicile'}</p>
                    <p className="text-xs text-gray-500">📦 {totalItems} article{totalItems > 1 ? 's' : ''}</p>
                    <p className="text-sm font-bold text-navy mt-2">🧾 Total : {total.toLocaleString('fr-DZ')} DA</p>
                  </div>
                </div>
                <button onClick={() => { onClearCart(); onClose(); }} className="bg-navy text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-navy-light transition-colors">
                  Continuer mes achats
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {step === 'cart' && items.length > 0 && (
          <div className="border-t border-gray-100 p-4 bg-white space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sous-total</span>
                <span className="font-semibold text-navy">{subtotal.toLocaleString('fr-DZ')} DA</span>
              </div>
              {selectedWilaya && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Livraison {deliveryType === 'stopdesk' ? '(Stop Desk)' : '(Domicile)'}
                  </span>
                  <span className={`font-semibold ${isFreeDelivery ? 'text-green-500' : 'text-navy'}`}>
                    {isFreeDelivery ? 'GRATUITE' : `${deliveryFee.toLocaleString('fr-DZ')} DA`}
                  </span>
                </div>
              )}
              {!selectedWilaya && (
                <p className="text-[11px] text-amber-600 italic">⚠️ Sélectionnez votre wilaya pour voir les frais de livraison</p>
              )}
              <div className="flex justify-between text-base pt-2 border-t border-gray-100">
                <span className="font-bold text-navy">Total</span>
                <span className="font-bold text-navy text-lg">{total.toLocaleString('fr-DZ')} DA</span>
              </div>
            </div>
            <button
              onClick={() => setStep('info')}
              className="w-full bg-navy hover:bg-navy-light text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
            >
              Passer la commande <ChevronRight size={16} />
            </button>
            <p className="text-[10px] text-center text-gray-400">💳 Paiement à la livraison · 📮 Expédié via ZR Express</p>
          </div>
        )}

        {step === 'info' && (
          <div className="border-t border-gray-100 p-4 bg-white space-y-3">
            <div className="flex justify-between text-base">
              <span className="font-bold text-navy">Total à payer</span>
              <span className="font-bold text-navy text-lg">{total.toLocaleString('fr-DZ')} DA</span>
            </div>
            <button onClick={handleSubmitOrder} className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
              <MessageCircle size={18} /> Confirmer la commande
            </button>
            <p className="text-[10px] text-center text-gray-400">La commande sera envoyée via WhatsApp pour confirmation</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Cart;
