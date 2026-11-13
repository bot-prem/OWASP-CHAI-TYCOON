import React from 'react';
import { Coffee, DollarSign, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function TycoonGuide() {
  return (
    <div className="bg-gradient-to-br from-amber-900 to-amber-950 text-amber-50 rounded-2xl p-6 shadow-md border border-amber-800/80 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-800 pb-4 mb-4">
        <div>
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full mb-1">
            Tycoon Operations Manual
          </span>
          <h2 className="text-xl font-black text-white">How To Run Your Chai Stall</h2>
        </div>
        <div className="text-xs text-amber-200/80 bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-700/40">
          Formula: 1 Tea + 1 Milk + 1 Sugar + 1 Cup = 1 Kadak Chai
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-amber-950/50 border border-amber-800/50 rounded-xl p-3.5 flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-amber-100 text-sm mb-1">1. Budget & Stock</h4>
            <p className="text-amber-200/70 leading-relaxed">
              Start with your ₹500 budget. Buy wholesale tea leaves, milk, sugar, and cups. Balance your quantities to avoid bottlenecks!
            </p>
          </div>
        </div>

        <div className="bg-amber-950/50 border border-amber-800/50 rounded-xl p-3.5 flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-amber-100 text-sm mb-1">2. Price vs Demand</h4>
            <p className="text-amber-200/70 leading-relaxed">
              Set your chai price per cup (e.g. ₹15). High prices yield bigger margins but turn budget customers away; low prices sell out fast.
            </p>
          </div>
        </div>

        <div className="bg-amber-950/50 border border-amber-800/50 rounded-xl p-3.5 flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-amber-100 text-sm mb-1">3. Rush Hours & Shocks</h4>
            <p className="text-amber-200/70 leading-relaxed">
              Random rush hours create sudden waves of chai lovers. Watch out for dairy strikes and milk price shocks!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
