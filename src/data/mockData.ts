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

export const INITIAL_PANTRY: PantryItem[] = [
  {
    id: 'item-1',
    name: 'Baby Spinach',
    category: 'Produce',
    location: 'Fridge',
    quantity: '1 bag (200g)',
    daysLeft: 1,
    expiryDate: getOffsetDateString(1),
    addedDate: getOffsetDateString(-5),
    barcode: '071112458921',
    notes: 'Leaves still crisp, use in stir-fry or salad soon',
    estimatedPrice: 3.49,
    weightLbs: 0.5,
  },
  {
    id: 'item-2',
    name: 'Free-Range Chicken Breast',
    category: 'Meat & Seafood',
    location: 'Fridge',
    quantity: '2 fillets (500g)',
    daysLeft: 0,
    expiryDate: getOffsetDateString(0),
    addedDate: getOffsetDateString(-2),
    barcode: '028475930211',
    notes: 'Cook today or freeze immediately',
    estimatedPrice: 7.99,
    weightLbs: 1.1,
  },
  {
    id: 'item-3',
    name: 'Organic Whole Milk',
    category: 'Dairy & Eggs',
    location: 'Fridge',
    quantity: '1 carton (1 Liter)',
    daysLeft: 2,
    expiryDate: getOffsetDateString(2),
    addedDate: getOffsetDateString(-6),
    barcode: '041220789432',
    notes: 'Great for French toast, smoothies or béchamel',
    estimatedPrice: 4.29,
    weightLbs: 2.2,
  },
  {
    id: 'item-4',
    name: 'Artisan Sourdough Boule',
    category: 'Bakery',
    location: 'Pantry',
    quantity: 'Half loaf (4 slices)',
    daysLeft: 1,
    expiryDate: getOffsetDateString(1),
    addedDate: getOffsetDateString(-4),
    barcode: '083492104523',
    notes: 'Ideal for toast, croutons or panzanella',
    estimatedPrice: 5.50,
    weightLbs: 0.8,
  },
  {
    id: 'item-5',
    name: 'Pasture-Raised Eggs',
    category: 'Dairy & Eggs',
    location: 'Fridge',
    quantity: '8 large eggs',
    daysLeft: 8,
    expiryDate: getOffsetDateString(8),
    addedDate: getOffsetDateString(-10),
    barcode: '019847230491',
    notes: 'Grade A fresh brown eggs',
    estimatedPrice: 4.89,
    weightLbs: 1.0,
  },
  {
    id: 'item-6',
    name: 'Hass Avocados',
    category: 'Produce',
    location: 'Pantry',
    quantity: '2 avocados',
    daysLeft: 2,
    expiryDate: getOffsetDateString(2),
    addedDate: getOffsetDateString(-3),
    barcode: '033383400192',
    notes: 'Soft to gentle press, ready to eat',
    estimatedPrice: 3.00,
    weightLbs: 0.7,
  },
  {
    id: 'item-7',
    name: 'Plain Greek Yogurt',
    category: 'Dairy & Eggs',
    location: 'Fridge',
    quantity: '1 tub (500g)',
    daysLeft: 5,
    expiryDate: getOffsetDateString(5),
    addedDate: getOffsetDateString(-7),
    barcode: '052210874521',
    notes: 'Use in morning bowls or meat marinade',
    estimatedPrice: 4.49,
    weightLbs: 1.1,
  },
  {
    id: 'item-8',
    name: 'Organic Black Beans',
    category: 'Pantry & Dry Goods',
    location: 'Pantry',
    quantity: '2 cans (15 oz)',
    daysLeft: 180,
    expiryDate: getOffsetDateString(180),
    addedDate: getOffsetDateString(-20),
    barcode: '074829103845',
    notes: 'Pantry staple, long shelf life',
    estimatedPrice: 2.18,
    weightLbs: 1.8,
  },
  {
    id: 'item-9',
    name: 'Atlantic Salmon Fillet',
    category: 'Meat & Seafood',
    location: 'Fridge',
    quantity: '1 piece (300g)',
    daysLeft: 1,
    expiryDate: getOffsetDateString(1),
    addedDate: getOffsetDateString(-1),
    barcode: '028475931102',
    notes: 'Fresh catch, roast or pan-sear tonight',
    estimatedPrice: 8.50,
    weightLbs: 0.7,
  },
  {
    id: 'item-10',
    name: 'Ripe Bananas',
    category: 'Produce',
    location: 'Pantry',
    quantity: '3 bananas',
    daysLeft: 2,
    expiryDate: getOffsetDateString(2),
    addedDate: getOffsetDateString(-4),
    barcode: '040110002134',
    notes: 'Spotted peel, sweet for banana bread or smoothie',
    estimatedPrice: 1.25,
    weightLbs: 1.2,
  }
];

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

