import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Leaf,
  Milk,
  Sparkles,
  Coffee,
  RotateCcw,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { INGREDIENTS } from '../constants/gameData';
import { calculateUnitChaiCost } from '../utils/gameLogic';

const iconMap = {
  Leaf: Leaf,
  Milk: Milk,
  Sparkles: Sparkles,
  Coffee: Coffee,
};

export default function PreparationPhase({
  budget,
  inventory,
  marketPrices,
  onConfirmPurchase,
}) {
  // Cart state: quantities of ingredients user intends to buy
  const [cart, setCart] = useState({
    teaLeaves: 0,
    milk: 0,
    sugar: 0,
    cups: 0,
  });

  const [notification, setNotification] = useState(null);

  // Calculate total procurement cost of items in cart
  const totalCartCost = Object.keys(cart).reduce((sum, key) => {
    const price = marketPrices[key] || INGREDIENTS[key].basePrice;
    return sum + (cart[key] || 0) * price;
  }, 0);

  const remainingBudget = budget - totalCartCost;
  const isBudgetExceeded = remainingBudget < 0;
  const hasItemsInCart = Object.values(cart).some((q) => q > 0);

  // Update item quantity in cart
  const updateCartQuantity = (key, delta) => {
    setCart((prev) => {
      const current = prev[key] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [key]: next };
    });
  };

  const setCartItemDirect = (key, value) => {
    const parsed = Math.max(0, parseInt(value, 10) || 0);
    setCart((prev) => ({ ...prev, [key]: parsed }));
  };

  // Max affordable for a single item with remaining budget
  const handleMaxAffordable = (key) => {
    const itemPrice = marketPrices[key] || INGREDIENTS[key].basePrice;
    const currentItemCost = (cart[key] || 0) * itemPrice;
    const cashAvailableForThisItem = budget - (totalCartCost - currentItemCost);
    if (cashAvailableForThisItem <= 0) return;
    const maxQty = Math.floor(cashAvailableForThisItem / itemPrice);
    setCart((prev) => ({ ...prev, [key]: maxQty }));
  };

  // Auto-balance cart: Buy equal quantities of all 4 ingredients with available budget
  const handleBalancedRestock = () => {
    const unitSetCost = calculateUnitChaiCost(marketPrices);
    if (unitSetCost <= 0) return;
    const affordableSets = Math.floor(budget / unitSetCost);
    if (affordableSets <= 0) {
      setNotification({
        type: 'error',
        message: `Insufficient budget (₹${budget}) to buy a complete 4-ingredient set (₹${unitSetCost}).`,
      });
      return;
    }
    setCart({
      teaLeaves: affordableSets,
      milk: affordableSets,
      sugar: affordableSets,
      cups: affordableSets,
    });
    setNotification({
      type: 'info',
      message: `Balanced cart to buy ${affordableSets} complete chai servings for ₹${affordableSets * unitSetCost}.`,
    });
  };

  const handleClearCart = () => {
    setCart({ teaLeaves: 0, milk: 0, sugar: 0, cups: 0 });
    setNotification(null);
  };

  const handlePurchase = () => {
    if (isBudgetExceeded) {
      setNotification({
        type: 'error',
        message: 'Cannot confirm purchase: Total procurement cost exceeds available budget!',
      });
      return;
    }

    if (!hasItemsInCart) {
      setNotification({
        type: 'error',
        message: 'Please select items to stock up before confirming purchase.',
      });
      return;
    }

    // Execute purchase
    onConfirmPurchase(cart, totalCartCost);
    setNotification({
      type: 'success',
      message: `Successfully procured ingredients for ₹${totalCartCost}! Stockroom updated.`,
    });
    setCart({ teaLeaves: 0, milk: 0, sugar: 0, cups: 0 });
  };

  // Projected new inventory after purchase
  const projectedInventory = {
    teaLeaves: (inventory.teaLeaves || 0) + (cart.teaLeaves || 0),
    milk: (inventory.milk || 0) + (cart.milk || 0),
    sugar: (inventory.sugar || 0) + (cart.sugar || 0),
    cups: (inventory.cups || 0) + (cart.cups || 0),
  };

  const projectedCapacity = Math.min(
    projectedInventory.teaLeaves,
    projectedInventory.milk,
    projectedInventory.sugar,
    projectedInventory.cups
  );

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 sm:p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">Daily Wholesale Procurement Phase</h2>
            <p className="text-xs text-stone-500">
              Purchase raw ingredients at Mandi rates within your budget
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleBalancedRestock}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition cursor-pointer"
            title="Automatically fills cart with balanced quantities of all 4 ingredients"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Balance Cart</span>
          </button>

          {hasItemsInCart && (
            <button
              onClick={handleClearCart}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Notification Toast if any */}
      {notification && (
        <div
          className={`mb-4 p-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all ${
            notification.type === 'error'
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Wholesale Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.keys(INGREDIENTS).map((key) => {
          const item = INGREDIENTS[key];
          const Icon = iconMap[item.icon] || Leaf;
          const wholesalePrice = marketPrices[key] || item.basePrice;
          const isSpiked = wholesalePrice > item.basePrice;
          const qtyInCart = cart[key] || 0;
          const subtotal = qtyInCart * wholesalePrice;
          const stockInHand = inventory[key] || 0;

          return (
            <div
              key={key}
              className={`rounded-2xl border p-4 transition-all ${
                qtyInCart > 0
                  ? 'border-amber-400 bg-amber-50/20 shadow-xs'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              {/* Item Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-base font-extrabold text-stone-900 font-mono">
                      ₹{wholesalePrice}
                    </span>
                    <span className="text-[11px] text-stone-500 font-normal">/ unit</span>
                  </div>
                  {isSpiked && (
                    <span className="inline-block text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                      High Price
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Desc */}
              <h3 className="font-bold text-stone-900 text-sm leading-snug">{item.name}</h3>
              <p className="text-[11px] text-stone-500 mb-2">
                In Stock: <strong className="text-stone-700 font-mono">{stockInHand}</strong>
              </p>

              {/* Quantity Controls */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-500 font-medium">To Buy:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateCartQuantity(key, -1)}
                      disabled={qtyInCart <= 0}
                      className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-stone-700 transition cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={qtyInCart}
                      onChange={(e) => setCartItemDirect(key, e.target.value)}
                      className="w-14 text-center font-mono font-bold text-sm border border-stone-200 rounded-lg py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      onClick={() => updateCartQuantity(key, 1)}
                      className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Quick Add Buttons */}
                <div className="flex items-center justify-between gap-1 pt-1">
                  <div className="flex gap-1">
                    <button
                      onClick={() => updateCartQuantity(key, 5)}
                      className="px-2 py-0.5 text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 rounded text-stone-700 cursor-pointer"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => updateCartQuantity(key, 10)}
                      className="px-2 py-0.5 text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 rounded text-stone-700 cursor-pointer"
                    >
                      +10
                    </button>
                  </div>
                  <button
                    onClick={() => handleMaxAffordable(key)}
                    className="px-2 py-0.5 text-[11px] font-semibold text-amber-800 bg-amber-100/70 hover:bg-amber-200/80 rounded cursor-pointer"
                  >
                    Max
                  </button>
                </div>

                {/* Item Subtotal */}
                <div className="flex justify-between items-center text-xs pt-1.5 text-stone-500">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-stone-900">₹{subtotal}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary & Validation Bar */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200/90 p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div>
            <span className="text-xs text-stone-500 block">Total Cart Cost:</span>
            <span
              className={`text-xl font-black font-mono ${
                isBudgetExceeded ? 'text-rose-600' : 'text-stone-900'
              }`}
            >
              ₹{totalCartCost}
            </span>
          </div>

          <div className="h-8 w-px bg-stone-200 hidden sm:block"></div>

          <div>
            <span className="text-xs text-stone-500 block">Available Budget:</span>
            <span className="text-xl font-bold font-mono text-emerald-800">
              ₹{budget}
            </span>
          </div>

          <div className="h-8 w-px bg-stone-200 hidden sm:block"></div>

          <div>
            <span className="text-xs text-stone-500 block">Budget Remaining:</span>
            <span
              className={`text-xl font-black font-mono ${
                isBudgetExceeded ? 'text-rose-600 font-extrabold' : 'text-emerald-700'
              }`}
            >
              ₹{remainingBudget}
            </span>
          </div>

          <div className="h-8 w-px bg-stone-200 hidden sm:block"></div>

          <div>
            <span className="text-xs text-stone-500 block">Projected Capacity:</span>
            <span className="text-xl font-bold font-mono text-amber-900">
              {projectedCapacity}{' '}
              <span className="text-xs font-normal text-stone-500">cups</span>
            </span>
          </div>
        </div>

        {/* Action Button with validation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {isBudgetExceeded && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 font-bold bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Budget exceeded by ₹{Math.abs(remainingBudget)}!</span>
            </div>
          )}

          <button
            onClick={handlePurchase}
            disabled={isBudgetExceeded || !hasItemsInCart}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer ${
              isBudgetExceeded || !hasItemsInCart
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-600/30'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Confirm & Stock Inventory</span>
          </button>
        </div>
      </div>
    </div>
  );
}
