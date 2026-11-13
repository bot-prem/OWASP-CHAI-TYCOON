# ☕ Chai Stall Tycoon

> **A Production-Grade, Browser-First Business Simulation Game**  
> Run your own Indian street corner chai tapri! Manage working capital, procure wholesale ingredients, optimize pricing, ride randomized rush hour waves, and navigate market shocks.

---

## 🌟 Live Architecture & Core Mechanics

1. **Local Execution Only (Zero External APIs):**
   - 100% browser-first logic executed on the client side with React state and `localStorage` persistence.
   - Zero secrets, zero `.env` dependencies, zero external database or backend calls.

2. **The 4 Fundamental Ingredients:**
   - 🍃 **Assam CTC Tea Leaves** (Base Wholesale: ₹3/unit)
   - 🥛 **Fresh Dairy Milk** (Base Wholesale: ₹4/unit, spikes up to ₹12 during crisis)
   - 🍬 **Refined Sugar** (Base Wholesale: ₹1/unit)
   - ☕ **Kulhad / Paper Cups** (Base Wholesale: ₹2/unit)
   - *Formula:* `1 Tea + 1 Milk + 1 Sugar + 1 Cup = 1 Kadak Chai Serving`
   - *Capacity:* `Math.min(tea, milk, sugar, cups)`

3. **Incremental MVP Features Implemented:**
   - ✅ **MVP 1 - Dashboard & State:**
     - Initialized with ₹500 starting budget, Day 1 tracking, 5.0★ stall reputation, and empty inventory.
     - Live KPI indicators for available capital, brewing capacity, potential revenue, and stall status.
   - ✅ **MVP 2 - Daily Preparation Phase:**
     - Wholesale Mandi market view with item prices, quantity counters, quick bulk additions (+5, +10, Max Affordable).
     - Intelligent "Balance Cart" auto-allocation across all 4 ingredients.
     - Real-time cart subtotal, remaining budget preview, and strict over-budget prevention validation.
     - Interactive selling price setter (₹5 - ₹50) with dynamic margin calculation and customer demand elasticity preview.
   - ✅ **MVP 3 - Simulation Engine:**
     - "Start Day" action running local algorithm simulating customer footfall based on price elasticity, weather, and a randomized rush hour multiplier (1.2x to 2.1x).
     - Animated 3-stage day progression (Morning Commuters, Afternoon Lull, Peak Evening Rush Hour).
     - Stockout detection with bottleneck ingredient identification.
   - ✅ **MVP 4 - End of Day Report:**
     - Complete financial breakdown: Total Revenue, Cost of Goods Sold (COGS), and Net Profit/Loss.
     - Operational metrics: Demand served fill rate %, cups sold vs customers turned away.
     - Procedurally generated realistic customer feedback reflecting price satisfaction, stock availability, and tea quality.
     - Confetti celebration on profitable days and seamless day transition.
   - ✅ **MVP 5 - The "Milk Price Shock" Event:**
     - Wholesale milk price suddenly spikes from ₹4 to ₹12 (a 300% surge!).
     - Can be triggered manually on demand via dedicated trigger button or rolled randomly (25% chance) on day transitions.
     - Interactive Tycoon Decision Modal presenting 3 strategic choices:
       1. **Raise Chai Price (+₹10):** Protects profit margins with mild demand softening.
       2. **Dilute with Water (Street Hustle):** Stretches milk yield 2x, but introduces angry customer reviews!
       3. **Take the Loss (Protect Loyalty):** Absorbs high milk cost to maintain premium quality and stall reputation.

---

## 🚀 Running the App Locally

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Startup

```bash
# Clone the repository
git clone https://github.com/bot-prem/OWASP-CHAI-TYCOON.git
cd OWASP-CHAI-TYCOON

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## 📦 Git Commits History (Step-by-Step Verification)

Every feature was incrementally verified end-to-end before staging, committing, and pushing:

- `5c96893` — `feat: initialize dashboard and state with daily budget and empty inventory`
- `a156943` — `feat: implement daily preparation phase with wholesale stock purchasing and chai price setter`
- `a746796` — `feat: implement simulation engine with price demand algorithm and randomized rush hour multiplier`
- `5d4fda8` — `feat: implement end of day report with financial breakdown and customer feedback`
- `99c17a6` — `feat: implement milk price shock event with crisis trigger and strategic decision UI`
