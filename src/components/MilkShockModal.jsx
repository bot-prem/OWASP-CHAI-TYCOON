import React from 'react';
import {
  AlertTriangle,
  Flame,
  Droplet,
  Shield,
  TrendingUp,
  ArrowRight,
  Info,
  DollarSign,
} from 'lucide-react';

export default function MilkShockModal({
  isOpen,
  onClose,
  onSelectOption,
  currentPrice,
  spikedMilkPrice,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-stone-900 border border-amber-500/40 text-stone-100 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient Crisis Red Glow */}
        <div className="absolute -top-20 -left-20 w-52 h-52 bg-rose-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-52 h-52 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-start gap-4 pb-5 border-b border-stone-800 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
                🚨 Economic Market Shock
              </span>
              <span className="text-xs text-amber-400 font-mono font-bold">
                Milk Mandi Crisis
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              The "Milk Price Shock" Hits Town!
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
              A major statewide dairy union strike and festive festival rush has caused the wholesale price of milk to suddenly skyrocket from <strong className="text-emerald-400 font-mono">₹4</strong> to <strong className="text-rose-400 font-mono text-base">₹{spikedMilkPrice}</strong> per portion!
            </p>
          </div>
        </div>

        {/* Decision Options */}
        <div className="space-y-3.5 mb-6">
          <h4 className="text-xs uppercase tracking-wider text-stone-400 font-bold">
            Choose Your Strategic Response:
          </h4>

          {/* Option 1: Raise Chai Price */}
          <div
            onClick={() => onSelectOption('raise_price')}
            className="group bg-stone-800/60 hover:bg-stone-800 border border-stone-700/80 hover:border-amber-500/70 p-4 rounded-2xl transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="font-bold text-sm text-white group-hover:text-amber-300 transition">
                    1. Raise Chai Price (+₹10)
                  </h5>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.2 rounded font-mono font-semibold">
                    New: ₹{currentPrice + 10}/cup
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5 leading-snug">
                  Pass the increased dairy expense onto patrons. High margin per cup, though budget customers will hesitate.
                </p>
              </div>
            </div>
            <button className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 group-hover:bg-amber-500 group-hover:text-stone-950 transition shrink-0 self-end sm:self-center">
              Select
            </button>
          </div>

          {/* Option 2: Dilute with Water */}
          <div
            onClick={() => onSelectOption('dilute_water')}
            className="group bg-stone-800/60 hover:bg-stone-800 border border-stone-700/80 hover:border-sky-500/70 p-4 rounded-2xl transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="font-bold text-sm text-white group-hover:text-sky-300 transition">
                    2. Dilute with Water (Street Hustle)
                  </h5>
                  <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.2 rounded font-mono font-semibold">
                    2x Milk Yield
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5 leading-snug">
                  Add boiled water to stretch milk 2x and keep price unchanged. High risk of spicy negative reviews!
                </p>
              </div>
            </div>
            <button className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-500/30 group-hover:bg-sky-500 group-hover:text-stone-950 transition shrink-0 self-end sm:self-center">
              Select
            </button>
          </div>

          {/* Option 3: Take the Loss */}
          <div
            onClick={() => onSelectOption('absorb_loss')}
            className="group bg-stone-800/60 hover:bg-stone-800 border border-stone-700/80 hover:border-emerald-500/70 p-4 rounded-2xl transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="font-bold text-sm text-white group-hover:text-emerald-300 transition">
                    3. Take the Loss (Protect Loyalty)
                  </h5>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded font-mono font-semibold">
                    Full Kadak Quality
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5 leading-snug">
                  Absorb the inflated milk price yourself. You may make less profit today, but your 5-star reputation is safe.
                </p>
              </div>
            </div>
            <button className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-stone-950 transition shrink-0 self-end sm:self-center">
              Select
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-800 text-xs text-stone-500">
          <span>Decisions apply exclusively to Day's operations.</span>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white underline cursor-pointer"
          >
            Decide Later
          </button>
        </div>
      </div>
    </div>
  );
}
