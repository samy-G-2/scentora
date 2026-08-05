import { useState, useCallback, useMemo } from 'react';
import type { Product } from '../data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

export type DeliveryType = 'domicile' | 'stopdesk';

export interface OrderInfo {
  fullName: string;
  phone: string;
  wilaya: string;
  address: string;
  notes: string;
  deliveryType: DeliveryType;
}

export interface WilayaInfo {
  code: string;
  name: string;
  domicile: number;
  stopdesk: number;
}

export const WILAYAS_DATA: WilayaInfo[] = [
  { code: "01", name: "Adrar", domicile: 1400, stopdesk: 970 },
  { code: "02", name: "Chlef", domicile: 850, stopdesk: 520 },
  { code: "03", name: "Laghouat", domicile: 950, stopdesk: 620 },
  { code: "04", name: "Oum El Bouaghi", domicile: 850, stopdesk: 520 },
  { code: "05", name: "Batna", domicile: 900, stopdesk: 520 },
  { code: "06", name: "Béjaïa", domicile: 800, stopdesk: 520 },
  { code: "07", name: "Biskra", domicile: 950, stopdesk: 620 },
  { code: "08", name: "Béchar", domicile: 1100, stopdesk: 720 },
  { code: "09", name: "Blida", domicile: 600, stopdesk: 470 },
  { code: "10", name: "Bouira", domicile: 700, stopdesk: 520 },
  { code: "11", name: "Tamanrasset", domicile: 1600, stopdesk: 1120 },
  { code: "12", name: "Tébessa", domicile: 900, stopdesk: 570 },
  { code: "13", name: "Tlemcen", domicile: 900, stopdesk: 570 },
  { code: "14", name: "Tiaret", domicile: 850, stopdesk: 520 },
  { code: "15", name: "Tizi Ouzou", domicile: 750, stopdesk: 520 },
  { code: "16", name: "Alger", domicile: 500, stopdesk: 370 },
  { code: "17", name: "Djelfa", domicile: 950, stopdesk: 570 },
  { code: "18", name: "Jijel", domicile: 900, stopdesk: 520 },
  { code: "19", name: "Sétif", domicile: 800, stopdesk: 520 },
  { code: "20", name: "Saïda", domicile: 900, stopdesk: 570 },
  { code: "21", name: "Skikda", domicile: 900, stopdesk: 520 },
  { code: "22", name: "Sidi Bel Abbès", domicile: 900, stopdesk: 520 },
  { code: "23", name: "Annaba", domicile: 850, stopdesk: 520 },
  { code: "24", name: "Guelma", domicile: 900, stopdesk: 520 },
  { code: "25", name: "Constantine", domicile: 800, stopdesk: 520 },
  { code: "26", name: "Médéa", domicile: 800, stopdesk: 520 },
  { code: "27", name: "Mostaganem", domicile: 900, stopdesk: 520 },
  { code: "28", name: "M'Sila", domicile: 850, stopdesk: 570 },
  { code: "29", name: "Mascara", domicile: 900, stopdesk: 520 },
  { code: "30", name: "Ouargla", domicile: 950, stopdesk: 670 },
  { code: "31", name: "Oran", domicile: 800, stopdesk: 520 },
  { code: "32", name: "El Bayadh", domicile: 1100, stopdesk: 670 },
  { code: "33", name: "Illizi", domicile: 1800, stopdesk: 1200 },
  { code: "34", name: "Bordj Bou Arréridj", domicile: 800, stopdesk: 520 },
  { code: "35", name: "Boumerdès", domicile: 700, stopdesk: 520 },
  { code: "36", name: "El Tarf", domicile: 850, stopdesk: 520 },
  { code: "37", name: "Tindouf", domicile: 1800, stopdesk: 1200 },
  { code: "38", name: "Tissemsilt", domicile: 900, stopdesk: 520 },
  { code: "39", name: "El Oued", domicile: 950, stopdesk: 670 },
  { code: "40", name: "Khenchela", domicile: 900, stopdesk: 520 },
  { code: "41", name: "Souk Ahras", domicile: 900, stopdesk: 520 },
  { code: "42", name: "Tipaza", domicile: 700, stopdesk: 520 },
  { code: "43", name: "Mila", domicile: 900, stopdesk: 520 },
  { code: "44", name: "Aïn Defla", domicile: 900, stopdesk: 520 },
  { code: "45", name: "Naâma", domicile: 1100, stopdesk: 670 },
  { code: "46", name: "Aïn Témouchent", domicile: 900, stopdesk: 570 },
  { code: "47", name: "Ghardaïa", domicile: 1100, stopdesk: 720 },
  { code: "48", name: "Relizane", domicile: 900, stopdesk: 520 },
  { code: "49", name: "El M'Ghair", domicile: 1000, stopdesk: 670 },
  { code: "50", name: "El Meniaa", domicile: 1200, stopdesk: 770 },
  { code: "51", name: "Ouled Djellal", domicile: 950, stopdesk: 620 },
  { code: "52", name: "Bordj Badji Mokhtar", domicile: 1800, stopdesk: 1200 },
  { code: "53", name: "Béni Abbès", domicile: 1400, stopdesk: 970 },
  { code: "54", name: "Timimoun", domicile: 1400, stopdesk: 970 },
  { code: "55", name: "Touggourt", domicile: 950, stopdesk: 670 },
  { code: "56", name: "Djanet", domicile: 1800, stopdesk: 1200 },
  { code: "57", name: "In Salah", domicile: 1600, stopdesk: 1120 },
  { code: "58", name: "In Guezzam", domicile: 1800, stopdesk: 1200 },
];

