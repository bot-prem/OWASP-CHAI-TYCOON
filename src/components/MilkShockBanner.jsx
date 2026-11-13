import React from 'react';
import {
  AlertTriangle,
  Zap,
  TrendingUp,
  Droplet,
  Shield,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function MilkShockBanner({
  isShockActive,
  onTriggerShock,
  onResetShock,
  milkPrice,
  shockStrategy,
  onOpenDecisionModal,
}) {
  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 mb-6 transition-all ${
        isShockActive
          ? 'bg-gradient-to-r from-rose-500/15 via-rose-500/5 to-amber-500/10 border-rose-400 shadow-sm'
          : 'bg-white border-stone-200/90 shadow-xs'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isShockActive
                ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isShockActive ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <Zap className="w-5 h-5 text-amber-600" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                {isShockActive
                  ? 'CRISIS ACTIVE: Wholesale Milk Price Shock!'
                  : 'Market Volatility Simulation: Milk Shock Trigger'}
              </h3>
              {isShockActive ? (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                  Milk @ ₹{milkPrice} (300% Spike)
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Normal Milk @ ₹{milkPrice}
                </span>
              )}
            </div>

            <p className="text-xs text-stone-500 mt-0.5">
              {isShockActive ? (
                <span>
                  Wholesale milk costs ₹{milkPrice}/portion.{' '}
                  {shockStrategy ? (
                    <strong className="text-stone-800 font-semibold">
                      Strategy Active:{' '}
                      {shockStrategy === 'raise_price' && '📈 Price Raised (+₹10)'}
                      {shockStrategy === 'dilute_water' && '💧 Water Dilution (2x Yield)'}
                      {shockStrategy === 'absorb_loss' && '🛡️ Absorb Cost (Protect Loyalty)'}
                    </strong>
                  ) : (
                    <strong className="text-rose-600">Pending Tycoon Strategy Decision!</strong>
                  )}
                </span>
              ) : (
                'Test dynamic market volatility. Spikes wholesale milk price to test pricing resilience.'
              )}
            </p>
          </div>
        </div>

        {/* Right CTA Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {isShockActive ? (
            <>
              <button
                onClick={onOpenDecisionModal}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-xs transition cursor-pointer"
              >
                Change Strategy
              </button>
              <button
                onClick={onResetShock}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
                title="Restore normal wholesale milk price"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>End Shock</span>
              </button>
            </>
          ) : (
            <button
              onClick={onTriggerShock}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-xs shadow-rose-600/20 transition cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Trigger Milk Price Shock Event</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
