import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { lastToast, dismissToast } = useCart();

  useEffect(() => {
    if (lastToast) {
      const timer = setTimeout(() => {
        dismissToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [lastToast, dismissToast]);

  if (!lastToast) return null;

  return (
    <aside
      aria-label="Notification"
      className="fixed bottom-6 left-6 z-50 max-w-sm bg-white border border-[#E6E0D5] text-[#292B28] rounded-md shadow-lg p-3.5 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="w-7 h-7 rounded-full bg-[#EDF1EC] text-[#34483B] flex items-center justify-center shrink-0">
          <ShoppingBag className="w-3.5 h-3.5" />
        </div>
        <p className="text-xs text-[#292B28] truncate font-medium">
          {lastToast}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          to="/cart"
          onClick={dismissToast}
          className="text-xs font-semibold text-[#34483B] hover:underline whitespace-nowrap"
        >
          View Bag
        </Link>
        <button
          onClick={dismissToast}
          className="text-[#666963] hover:text-[#292B28] p-1 rounded-xs"
          aria-label="Dismiss toast"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
