import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import InventoryOverview from './components/InventoryOverview';
import PreparationPhase from './components/PreparationPhase';
import PriceSetter from './components/PriceSetter';
import TycoonGuide from './components/TycoonGuide';
import {
  INITIAL_BUDGET,
  INITIAL_INVENTORY,
  DEFAULT_CHAI_PRICE,
  INGREDIENTS,
} from './constants/gameData';
import { ShieldCheck, Coffee, ShoppingBag, Sparkles } from 'lucide-react';

export default function App() {
  // Budget state (persisted)
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('chai_tycoon_budget');
    return saved !== null ? Number(saved) : INITIAL_BUDGET;
  });

  // Inventory state (persisted)
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('chai_tycoon_inventory');
    return saved !== null ? JSON.parse(saved) : { ...INITIAL_INVENTORY };
  });

  // Day number (persisted)
  const [day, setDay] = useState(() => {
    const saved = localStorage.getItem('chai_tycoon_day');
    return saved !== null ? Number(saved) : 1;
  });

  // Stall Reputation rating (persisted)
  const [reputation, setReputation] = useState(() => {
    const saved = localStorage.getItem('chai_tycoon_reputation');
    return saved !== null ? Number(saved) : 5.0;
  });

  // Chai selling price (persisted)
  const [chaiPrice, setChaiPrice] = useState(() => {
    const saved = localStorage.getItem('chai_tycoon_price');
    return saved !== null ? Number(saved) : DEFAULT_CHAI_PRICE;
  });

  // Wholesale market prices for ingredients
  const [marketPrices, setMarketPrices] = useState(() => {
    const saved = localStorage.getItem('chai_tycoon_prices');
    if (saved) return JSON.parse(saved);
    return {
      teaLeaves: INGREDIENTS.teaLeaves.basePrice,
      milk: INGREDIENTS.milk.basePrice,
      sugar: INGREDIENTS.sugar.basePrice,
      cups: INGREDIENTS.cups.basePrice,
    };
  });

  // Local storage synchronization (Local Execution Only constraint)
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

  useEffect(() => {
    localStorage.setItem('chai_tycoon_prices', JSON.stringify(marketPrices));
  }, [marketPrices]);

  // Handle purchasing stock during preparation phase
  const handleConfirmPurchase = (cart, totalCost) => {
    setBudget((prev) => Math.max(0, prev - totalCost));
    setInventory((prev) => ({
      teaLeaves: (prev.teaLeaves || 0) + (cart.teaLeaves || 0),
      milk: (prev.milk || 0) + (cart.milk || 0),
      sugar: (prev.sugar || 0) + (cart.sugar || 0),
      cups: (prev.cups || 0) + (cart.cups || 0),
    }));
  };

  // Reset simulation to Day 1
  const handleResetGame = () => {
    if (window.confirm('Reset Chai Stall to Day 1? All progress, stock, and budget will return to starting ₹500.')) {
      setBudget(INITIAL_BUDGET);
      setInventory({ ...INITIAL_INVENTORY });
      setDay(1);
      setReputation(5.0);
      setChaiPrice(DEFAULT_CHAI_PRICE);
      setMarketPrices({
        teaLeaves: INGREDIENTS.teaLeaves.basePrice,
        milk: INGREDIENTS.milk.basePrice,
        sugar: INGREDIENTS.sugar.basePrice,
        cups: INGREDIENTS.cups.basePrice,
      });
      localStorage.clear();
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col">
      {/* Top HUD Navigation */}
      <Navbar
        day={day}
        budget={budget}
        reputation={reputation}
        onReset={handleResetGame}
      />

      {/* Main Game Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Banner with phase indicator */}
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-amber-950 font-bold flex items-center justify-center shadow-xs shrink-0">
              🌅
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-amber-950">
                  Day {day}: Morning Preparation Phase
                </h2>
                <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Procurement Active
                </span>
              </div>
              <p className="text-xs text-amber-900/80">
                Inspect wholesale mandi prices, purchase tea, milk, sugar, and cups within budget, and calibrate your selling price.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-xs self-stretch md:self-auto justify-between md:justify-start">
            <span className="text-xs text-stone-500 font-medium">Available Budget:</span>
            <span className="text-base font-extrabold text-emerald-700 font-mono">₹{budget}</span>
          </div>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats
          budget={budget}
          inventory={inventory}
          chaiPrice={chaiPrice}
        />

        {/* Current Inventory Levels */}
        <InventoryOverview inventory={inventory} />

        {/* Feature 2: Daily Wholesale Procurement Phase */}
        <PreparationPhase
          budget={budget}
          inventory={inventory}
          marketPrices={marketPrices}
          onConfirmPurchase={handleConfirmPurchase}
        />

        {/* Feature 2: Set Chai Selling Price */}
        <PriceSetter
          chaiPrice={chaiPrice}
          setChaiPrice={setChaiPrice}
          marketPrices={marketPrices}
        />

        {/* Tycoon Operations Guide */}
        <TycoonGuide />
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 py-6 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-200">Chai Stall Tycoon</span>
            <span>•</span>
            <span>Local Browser-First Engine</span>
          </div>
          <p className="text-stone-400">
            Phase 2: Daily Preparation Phase Implemented • Zero External APIs
          </p>
        </div>
      </footer>
    </div>
  );
}