export const SCANNABLE_BARCODE_PRESETS = [
  {
    barcode: '071112458921',
    name: 'Organic Baby Spinach (300g)',
    brand: 'Earthbound Farm',
    category: 'Produce' as FoodCategory,
    location: 'Fridge' as const,
    quantity: '1 clamshell (300g)',
    daysLeft: 4,
    estimatedPrice: 3.99,
    weightLbs: 0.66,
    notes: 'Pre-washed triple organic greens',
    nutritionHighlights: 'Rich in Iron, Vitamin K & Folate'
  },
  {
    barcode: '041220789432',
    name: 'Lactaid 2% Reduced Fat Milk',
    brand: 'Lactaid Dairy',
    category: 'Dairy & Eggs' as FoodCategory,
    location: 'Fridge' as const,
    quantity: '1 jug (0.5 Gallon)',
    daysLeft: 9,
    estimatedPrice: 4.49,
    weightLbs: 4.2,
    notes: 'Lactose-free fortified milk',
    nutritionHighlights: '13g Protein per serving'
  },
  {
    barcode: '028475930211',
    name: 'Organic Boneless Chicken Thighs',
    brand: 'Bell & Evans',
    category: 'Meat & Seafood' as FoodCategory,
    location: 'Fridge' as const,
    quantity: '4 pieces (1.2 lbs)',
    daysLeft: 3,
    estimatedPrice: 8.99,
    weightLbs: 1.2,
    notes: 'Air-chilled organic poultry',
    nutritionHighlights: 'Zero antibiotics, pasture-raised'
  },
  {
    barcode: '052210874521',
    name: 'Fage Total 5% Greek Yogurt',
    brand: 'FAGE',
    category: 'Dairy & Eggs' as FoodCategory,
    location: 'Fridge' as const,
    quantity: '1 tub (17.6 oz)',
    daysLeft: 12,
    estimatedPrice: 4.79,
    weightLbs: 1.1,
    notes: 'Rich and creamy strained yogurt',
    nutritionHighlights: '16g Protein, Live active cultures'
  },
  {
    barcode: '083492104523',
    name: 'Rustic Sourdough Boule',
    brand: 'La Brea Bakery',
    category: 'Bakery' as FoodCategory,
    location: 'Pantry' as const,
    quantity: '1 whole loaf',
    daysLeft: 5,
    estimatedPrice: 5.99,
    weightLbs: 1.2,
    notes: 'Natural sourdough fermentation',
    nutritionHighlights: 'No artificial preservatives'
  },
  {
    barcode: '033383400192',
    name: 'Organic Hass Avocados Bag',
    brand: 'Del Monte',
    category: 'Produce' as FoodCategory,
    location: 'Pantry' as const,
    quantity: 'Bag of 4 avocados',
    daysLeft: 4,
    estimatedPrice: 4.99,
    weightLbs: 1.5,
    notes: 'Good healthy monounsaturated fats',
    nutritionHighlights: 'Heart-healthy potassium & fiber'
  }
];

