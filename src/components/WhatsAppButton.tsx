import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/213555741929?text=Salam%2C%20je%20vous%20contacte%20depuis%20votre%20site%20Scentora"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
    >
      {/* Tooltip */}
      <span className="absolute bottom-full right-0 mb-3 bg-white text-gray-900 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        💬 Besoin d'aide ? Écrivez-nous !
        <span className="absolute top-full right-6 w-2 h-2 bg-white transform rotate-45 -translate-y-1" />
      </span>

      {/* Button */}
      <div className="bg-green-500 hover:bg-green-600 text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 whatsapp-pulse">
        <MessageCircle size={26} />
      </div>
    </a>
  );
};

export default WhatsAppButton;
