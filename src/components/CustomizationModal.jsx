import React from 'react';
import { Sliders } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';

export const CustomizationModal = () => {
  const { isAdmin, openDashboardModal, openLoginModal } = useAdmin();
  const { data } = useLanguage();

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <button
        onClick={() => (isAdmin ? openDashboardModal('settings') : openLoginModal())}
        title="Pengaturan & Panel Admin"
        className="p-2.5 rounded-full glass-panel border border-white/10 text-warm-300/50 hover:text-champagne-300 hover:border-champagne-400/40 transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex items-center gap-2 group"
        aria-label="Panel Admin"
      >
        <Sliders className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
        <span className="hidden sm:inline text-[9px] tracking-mega-wide uppercase text-warm-300/60 group-hover:text-champagne-300 font-sans">
          {data.customization?.button || 'Panel Admin'}
        </span>
      </button>
    </div>
  );
};

export default CustomizationModal;