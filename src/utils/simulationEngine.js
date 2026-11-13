import { getDemandPrediction } from './gameLogic';

/**
 * Random range helper (inclusive)
 */
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Weather presets that add flavor to the daily simulation
 */
export const WEATHER_CONDITIONS = [
  { name: 'Monsoon Drizzle', emoji: '🌧️', multiplier: 1.35, desc: 'Rainy chill drives everyone to crave hot piping chai!' },
  { name: 'Pleasant Breeze', emoji: '⛅', multiplier: 1.1, desc: 'Comfortable weather with steady street traffic.' },
  { name: 'Chilly Morning', emoji: '🧣', multiplier: 1.25, desc: 'Morning frost makes your warm tapri the neighborhood hotspot.' },
  { name: 'Sunny & Warm', emoji: '☀️', multiplier: 1.0, desc: 'Standard business day at the corner stall.' },
  { name: 'Scorching Heat', emoji: '🔥', multiplier: 0.85, desc: 'Afternoon heat slightly slows down hot tea demand.' },
];

/**
 * Rush Hour events that provide randomized rush hour multipliers
 */
export const RUSH_HOUR_EVENTS = [
  { title: 'Morning Office Rush', multiplier: 1.5, desc: 'Commuters from nearby tech park grab a quick cutting chai before login.' },
  { title: 'Evening College Hangout', multiplier: 1.7, desc: 'Students gather after classes for chai, samosa, and gossip.' },
  { title: 'Metro Delay Crowd', multiplier: 2.1, desc: 'Signal failure at the station! Hundreds of stranded passengers pour into your stall.' },
  { title: 'Regular Tea Break', multiplier: 1.3, desc: 'Local shopkeepers and delivery riders take their routine 4 PM tea break.' },
  { title: 'Monsoon Cloudburst Surge', multiplier: 1.9, desc: 'Sudden downpour traps pedestrians under your stall canopy!' },
];

/**
 * Core Local Simulation Algorithm
 * Takes current stall price, inventory, and optional modifiers (e.g. water dilution)
 */
export function runDaySimulation({
  chaiPrice,
  inventory,
  milkDilution = false,
  reputation = 5.0,
}) {
  // 1. Pick weather condition
  const weather = WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)];

  // 2. Determine base foot traffic (35 - 60 people walk past)
  const baseFootfall = randomBetween(38, 62);

  // 3. Price elasticity factor
  const demandConfig = getDemandPrediction(chaiPrice);
  const priceMultiplier = demandConfig.demandMultiplier;

  // 4. Randomize Rush Hour event and multiplier (1.25x to 2.1x)
  const rushEvent = RUSH_HOUR_EVENTS[Math.floor(Math.random() * RUSH_HOUR_EVENTS.length)];
  // Add small random variance to rush multiplier (± 0.15)
  const rushHourMultiplier = Number((rushEvent.multiplier + (Math.random() * 0.3 - 0.15)).toFixed(2));

  // 5. Total potential customer demand
  const rawDemand = baseFootfall * priceMultiplier * weather.multiplier * rushHourMultiplier;
  const potentialDemand = Math.max(1, Math.round(rawDemand));

  // 6. Max brewing capacity based on available inventory
  // If milk is diluted with water (Step 5 event option), 1 milk portion yields 2 cups of chai!
  const effectiveMilkAvailable = milkDilution ? (inventory.milk || 0) * 2 : (inventory.milk || 0);

  const maxCapacity = Math.min(
    inventory.teaLeaves || 0,
    effectiveMilkAvailable,
    inventory.sugar || 0,
    inventory.cups || 0
  );

  // 7. Calculate cups sold vs lost customers
  const cupsSold = Math.min(potentialDemand, maxCapacity);
  const lostCustomers = Math.max(0, potentialDemand - cupsSold);

  // 8. Identify bottleneck if sold out
  let bottleneck = null;
  if (lostCustomers > 0) {
    const limits = [
      { name: 'Tea Leaves', qty: inventory.teaLeaves || 0 },
      { name: 'Milk', qty: effectiveMilkAvailable },
      { name: 'Sugar', qty: inventory.sugar || 0 },
      { name: 'Cups', qty: inventory.cups || 0 },
    ];
    limits.sort((a, b) => a.qty - b.qty);
    bottleneck = limits[0].name;
  }

  // 9. Inventory deducted
  const milkUsed = milkDilution ? Math.ceil(cupsSold / 2) : cupsSold;
  const inventoryUsed = {
    teaLeaves: cupsSold,
    milk: milkUsed,
    sugar: cupsSold,
    cups: cupsSold,
  };

  const remainingInventory = {
    teaLeaves: Math.max(0, (inventory.teaLeaves || 0) - inventoryUsed.teaLeaves),
    milk: Math.max(0, (inventory.milk || 0) - inventoryUsed.milk),
    sugar: Math.max(0, (inventory.sugar || 0) - inventoryUsed.sugar),
    cups: Math.max(0, (inventory.cups || 0) - inventoryUsed.cups),
  };

  // 10. Financials
  const revenue = cupsSold * chaiPrice;

  // Breakdown across the day in 3 phases (Morning, Afternoon, Evening Rush)
  const morningSold = Math.round(cupsSold * 0.35);
  const afternoonSold = Math.round(cupsSold * 0.20);
  const eveningSold = Math.max(0, cupsSold - morningSold - afternoonSold);

  return {
    weather,
    rushEvent,
    rushHourMultiplier,
    baseFootfall,
    potentialDemand,
    maxCapacity,
    cupsSold,
    lostCustomers,
    bottleneck,
    revenue,
    inventoryUsed,
    remainingInventory,
    timeline: [
      { time: '08:30 AM', phase: 'Morning Commuters', cups: morningSold, emoji: '🌅' },
      { time: '01:30 PM', phase: 'Afternoon Lull', cups: afternoonSold, emoji: '☀️' },
      { time: '06:00 PM', phase: 'Peak Rush Hour ⚡', cups: eveningSold, emoji: '🌆', isRush: true },
    ],
  };
}
