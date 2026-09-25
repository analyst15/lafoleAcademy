import React, { useState } from 'react';
import { Tag, X } from 'lucide-react';

interface PromoAlertBarProps {
  onShopNow?: () => void;
  onDismiss?: () => void;
}

export const PromoAlertBar: React.FC<PromoAlertBarProps> = ({
  onShopNow,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  if (!isVisible) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div 
      id="promo-alert-banner"
      role="alert"
      className="w-full bg-[#F0F7F4] dark:bg-[#0c1813] border-b border-[#D8ECE1] dark:border-emerald-950/80 transition-all duration-200"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-2 sm:py-2.5 flex items-center justify-between gap-3 text-xs sm:text-[13px] md:text-sm">
        
        {/* Left balance spacer for perfect centering on desktop */}
        <div className="hidden lg:block w-7 flex-shrink-0" aria-hidden="true" />

        {/* Centered Alert Content */}
        <div className="flex items-center justify-center flex-wrap gap-x-1.5 gap-y-1 text-slate-700 dark:text-slate-200 leading-normal mx-auto text-center">
          {/* Green Tag Icon */}
          <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16A34A] dark:text-emerald-400 flex-shrink-0 inline-block mr-0.5" />
          
          <span className="font-normal">Back to school sale:</span>
          <span className="font-bold text-slate-900 dark:text-white">50% off</span>
          <span>all courses —</span>
          <span className="text-slate-600 dark:text-slate-300">Diploma kuma jirto qiima dhimista</span>

          {/* 10d left badge in orange */}
          <span className="text-[#EA580C] dark:text-amber-400 font-semibold ml-1">
            10d left
          </span>

          {/* Shop now link in green with underline */}
          <button
            type="button"
            onClick={onShopNow}
            className="text-[#16A34A] dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold underline underline-offset-4 decoration-[#16A34A] dark:decoration-emerald-400 ml-1.5 transition-colors cursor-pointer"
          >
            Shop now
          </button>
        </div>

        {/* Close / Dismiss Action on the right */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
          className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer flex-shrink-0 ml-auto lg:ml-0"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

      </div>
    </div>
  );
};
