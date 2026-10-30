import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PantryView } from './components/PantryView';
import { ScannerView } from './components/ScannerView';
import { RecipesView } from './components/RecipesView';
import { DonationView } from './components/DonationView';
import { TopSaversView } from './components/TopSaversView';
import { ShoppingListView } from './components/ShoppingListView';
import { AccountView } from './components/AccountView';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AuthModal } from './components/AuthModal';
import { AiRecipeModal } from './components/AiRecipeModal';
import { 
  PantryItem, 
  TopSaverUser, 
  DiscountReward, 
  UserImpactStats,
  ShoppingListItem,
  AuthUser,
  Recipe
} from './types/pantry';
import { 
  INITIAL_PANTRY, 
  INITIAL_TOP_SAVERS, 
  INITIAL_DISCOUNT_REWARDS,
  calculateDaysLeft,
  getOffsetDateString,
  RECIPES_CATALOG
} from './data/mockData';

const INITIAL_SHOPPING_LIST: ShoppingListItem[] = [
  {
    id: 'shop-1',
    name: 'Fresh Strawberries',
    category: 'Produce',
    quantity: '1 lb clamshell',
    notes: 'For breakfast yogurt bowls',
    checked: true,
    estimatedPrice: 3.99,
    defaultLocation: 'Fridge',
    defaultShelfLifeDays: 3,
    addedAt: new Date().toISOString()
  },
  {
    id: 'shop-2',
    name: 'Extra Virgin Olive Oil',
    category: 'Pantry & Dry Goods',
    quantity: '1 bottle (500ml)',
    notes: 'Pantry staple for dressings and skillet cooking',
    checked: false,
    estimatedPrice: 8.49,
    defaultLocation: 'Pantry',
    defaultShelfLifeDays: 180,
    addedAt: new Date().toISOString()
  },
  {
    id: 'shop-3',
    name: 'Sharp Cheddar Cheese',
    category: 'Dairy & Eggs',
    quantity: '8 oz block',
    notes: 'For frittatas and snacks',
    checked: true,
    estimatedPrice: 4.29,
    defaultLocation: 'Fridge',
    defaultShelfLifeDays: 21,
    addedAt: new Date().toISOString()
  }
];

