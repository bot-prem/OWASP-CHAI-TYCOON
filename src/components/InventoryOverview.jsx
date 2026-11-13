import React from 'react';
import { Leaf, Milk, Sparkles, Coffee, AlertCircle, Package } from 'lucide-react';
import { INGREDIENTS } from '../constants/gameData';

const iconMap = {
  Leaf: Leaf,
  Milk: Milk,
  Sparkles: Sparkles,
  Coffee: Coffee,
};

export default function InventoryOverview({ inventory }) {
  const maxCupsPossible = Math.min(
    inventory.teaLeaves || 0,
    inventory.milk || 0,
    inventory.sugar || 0,
    inventory.cups || 0
  );

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-5 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">Current Stockroom Inventory</h2>
            <p className="text-xs text-stone-500">Live storage levels at your chai stall</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
          <Coffee className="w-4 h-4 text-amber-700" />
          <span className="text-xs font-medium text-amber-800">
            Brewing Capacity: <strong className="text-amber-950 font-bold">{maxCupsPossible} cups</strong>
          </span>
        </div>
      </div>

      {/* 4 Inventory items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.keys(INGREDIENTS).map((key) => {
          const item = INGREDIENTS[key];
          const Icon = iconMap[item.icon] || Package;
          const quantity = inventory[key] || 0;
          const isZero = quantity === 0;

          return (
            <div
              key={key}
              className={`relative rounded-xl border p-4 transition-all duration-200 ${
                isZero
                  ? 'bg-stone-50/70 border-stone-200'
                  : 'bg-white border-amber-200/70 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isZero
                      ? 'bg-stone-200/70 text-stone-500'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {isZero ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200/70 px-2 py-0.5 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    Empty
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
                    In Stock
                  </span>
                )}
              </div>

              <h3 className="font-bold text-sm text-stone-800 leading-snug">{item.name}</h3>
              <p className="text-[11px] text-stone-500 mb-3">{item.unit}</p>

              <div className="flex items-baseline justify-between pt-2 border-t border-stone-100">
                <span className="text-xs text-stone-400 font-medium">Quantity</span>
                <span
                  className={`text-xl font-extrabold font-mono ${
                    isZero ? 'text-stone-400' : 'text-stone-900'
                  }`}
                >
                  {quantity}{' '}
                  <span className="text-xs font-normal text-stone-500">
                    {key === 'cups' ? 'cups' : 'pts'}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
