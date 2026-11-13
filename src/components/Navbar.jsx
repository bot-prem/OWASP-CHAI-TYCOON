import React from 'react';
import { Coffee, Coins, Calendar, RotateCcw, Award } from 'lucide-react';

export default function Navbar({ day, budget, reputation, onReset }) {
  return (
    <header className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-amber-50 shadow-lg border-b border-amber-700/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Coffee className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  Chai Stall <span className="text-amber-400">Tycoon</span>
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/30">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-medium">
                Corner Tapri Business Simulator
              </p>
            </div>
          </div>

          {/* Quick HUD Badges */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
            {/* Day Badge */}
            <div className="flex items-center gap-2 bg-amber-950/60 border border-amber-700/60 px-3 py-1.5 rounded-xl shadow-sm">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-300/80 font-medium">Day</span>
              <span className="text-sm font-bold text-white font-mono">{day}</span>
            </div>

            {/* Budget Badge */}
            <div className="flex items-center gap-2 bg-amber-950/60 border border-emerald-600/50 px-3.5 py-1.5 rounded-xl shadow-sm">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-300/80 font-medium">Cash</span>
              <span className="text-sm font-extrabold text-emerald-300 font-mono">
                ₹{budget.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Rating Badge */}
            <div className="flex items-center gap-2 bg-amber-950/60 border border-amber-600/50 px-3 py-1.5 rounded-xl shadow-sm">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-300/80 font-medium">Rating</span>
              <span className="text-sm font-bold text-amber-300 font-mono">
                {reputation.toFixed(1)} ★
              </span>
            </div>

            {/* Reset Button */}
            <button
              onClick={onReset}
              title="Reset simulation to Day 1"
              className="flex items-center gap-1.5 text-xs font-medium text-amber-200 hover:text-white bg-amber-800/40 hover:bg-amber-800/70 border border-amber-700/50 px-2.5 py-1.5 rounded-xl transition duration-150 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
