export type FoodCategory = 
  | 'Produce'
  | 'Dairy & Eggs'
  | 'Meat & Seafood'
  | 'Bakery'
  | 'Pantry & Dry Goods'
  | 'Beverages'
  | 'Frozen';

export type StorageLocation = 'Fridge' | 'Pantry' | 'Freezer';

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
  estimatedPrice: number; // in USD
  weightLbs: number;
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
  actionType: 'cook' | 'donate' | 'general';
  read: boolean;
}

export interface UserImpactStats {
  rescuedLbs: number;
  dollarsSaved: number;
  co2SavedKg: number;
  itemsCooked: number;
  itemsDonated: number;
}

export type SaverTier = 'Master Saver' | 'Eco Champion' | 'Conscious Consumer' | 'Rising Saver';

export interface TopSaverUser {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  tier: SaverTier;
  rescuedLbs: number;
  dollarsSaved: number;
  streakDays: number;
  isCurrentUser?: boolean;
  eligibleDiscount: string;
  badge: string;
}

export interface DiscountReward {
  id: string;
  code: string;
  partnerStore: string;
  discountValue: string; // e.g. "25% OFF" or "$15 Credit"
  description: string;
  minTier: SaverTier;
  minLbsRequired: number;
  expiryDate: string;
  category: 'Produce & Groceries' | 'Organic Markets' | 'Bakery & Deli' | 'Local Delivery';
  claimed: boolean;
  terms: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  category: FoodCategory;
  quantity: string;
  notes?: string;
  checked: boolean;
  estimatedPrice: number;
  defaultLocation: StorageLocation;
  defaultShelfLifeDays: number;
  sourceRecipe?: string;
  addedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  token: string;
  createdAt: string;
  lastSyncAt?: string;
}

export interface DeviceSyncData {
  userId: string;
  inventory: PantryItem[];
  shoppingList: ShoppingListItem[];
  userStats: UserImpactStats;
  updatedAt: string;
}


