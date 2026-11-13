import React from 'react';
import { IndianRupee, TrendingUp, AlertCircle, Percent, Sparkles } from 'lucide-react';
import { getDemandPrediction, calculateUnitChaiCost } from '../utils/gameLogic';

export default function PriceSetter({ chaiPrice, setChaiPrice, marketPrices }) {
  const unitCost = calculateUnitChaiCost(marketPrices);
  const profitPerCup = chaiPrice - unitCost;
  const marginPercentage = chaiPrice > 0 ? Math.round((profitPerCup / chaiPrice) * 100) : 0;
  const demand = getDemandPrediction(chaiPrice);

  const presets = [10, 15, 20, 25];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">Chai Pricing Strategy</h2>
            <p className="text-xs text-stone-500">Set the selling price for 1 cup of Kadak Chai</p>
          </div>
        </div>

        {/* Current price badge */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-xl self-start sm:self-auto">
          <span className="text-xs font-semibold text-emerald-800">Current Selling Price:</span>
          <span className="text-lg font-extrabold text-emerald-950 font-mono">₹{chaiPrice}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Slider & Presets (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="price-slider" className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                Adjust Price per Cup
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-stone-500">Manual Entry:</span>
                <div className="relative">
                  <span className="absolute left-2 top-1.5 text-xs text-stone-500 font-bold">₹</span>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={chaiPrice}
                    onChange={(e) => setChaiPrice(Math.max(5, Math.min(60, Number(e.target.value) || 5)))}
                    className="w-18 pl-5 pr-2 py-1 text-sm font-bold font-mono border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <input
              id="price-slider"
              type="range"
              min={5}
              max={50}
              step={1}
              value={chaiPrice}
              onChange={(e) => setChaiPrice(Number(e.target.value))}
              className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-mono mt-1">
              <span>₹5 (Bargain)</span>
              <span>₹15 (Standard)</span>
              <span>₹30 (Premium)</span>
              <span>₹50 (Luxury)</span>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-stone-500 font-medium">Quick Presets:</span>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setChaiPrice(p)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    chaiPrice === p
                      ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  ₹{p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Profit Margin & Demand Preview (5 cols) */}
        <div className="lg:col-span-5 bg-stone-50 rounded-xl p-4 border border-stone-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-200">
            <span className="text-stone-500 font-medium">Estimated Ingredient Cost:</span>
            <span className="font-bold text-stone-700 font-mono">₹{unitCost}/cup</span>
          </div>

          <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-200">
            <span className="text-stone-500 font-medium">Net Profit Margin:</span>
            <span
              className={`font-black font-mono text-sm ${
                profitPerCup > 0
                  ? 'text-emerald-700'
                  : profitPerCup === 0
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            >
              {profitPerCup >= 0 ? `+₹${profitPerCup}` : `-₹${Math.abs(profitPerCup)}`}{' '}
              <span className="text-xs font-semibold">({marginPercentage}%)</span>
            </span>
          </div>

          {/* Demand Elasticity Badge */}
          <div className="bg-white rounded-lg p-3 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Predicted Customer Response
              </span>
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                <span>{demand.emoji}</span>
                <span>{demand.tier}</span>
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-snug">{demand.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
