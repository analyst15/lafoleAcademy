import React, { useEffect, useRef } from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { calculateCartTotal } from '../utils/cartUtils';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (courseId: string) => void;
  onCheckout: () => void;
  onViewCart: () => void;
}

export const CartDropdown: React.FC<CartDropdownProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onCheckout,
  onViewCart
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const total = calculateCartTotal(cartItems);
  const formattedTotal = `$${total.toFixed(2)}`;
  const count = cartItems.length;

  return (
    <div
      ref={dropdownRef}
      id="cart-dropdown-popover"
      role="dialog"
      aria-label="Shopping Cart Menu"
      className="absolute right-0 top-full mt-2.5 w-[340px] sm:w-[370px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 p-5 z-50 animate-fadeIn select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          Your Cart ({count} {count === 1 ? 'item' : 'items'})
        </h3>
        <button
          onClick={onClose}
          aria-label="Close cart menu"
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Cart Items List */}
      {cartItems.length === 0 ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Your cart is currently empty.
          </p>
          <button
            onClick={() => {
              onClose();
              onViewCart();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#22C55E] text-white text-xs font-semibold hover:bg-[#16A34A] transition-colors"
          >
            Explore Courses
          </button>
        </div>
      ) : (
        <div className="py-3 max-h-[260px] overflow-y-auto space-y-3.5 divide-y divide-slate-100/70 dark:divide-slate-800/60 pr-1">
          {cartItems.map((item) => (
            <div
              key={item.courseId}
              className="flex items-center justify-between gap-3 pt-3 first:pt-0 group"
            >
              {/* Thumbnail */}
              <img
                src={item.thumbnail}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-slate-200/80 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
              />

              {/* Title & Info */}
              <div className="flex-1 min-w-0 pr-1">
                <p 
                  title={item.title}
                  className="text-xs sm:text-[13px] font-medium text-slate-900 dark:text-slate-100 truncate"
                >
                  {item.title}
                </p>
              </div>

              {/* Price & Remove Button */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  ${Number(item.price).toFixed(2)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item.courseId);
                  }}
                  aria-label={`Remove ${item.title} from cart`}
                  className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pricing Summary */}
      {cartItems.length > 0 && (
        <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-[13px] text-slate-600 dark:text-slate-400">
            <span>Subtotal ({count} {count === 1 ? 'item' : 'items'})</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">{formattedTotal}</span>
          </div>

          <div className="flex items-center justify-between text-sm sm:text-base font-bold text-slate-900 dark:text-white pt-1">
            <span>Total</span>
            <span className="text-slate-900 dark:text-white">{formattedTotal}</span>
          </div>

          {/* Bottom Action Buttons: View cart & Checkout */}
          <div className="flex items-center gap-2.5 pt-3">
            <button
              id="btn-cart-view-cart"
              onClick={() => {
                onClose();
                onViewCart();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors text-center"
            >
              View cart
            </button>
            <button
              id="btn-cart-checkout"
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
