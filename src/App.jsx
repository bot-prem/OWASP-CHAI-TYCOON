import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import InventoryOverview from './components/InventoryOverview';
import TycoonGuide from './components/TycoonGuide';
import { INITIAL_BUDGET, INITIAL_INVENTORY, DEFAULT_CHAI_PRICE } from './constants/gameData';
import { Sparkles, ShoppingCart, PlayCircle, ShieldCheck } from 'lucide-react';

export default function App() {
  // Initialize state with default or persisted local storage
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('chai_tycoon_budget');
    return saved !== null ? Number(saved) : INITIAL_BUDGET;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('chai_tycoon_inventory');
    return saved !== null ? JSON.parse(saved) : { ...INITIAL_INVENTORY };
  });

  const [day, setDay] = useState(() => {
    const saved = localStorage.getItem('chai_tycoon_day');
    return saved !== null ? Number(saved) : 1;
  });

  const [reputation, setReputation] = useState(() => {
    const saved = localStorage.getItem('chai_tycoon_reputation');
    return saved !== null ? Number(saved) : 5.0;
  });

  const [chaiPrice, setChaiPrice] = useState(() => {
    const saved = localStorage.getItem('chai_tycoon_price');
    return saved !== null ? Number(saved) : DEFAULT_CHAI_PRICE;
  });

  // Persist state to local storage (Local Execution Only constraint)
  useEffect(() => {
    localStorage.setItem('chai_tycoon_budget', budget.toString());
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('chai_tycoon_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('chai_tycoon_day', day.toString());
  }, [day]);

  useEffect(() => {
    localStorage.setItem('chai_tycoon_reputation', reputation.toString());
  }, [reputation]);

  useEffect(() => {
    localStorage.setItem('chai_tycoon_price', chaiPrice.toString());
  }, [chaiPrice]);

  const handleResetGame = () => {
    if (window.confirm('Are you sure you want to reset your Chai Stall? All progress will reset to Day 1 with ₹500.')) {
      setBudget(INITIAL_BUDGET);
      setInventory({ ...INITIAL_INVENTORY });
      setDay(1);
      setReputation(5.0);
      setChaiPrice(DEFAULT_CHAI_PRICE);
      localStorage.clear();
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col">
      {/* Top Navigation Bar */}
      <Navbar
        day={day}
        budget={budget}
        reputation={reputation}
        onReset={handleResetGame}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Banner with Status & MVP Step indicator */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-amber-950 font-bold flex items-center justify-center shadow-sm shrink-0">
              ☕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-amber-950">
                  Day {day} — Stall Morning Dashboard
                </h2>
                <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> State Initialized
                </span>
              </div>
              <p className="text-xs text-amber-900/80">
                Daily starting budget initialized to ₹{budget.toLocaleString('en-IN')}. Inventory ready for procurement.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-xs self-stretch md:self-auto justify-between md:justify-start">
            <span className="text-xs text-stone-500 font-medium">Stall Cash Reserves:</span>
            <span className="text-sm font-extrabold text-emerald-700 font-mono">₹{budget}</span>
          </div>
        </div>

        {/* Top-Level KPI Dashboard Cards */}
        <DashboardStats
          budget={budget}
          inventory={inventory}
          chaiPrice={chaiPrice}
        />

        {/* Current Ingredient Inventory Display */}
        <InventoryOverview inventory={inventory} />

        {/* Operations Guide Card */}
        <TycoonGuide />
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 py-6 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-200">Chai Stall Tycoon</span>
            <span>•</span>
            <span>Browser-First Simulation Engine</span>
          </div>
          <p className="text-stone-400">
            Local Execution • Zero External APIs • Production-Grade Web App
          </p>
        </div>
      </footer>
    </div>
  );
}