export const FREE_DELIVERY_THRESHOLD = 15000;
export const PHONE_NUMBER = '213555741929';

export function getDeliveryFee(wilayaName: string, type: DeliveryType): number {
  const w = WILAYAS_DATA.find(w => wilayaName.includes(w.name) || wilayaName.includes(w.code));
  if (!w) return 0;
  return type === 'stopdesk' ? w.stopdesk : w.domicile;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('domicile');

  const addItem = useCallback((product: Product) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.product.id !== productId));
    } else {
      setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
    }
  }, []);

  const clearCart = useCallback(() => { setItems([]); setSelectedWilaya(''); setDeliveryType('domicile'); }, []);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.product.price * i.quantity, 0), [items]);
  const totalItems = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);

  const deliveryFee = useMemo(() => {
    if (!selectedWilaya) return 0;
    if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
    return getDeliveryFee(selectedWilaya, deliveryType);
  }, [selectedWilaya, deliveryType, subtotal]);

  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const total = subtotal + deliveryFee;

  const buildWhatsAppMessage = useCallback((info: OrderInfo) => {
    const fee = isFreeDelivery ? 0 : getDeliveryFee(info.wilaya, info.deliveryType);
    const orderTotal = subtotal + fee;
    const modeLabel = info.deliveryType === 'stopdesk' ? 'Stop Desk (point relais)' : 'À domicile';

    const lines = [
      `🛒 *NOUVELLE COMMANDE — SCENTORA*`,
      ``,
      `👤 *Client :* ${info.fullName}`,
      `📞 *Téléphone :* ${info.phone}`,
      `📍 *Wilaya :* ${info.wilaya}`,
      `🏠 *Adresse :* ${info.address}`,
      `📦 *Mode :* ${modeLabel}`,
      info.notes ? `📝 *Notes :* ${info.notes}` : '',
      ``,
      `🧴 *Articles :*`,
      ...items.map(i =>
        `  • ${i.product.name} (${i.product.brand}) x${i.quantity} — ${(i.product.price * i.quantity).toLocaleString('fr-DZ')} DA`
      ),
      ``,
      `💰 *Sous-total :* ${subtotal.toLocaleString('fr-DZ')} DA`,
      `🚚 *Livraison (${modeLabel}) :* ${isFreeDelivery ? 'GRATUITE ✅' : `${fee.toLocaleString('fr-DZ')} DA`}`,
      `🧾 *TOTAL :* ${orderTotal.toLocaleString('fr-DZ')} DA`,
      ``,
      `💳 Paiement à la livraison`,
      `📮 Via ZR Express`,
    ].filter(Boolean);

    return encodeURIComponent(lines.join('\n'));
  }, [items, subtotal, isFreeDelivery]);

  return {
    items, addItem, removeItem, updateQuantity, clearCart,
    subtotal, totalItems, isFreeDelivery, deliveryFee, total,
    selectedWilaya, setSelectedWilaya,
    deliveryType, setDeliveryType,
    buildWhatsAppMessage,
  };
}
