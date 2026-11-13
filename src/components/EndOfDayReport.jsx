import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  TrendingUp,
  TrendingDown,
  Coins,
  Coffee,
  Users,
  Award,
  AlertTriangle,
  ArrowRight,
  Star,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { INGREDIENTS } from '../constants/gameData';
import { generateCustomerFeedback } from '../utils/feedbackGenerator';

export default function EndOfDayReport({
  report,
  day,
  chaiPrice,
  marketPrices,
  onNextDay,
  isDiluted = false,
}) {
  const {
    cupsSold,
    potentialDemand,
    lostCustomers,
    bottleneck,
    revenue,
    inventoryUsed,
    rushEvent,
    weather,
  } = report;

  // Calculate ingredient costs for cups sold (COGS)
  const ingredientCost =
    (inventoryUsed.teaLeaves || 0) * (marketPrices.teaLeaves || INGREDIENTS.teaLeaves.basePrice) +
    (inventoryUsed.milk || 0) * (marketPrices.milk || INGREDIENTS.milk.basePrice) +
    (inventoryUsed.sugar || 0) * (marketPrices.sugar || INGREDIENTS.sugar.basePrice) +
    (inventoryUsed.cups || 0) * (marketPrices.cups || INGREDIENTS.cups.basePrice);

  const netProfit = revenue - ingredientCost;
  const isProfitable = netProfit >= 0;
  const marginPercent = revenue > 0 ? Math.round((netProfit / revenue) * 100) : 0;
  const fillRate = potentialDemand > 0 ? Math.round((cupsSold / potentialDemand) * 100) : 100;

  // Trigger celebratory confetti on profit!
  useEffect(() => {
    if (isProfitable && revenue > 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#fbbf24', '#059669'],
      });
    }
  }, [isProfitable, revenue]);

  // Generate dynamic customer feedback
  const feedbackList = generateCustomerFeedback({
    chaiPrice,
    lostCustomers,
    bottleneck,
    isDiluted,
    cupsSold,
  });

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden mb-8 animate-fadeIn">
      {/* Report Header */}
      <div
        className={`p-6 sm:p-8 text-white ${
          isProfitable
            ? 'bg-gradient-to-r from-emerald-900 via-emerald-800 to-amber-950'
            : 'bg-gradient-to-r from-rose-950 via-rose-900 to-stone-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-white/15 px-3 py-0.5 rounded-full mb-2">
              Financial & Sales Audit
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Day {day} End of Day Report
            </h2>
            <p className="text-xs sm:text-sm text-stone-200/90 mt-1">
              Performance breakdown for {weather.name} with {rushEvent.title}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/25 backdrop-blur-xs border border-white/20 px-5 py-3 rounded-2xl self-start sm:self-auto">
            {isProfitable ? (
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            ) : (
              <TrendingDown className="w-8 h-8 text-rose-400" />
            )}
            <div>
              <span className="text-[11px] text-stone-300 uppercase tracking-wider block font-bold">
                Net Profit
              </span>
              <span
                className={`text-2xl sm:text-3xl font-black font-mono ${
                  isProfitable ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {netProfit >= 0 ? `+₹${netProfit}` : `-₹${Math.abs(netProfit)}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
              Total Revenue
            </span>
            <div className="text-2xl font-black text-stone-900 font-mono">
              ₹{revenue.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              {cupsSold} cups @ ₹{chaiPrice}/cup
            </p>
          </div>

          {/* Ingredient Costs */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
              Ingredient Costs (COGS)
            </span>
            <div className="text-2xl font-black text-rose-700 font-mono">
              ₹{ingredientCost.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Raw stock consumed today</p>
          </div>

          {/* Profit Margin */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
              Profit Margin
            </span>
            <div
              className={`text-2xl font-black font-mono ${
                isProfitable ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {marginPercent}%
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              {isProfitable ? 'Healthy operational return' : 'Loss-making day'}
            </p>
          </div>

          {/* Service Rate */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
              Demand Served
            </span>
            <div className="text-2xl font-black text-amber-900 font-mono">
              {fillRate}%
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              {lostCustomers === 0
                ? 'Zero lost sales!'
                : `${lostCustomers} customers turned away`}
            </p>
          </div>
        </div>

        {/* Detailed Financial & Stock Audit Table */}
        <div className="bg-stone-50/70 rounded-2xl border border-stone-200/80 overflow-hidden">
          <div className="p-4 bg-stone-100/80 border-b border-stone-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-700" />
              <span>Ingredient Consumption Breakdown</span>
            </h3>
            <span className="text-xs text-stone-500">Day {day} Usage</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] uppercase tracking-wider text-stone-400 bg-stone-100/40 border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-4 font-bold">Ingredient</th>
                  <th className="py-2.5 px-4 font-bold text-center">Units Used</th>
                  <th className="py-2.5 px-4 font-bold text-center">Unit Price</th>
                  <th className="py-2.5 px-4 font-bold text-right">Cost Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {Object.keys(INGREDIENTS).map((key) => {
                  const item = INGREDIENTS[key];
                  const used = inventoryUsed[key] || 0;
                  const price = marketPrices[key] || item.basePrice;
                  const cost = used * price;

                  return (
                    <tr key={key} className="hover:bg-white/50">
                      <td className="py-2.5 px-4 font-semibold text-stone-800">
                        {item.name}
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono text-stone-700">
                        {used} {key === 'cups' ? 'cups' : 'pts'}
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono text-stone-600">
                        ₹{price}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-stone-900">
                        ₹{cost}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-amber-50/40 font-bold border-t-2 border-stone-200">
                  <td colSpan={3} className="py-2.5 px-4 text-stone-700 text-right">
                    Total Direct Ingredient Cost:
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-sm text-stone-900">
                    ₹{ingredientCost}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Feedback Cards Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-700" />
                <span>Customer Reviews & Feedback</span>
              </h3>
              <p className="text-xs text-stone-500">
                Live feedback from commuters, office staff, and street patrons
              </p>
            </div>
            <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              {feedbackList.length} Verified Reviews
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {feedbackList.map((review) => (
              <div
                key={review.id}
                className="bg-stone-50 rounded-2xl border border-stone-200 p-4 flex flex-col justify-between hover:shadow-xs transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{review.avatar}</span>
                      <div>
                        <strong className="block text-xs text-stone-900 font-bold">
                          {review.author}
                        </strong>
                        <span className="text-[10px] text-stone-500 font-medium">
                          {review.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-2.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= review.rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-mono font-bold text-stone-700 ml-1">
                      {review.rating}.0
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 italic leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button: Advance to Next Day */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-stone-500 text-center sm:text-left">
            Remaining inventory carries over to the next day. Mandi prices will refresh.
          </div>

          <button
            onClick={onNextDay}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-stone-950 shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
          >
            <span>Proceed to Day {day + 1} Preparation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
