import React, { useState, useEffect } from 'react';
import {
  Play,
  Zap,
  Coffee,
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
  CloudSun,
  Flame,
  CheckCircle2,
  FastForward,
} from 'lucide-react';

export default function SimulationModal({
  simulationData,
  onComplete,
  chaiPrice,
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [displayCups, setDisplayCups] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const {
    weather,
    rushEvent,
    rushHourMultiplier,
    potentialDemand,
    maxCapacity,
    cupsSold,
    lostCustomers,
    bottleneck,
    revenue,
    timeline,
  } = simulationData;

  // Animate simulation progression
  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < timeline.length - 1) {
          return prev + 1;
        } else {
          setIsFinished(true);
          setDisplayCups(cupsSold);
          clearInterval(timer);
          return prev;
        }
      });
    }, 1100);

    return () => clearInterval(timer);
  }, [timeline.length, cupsSold, isFinished]);

  // Smoothly increment cups counter
  useEffect(() => {
    if (isFinished) {
      setDisplayCups(cupsSold);
      return;
    }
    const target = timeline
      .slice(0, currentStepIndex + 1)
      .reduce((sum, item) => sum + item.cups, 0);

    const stepTimer = setInterval(() => {
      setDisplayCups((prev) => {
        if (prev < target) return prev + 1;
        clearInterval(stepTimer);
        return target;
      });
    }, 25);

    return () => clearInterval(stepTimer);
  }, [currentStepIndex, timeline, isFinished, cupsSold]);

  const handleSkip = () => {
    setCurrentStepIndex(timeline.length - 1);
    setDisplayCups(cupsSold);
    setIsFinished(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-stone-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Chai Stall In Action</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Simulating Sales
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Piping hot chai brewing on the street corner
              </p>
            </div>
          </div>

          {!isFinished && (
            <button
              onClick={handleSkip}
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-300 bg-stone-800/80 hover:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700 transition cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Skip</span>
            </button>
          )}
        </div>

        {/* Environmental Factors Pill Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* Weather */}
          <div className="bg-stone-800/50 border border-stone-800 rounded-xl p-3 flex items-center gap-3">
            <span className="text-2xl">{weather.emoji}</span>
            <div className="text-xs">
              <span className="text-stone-400 block font-medium">Weather Condition</span>
              <strong className="text-stone-200">{weather.name}</strong>
              <span className="text-amber-400/90 ml-1 font-mono text-[11px]">
                ({weather.multiplier}x demand)
              </span>
            </div>
          </div>

          {/* Rush Hour Surge */}
          <div className="bg-amber-950/30 border border-amber-900/40 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="text-amber-400/80 block font-medium">Rush Hour Trigger</span>
              <strong className="text-amber-200">{rushEvent.title}</strong>
              <span className="text-emerald-400 ml-1 font-mono font-bold text-[11px]">
                ⚡ {rushHourMultiplier}x Boost
              </span>
            </div>
          </div>
        </div>

        {/* Big Live Sales Display */}
        <div className="bg-gradient-to-b from-stone-800/60 to-stone-900/60 border border-stone-800 rounded-2xl p-6 mb-6 text-center">
          <span className="text-xs uppercase tracking-widest text-stone-400 font-bold block mb-1">
            Cups Served Today
          </span>
          <div className="text-5xl sm:text-6xl font-black text-amber-400 font-mono tracking-tight my-2">
            {displayCups}{' '}
            <span className="text-lg font-medium text-stone-400 font-sans">
              / {potentialDemand} demand
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs mt-3 pt-3 border-t border-stone-800/80">
            <span className="text-stone-400">
              Chai Price: <strong className="text-white font-mono">₹{chaiPrice}</strong>
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-400">
              Current Revenue: <strong className="text-emerald-400 font-mono">₹{displayCups * chaiPrice}</strong>
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-400">
              Capacity: <strong className="text-amber-200 font-mono">{maxCapacity} cups</strong>
            </span>
          </div>
        </div>

        {/* Timeline Progress Cards */}
        <div className="space-y-2.5 mb-6">
          {timeline.map((step, idx) => {
            const isPast = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex && !isFinished;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between text-xs ${
                  isCurrent
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-200 scale-[1.01]'
                    : isPast
                    ? 'bg-stone-800/40 border-stone-700/60 text-stone-300'
                    : 'bg-stone-900/40 border-stone-800 text-stone-500 opacity-40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{step.emoji}</span>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold">
                      <span>{step.phase}</span>
                      {step.isRush && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                          Surge
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-400">{step.time}</span>
                  </div>
                </div>

                <div className="font-mono font-bold text-sm">
                  {isPast ? `+${step.cups} cups` : '—'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Lost Demand / Stockout Alert */}
        {isFinished && lostCustomers > 0 && (
          <div className="mb-6 p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-200 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong className="block font-bold">Stockout Occurred!</strong>
              <span>
                {lostCustomers} eager customers had to be turned away because you ran out of{' '}
                <strong className="underline text-rose-100">{bottleneck}</strong>.
              </span>
            </div>
          </div>
        )}

        {/* Completion Action */}
        {isFinished ? (
          <button
            onClick={onComplete}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-stone-950 shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Review End of Day Financial Report</span>
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 text-xs text-stone-400 py-2">
            <Clock className="w-4 h-4 animate-spin text-amber-400" />
            <span>Brewing cutting chai for hungry crowds...</span>
          </div>
        )}
      </div>
    </div>
  );
}
