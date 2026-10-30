import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Utensils, 
  HeartHandshake, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Calendar, 
  Filter, 
  Edit3,
  X,
  MapPin,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { PantryItem, FoodCategory, StorageLocation, AllergyId } from '../types/pantry';
import { formatHumanDate, calculateDaysLeft } from '../data/mockData';
import { getItemConflictingAllergies } from '../utils/allergyUtils';
import { useLanguage } from '../i18n/LanguageContext';

interface PantryViewProps {
  inventory: PantryItem[];
  onDeleteItem: (id: string) => void;
  onUpdateItem: (item: PantryItem) => void;
  onMarkRescued: (item: PantryItem, method: 'cooked' | 'donated') => void;
  onNavigateToScanner: () => void;
  onCookItem: (itemName: string) => void;
  onDonateItem: (item: PantryItem) => void;
  onNavigateToTopSavers: () => void;
  userAllergies?: AllergyId[];
}

export const PantryView: React.FC<PantryViewProps> = ({
  inventory,
  onDeleteItem,
  onUpdateItem,
  onMarkRescued,
  onNavigateToScanner,
  onCookItem,
  onDonateItem,
  onNavigateToTopSavers,
  userAllergies = []
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'expiry' | 'name' | 'category' | 'recent'>('expiry');
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);
  const [notificationDismissed, setNotificationDismissed] = useState(false);

  // Critical item count
  const expiringSoonItems = inventory.filter(i => i.daysLeft <= 3 && i.daysLeft >= 0);

  // Filter & Sort
  const categories: (string | FoodCategory)[] = [
    'all',
    'Expiring Soon (≤3d)',
    'Produce',
    'Dairy & Eggs',
    'Meat & Seafood',
    'Bakery',
    'Pantry & Dry Goods'
  ];

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'Expiring Soon (≤3d)') return item.daysLeft <= 3 && item.daysLeft >= 0;
    return item.category === selectedCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'expiry') return a.daysLeft - b.daysLeft;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'category') return a.category.localeCompare(b.category);
    if (sortBy === 'recent') return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
    return 0;
  });

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'all': return t('catAll');
      case 'Expiring Soon (≤3d)': return t('catExpiringSoon');
      case 'Produce': return t('catProduce');
      case 'Dairy & Eggs': return t('catDairy');
      case 'Meat & Seafood': return t('catMeat');
      case 'Bakery': return t('catBakery');
      case 'Pantry & Dry Goods': return t('catPantry');
      case 'Frozen': return t('catFrozen');
      default: return cat;
    }
  };

  const getUrgencyBadge = (days: number) => {
    if (days < 0) {
      return {
        label: t('statusExpired'),
        classes: 'text-stone-500 bg-stone-100 border-stone-300',
        dot: 'bg-stone-400'
      };
    }
    if (days === 0) {
      return {
        label: t('statusExpiresToday'),
        classes: 'text-red-800 bg-red-50 border-red-200 font-semibold',
        dot: 'bg-red-600'
      };
    }
    if (days === 1) {
      return {
        label: t('status1DayLeft'),
        classes: 'text-red-700 bg-red-50/80 border-red-200 font-medium',
        dot: 'bg-red-500'
      };
    }
    if (days <= 3) {
      return {
        label: `${days} ${t('statusDaysLeft')}`,
        classes: 'text-amber-800 bg-amber-50 border-amber-200 font-medium',
        dot: 'bg-amber-500'
      };
    }
    return {
      label: `${days} ${t('statusDaysLeft')}`,
      classes: 'text-emerald-800 bg-emerald-50/80 border-emerald-200 font-normal',
      dot: 'bg-emerald-600'
    };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Expiry Warning Callout */}
      {expiringSoonItems.length > 0 && !notificationDismissed && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-amber-950">
                {t('pantryAlertHeadsUp')} ({expiringSoonItems.length})
              </h2>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                {t('pantryAlertMessage').replace('{count}', expiringSoonItems.length.toString())}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => onCookItem(expiringSoonItems[0].name)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>{t('actionCookItem')}</span>
            </button>
            <button
              onClick={() => onDonateItem(expiringSoonItems[0])}
              className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('actionDonateItem')}</span>
            </button>
            <button
              onClick={() => setNotificationDismissed(true)}
              className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg"
              title="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Saver Discount Promo Bar */}
      <div className="bg-stone-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-amber-400">
              {t('saversTitle')}
            </div>
            <p className="text-xs sm:text-sm text-stone-200">
              {t('saversSubtitle')}
            </p>
          </div>
        </div>
        <button
          onClick={onNavigateToTopSavers}
          className="px-3.5 py-1.5 bg-white hover:bg-stone-100 text-stone-900 text-xs font-semibold rounded-lg transition-colors shrink-0"
        >
          {t('saversLeaderboardTitle')}
        </button>
      </div>

      {/* Search, Filter & Action Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder={t('actionSearchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Sort selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs font-medium bg-white border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="expiry">{t('actionSortEarliest')}</option>
              <option value="name">{t('actionSortAlpha')}</option>
              <option value="category">{t('actionSortCategory')}</option>
              <option value="recent">{t('actionSortRecent')}</option>
            </select>

            {/* Quick Add / Scan button */}
            <button
              onClick={onNavigateToScanner}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>{t('actionAddGroceries')}</span>
            </button>
          </div>
        </div>

        {/* Category Pills / Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Items Count & Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          {t('pantryShowingCount').replace('{count}', sortedItems.length.toString()).replace('{total}', inventory.length.toString())}
        </span>
        <span className="text-[11px] text-stone-400">
          {t('actionSortEarliest')}
        </span>
      </div>

      {/* Items List */}
      {sortedItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3.5 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center text-2xl shadow-inner">
            🍃
          </div>
          <h3 className="text-lg font-bold text-stone-900">
            {inventory.length === 0 ? t('pantryEmptyTitle') : t('pantryEmptyTitle')}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            {inventory.length === 0 
              ? t('pantryEmptyDesc')
              : t('pantryEmptyDesc')}
          </p>
          <button
            onClick={onNavigateToScanner}
            className="mt-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('pantryAddFirstBtn')}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {sortedItems.map(item => {
            const urgency = getUrgencyBadge(item.daysLeft);
            const conflictingAllergies = getItemConflictingAllergies(item.allergens, item.name, userAllergies);
            const hasAllergyConflict = conflictingAllergies.length > 0;
            const itemWeightKg = item.weightKg ?? (item.weightLbs ? Number((item.weightLbs * 0.453592).toFixed(1)) : 0.4);

            return (
              <div
                key={item.id}
                className={`rounded-2xl p-4 border transition-all shadow-xs flex flex-col justify-between ${
                  hasAllergyConflict
                    ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-300/60'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-stone-900 tracking-tight">
                          {item.name}
                        </h3>
                        <span className={`text-[11px] px-2 py-0.5 rounded-md border ${urgency.classes} inline-flex items-center gap-1`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${urgency.dot}`} />
                          <span>{urgency.label}</span>
                        </span>
                        {hasAllergyConflict && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 border border-amber-300 font-bold inline-flex items-center gap-1 shadow-2xs">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span>{t('allergyWarningBadge')}: {conflictingAllergies.map(a => `${a.icon} ${a.label}`).join(', ')}</span>
                          </span>
                        )}
                      </div>

                      {/* Clean Unboxed Metadata with · separator */}
                      <div className="text-xs text-stone-500 mt-1 flex items-center gap-2 flex-wrap">
                        <span>{getCategoryLabel(item.category)}</span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span>{item.location === 'Fridge' ? t('locFridge') : item.location === 'Pantry' ? t('locPantry') : t('locFreezer')}</span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span>{item.quantity}</span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span>{formatHumanDate(item.expiryDate)}</span>
                      </div>

                      {item.notes && (
                        <p className="text-xs text-stone-600 mt-2 bg-stone-50/80 p-2 rounded-lg border border-stone-100">
                          {item.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                        title={t('actionEdit')}
                        aria-label="Edit item"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t('actionDelete')}
                        aria-label="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Action Row */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="text-[11px] text-stone-400">
                    {t('pantryEstValue')}: <strong className="text-stone-700">€{item.estimatedPrice.toFixed(2)}</strong> ({itemWeightKg} kg)
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onCookItem(item.name)}
                      className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
                      title={t('actionCookItem')}
                    >
                      <Utensils className="w-3 h-3 text-emerald-600" />
                      <span>{t('actionCook')}</span>
                    </button>

                    <button
                      onClick={() => onDonateItem(item)}
                      className="px-2.5 py-1 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors flex items-center gap-1"
                      title={t('actionDonateItem')}
                    >
                      <HeartHandshake className="w-3 h-3 text-emerald-600" />
                      <span>{t('actionDonate')}</span>
                    </button>

                    <button
                      onClick={() => onMarkRescued(item, 'cooked')}
                      className="px-2.5 py-1 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1"
                      title={t('actionMarkConsumed')}
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{t('actionMarkConsumed')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs" 
            onClick={() => setEditingItem(null)} 
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 p-6 z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900">{t('actionEdit')}</h3>
              <button 
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">{t('scanManualName')}</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">{t('actionSortCategory')}</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as FoodCategory })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Produce">{t('catProduce')}</option>
                    <option value="Dairy & Eggs">{t('catDairy')}</option>
                    <option value="Meat & Seafood">{t('catMeat')}</option>
                    <option value="Bakery">{t('catBakery')}</option>
                    <option value="Pantry & Dry Goods">{t('catPantry')}</option>
                    <option value="Frozen">{t('catFrozen')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">{t('locPantry')}</label>
                  <select
                    value={editingItem.location}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value as StorageLocation })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Fridge">{t('locFridge')}</option>
                    <option value="Pantry">{t('locPantry')}</option>
                    <option value="Freezer">{t('locFreezer')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">{t('scanManualQty')}</label>
                  <input
                    type="text"
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({ ...editingItem, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">{t('scanManualExpiryDays')}</label>
                  <input
                    type="date"
                    value={editingItem.expiryDate}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      const days = calculateDaysLeft(newDate);
                      setEditingItem({ ...editingItem, expiryDate: newDate, daysLeft: days });
                    }}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Notes</label>
                <input
                  type="text"
                  value={editingItem.notes || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                  placeholder="e.g. Keep sealed in crisper drawer"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                {t('actionCancel')}
              </button>
              <button
                onClick={() => {
                  onUpdateItem(editingItem);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
              >
                {t('actionSave')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
