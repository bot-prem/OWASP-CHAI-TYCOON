import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import InventoryOverview from './components/InventoryOverview';
import PreparationPhase from './components/PreparationPhase';
import PriceSetter from './components/PriceSetter';
import SimulationModal from './components/SimulationModal';
import EndOfDayReport from './components/EndOfDayReport';
import MilkShockModal from './components/MilkShockModal';
import MilkShockBanner from './components/MilkShockBanner';
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

const NORMAL_MILK_PRICE = 4;
const SPIKED_MILK_PRICE = 12;

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

  // Milk Shock Event States
  const [isMilkShockActive, setIsMilkShockActive] = useState(() => {
    return localStorage.getItem('chai_tycoon_milk_shock') === 'true';
  });

  const [shockStrategy, setShockStrategy] = useState(() => {
    return localStorage.getItem('chai_tycoon_shock_strategy') || null;
  });

  const [isShockModalOpen, setIsShockModalOpen] = useState(false);

  // Wholesale market prices for ingredients
  const [marketPrices, setMarketPrices] = useState(() => {
    const saved = localStorage.getItem('chai_tycoon_prices');
    if (saved) return JSON.parse(saved);
    return {
      teaLeaves: INGREDIENTS.teaLeaves.basePrice,
      milk: NORMAL_MILK_PRICE,
      sugar: INGREDIENTS.sugar.basePrice,
      cups: INGREDIENTS.cups.basePrice,
    };
  });

  // Simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [lastReport, setLastReport] = useState(() => {
    const saved = localStorage.getItem('chai_tycoon_last_report');
    return saved ? JSON.parse(saved) : null;
  });
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

  useEffect(() => {
    localStorage.setItem('chai_tycoon_milk_shock', isMilkShockActive.toString());
  }, [isMilkShockActive]);

  useEffect(() => {
    if (shockStrategy) {
      localStorage.setItem('chai_tycoon_shock_strategy', shockStrategy);
    } else {
      localStorage.removeItem('chai_tycoon_shock_strategy');
    }
  }, [shockStrategy]);

  useEffect(() => {
    if (lastReport) {
      localStorage.setItem('chai_tycoon_last_report', JSON.stringify(lastReport));
    } else {
      localStorage.removeItem('chai_tycoon_last_report');
    }
  }, [lastReport]);

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

  // Trigger Milk Price Shock event
  const handleTriggerMilkShock = () => {
    setIsMilkShockActive(true);
    setMarketPrices((prev) => ({ ...prev, milk: SPIKED_MILK_PRICE }));
    setIsShockModalOpen(true);
  };

  // Reset Milk Price Shock
  const handleResetMilkShock = () => {
    setIsMilkShockActive(false);
    setShockStrategy(null);
    setMarketPrices((prev) => ({ ...prev, milk: NORMAL_MILK_PRICE }));
    setIsShockModalOpen(false);
    setAppAlert({
      type: 'success',
      message: 'Milk market stabilized! Wholesale milk price returned to normal ₹4/portion.',
    });
  };

  // Handle Decision Option from Milk Shock Modal
  const handleSelectShockOption = (option) => {
    setShockStrategy(option);
    setIsShockModalOpen(false);

    if (option === 'raise_price') {
      setChaiPrice((prev) => prev + 10);
      setAppAlert({
        type: 'info',
        message: `Strategic decision: Raised chai price by +₹10 (now ₹${chaiPrice + 10}) to absorb milk price spike.`,
      });
    } else if (option === 'dilute_water') {
      setAppAlert({
        type: 'info',
        message: 'Strategic decision: Diluting with water. Each milk portion yields 2 cups of chai, but expect customer scrutiny!',
      });
    } else if (option === 'absorb_loss') {
      setAppAlert({
        type: 'info',
        message: 'Strategic decision: Taking the loss. Paying ₹12 for milk to preserve 100% authentic kadak chai quality and reputation.',
      });
    }
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

    const isDiluted = isMilkShockActive && shockStrategy === 'dilute_water';

    // Run the local simulation algorithm
    const simResult = runDaySimulation({
      chaiPrice,
      inventory,
      milkDilution: isDiluted,
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

    // Update reputation smoothly
    setReputation((prev) => {
      let delta = 0;
      if (isMilkShockActive && shockStrategy === 'dilute_water') {
        delta -= 0.3; // Customer backlash for water dilution
      } else if (isMilkShockActive && shockStrategy === 'absorb_loss') {
        delta += 0.2; // Bonus for preserving authentic quality
      }

      if (activeSimulation.lostCustomers > 8) {
        delta -= 0.2;
      } else if (activeSimulation.lostCustomers === 0 && activeSimulation.cupsSold > 10) {
        delta += 0.1;
      }

      const updated = Math.min(5.0, Math.max(1.5, Number((prev + delta).toFixed(1))));
      return updated;
    });
  };

  // Advance to Next Day (with random 25% chance of milk shock event!)
  const handleNextDay = () => {
    const nextDayNum = day + 1;
    setDay(nextDayNum);
    setLastReport(null);

    // Random daily event roll (25% chance on day change)
    const shouldShockTrigger = Math.random() < 0.25;
    if (shouldShockTrigger && !isMilkShockActive) {
      setIsMilkShockActive(true);
      setMarketPrices((prev) => ({ ...prev, milk: SPIKED_MILK_PRICE }));
      setShockStrategy(null);
      setIsShockModalOpen(true);
      setAppAlert({
        type: 'error',
        message: `Day ${nextDayNum} Alert: A dairy union strike just spiked the wholesale milk price to ₹${SPIKED_MILK_PRICE}!`,
      });
    } else {
      setAppAlert({
        type: 'success',
        message: `Welcome to Day ${nextDayNum}! Review today's wholesale prices and stock your cart.`,
      });
    }
  };

  // Reset simulation to Day 1
  const handleResetGame = () => {
    if (window.confirm('Reset Chai Stall to Day 1? All progress, stock, and budget will return to starting ₹500.')) {
      setBudget(INITIAL_BUDGET);
      setInventory({ ...INITIAL_INVENTORY });
      setDay(1);
      setReputation(5.0);
      setChaiPrice(DEFAULT_CHAI_PRICE);
      setIsMilkShockActive(false);
      setShockStrategy(null);
      setMarketPrices({
        teaLeaves: INGREDIENTS.teaLeaves.basePrice,
        milk: NORMAL_MILK_PRICE,
        sugar: INGREDIENTS.sugar.basePrice,
        cups: INGREDIENTS.cups.basePrice,
      });
      setLastReport(null);
      setActiveSimulation(null);
      setIsSimulating(false);
      setIsShockModalOpen(false);
      localStorage.clear();
    }
  };

  const currentCapacity = calculateBrewCapacity(inventory);
  const isDilutedToday = isMilkShockActive && shockStrategy === 'dilute_water';

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
              {lastReport ? '📊' : isMilkShockActive ? '🥛⚡' : '🌅'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-amber-950">
                  {lastReport
                    ? `Day ${day}: Sales & Financial Review`
                    : `Day ${day}: Morning Preparation Phase`}
                </h2>
                <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {lastReport ? 'Report Ready' : 'Prep Active'}
                </span>
                {isMilkShockActive && (
                  <span className="text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full">
                    Milk Crisis
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-900/80">
                {lastReport
                  ? `Review total revenue, raw ingredient costs, net profit, and customer reviews below.`
                  : `Procure stock at wholesale rates, calibrate your price, and start the day to run the simulation.`}
              </p>
            </div>
          </div>

          {/* Action Callout Button */}
          {!lastReport && (
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
          )}
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

        {/* Feature 5: The Milk Price Shock Interactive Trigger & Banner */}
        <MilkShockBanner
          isShockActive={isMilkShockActive}
          onTriggerShock={handleTriggerMilkShock}
          onResetShock={handleResetMilkShock}
          milkPrice={marketPrices.milk}
          shockStrategy={shockStrategy}
          onOpenDecisionModal={() => setIsShockModalOpen(true)}
        />

        {/* Top Dashboard KPIs */}
        <DashboardStats
          budget={budget}
          inventory={inventory}
          chaiPrice={chaiPrice}
        />

        {/* Feature 4: End of Day Report (Rendered when simulation finishes) */}
        {lastReport && (
          <EndOfDayReport
            report={lastReport}
            day={day}
            chaiPrice={chaiPrice}
            marketPrices={marketPrices}
            onNextDay={handleNextDay}
            isDiluted={isDilutedToday}
          />
        )}

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

        {/* Feature 3: Simulation Engine Modal */}
        {isSimulating && activeSimulation && (
          <SimulationModal
            simulationData={activeSimulation}
            onComplete={handleSimulationComplete}
            chaiPrice={chaiPrice}
          />
        )}

        {/* Feature 5: Milk Price Shock Decision Options Modal */}
        <MilkShockModal
          isOpen={isShockModalOpen}
          onClose={() => setIsShockModalOpen(false)}
          onSelectOption={handleSelectShockOption}
          currentPrice={chaiPrice}
          spikedMilkPrice={SPIKED_MILK_PRICE}
        />
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 py-6 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-200">Chai Stall Tycoon</span>
            <span>•</span>
            <span>Production-Grade Browser Game</span>
          </div>
          <p className="text-stone-400">
            All 5 MVP Features Completed • Local Execution • Zero External APIs
          </p>
        </div>
      </footer>
    </div>
  );
}
