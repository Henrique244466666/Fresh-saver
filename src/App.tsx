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
import { AndroidDownloadModal } from './components/AndroidDownloadModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { LanguageProvider } from './i18n/LanguageContext';
import { 
  PantryItem, 
  TopSaverUser, 
  DiscountReward, 
  UserImpactStats,
  ShoppingListItem,
  AuthUser,
  Recipe,
  AllergyId
} from './types/pantry';
import { 
  INITIAL_PANTRY, 
  INITIAL_TOP_SAVERS, 
  INITIAL_DISCOUNT_REWARDS,
  calculateDaysLeft,
  getOffsetDateString,
  RECIPES_CATALOG
} from './data/mockData';
import { detectItemAllergens } from './utils/allergyUtils';

const INITIAL_SHOPPING_LIST: ShoppingListItem[] = [];

export default function App() {
  // Navigation tab
  const [currentTab, setCurrentTab] = useState<'pantry' | 'scanner' | 'recipes' | 'donate' | 'top-savers' | 'shopping-list' | 'account'>('pantry');
  
  // User Personal Allergies State
  const [userAllergies, setUserAllergies] = useState<AllergyId[]>(() => {
    try {
      const saved = localStorage.getItem('freshsaver_user_allergies');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  
  // Modals & Drawers
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAiRecipeModalOpen, setIsAiRecipeModalOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);

  // Cross-feature filters
  const [preSelectedIngredient, setPreSelectedIngredient] = useState<string | undefined>(undefined);
  const [preSelectedDonationItem, setPreSelectedDonationItem] = useState<PantryItem | null>(null);

  // Authenticated user (default to null for real user login/signup)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('freshsaver_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.id !== 'usr-default-alex' && parsed.email !== 'alex.miller@example.com') {
          return parsed;
        }
      }
    } catch {}
    return null;
  });

  // LocalStorage-backed state for inventory (clean start without sample items)
  const [inventory, setInventory] = useState<PantryItem[]>(() => {
    try {
      const saved = localStorage.getItem('freshsaver_inventory');
      if (saved) {
        const parsed: PantryItem[] = JSON.parse(saved);
        // Exclude legacy mock items
        const realItems = parsed.filter(item => !item.id.startsWith('item-'));
        return realItems.map(item => ({
          ...item,
          daysLeft: calculateDaysLeft(item.expiryDate)
        }));
      }
    } catch {}
    return [];
  });

  // Shopping List (clean start without sample items)
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>(() => {
    try {
      const saved = localStorage.getItem('freshsaver_shopping_list');
      if (saved) {
        const parsed: ShoppingListItem[] = JSON.parse(saved);
        return parsed.filter(item => !item.id.startsWith('shop-'));
      }
    } catch {}
    return [];
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
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          rescuedKg: parsed.rescuedKg ?? (parsed.rescuedLbs ? Number((parsed.rescuedLbs * 0.453592).toFixed(1)) : 0),
          eurosSaved: parsed.eurosSaved ?? (parsed.dollarsSaved ?? 0),
          rescuedLbs: parsed.rescuedLbs ?? 0,
          dollarsSaved: parsed.dollarsSaved ?? 0,
          co2SavedKg: parsed.co2SavedKg ?? 0,
          itemsCooked: parsed.itemsCooked ?? 0,
          itemsDonated: parsed.itemsDonated ?? 0
        };
      }
    } catch {}
    return {
      rescuedKg: 0,
      eurosSaved: 0,
      rescuedLbs: 0,
      dollarsSaved: 0,
      co2SavedKg: 0,
      itemsCooked: 0,
      itemsDonated: 0
    };
  });

  const handleToggleAllergy = (allergyId: AllergyId) => {
    setUserAllergies(prev => {
      const next = prev.includes(allergyId)
        ? prev.filter(id => id !== allergyId)
        : [...prev, allergyId];
      try {
        localStorage.setItem('freshsaver_user_allergies', JSON.stringify(next));
      } catch {}
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          allergies: next
        });
      }
      return next;
    });
  };

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
  const recordFoodSaved = (kg: number, euros: number, type: 'cooked' | 'donated') => {
    const newKg = Number(((userStats.rescuedKg ?? 0) + kg).toFixed(1));
    const newEuros = Number(((userStats.eurosSaved ?? 0) + euros).toFixed(2));
    const newCo2 = Number((userStats.co2SavedKg + (kg * 3.1)).toFixed(1));

    const updatedStats: UserImpactStats = {
      rescuedKg: newKg,
      eurosSaved: newEuros,
      rescuedLbs: Number((newKg * 2.20462).toFixed(1)),
      dollarsSaved: Number((newEuros * 1.08).toFixed(2)),
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
          if (newKg >= 20) {
            newTier = 'Master Saver';
            newDiscount = '25% OFF';
          } else if (newKg >= 12) {
            newTier = 'Eco Champion';
            newDiscount = '15% OFF';
          } else if (newKg >= 7) {
            newTier = 'Conscious Consumer';
            newDiscount = '10% OFF';
          }

          return {
            ...u,
            rescuedKg: newKg,
            eurosSaved: newEuros,
            rescuedLbs: Number((newKg * 2.20462).toFixed(1)),
            dollarsSaved: Number((newEuros * 1.08).toFixed(2)),
            tier: newTier,
            eligibleDiscount: newDiscount
          };
        }
        return u;
      });

      return updated
        .sort((a, b) => (b.rescuedKg ?? b.rescuedLbs) - (a.rescuedKg ?? a.rescuedLbs))
        .map((user, index) => ({
          ...user,
          rank: index + 1
        }));
    });
  };

  const handleMarkRescued = (item: PantryItem, method: 'cooked' | 'donated') => {
    recordFoodSaved(item.weightKg ?? 0.4, item.estimatedPrice, method);
    handleDeleteItem(item.id);
  };

  const handleMealCooked = (usedIngredientNames: string[], _recipeTitle: string) => {
    let totalKg = 0;
    let totalEuros = 0;

    setInventory(prev => {
      const remaining: PantryItem[] = [];
      prev.forEach(item => {
        const matches = usedIngredientNames.some(name => 
          item.name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(item.name.toLowerCase())
        );

        if (matches) {
          totalKg += (item.weightKg ?? 0.4);
          totalEuros += item.estimatedPrice;
        } else {
          remaining.push(item);
        }
      });
      return remaining;
    });

    recordFoodSaved(totalKg > 0 ? totalKg : 0.5, totalEuros > 0 ? totalEuros : 4.50, 'cooked');
  };

  const handleDonationCompleted = (donatedItems: PantryItem[], _centerName: string) => {
    let totalKg = 0;
    let totalEuros = 0;

    const donatedIds = donatedItems.map(i => i.id);
    donatedItems.forEach(item => {
      totalKg += (item.weightKg ?? 0.4);
      totalEuros += item.estimatedPrice;
    });

    setInventory(prev => prev.filter(i => !donatedIds.includes(i.id)));
    recordFoodSaved(totalKg, totalEuros, 'donated');
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
      estimatedPrice: b.estimatedPrice || 2.50,
      weightKg: 0.4,
      weightLbs: 0.88,
      allergens: b.allergens || detectItemAllergens(b.name)
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
    <LanguageProvider>
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
          onOpenAndroidDownload={() => setIsAndroidModalOpen(true)}
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
              userAllergies={userAllergies}
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
              userAllergies={userAllergies}
            />
          )}

          {currentTab === 'scanner' && (
            <ScannerView
              onAddItem={handleAddItem}
              onAddBatchItems={handleAddBatchItems}
              onNavigateToPantry={() => setCurrentTab('pantry')}
              userAllergies={userAllergies}
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
              userAllergies={userAllergies}
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
              onOpenAndroidDownload={() => setIsAndroidModalOpen(true)}
              userAllergies={userAllergies}
              onToggleAllergy={handleToggleAllergy}
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
          userAllergies={userAllergies}
        />

        {/* Android & GitHub Download Modal */}
        <AndroidDownloadModal
          isOpen={isAndroidModalOpen}
          onClose={() => setIsAndroidModalOpen(false)}
        />

        {/* PWA Offline Mode Status Indicator */}
        <OfflineIndicator />
      </div>
    </LanguageProvider>
  );
}