export default function App() {
  // Navigation tab
  const [currentTab, setCurrentTab] = useState<'pantry' | 'scanner' | 'recipes' | 'donate' | 'top-savers' | 'shopping-list' | 'account'>('pantry');
  
  // Modals & Drawers
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAiRecipeModalOpen, setIsAiRecipeModalOpen] = useState(false);

  // Cross-feature filters
  const [preSelectedIngredient, setPreSelectedIngredient] = useState<string | undefined>(undefined);
  const [preSelectedDonationItem, setPreSelectedDonationItem] = useState<PantryItem | null>(null);

  // Authenticated user
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('freshsaver_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: 'usr-default-alex',
      name: 'Alex Miller',
      email: 'alex.miller@example.com',
      token: 'tok_alex_default',
      createdAt: '2026-09-01T08:00:00Z',
      lastSyncAt: new Date().toISOString()
    };
  });

  // LocalStorage-backed state for inventory
  const [inventory, setInventory] = useState<PantryItem[]>(() => {
    try {
      const saved = localStorage.getItem('freshsaver_inventory');
      if (saved) {
        const parsed: PantryItem[] = JSON.parse(saved);
        return parsed.map(item => ({
          ...item,
          daysLeft: calculateDaysLeft(item.expiryDate)
        }));
      }
    } catch {}
    return INITIAL_PANTRY.map(item => ({
      ...item,
      daysLeft: calculateDaysLeft(item.expiryDate)
    }));
  });

  // Shopping List
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>(() => {
    try {
      const saved = localStorage.getItem('freshsaver_shopping_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SHOPPING_LIST;
  });

  const [topSavers, setTopSavers] = useState<TopSaverUser[]>(() => {
    try {
      const saved = localStorage.getItem('freshsaver_top_savers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TOP_SAVERS;
  });

  const [discountRewards, setDiscountRewards] = useState<DiscountReward[]>(() => {
    try {
      const saved = localStorage.getItem('freshsaver_discount_rewards');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DISCOUNT_REWARDS;
  });

  const [userStats, setUserStats] = useState<UserImpactStats>(() => {
    try {
      const saved = localStorage.getItem('freshsaver_user_stats');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      rescuedLbs: 38.6,
      dollarsSaved: 174.20,
      co2SavedKg: 54.0,
      itemsCooked: 16,
      itemsDonated: 5
    };
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('freshsaver_inventory', JSON.stringify(inventory));
    } catch {}
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem('freshsaver_shopping_list', JSON.stringify(shoppingList));
    } catch {}
  }, [shoppingList]);

  useEffect(() => {
    try {
      localStorage.setItem('freshsaver_top_savers', JSON.stringify(topSavers));
    } catch {}
  }, [topSavers]);

  useEffect(() => {
    try {
      localStorage.setItem('freshsaver_discount_rewards', JSON.stringify(discountRewards));
    } catch {}
  }, [discountRewards]);

  useEffect(() => {
    try {
      localStorage.setItem('freshsaver_user_stats', JSON.stringify(userStats));
    } catch {}
  }, [userStats]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('freshsaver_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('freshsaver_user');
      }
    } catch {}
  }, [currentUser]);

  // Background Cloud Sync
  useEffect(() => {
    if (currentUser) {
      fetch('/api/sync/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          inventory,
          shoppingList,
          userStats
        })
      }).catch(() => {});
    }
  }, [inventory, shoppingList, userStats, currentUser]);

  // Inventory Handlers
  const handleAddItem = (newItem: PantryItem) => {
    setInventory(prev => [newItem, ...prev]);
  };

  const handleAddBatchItems = (newItems: PantryItem[]) => {
    setInventory(prev => [...newItems, ...prev]);
  };

  const handleDeleteItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateItem = (updatedItem: PantryItem) => {
    setInventory(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  // Helper to record saved food and update leaderboard
  const recordFoodSaved = (lbs: number, dollars: number, type: 'cooked' | 'donated') => {
    const newLbs = Number((userStats.rescuedLbs + lbs).toFixed(1));
    const newDollars = Number((userStats.dollarsSaved + dollars).toFixed(2));
    const newCo2 = Number((userStats.co2SavedKg + (lbs * 1.4)).toFixed(1));

    const updatedStats: UserImpactStats = {
      rescuedLbs: newLbs,
      dollarsSaved: newDollars,
      co2SavedKg: newCo2,
      itemsCooked: type === 'cooked' ? userStats.itemsCooked + 1 : userStats.itemsCooked,
      itemsDonated: type === 'donated' ? userStats.itemsDonated + 1 : userStats.itemsDonated,
    };
    setUserStats(updatedStats);

    setTopSavers(prev => {
      const updated = prev.map(u => {
        if (u.isCurrentUser) {
          let newTier = u.tier;
          let newDiscount = u.eligibleDiscount;
          if (newLbs >= 45) {
            newTier = 'Master Saver';
            newDiscount = '25% OFF';
          } else if (newLbs >= 25) {
            newTier = 'Eco Champion';
            newDiscount = '15% OFF';
          } else if (newLbs >= 15) {
            newTier = 'Conscious Consumer';
            newDiscount = '10% OFF';
          }

          return {
            ...u,
            rescuedLbs: newLbs,
            dollarsSaved: newDollars,
            tier: newTier,
            eligibleDiscount: newDiscount
          };
        }
        return u;
      });

      return updated
        .sort((a, b) => b.rescuedLbs - a.rescuedLbs)
        .map((user, index) => ({
          ...user,
          rank: index + 1
        }));
    });
  };

  const handleMarkRescued = (item: PantryItem, method: 'cooked' | 'donated') => {
    recordFoodSaved(item.weightLbs, item.estimatedPrice, method);
    handleDeleteItem(item.id);
  };

  const handleMealCooked = (usedIngredientNames: string[], _recipeTitle: string) => {
    let totalLbs = 0;
    let totalDollars = 0;

    setInventory(prev => {
      const remaining: PantryItem[] = [];
      prev.forEach(item => {
        const matches = usedIngredientNames.some(name => 
          item.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(item.name.toLowerCase())
        );

        if (matches) {
          totalLbs += item.weightLbs;
          totalDollars += item.estimatedPrice;
        } else {
          remaining.push(item);
        }
      });
      return remaining;
    });

    recordFoodSaved(totalLbs > 0 ? totalLbs : 1.2, totalDollars > 0 ? totalDollars : 6.50, 'cooked');
  };

  const handleDonationCompleted = (donatedItems: PantryItem[], _centerName: string) => {
    let totalLbs = 0;
    let totalDollars = 0;

    const donatedIds = donatedItems.map(i => i.id);
    donatedItems.forEach(item => {
      totalLbs += item.weightLbs;
      totalDollars += item.estimatedPrice;
    });

    setInventory(prev => prev.filter(i => !donatedIds.includes(i.id)));
    recordFoodSaved(totalLbs, totalDollars, 'donated');
    setPreSelectedDonationItem(null);
  };

  const handleClaimReward = (rewardId: string) => {
    setDiscountRewards(prev => prev.map(r => r.id === rewardId ? { ...r, claimed: true } : r));
  };

  // ---------------------------------------------------------
  // Shopping List -> Pantry Conversion Handlers
  // ---------------------------------------------------------
  const handleAddShoppingItem = (item: ShoppingListItem) => {
    setShoppingList(prev => [item, ...prev]);
  };

  const handleToggleCheckShoppingItem = (id: string) => {
    setShoppingList(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleDeleteShoppingItem = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  // Turn checked bought items into pantry products
  const handleConvertBoughtToPantry = (boughtItems: ShoppingListItem[]) => {
    const boughtIds = boughtItems.map(b => b.id);

    const convertedPantryItems: PantryItem[] = boughtItems.map((b, idx) => ({
      id: `pantry-bought-${Date.now()}-${idx}`,
      name: b.name,
      category: b.category,
      location: b.defaultLocation,
      quantity: b.quantity,
      daysLeft: b.defaultShelfLifeDays,
      expiryDate: getOffsetDateString(b.defaultShelfLifeDays),
      addedDate: getOffsetDateString(0),
      notes: b.notes ? `Bought from shopping list: ${b.notes}` : 'Purchased from grocery shopping list',
      estimatedPrice: b.estimatedPrice || 3.50,
      weightLbs: 0.8
    }));

    // Add to active inventory
    setInventory(prev => [...convertedPantryItems, ...prev]);

    // Remove from shopping list
    setShoppingList(prev => prev.filter(item => !boughtIds.includes(item.id)));
  };

  // Add missing recipe ingredients to shopping list
  const handleAddMissingToShoppingList = (ingredients: { name: string; amount: string }[], recipeTitle: string) => {
    const newItems: ShoppingListItem[] = ingredients.map((ing, idx) => ({
      id: `shop-miss-${Date.now()}-${idx}`,
      name: ing.name,
      category: 'Pantry & Dry Goods',
      quantity: ing.amount || '1 unit',
      notes: `Needed for ${recipeTitle}`,
      checked: false,
      estimatedPrice: 3.25,
      defaultLocation: 'Pantry',
      defaultShelfLifeDays: 14,
      sourceRecipe: recipeTitle,
      addedAt: new Date().toISOString()
    }));

    setShoppingList(prev => [...newItems, ...prev]);
  };

  // Quick navigation
  const handleCookItemFromPantry = (itemName: string) => {
    setPreSelectedIngredient(itemName);
    setCurrentTab('recipes');
  };

  const handleDonateItemFromPantry = (item: PantryItem) => {
    setPreSelectedDonationItem(item);
    setCurrentTab('donate');
  };

  // Custom AI recipe created
  const handleAddCustomRecipe = (recipe: Recipe) => {
    RECIPES_CATALOG.unshift(recipe);
  };

  // Apply cloud synced data from other device
  const handleApplySyncedData = (data: { inventory: PantryItem[]; shoppingList: ShoppingListItem[]; userStats: UserImpactStats }) => {
    setInventory(data.inventory);
    setShoppingList(data.shoppingList);
    setUserStats(data.userStats);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col antialiased text-stone-900 pb-20 md:pb-8">
      {/* Top Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab !== 'recipes') setPreSelectedIngredient(undefined);
          setCurrentTab(tab);
        }}
        inventory={inventory}
        shoppingList={shoppingList}
        currentUser={currentUser}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenTopSavers={() => setCurrentTab('top-savers')}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentTab === 'pantry' && (
          <PantryView
            inventory={inventory}
            onDeleteItem={handleDeleteItem}
            onUpdateItem={handleUpdateItem}
            onMarkRescued={handleMarkRescued}
            onNavigateToScanner={() => setCurrentTab('scanner')}
            onCookItem={handleCookItemFromPantry}
            onDonateItem={handleDonateItemFromPantry}
            onNavigateToTopSavers={() => setCurrentTab('top-savers')}
          />
        )}

        {currentTab === 'shopping-list' && (
          <ShoppingListView
            shoppingList={shoppingList}
            onAddShoppingItem={handleAddShoppingItem}
            onToggleCheckItem={handleToggleCheckShoppingItem}
            onDeleteShoppingItem={handleDeleteShoppingItem}
            onConvertBoughtToPantry={handleConvertBoughtToPantry}
            onNavigateToPantry={() => setCurrentTab('pantry')}
          />
        )}

        {currentTab === 'scanner' && (
          <ScannerView
            onAddItem={handleAddItem}
            onAddBatchItems={handleAddBatchItems}
            onNavigateToPantry={() => setCurrentTab('pantry')}
          />
        )}

        {currentTab === 'recipes' && (
          <RecipesView
            inventory={inventory}
            preSelectedIngredient={preSelectedIngredient}
            onClearPreSelectedIngredient={() => setPreSelectedIngredient(undefined)}
            onMealCooked={handleMealCooked}
            onOpenAiRecipeGenerator={() => setIsAiRecipeModalOpen(true)}
            onAddMissingToShoppingList={handleAddMissingToShoppingList}
          />
        )}

        {currentTab === 'donate' && (
          <DonationView
            inventory={inventory}
            preSelectedDonationItem={preSelectedDonationItem}
            onClearPreSelectedDonationItem={() => setPreSelectedDonationItem(null)}
            onDonationCompleted={handleDonationCompleted}
            onNavigateToTopSavers={() => setCurrentTab('top-savers')}
          />
        )}

        {currentTab === 'top-savers' && (
          <TopSaversView
            topSavers={topSavers}
            discountRewards={discountRewards}
            currentUserStats={userStats}
            onNavigateToRecipes={() => setCurrentTab('recipes')}
            onNavigateToDonate={() => setCurrentTab('donate')}
            onClaimReward={handleClaimReward}
          />
        )}

        {currentTab === 'account' && (
          <AccountView
            currentUser={currentUser}
            onLoginSuccess={(user) => setCurrentUser(user)}
            onLogout={() => setCurrentUser(null)}
            inventory={inventory}
            shoppingList={shoppingList}
            userStats={userStats}
            onApplySyncedData={handleApplySyncedData}
            onNavigateToPantry={() => setCurrentTab('pantry')}
          />
        )}
      </main>

      {/* Mobile Ergonomic Bottom Tab Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab !== 'recipes') setPreSelectedIngredient(undefined);
          setCurrentTab(tab);
        }}
        inventory={inventory}
        shoppingList={shoppingList}
      />

      {/* Expiry Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        inventory={inventory}
        onCookItem={handleCookItemFromPantry}
        onDonateItem={handleDonateItemFromPantry}
      />

      {/* Auth & Multi-Device Cloud Sync Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
        inventory={inventory}
        shoppingList={shoppingList}
        userStats={userStats}
        onApplySyncedData={handleApplySyncedData}
      />

      {/* Generative AI Custom Recipe Modal */}
      <AiRecipeModal
        isOpen={isAiRecipeModalOpen}
        onClose={() => setIsAiRecipeModalOpen(false)}
        inventory={inventory}
        onAddCustomRecipe={handleAddCustomRecipe}
        onAddMissingToShoppingList={handleAddMissingToShoppingList}
        onStartCooking={(recipe) => {
          handleMealCooked(recipe.ingredients.map(i => i.name), recipe.title);
        }}
      />
    </div>
  );
}
