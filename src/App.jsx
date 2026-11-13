import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import InventoryOverview from './components/InventoryOverview';
import PreparationPhase from './components/PreparationPhase';
import PriceSetter from './components/PriceSetter';
import SimulationModal from './components/SimulationModal';
import TycoonGuide from './components/TycoonGuide';
import {
  INITIAL_BUDGET,
  INITIAL_INVENTORY,
  DEFAULT_CHAI_PRICE,
  INGREDIENTS,
} from './constants/gameData';
import { runDaySimulation } from './utils/simulationEngine';
import { calculateBrewCapacity } from './utils/gameLogic';
import { ShieldCheck, Play, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

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

  // Simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [lastReport, setLastReport] = useState(null);
  const [appAlert, setAppAlert] = useState(null);

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
    setAppAlert(null);
  };

  // Launch the local simulation engine
  const handleStartDay = () => {
    const capacity = calculateBrewCapacity(inventory);
    if (capacity <= 0) {
      setAppAlert({
        type: 'error',
        message: 'Cannot open stall: Brewing capacity is 0 cups! Purchase ingredients in the wholesale section below.',
      });
      return;
    }

    // Run the local simulation algorithm
    const simResult = runDaySimulation({
      chaiPrice,
      inventory,
      reputation,
    });

    setActiveSimulation(simResult);
    setIsSimulating(true);
    setAppAlert(null);
  };

  // Complete simulation and update game state
  const handleSimulationComplete = () => {
    if (!activeSimulation) return;

    // Apply financial and inventory updates
    setBudget((prev) => prev + activeSimulation.revenue);
    setInventory(activeSimulation.remainingInventory);
    setLastReport(activeSimulation);
    setIsSimulating(false);
    setActiveSimulation(null);

    setAppAlert({
      type: 'success',
      message: `Day ${day} simulation completed! Sold ${activeSimulation.cupsSold} cups for ₹${activeSimulation.revenue}.`,
    });
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
      setLastReport(null);
      setActiveSimulation(null);
      setIsSimulating(false);
      localStorage.clear();
    }
  };

  const currentCapacity = calculateBrewCapacity(inventory);

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
        {/* Banner with phase indicator & Start Day CTA */}
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-amber-950 font-bold flex items-center justify-center shadow-xs shrink-0 text-xl">
              🌅
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-amber-950">
                  Day {day}: Morning Preparation & Simulation
                </h2>
                <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Ready
                </span>
              </div>
              <p className="text-xs text-amber-900/80">
                Stock your stall, adjust your price, and start the day to run the local sales simulation engine with randomized rush hours.
              </p>
            </div>
          </div>

          {/* Action Callout Button */}
          <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
            <button
              onClick={handleStartDay}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm tracking-wide shadow-md transition-all cursor-pointer ${
                currentCapacity > 0
                  ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START DAY {day} SIMULATION</span>
            </button>
          </div>
        </div>

        {/* Global Toast Alert */}
        {appAlert && (
          <div
            className={`mb-6 p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 border shadow-xs animate-fadeIn ${
              appAlert.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {appAlert.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            <span>{appAlert.message}</span>
          </div>
        )}

        {/* Dashboard Stats */}
        <DashboardStats
          budget={budget}
          inventory={inventory}
          chaiPrice={chaiPrice}
        />

        {/* Current Inventory Levels */}
        <InventoryOverview inventory={inventory} />

        {/* Daily Wholesale Procurement Phase */}
        <PreparationPhase
          budget={budget}
          inventory={inventory}
          marketPrices={marketPrices}
          onConfirmPurchase={handleConfirmPurchase}
        />

        {/* Set Chai Selling Price */}
        <PriceSetter
          chaiPrice={chaiPrice}
          setChaiPrice={setChaiPrice}
          marketPrices={marketPrices}
        />

        {/* Tycoon Operations Guide */}
        <TycoonGuide />

        {/* Feature 3: Simulation Engine Modal */}
        {isSimulating && activeSimulation && (
          <SimulationModal
            simulationData={activeSimulation}
            onComplete={handleSimulationComplete}
            chaiPrice={chaiPrice}
          />
        )}
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
            Phase 3: Simulation Engine Implemented • Zero External APIs
          </p>
        </div>
      </footer>
    </div>
  );
}
