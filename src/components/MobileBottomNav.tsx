import { 
  Package, 
  Barcode, 
  Utensils, 
  HeartHandshake, 
  Award,
  ShoppingBag
} from 'lucide-react';
import { PantryItem, ShoppingListItem } from '../types/pantry';
import { useLanguage } from '../i18n/LanguageContext';

interface MobileBottomNavProps {
  currentTab: 'pantry' | 'scanner' | 'recipes' | 'donate' | 'top-savers' | 'shopping-list' | 'account';
  onSelectTab: (tab: 'pantry' | 'scanner' | 'recipes' | 'donate' | 'top-savers' | 'shopping-list' | 'account') => void;
  inventory: PantryItem[];
  shoppingList: ShoppingListItem[];
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  inventory,
  shoppingList
}) => {
  const { t } = useLanguage();
  const expiringSoonCount = inventory.filter(item => item.daysLeft <= 3 && item.daysLeft >= 0).length;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg">
      <div className="grid grid-cols-6 items-center h-16 max-w-lg mx-auto px-1">
        {/* Pantry */}
        <button
          onClick={() => onSelectTab('pantry')}
          className={`relative min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'pantry' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
          aria-label="Pantry Tab"
        >
          <Package className="w-4 h-4" />
          <span className="text-[9px] tracking-tight mt-1 truncate max-w-full px-0.5">{t('navPantry')}</span>
          {expiringSoonCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* Shopping List */}
        <button
          onClick={() => onSelectTab('shopping-list')}
          className={`relative min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'shopping-list' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
          aria-label="Shopping List Tab"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-[9px] tracking-tight mt-1 truncate max-w-full px-0.5">{t('navShopping')}</span>
          {shoppingList.length > 0 && (
            <span className="absolute top-1 right-2 min-w-[14px] h-[14px] px-0.5 bg-emerald-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {shoppingList.length}
            </span>
          )}
        </button>

        {/* Scan Center Button */}
        <button
          onClick={() => onSelectTab('scanner')}
          className="relative min-h-[44px] flex flex-col items-center justify-center -mt-4 focus:outline-none"
          aria-label="Scanner Tab"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 border-2 border-white ${
            currentTab === 'scanner' ? 'bg-stone-900 text-white' : 'bg-emerald-600 text-white'
          }`}>
            <Barcode className="w-5 h-5" />
          </div>
          <span className={`text-[9px] tracking-tight mt-1 truncate max-w-full px-0.5 ${
            currentTab === 'scanner' ? 'text-stone-900 font-bold' : 'text-stone-500'
          }`}>
            {t('navScan')}
          </span>
        </button>

        {/* Recipes */}
        <button
          onClick={() => onSelectTab('recipes')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'recipes' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
          aria-label="Recipes Tab"
        >
          <Utensils className="w-4 h-4" />
          <span className="text-[9px] tracking-tight mt-1 truncate max-w-full px-0.5">{t('navRecipes')}</span>
        </button>

        {/* Donate */}
        <button
          onClick={() => onSelectTab('donate')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'donate' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
          aria-label="Donate Tab"
        >
          <HeartHandshake className="w-4 h-4" />
          <span className="text-[9px] tracking-tight mt-1 truncate max-w-full px-0.5">{t('navDonate')}</span>
        </button>

        {/* Top Savers */}
        <button
          onClick={() => onSelectTab('top-savers')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentTab === 'top-savers' ? 'text-amber-700 font-bold' : 'text-stone-500'
          }`}
          aria-label="Top Savers Tab"
        >
          <Award className="w-4 h-4" />
          <span className="text-[9px] tracking-tight mt-1 truncate max-w-full px-0.5">{t('navTopSavers')}</span>
        </button>
      </div>
    </nav>
  );
};

