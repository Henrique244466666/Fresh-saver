export type FoodCategory = 
  | 'Produce'
  | 'Dairy & Eggs'
  | 'Meat & Seafood'
  | 'Bakery'
  | 'Pantry & Dry Goods'
  | 'Beverages'
  | 'Frozen';

export type StorageLocation = 'Fridge' | 'Pantry' | 'Freezer';

export type AllergyId = 
  | 'peanuts'
  | 'tree_nuts'
  | 'dairy'
  | 'eggs'
  | 'wheat_gluten'
  | 'soy'
  | 'fish'
  | 'shellfish'
  | 'sesame';

export interface AllergyOption {
  id: AllergyId;
  label: string;
  icon: string;
  keywords: string[];
}

export interface PantryItem {
  id: string;
  name: string;
  category: FoodCategory;
  location: StorageLocation;
  quantity: string;
  daysLeft: number;
  expiryDate: string; // YYYY-MM-DD
  addedDate: string;  // YYYY-MM-DD
  barcode?: string;
  notes?: string;
  estimatedPrice: number; // in EUR (€)
  weightKg: number;
  allergens?: AllergyId[];
  weightLbs?: number; // legacy compatibility
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  isPantryMatch?: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  prepTime: string;
  cookTime: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  servings: number;
  caloriesPerServing: number;
  category: string;
  imageUrl: string;
  tags: string[];
  ingredients: RecipeIngredient[];
  instructions: string[];
  tipsForExpiringFood?: string;
  allergens?: AllergyId[];
}

export interface DonationCenter {
  id: string;
  name: string;
  type: 'Community Fridge' | 'Food Bank' | 'Soup Kitchen' | 'Food Rescue Hub';
  distance: string;
  address: string;
  coordinates: { x: number; y: number }; // percentage on map (0-100)
  hours: string;
  phone: string;
  accepts: string[];
  cannotAccept: string[];
  dropOffInstructions: string;
  verified: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  urgency: 'high' | 'medium' | 'low';
  relatedItemId?: string;
  actionType: 'cook' | 'donate' | 'general' | 'allergy';
  read: boolean;
}

export interface UserImpactStats {
  rescuedKg: number;
  eurosSaved: number;
  co2SavedKg: number;
  itemsCooked: number;
  itemsDonated: number;
  rescuedLbs?: number; // compatibility
  dollarsSaved?: number; // compatibility
}

export type SaverTier = 'Master Saver' | 'Eco Champion' | 'Conscious Consumer' | 'Rising Saver';

export interface TopSaverUser {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  tier: SaverTier;
  rescuedKg: number;
  eurosSaved: number;
  streakDays: number;
  isCurrentUser?: boolean;
  eligibleDiscount: string;
  badge: string;
  rescuedLbs?: number;
  dollarsSaved?: number;
}

export interface DiscountReward {
  id: string;
  code: string;
  partnerStore: string;
  discountValue: string; // e.g. "25% OFF" or "15€ Desconto"
  description: string;
  minTier: SaverTier;
  minKgRequired: number;
  expiryDate: string;
  category: 'Produce & Groceries' | 'Organic Markets' | 'Bakery & Deli' | 'Local Delivery';
  claimed: boolean;
  terms: string;
  minLbsRequired?: number;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  category: FoodCategory;
  quantity: string;
  notes?: string;
  checked: boolean;
  estimatedPrice: number; // in EUR (€)
  defaultLocation: StorageLocation;
  defaultShelfLifeDays: number;
  sourceRecipe?: string;
  addedAt: string;
  allergens?: AllergyId[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  token: string;
  createdAt: string;
  lastSyncAt?: string;
  allergies?: AllergyId[];
}

export interface DeviceSyncData {
  userId: string;
  inventory: PantryItem[];
  shoppingList: ShoppingListItem[];
  userStats: UserImpactStats;
  updatedAt: string;
}
