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
  Sparkles
} from 'lucide-react';
import { PantryItem, FoodCategory, StorageLocation } from '../types/pantry';
import { formatHumanDate, calculateDaysLeft } from '../data/mockData';

interface PantryViewProps {
  inventory: PantryItem[];
  onDeleteItem: (id: string) => void;
  onUpdateItem: (item: PantryItem) => void;
  onMarkRescued: (item: PantryItem, method: 'cooked' | 'donated') => void;
  onNavigateToScanner: () => void;
  onCookItem: (itemName: string) => void;
  onDonateItem: (item: PantryItem) => void;
  onNavigateToTopSavers: () => void;
}

export const PantryView: React.FC<PantryViewProps> = ({
  inventory,
  onDeleteItem,
  onUpdateItem,
  onMarkRescued,
  onNavigateToScanner,
  onCookItem,
  onDonateItem,
  onNavigateToTopSavers
}) => {
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

  const getUrgencyBadge = (days: number) => {
    if (days < 0) {
      return {
        label: 'Expired',
        classes: 'text-stone-500 bg-stone-100 border-stone-300',
        dot: 'bg-stone-400'
      };
    }
    if (days === 0) {
      return {
        label: 'Expires Today',
        classes: 'text-red-800 bg-red-50 border-red-200 font-semibold',
        dot: 'bg-red-600'
      };
    }
    if (days === 1) {
      return {
        label: '1 Day Left',
        classes: 'text-red-700 bg-red-50/80 border-red-200 font-medium',
        dot: 'bg-red-500'
      };
    }
    if (days <= 3) {
      return {
        label: `${days} Days Left`,
        classes: 'text-amber-800 bg-amber-50 border-amber-200 font-medium',
        dot: 'bg-amber-500'
      };
    }
    return {
      label: `${days} Days Left`,
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
                {expiringSoonItems.length} item{expiringSoonItems.length > 1 ? 's' : ''} expiring within 72 hours
              </h2>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Save them from spoiling! Cook with suggested zero-waste recipes or donate unopened groceries to nearby community fridges.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => onCookItem(expiringSoonItems[0].name)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Suggested Recipes</span>
            </button>
            <button
              onClick={() => onDonateItem(expiringSoonItems[0])}
              className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
              <span>Find Drop-offs</span>
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
              FreshSaver Rewards Tier Active
            </div>
            <p className="text-xs sm:text-sm text-stone-200">
              You are in the <strong>Eco Champion tier (15% OFF)</strong>. Mark expiring food as cooked or donated to reach <strong>Master Saver (25% OFF)</strong>!
            </p>
          </div>
        </div>
        <button
          onClick={onNavigateToTopSavers}
          className="px-3.5 py-1.5 bg-white hover:bg-stone-100 text-stone-900 text-xs font-semibold rounded-lg transition-colors shrink-0"
        >
          View Top Savers & Coupons
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
              placeholder="Search groceries (e.g. Milk, Spinach, Chicken)..."
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
              <option value="expiry">Sort: Expiring Earliest</option>
              <option value="name">Sort: Alphabetical (A-Z)</option>
              <option value="category">Sort: Category</option>
              <option value="recent">Sort: Recently Added</option>
            </select>

            {/* Quick Add / Scan button */}
            <button
              onClick={onNavigateToScanner}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Groceries</span>
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
              {cat === 'all' ? 'All Items' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Items Count & Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          Showing <strong>{sortedItems.length}</strong> of {inventory.length} grocery items
        </span>
        <span className="text-[11px] text-stone-400">
          Sorted by urgency
        </span>
      </div>

      {/* Items List */}
      {sortedItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <Utensils className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-stone-900">No groceries match your search</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search terms or scan new groceries to start tracking shelf life.
          </p>
          <button
            onClick={onNavigateToScanner}
            className="mt-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Scan New Items</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {sortedItems.map(item => {
            const urgency = getUrgencyBadge(item.daysLeft);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-stone-200 hover:border-stone-300 transition-all shadow-xs flex flex-col justify-between"
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
                      </div>

                      {/* Clean Unboxed Metadata with · separator */}
                      <div className="text-xs text-stone-500 mt-1 flex items-center gap-2 flex-wrap">
                        <span>{item.category}</span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span>{item.location}</span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span>{item.quantity}</span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span>Exp: {formatHumanDate(item.expiryDate)}</span>
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
                        title="Edit shelf life or details"
                        aria-label="Edit item"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove item"
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
                    Est. value: <strong className="text-stone-700">${item.estimatedPrice.toFixed(2)}</strong> ({item.weightLbs} lbs)
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onCookItem(item.name)}
                      className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
                      title="Find waste-reducing recipes for this item"
                    >
                      <Utensils className="w-3 h-3 text-emerald-600" />
                      <span>Cook</span>
                    </button>

                    <button
                      onClick={() => onDonateItem(item)}
                      className="px-2.5 py-1 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors flex items-center gap-1"
                      title="Find local donation fridge or food bank"
                    >
                      <HeartHandshake className="w-3 h-3 text-emerald-600" />
                      <span>Donate</span>
                    </button>

                    <button
                      onClick={() => onMarkRescued(item, 'cooked')}
                      className="px-2.5 py-1 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1"
                      title="Mark as eaten & earn Top Saver points"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Ate It!</span>
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
              <h3 className="text-base font-bold text-stone-900">Edit Grocery Item</h3>
              <button 
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Item Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as FoodCategory })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Produce">Produce</option>
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                    <option value="Meat & Seafood">Meat & Seafood</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Pantry & Dry Goods">Pantry & Dry Goods</option>
                    <option value="Frozen">Frozen</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Storage Location</label>
                  <select
                    value={editingItem.location}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value as StorageLocation })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Fridge">Fridge</option>
                    <option value="Pantry">Pantry</option>
                    <option value="Freezer">Freezer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Quantity / Size</label>
                  <input
                    type="text"
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({ ...editingItem, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Expiration Date</label>
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
                <label className="block text-stone-600 font-semibold mb-1">Notes / Storage Tips</label>
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
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateItem(editingItem);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
