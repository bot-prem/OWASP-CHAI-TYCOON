import { INGREDIENTS } from '../constants/gameData';

/**
 * Calculates the cost of making 1 cup of chai based on current wholesale prices.
 */
export function calculateUnitChaiCost(marketPrices) {
  return (
    (marketPrices.teaLeaves || INGREDIENTS.teaLeaves.basePrice) +
    (marketPrices.milk || INGREDIENTS.milk.basePrice) +
    (marketPrices.sugar || INGREDIENTS.sugar.basePrice) +
    (marketPrices.cups || INGREDIENTS.cups.basePrice)
  );
}

/**
 * Calculates maximum cups that can be brewed with given inventory
 */
export function calculateBrewCapacity(inventory) {
  return Math.min(
    inventory.teaLeaves || 0,
    inventory.milk || 0,
    inventory.sugar || 0,
    inventory.cups || 0
  );
}

/**
 * Predicts customer demand elasticity based on chai selling price
 */
export function getDemandPrediction(price) {
  if (price <= 8) {
    return {
      tier: 'Bargain Rush',
      color: 'emerald',
      emoji: '🔥',
      text: 'Massive foot traffic! Budget buyers and office crowds will swarm your stall.',
      demandMultiplier: 1.6,
    };
  }
  if (price <= 16) {
    return {
      tier: 'Optimal Market Rate',
      color: 'amber',
      emoji: '☕',
      text: 'Sweet spot! Balanced demand, enthusiastic customers, and healthy margins.',
      demandMultiplier: 1.15,
    };
  }
  if (price <= 24) {
    return {
      tier: 'Premium Kadak',
      color: 'blue',
      emoji: '💎',
      text: 'Slight customer hesitation. Good margins, but expect ~20% lower footfall.',
      demandMultiplier: 0.82,
    };
  }
  if (price <= 32) {
    return {
      tier: 'Luxury Pricing',
      color: 'purple',
      emoji: '⚠️',
      text: 'High price resistance. Only wealthy techies and tourists will buy.',
      demandMultiplier: 0.55,
    };
  }
  return {
    tier: 'Exorbitant Price',
    color: 'rose',
    emoji: '🛑',
    text: 'Outrageous! Customers will complain and walk to the rival stall across the street.',
    demandMultiplier: 0.25,
  };
}
