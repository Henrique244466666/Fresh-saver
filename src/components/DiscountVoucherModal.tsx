import React, { useState } from 'react';
import { X, Check, Copy, Store, Calendar, ShieldCheck, Ticket } from 'lucide-react';
import { DiscountReward } from '../types/pantry';
import { formatHumanDate } from '../data/mockData';

interface DiscountVoucherModalProps {
  reward: DiscountReward | null;
  onClose: () => void;
  onMarkClaimed: (rewardId: string) => void;
}

export const DiscountVoucherModal: React.FC<DiscountVoucherModalProps> = ({
  reward,
  onClose,
  onMarkClaimed
}) => {
  const [copied, setCopied] = useState(false);

  if (!reward) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(reward.code);
    setCopied(true);
    onMarkClaimed(reward.id);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Ribbon */}
        <div className="bg-emerald-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-emerald-200" />
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
              Top Saver Partner Voucher
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-800 transition-colors"
            aria-label="Close voucher modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-2">
              <Store className="w-3.5 h-3.5" />
              <span>{reward.partnerStore}</span>
            </div>
            <h3 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              {reward.discountValue}
            </h3>
            <p className="text-sm text-stone-600 mt-1 max-w-sm mx-auto">
              {reward.description}
            </p>
          </div>

          {/* Barcode Presentation Box */}
          <div className="p-4 bg-stone-50 rounded-xl border border-dashed border-stone-300 text-center space-y-3">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Scan at Checkout or Apply Online
            </p>

            {/* Simulated Clean Vector Barcode */}
            <div className="flex justify-center items-center gap-[2.5px] h-14 px-4 bg-white py-2 rounded-lg border border-stone-200">
              {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 3, 1, 2, 4, 1, 3].map((width, idx) => (
                <div 
                  key={idx} 
                  className="bg-stone-900 h-full rounded-xs" 
                  style={{ width: `${width * 2}px` }} 
                />
              ))}
            </div>

            {/* Promo Code Box */}
            <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-stone-200">
              <div className="text-left pl-2">
                <span className="text-[10px] text-stone-400 block font-mono">PROMO CODE</span>
                <span className="font-mono text-base font-bold text-stone-900 tracking-wider">
                  {reward.code}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Details & Terms */}
          <div className="text-xs text-stone-500 space-y-2 border-t border-stone-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-stone-600">
                <Calendar className="w-3.5 h-3.5" /> Valid Until:
              </span>
              <span className="font-semibold text-stone-800">
                {formatHumanDate(reward.expiryDate)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-stone-600">
                <ShieldCheck className="w-3.5 h-3.5" /> Saver Tier:
              </span>
              <span className="font-semibold text-stone-800">
                {reward.minTier}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 pt-1 leading-relaxed">
              {reward.terms}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