export const MOCK_RECEIPT_ITEMS: PantryItem[] = [
  {
    id: 'rcpt-1',
    name: 'Strawberries Fresh',
    category: 'Produce',
    location: 'Fridge',
    quantity: '1 lb clamshell',
    daysLeft: 3,
    expiryDate: getOffsetDateString(3),
    addedDate: getOffsetDateString(0),
    barcode: '049182374112',
    notes: 'Scanned from Safeway receipt #4892',
    estimatedPrice: 3.99,
    weightLbs: 1.0,
  },
  {
    id: 'rcpt-2',
    name: 'Sharp Cheddar Cheese',
    category: 'Dairy & Eggs',
    location: 'Fridge',
    quantity: '8 oz block',
    daysLeft: 20,
    expiryDate: getOffsetDateString(20),
    addedDate: getOffsetDateString(0),
    barcode: '038291049281',
    notes: 'Scanned from Safeway receipt #4892',
    estimatedPrice: 4.29,
    weightLbs: 0.5,
  },
  {
    id: 'rcpt-3',
    name: 'Whole Grain Sliced Bread',
    category: 'Bakery',
    location: 'Pantry',
    quantity: '1 loaf (24 oz)',
    daysLeft: 6,
    expiryDate: getOffsetDateString(6),
    addedDate: getOffsetDateString(0),
    barcode: '049182374330',
    notes: 'Scanned from Safeway receipt #4892',
    estimatedPrice: 3.89,
    weightLbs: 1.5,
  },
  {
    id: 'rcpt-4',
    name: 'Atlantic Salmon Portion',
    category: 'Meat & Seafood',
    location: 'Fridge',
    quantity: '2 portions (12 oz)',
    daysLeft: 2,
    expiryDate: getOffsetDateString(2),
    addedDate: getOffsetDateString(0),
    barcode: '028475939981',
    notes: 'Scanned from Safeway receipt #4892',
    estimatedPrice: 9.49,
    weightLbs: 0.75,
  }
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
    tipsForExpiringFood: 'Rescues Chicken Breast and Baby Spinach on their final fresh days. Extra milk softens the pan sauce.'
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
    tipsForExpiringFood: 'Perfect for using up slightly wilted greens, loose eggs, and approaching avocados.'
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
    tipsForExpiringFood: 'Stale sourdough absorbs egg custard much better than fresh bread without getting soggy. Turns spotted bananas into gourmet caramel topping.'
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
    tipsForExpiringFood: 'Saves delicate seafood on day 1 and pairs with soft avocados that must be consumed today.'
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
      { name: 'Plain Greek Yogurt', amount: '2 tbsp (dollop on top)' },
      { name: 'Cumin & Lime', amount: '1/2 tsp each' }
    ],
    instructions: [
      'Warm rinsed black beans in a small saucepan with cumin, garlic powder, and a splash of water for 3 minutes.',
      'Layer a bed of crisp baby spinach into shallow bowls.',
      'Spoon warm seasoned black beans over the greens to lightly soften them.',
      'Fan avocado slices across the top and add a cool dollop of Greek yogurt as a healthy crema alternative.'
    ],
    tipsForExpiringFood: 'Combines pantry canned beans with expiring fresh avocado and greens for zero prep time.'
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
      { name: 'Cinnamon or Nuts', amount: '1 tbsp optional' }
    ],
    instructions: [
      'Layer Greek yogurt into a glass or bowl.',
      'Top with ripe banana slices and any soft fruits in your fridge.',
      'Drizzle with honey and sprinkle with cinnamon.'
    ],
    tipsForExpiringFood: 'Fastest way to turn dairy and ripe fruits into an energizing snack.'
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
    rescuedLbs: 46.8,
    dollarsSaved: 218.75,
    streakDays: 28,
    eligibleDiscount: '25% OFF',
    badge: '🍲 Soup Kitchen Pioneer'
  },
  {
    id: 'usr-4',
    rank: 4,
    name: 'You (Alex Miller)',
    avatar: 'AM',
    tier: 'Eco Champion',
    rescuedLbs: 38.6,
    dollarsSaved: 174.20,
    streakDays: 19,
    isCurrentUser: true,
    eligibleDiscount: '15% OFF',
    badge: '🌟 Zero Waste Chef'
  },
  {
    id: 'usr-5',
    rank: 5,
    name: 'Liam Gallagher',
    avatar: 'LG',
    tier: 'Eco Champion',
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
    rescuedLbs: 18.2,
    dollarsSaved: 82.00,
    streakDays: 8,
    eligibleDiscount: '10% OFF',
    badge: '🌱 Fresh Sprout'
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
    minLbsRequired: 45,
    expiryDate: getOffsetDateString(30),
    category: 'Organic Markets',
    claimed: false,
    terms: 'Valid on in-store and online orders over $40. Maximum discount $35.'
  },
  {
    id: 'rew-2',
    code: 'SAVERPRODUCE-15',
    partnerStore: 'Sprouts Farmers Co-op',
    discountValue: '15% OFF',
    description: '15% off any seasonal fruit and vegetable baskets.',
    minTier: 'Eco Champion',
    minLbsRequired: 25,
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
    minLbsRequired: 25,
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
    minLbsRequired: 15,
    expiryDate: getOffsetDateString(15),
    category: 'Produce & Groceries',
    claimed: false,
    terms: 'Valid across dairy, produce, and bakery aisles.'
  },
  {
    id: 'rew-5',
    code: 'FRESHPASS-DELIVERY',
    partnerStore: 'FarmDirect Local Express',
    discountValue: '$10 Credit',
    description: '$10 credit toward zero-emissions local farm produce delivery.',
    minTier: 'Rising Saver',
    minLbsRequired: 5,
    expiryDate: getOffsetDateString(45),
    category: 'Local Delivery',
    claimed: false,
    terms: 'No minimum order. Can be combined with farm subscription boxes.'
  }
];

