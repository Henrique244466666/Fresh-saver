import { PantryItem, Recipe, DonationCenter, FoodCategory } from '../types/pantry';

export function getOffsetDateString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

export function formatHumanDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function calculateDaysLeft(expiryDateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [year, month, day] = expiryDateStr.split('-').map(Number);
  const expiry = new Date(year, month - 1, day);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export const INITIAL_PANTRY: PantryItem[] = [];

export interface ShelfLifeGuideItem {
  name: string;
  category: FoodCategory;
  defaultLocation: 'Fridge' | 'Pantry' | 'Freezer';
  shelfLifeDays: number;
  storageTip: string;
}

export const SHELF_LIFE_DATABASE: ShelfLifeGuideItem[] = [
  { name: 'Baby Spinach', category: 'Produce', defaultLocation: 'Fridge', shelfLifeDays: 5, storageTip: 'Store with paper towel to absorb excess moisture.' },
  { name: 'Kale & Leafy Greens', category: 'Produce', defaultLocation: 'Fridge', shelfLifeDays: 7, storageTip: 'Keep in crisper drawer in sealed produce container.' },
  { name: 'Avocados', category: 'Produce', defaultLocation: 'Pantry', shelfLifeDays: 4, storageTip: 'Move to fridge once ripe to pause over-ripening.' },
  { name: 'Strawberries & Berries', category: 'Produce', defaultLocation: 'Fridge', shelfLifeDays: 3, storageTip: 'Wash only right before eating.' },
  { name: 'Bananas', category: 'Produce', defaultLocation: 'Pantry', shelfLifeDays: 5, storageTip: 'Separate stems to slow ethylene ripening.' },
  { name: 'Apples', category: 'Produce', defaultLocation: 'Fridge', shelfLifeDays: 21, storageTip: 'Keep cold for extra crispness.' },
  { name: 'Tomatoes', category: 'Produce', defaultLocation: 'Pantry', shelfLifeDays: 6, storageTip: 'Store stem down at room temperature for peak flavor.' },
  { name: 'Whole Milk', category: 'Dairy & Eggs', defaultLocation: 'Fridge', shelfLifeDays: 7, storageTip: 'Store on inner middle shelf, not on door where temp fluctuates.' },
  { name: 'Eggs', category: 'Dairy & Eggs', defaultLocation: 'Fridge', shelfLifeDays: 28, storageTip: 'Keep in original carton to maintain moisture seal.' },
  { name: 'Cheddar & Hard Cheese', category: 'Dairy & Eggs', defaultLocation: 'Fridge', shelfLifeDays: 25, storageTip: 'Wrap in parchment paper or beeswax wrap.' },
  { name: 'Greek Yogurt', category: 'Dairy & Eggs', defaultLocation: 'Fridge', shelfLifeDays: 14, storageTip: 'Keep sealed tightly after opening.' },
  { name: 'Chicken Breast', category: 'Meat & Seafood', defaultLocation: 'Fridge', shelfLifeDays: 2, storageTip: 'Cook within 48h or freeze in airtight wrap.' },
  { name: 'Ground Beef', category: 'Meat & Seafood', defaultLocation: 'Fridge', shelfLifeDays: 2, storageTip: 'Cook within 2 days of purchase.' },
  { name: 'Salmon Fillet', category: 'Meat & Seafood', defaultLocation: 'Fridge', shelfLifeDays: 2, storageTip: 'Keep chilled over a bed of ice or bottom fridge shelf.' },
  { name: 'Sourdough Bread', category: 'Bakery', defaultLocation: 'Pantry', shelfLifeDays: 4, storageTip: 'Store cut side down on cutting board or in bread bag.' },
  { name: 'Sliced Sandwich Bread', category: 'Bakery', defaultLocation: 'Pantry', shelfLifeDays: 7, storageTip: 'Freeze extra slices and toast directly from freezer.' },
  { name: 'Canned Beans & Veggies', category: 'Pantry & Dry Goods', defaultLocation: 'Pantry', shelfLifeDays: 365, storageTip: 'Store in cool, dry cabinet away from heat.' },
  { name: 'Dry Pasta & Rice', category: 'Pantry & Dry Goods', defaultLocation: 'Pantry', shelfLifeDays: 365, storageTip: 'Keep in airtight glass or acrylic canisters.' },
  { name: 'Tofu', category: 'Dairy & Eggs', defaultLocation: 'Fridge', shelfLifeDays: 7, storageTip: 'Submerge opened tofu in fresh water, change water daily.' }
];


export const RECIPES_CATALOG: Recipe[] = [
  {
    id: 'rec-1',
    title: 'Garlic Spinach Chicken Skillet',
    prepTime: '10 min',
    cookTime: '15 min',
    difficulty: 'Easy',
    servings: 2,
    caloriesPerServing: 380,
    category: 'Dinner',
    imageUrl: '', // Stylized graphic fallback
    tags: ['High Protein', 'Gluten Free', 'Zero Waste', 'Fast Dinner'],
    ingredients: [
      { name: 'Chicken Breast', amount: '2 fillets' },
      { name: 'Baby Spinach', amount: '2 cups packed' },
      { name: 'Organic Whole Milk', amount: '1/3 cup' },
      { name: 'Garlic', amount: '3 cloves, minced' },
      { name: 'Olive Oil', amount: '1 tbsp' }
    ],
    instructions: [
      'Season chicken breast with salt, pepper, and garlic powder.',
      'Heat olive oil in a skillet over medium-high heat. Sear chicken 5-6 minutes per side until golden.',
      'Reduce heat to medium-low, stir in minced garlic and milk, gently simmering for 2 minutes to create a pan sauce.',
      'Add spinach directly to the pan and toss for 60 seconds until wilted and vibrant green. Serve immediately.'
    ],
    tipsForExpiringFood: 'Rescues Chicken Breast and Baby Spinach on their final fresh days. Extra milk softens the pan sauce.',
    allergens: ['dairy']
  },
  {
    id: 'rec-2',
    title: 'Quick Spinach & Egg Frittata',
    prepTime: '5 min',
    cookTime: '12 min',
    difficulty: 'Easy',
    servings: 2,
    caloriesPerServing: 260,
    category: 'Breakfast / Brunch',
    imageUrl: '',
    tags: ['Vegetarian', 'Quick & Easy', 'Keto Friendly'],
    ingredients: [
      { name: 'Pasture-Raised Eggs', amount: '4 large eggs' },
      { name: 'Baby Spinach', amount: '2 big handfuls' },
      { name: 'Organic Whole Milk', amount: '2 tbsp' },
      { name: 'Hass Avocados', amount: '1 sliced for topping' },
      { name: 'Olive Oil', amount: '1 tsp' }
    ],
    instructions: [
      'Whisk eggs together with milk, salt, and freshly cracked black pepper in a mixing bowl.',
      'Warm olive oil in an oven-safe nonstick pan over medium heat. Sauté spinach for 1 minute until soft.',
      'Pour whisked egg mixture evenly over the spinach.',
      'Cook on stovetop for 3-4 minutes until edges set, then broil on high for 2 minutes until puffed and golden.',
      'Slice into wedges and top with fresh avocado slices.'
    ],
    tipsForExpiringFood: 'Perfect for using up slightly wilted greens, loose eggs, and approaching avocados.',
    allergens: ['eggs', 'dairy']
  },
  {
    id: 'rec-3',
    title: 'Caramelized Banana French Toast',
    prepTime: '5 min',
    cookTime: '10 min',
    difficulty: 'Easy',
    servings: 2,
    caloriesPerServing: 420,
    category: 'Breakfast',
    imageUrl: '',
    tags: ['Comfort Food', 'Vegetarian', 'Sweet'],
    ingredients: [
      { name: 'Artisan Sourdough Boule', amount: '4 thick slices' },
      { name: 'Pasture-Raised Eggs', amount: '2 eggs' },
      { name: 'Organic Whole Milk', amount: '1/2 cup' },
      { name: 'Ripe Bananas', amount: '2 ripe bananas' },
      { name: 'Butter or Oil', amount: '1 tbsp' },
      { name: 'Cinnamon & Syrup', amount: 'To taste' }
    ],
    instructions: [
      'Whisk eggs, milk, and ground cinnamon together in a shallow wide dish.',
      'Dip thick slices of stale sourdough into the custard for 20 seconds per side so bread drinks up the liquid.',
      'Melt butter on a skillet over medium heat. Fry toast slices 3 minutes per side until deeply golden.',
      'In the same skillet, slice bananas lengthwise or into rounds, pan-searing with a drizzle of maple syrup for 2 minutes until caramelized.',
      'Stack the toast, spoon warm caramelized bananas over the top, and serve warm.'
    ],
    tipsForExpiringFood: 'Stale sourdough absorbs egg custard much better than fresh bread without getting soggy. Turns spotted bananas into gourmet caramel topping.',
    allergens: ['wheat_gluten', 'eggs', 'dairy']
  },
  {
    id: 'rec-4',
    title: 'Pan-Seared Salmon with Avocado Salsa',
    prepTime: '8 min',
    cookTime: '10 min',
    difficulty: 'Medium',
    servings: 1,
    caloriesPerServing: 490,
    category: 'Dinner',
    imageUrl: '',
    tags: ['Omega-3', 'High Protein', 'Fresh & Healthy'],
    ingredients: [
      { name: 'Atlantic Salmon Fillet', amount: '1 fillet (300g)' },
      { name: 'Hass Avocados', amount: '1 diced' },
      { name: 'Baby Spinach', amount: '1 cup fresh' },
      { name: 'Olive Oil', amount: '1 tbsp' },
      { name: 'Lime Juice & Salt', amount: 'To taste' }
    ],
    instructions: [
      'Pat salmon dry with paper towel; season skin and flesh generously with kosher salt and black pepper.',
      'Heat oil in skillet until shimmering. Place salmon skin-side down and press gently with spatula for 20 seconds.',
      'Cook 4-5 minutes until skin is crispy, flip and finish cooking flesh for 2-3 minutes.',
      'Toss diced ripe avocado with lime juice, pinch of salt, and a handful of chopped spinach.',
      'Plate the crispy salmon and spoon the refreshing avocado salsa over top.'
    ],
    tipsForExpiringFood: 'Saves delicate seafood on day 1 and pairs with soft avocados that must be consumed today.',
    allergens: ['fish']
  },
  {
    id: 'rec-5',
    title: 'Savory Black Bean & Avocado Bowl',
    prepTime: '5 min',
    cookTime: '5 min',
    difficulty: 'Easy',
    servings: 2,
    caloriesPerServing: 340,
    category: 'Lunch',
    imageUrl: '',
    tags: ['Plant-Based', 'High Fiber', 'Pantry Friendly'],
    ingredients: [
      { name: 'Organic Black Beans', amount: '1 can, drained & rinsed' },
      { name: 'Hass Avocados', amount: '1 avocado, sliced' },
      { name: 'Baby Spinach', amount: '2 cups fresh' },
      { name: 'Olive Oil', amount: '1 tsp' },
      { name: 'Cumin & Lime', amount: '1/2 tsp each' }
    ],
    instructions: [
      'Warm rinsed black beans in a small saucepan with cumin, garlic powder, and a splash of water for 3 minutes.',
      'Layer a bed of crisp baby spinach into shallow bowls.',
      'Spoon warm seasoned black beans over the greens to lightly soften them.',
      'Fan avocado slices across the top with a squeeze of fresh lime.'
    ],
    tipsForExpiringFood: 'Combines pantry canned beans with expiring fresh avocado and greens for zero prep time.',
    allergens: []
  },
  {
    id: 'rec-6',
    title: 'Creamy Greek Yogurt Berry Parfait',
    prepTime: '4 min',
    cookTime: '0 min',
    difficulty: 'Easy',
    servings: 1,
    caloriesPerServing: 280,
    category: 'Snack / Breakfast',
    imageUrl: '',
    tags: ['Probiotic', 'No Cook', 'Quick'],
    ingredients: [
      { name: 'Plain Greek Yogurt', amount: '1 cup' },
      { name: 'Ripe Bananas', amount: '1 sliced' },
      { name: 'Honey or Maple', amount: '1 tbsp' },
      { name: 'Cinnamon', amount: '1/4 tsp' }
    ],
    instructions: [
      'Layer Greek yogurt into a glass or bowl.',
      'Top with ripe banana slices and any soft fruits in your fridge.',
      'Drizzle with honey and sprinkle with cinnamon.'
    ],
    tipsForExpiringFood: 'Fastest way to turn dairy and ripe fruits into an energizing snack.',
    allergens: ['dairy']
  }
];

export const DONATION_CENTERS: DonationCenter[] = [
  {
    id: 'don-1',
    name: 'Community Care Fridge & Pantry',
    type: 'Community Fridge',
    distance: '0.4 mi',
    address: '428 Oak Grove Ave, Downtown',
    coordinates: { x: 38, y: 35 },
    hours: 'Open 24/7 (Outdoor accessible)',
    phone: '(555) 234-8901',
    accepts: [
      'Fresh uncut produce & fruit',
      'Unopened pasteurized dairy & eggs',
      'Commercially baked unopened bread',
      'Canned & sealed dry goods'
    ],
    cannotAccept: [
      'Raw meat or home-cooked leftovers',
      'Expired items past 2 days',
      'Opened dairy or cracked jars'
    ],
    dropOffInstructions: 'Walk directly up to the painted outdoor fridge. Place dairy and greens inside fridge shelves, bread and canned goods in the adjacent weather-proof pantry cabinet.',
    verified: true,
  },
  {
    id: 'don-2',
    name: 'Second Harvest Neighborhood Food Bank',
    type: 'Food Bank',
    distance: '1.2 mi',
    address: '890 Mission Boulevard, Suite B',
    coordinates: { x: 62, y: 28 },
    hours: 'Mon - Sat: 8:00 AM - 5:30 PM',
    phone: '(555) 872-3340',
    accepts: [
      'Canned proteins & beans',
      'Whole grain pasta, rice & oats',
      'Unopened refrigerated meats (with valid sell-by date)',
      'Intact produce boxes'
    ],
    cannotAccept: [
      'Expired dairy',
      'Dented or swollen cans',
      'Homemade goods'
    ],
    dropOffInstructions: 'Pull up to Bay 2 loading ramp. A volunteer with a cart will weigh your donation and issue an instant tax receipt if requested.',
    verified: true,
  },
  {
    id: 'don-3',
    name: 'St. Vincent Hope Soup Kitchen',
    type: 'Soup Kitchen',
    distance: '1.9 mi',
    address: '1104 Pine Street, West End',
    coordinates: { x: 25, y: 70 },
    hours: 'Daily: 7:00 AM - 6:00 PM',
    phone: '(555) 441-9022',
    accepts: [
      'Fresh meats & poultry (unopened, cookable)',
      'Bulk produce & potatoes',
      'Large container milk & cooking oils',
      'Commercial bakery breads'
    ],
    cannotAccept: [
      'Expired seafood',
      'Individual prepared leftover portions'
    ],
    dropOffInstructions: 'Ring bell at kitchen back door. The head chef greets drop-offs and uses incoming ingredients for that afternoon hot meal service.',
    verified: true,
  },
  {
    id: 'don-4',
    name: 'Urban Food Rescue Alliance Hub',
    type: 'Food Rescue Hub',
    distance: '2.6 mi',
    address: '245 Industrial Way, Dock 4',
    coordinates: { x: 78, y: 64 },
    hours: 'Mon - Fri: 9:00 AM - 4:00 PM',
    phone: '(555) 903-1288',
    accepts: [
      'Supermarket excess overstock',
      'Unopened fresh produce bags',
      'Canned goods by the case',
      'Chilled dairy & plant-based milks'
    ],
    cannotAccept: [
      'Warm or improperly refrigerated dairy',
      'Alcohol or non-food items'
    ],
    dropOffInstructions: 'Check in with dock manager. Items are redistributed to 14 partner neighborhood shelters within 3 hours via refrigerated cargo vans.',
    verified: true,
  }
];

export const INITIAL_TOP_SAVERS: import('../types/pantry').TopSaverUser[] = [
  {
    id: 'usr-1',
    rank: 1,
    name: 'Elena Rostova',
    avatar: 'ER',
    tier: 'Master Saver',
    rescuedKg: 26.5,
    eurosSaved: 260.00,
    rescuedLbs: 58.4,
    dollarsSaved: 284.50,
    streakDays: 42,
    eligibleDiscount: '25% OFF',
    badge: '🏆 Golden Pantry Steward'
  },
  {
    id: 'usr-2',
    rank: 2,
    name: 'Marcus Chen',
    avatar: 'MC',
    tier: 'Master Saver',
    rescuedKg: 23.2,
    eurosSaved: 225.00,
    rescuedLbs: 51.2,
    dollarsSaved: 246.00,
    streakDays: 35,
    eligibleDiscount: '25% OFF',
    badge: '🌿 Neighborhood Hero'
  },
  {
    id: 'usr-3',
    rank: 3,
    name: 'Aisha Al-Mansoor',
    avatar: 'AA',
    tier: 'Master Saver',
    rescuedKg: 21.2,
    eurosSaved: 195.50,
    rescuedLbs: 46.8,
    dollarsSaved: 218.75,
    streakDays: 28,
    eligibleDiscount: '25% OFF',
    badge: '🍲 Soup Kitchen Pioneer'
  },
  {
    id: 'usr-4',
    rank: 4,
    name: 'Elena Rostova',
    avatar: 'ER',
    tier: 'Eco Champion',
    rescuedKg: 17.5,
    eurosSaved: 158.00,
    rescuedLbs: 38.6,
    dollarsSaved: 174.20,
    streakDays: 19,
    eligibleDiscount: '15% OFF',
    badge: '🌟 Zero Waste Chef'
  },
  {
    id: 'usr-5',
    rank: 5,
    name: 'Liam Gallagher',
    avatar: 'LG',
    tier: 'Eco Champion',
    rescuedKg: 15.4,
    eurosSaved: 138.00,
    rescuedLbs: 34.1,
    dollarsSaved: 152.00,
    streakDays: 16,
    eligibleDiscount: '15% OFF',
    badge: '🥖 Bread Rescue Specialist'
  },
  {
    id: 'usr-6',
    rank: 6,
    name: 'Sofia Ramirez',
    avatar: 'SR',
    tier: 'Eco Champion',
    rescuedKg: 13.4,
    eurosSaved: 122.50,
    rescuedLbs: 29.5,
    dollarsSaved: 135.50,
    streakDays: 14,
    eligibleDiscount: '15% OFF',
    badge: '🥦 Crisper Drawer Master'
  },
  {
    id: 'usr-7',
    rank: 7,
    name: 'David Kim',
    avatar: 'DK',
    tier: 'Conscious Consumer',
    rescuedKg: 10.3,
    eurosSaved: 89.00,
    rescuedLbs: 22.8,
    dollarsSaved: 98.40,
    streakDays: 9,
    eligibleDiscount: '10% OFF',
    badge: '📦 Community Drop-off Lead'
  },
  {
    id: 'usr-8',
    rank: 8,
    name: 'Priya Patel',
    avatar: 'PP',
    tier: 'Conscious Consumer',
    rescuedKg: 8.2,
    eurosSaved: 74.00,
    rescuedLbs: 18.2,
    dollarsSaved: 82.00,
    streakDays: 8,
    eligibleDiscount: '10% OFF',
    badge: '🌱 Fresh Sprout'
  },
  {
    id: 'usr-current',
    rank: 9,
    name: 'You',
    avatar: 'ME',
    tier: 'Rising Saver',
    rescuedKg: 0,
    eurosSaved: 0,
    rescuedLbs: 0,
    dollarsSaved: 0,
    streakDays: 0,
    isCurrentUser: true,
    eligibleDiscount: '5% OFF',
    badge: '🌱 Fresh Starter'
  }
];

export const INITIAL_DISCOUNT_REWARDS: import('../types/pantry').DiscountReward[] = [
  {
    id: 'rew-1',
    code: 'MASTERSAVE-25',
    partnerStore: 'Green Valley Organic Market',
    discountValue: '25% OFF',
    description: 'Exclusive 25% off your entire fresh produce & bulk goods order.',
    minTier: 'Master Saver',
    minKgRequired: 20,
    expiryDate: getOffsetDateString(30),
    category: 'Organic Markets',
    claimed: false,
    terms: 'Valid on in-store and online orders over 40€. Maximum discount 35€.'
  },
  {
    id: 'rew-2',
    code: 'SAVERPRODUCE-15',
    partnerStore: 'Sprouts Farmers Co-op',
    discountValue: '15% OFF',
    description: '15% off any seasonal fruit and vegetable baskets.',
    minTier: 'Eco Champion',
    minKgRequired: 12,
    expiryDate: getOffsetDateString(21),
    category: 'Produce & Groceries',
    claimed: false,
    terms: 'Applicable at all metro area locations. One redemption per week.'
  },
  {
    id: 'rew-3',
    code: 'ARTISANBAKE-FREE',
    partnerStore: 'Hearth & Stone Artisan Bakery',
    discountValue: 'Free Loaf Voucher',
    description: 'Free day-fresh artisan sourdough or multigrain loaf with any purchase.',
    minTier: 'Eco Champion',
    minKgRequired: 12,
    expiryDate: getOffsetDateString(14),
    category: 'Bakery & Deli',
    claimed: false,
    terms: 'Show voucher in-store to redeem. Valid while daily fresh batches last.'
  },
  {
    id: 'rew-4',
    code: 'COMMUNITY-10',
    partnerStore: 'City Mart Supermarkets',
    discountValue: '10% OFF',
    description: '10% grocery coupon celebrating waste reduction stewards.',
    minTier: 'Conscious Consumer',
    minKgRequired: 7,
    expiryDate: getOffsetDateString(15),
    category: 'Produce & Groceries',
    claimed: false,
    terms: 'Valid across dairy, produce, and bakery aisles.'
  },
  {
    id: 'rew-5',
    code: 'FRESHPASS-DELIVERY',
    partnerStore: 'FarmDirect Local Express',
    discountValue: '10€ Credit',
    description: '10€ credit toward zero-emissions local farm produce delivery.',
    minTier: 'Rising Saver',
    minKgRequired: 2,
    expiryDate: getOffsetDateString(45),
    category: 'Local Delivery',
    claimed: false,
    terms: 'No minimum order. Can be combined with farm subscription boxes.'
  }
];

