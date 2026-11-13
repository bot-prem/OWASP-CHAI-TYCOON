import React from 'react';
import { Coins, Coffee, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

export default function DashboardStats({ budget, inventory, chaiPrice }) {
  const maxCups = Math.min(
    inventory.teaLeaves || 0,
    inventory.milk || 0,
    inventory.sugar || 0,
    inventory.cups || 0
  );

  const potentialRevenue = maxCups * chaiPrice;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Starting Budget */}
      <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 rounded-2xl border border-emerald-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">
            Available Capital
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono">
          ₹{budget.toLocaleString('en-IN')}
        </div>
        <p className="text-[11px] text-emerald-600/80 mt-1 font-medium">
          {budget >= 500 ? 'Initial capital ready for procurement' : 'Working capital for the day'}
        </p>
      </div>

      {/* Max Brewing Capacity */}
      <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50/30 rounded-2xl border border-amber-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold tracking-wider text-amber-700 uppercase">
            Brewing Capacity
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <Coffee className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-amber-950 font-mono">
          {maxCups}{' '}
          <span className="text-base font-semibold text-amber-700 font-sans">cups</span>
        </div>
        <p className="text-[11px] text-amber-700/80 mt-1 font-medium">
          {maxCups === 0
            ? 'Stall cannot brew yet (inventory empty)'
            : `Bottlenecked by lowest stock item`}
        </p>
      </div>

      {/* Potential Daily Revenue */}
      <div className="bg-gradient-to-br from-sky-50 via-white to-sky-50/30 rounded-2xl border border-sky-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold tracking-wider text-sky-700 uppercase">
            Max Potential Revenue
          </span>
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-sky-950 font-mono">
          ₹{potentialRevenue.toLocaleString('en-IN')}
        </div>
        <p className="text-[11px] text-sky-600/80 mt-1 font-medium">
          Based on ₹{chaiPrice}/cup selling price
        </p>
      </div>

      {/* Stall Readiness */}
      <div className="bg-gradient-to-br from-purple-50 via-white to-purple-50/30 rounded-2xl border border-purple-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold tracking-wider text-purple-700 uppercase">
            Stall Status
          </span>
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="text-lg font-bold text-purple-950 mt-1">
          {maxCups === 0 ? 'Stock Needed' : 'Ready to Brew'}
        </div>
        <p className="text-[11px] text-purple-700/80 mt-1 font-medium">
          {maxCups === 0
            ? 'Buy ingredients in preparation phase'
            : `${maxCups} cups ready for rush hour`}
        </p>
      </div>
    </div>
  );
}
