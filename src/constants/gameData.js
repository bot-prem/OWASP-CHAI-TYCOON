export const INITIAL_BUDGET = 500;

export const INGREDIENTS = {
  teaLeaves: {
    id: 'teaLeaves',
    name: 'Assam Tea Leaves',
    unit: 'portion',
    description: 'Strong, aromatic CTC blend essential for kadak chai.',
    basePrice: 3,
    icon: 'Leaf',
    color: 'emerald',
  },
  milk: {
    id: 'milk',
    name: 'Fresh Dairy Milk',
    unit: 'portion (50ml)',
    description: 'Creamy full-fat milk giving chai its rich body.',
    basePrice: 4,
    icon: 'Milk',
    color: 'blue',
  },
  sugar: {
    id: 'sugar',
    name: 'Refined Sugar',
    unit: 'portion',
    description: 'Sweetness tuned for classic Indian street chai.',
    basePrice: 1,
    icon: 'Sparkles',
    color: 'amber',
  },
  cups: {
    id: 'cups',
    name: 'Eco Kulhad / Paper Cups',
    unit: 'cup',
    description: 'Biodegradable cups ready for serving eager patrons.',
    basePrice: 2,
    icon: 'Coffee',
    color: 'rose',
  },
};

export const INITIAL_INVENTORY = {
  teaLeaves: 0,
  milk: 0,
  sugar: 0,
  cups: 0,
};

export const DEFAULT_CHAI_PRICE = 15;
