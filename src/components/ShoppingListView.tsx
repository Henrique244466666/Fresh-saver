import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Check, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  Package, 
  Sparkles, 
  Calendar,
  X,
  Info
} from 'lucide-react';
import { ShoppingListItem, PantryItem, FoodCategory, StorageLocation } from '../types/pantry';
import { SHELF_LIFE_DATABASE, getOffsetDateString, formatHumanDate } from '../data/mockData';

interface ShoppingListViewProps {
  shoppingList: ShoppingListItem[];
  onAddShoppingItem: (item: ShoppingListItem) => void;
  onToggleCheckItem: (id: string) => void;
  onDeleteShoppingItem: (id: string) => void;
  onConvertBoughtToPantry: (boughtItems: ShoppingListItem[]) => void;
  onNavigateToPantry: () => void;
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  shoppingList,
  onAddShoppingItem,
  onToggleCheckItem,
  onDeleteShoppingItem,
  onConvertBoughtToPantry,
  onNavigateToPantry
}) => {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Produce');
  const [quantity, setQuantity] = useState('1 unit');
  const [notes, setNotes] = useState('');
  const [shelfLifeDays, setShelfLifeDays] = useState<number>(5);
  const [location, setLocation] = useState<StorageLocation>('Fridge');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-fill shelf-life when typing
  const handleNameChange = (val: string) => {
    setItemName(val);
    const match = SHELF_LIFE_DATABASE.find(item => 
      item.name.toLowerCase().includes(val.toLowerCase()) || 
      val.toLowerCase().includes(item.name.toLowerCase())
    );
    if (match && val.length >= 3) {
      setCategory(match.category);
      setLocation(match.defaultLocation);
      setShelfLifeDays(match.shelfLifeDays);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    const newItem: ShoppingListItem = {
      id: `shop-${Date.now()}`,
      name: itemName.trim(),
      category,
      quantity: quantity || '1 unit',
      notes: notes.trim(),
      checked: false,
      estimatedPrice: 3.50,
      defaultLocation: location,
      defaultShelfLifeDays: Number(shelfLifeDays) || 5,
      addedAt: new Date().toISOString()
    };

    onAddShoppingItem(newItem);
    setItemName('');
    setNotes('');
    setToastMessage(`Added "${newItem.name}" to shopping list`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const checkedItems = shoppingList.filter(i => i.checked);
  const uncheckedItems = shoppingList.filter(i => !i.checked);
  const estimatedTotal = shoppingList.reduce((acc, curr) => acc + (curr.estimatedPrice || 3.50), 0);

  const handleConfirmConversion = () => {
    if (checkedItems.length === 0) return;
    onConvertBoughtToPantry(checkedItems);
    setShowConfirmModal(false);
    setToastMessage(`Successfully moved ${checkedItems.length} purchased items to your active pantry!`);
    setTimeout(() => {
      setToastMessage(null);
      onNavigateToPantry();
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
            Smart Grocery Shopping List
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Check off items as you buy them in the aisle, then turn them directly into pantry products with active shelf-life tracking.
          </p>
        </div>

        {checkedItems.length > 0 && (
          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-center shrink-0 animate-pulse"
          >
            <Package className="w-4 h-4" />
            <span>Turn {checkedItems.length} Bought Items into Pantry</span>
          </button>
        )}
      </div>

      {/* Quick Add Form */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-stone-900">Add Items to Shopping List</h3>

        <form onSubmit={handleAddItem} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Item Name
              </label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Fresh Strawberries, Greek Yogurt, Olive Oil..."
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
              >
                <option value="Produce">Produce</option>
                <option value="Dairy & Eggs">Dairy & Eggs</option>
                <option value="Meat & Seafood">Meat & Seafood</option>
                <option value="Bakery">Bakery</option>
                <option value="Pantry & Dry Goods">Pantry & Dry Goods</option>
                <option value="Beverages">Beverages</option>
                <option value="Frozen">Frozen</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Quantity
              </label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1 unit, 500g, 1 carton"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="text-[11px] text-stone-500 flex items-center gap-2">
              <span>Auto-shelf life: <strong>{shelfLifeDays} days</strong></span>
              <span>·</span>
              <span>Location: <strong>{location}</strong></span>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to List</span>
            </button>
          </div>
        </form>
      </div>

      {/* Shopping List Items Container */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {/* Subheader with Cart Progress */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-700" />
            <span className="font-bold text-stone-900">
              Shopping Cart ({checkedItems.length}/{shoppingList.length} picked up)
            </span>
          </div>

          <div className="text-stone-500 font-mono">
            Est. total: <strong className="text-stone-800">${estimatedTotal.toFixed(2)}</strong>
          </div>
        </div>

        {shoppingList.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-stone-800">Your shopping list is empty</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Add items you plan to buy, or click "Add Missing Ingredients" from any recipe. Once you buy them, tap "Turn into Pantry" to auto-start expiry tracking!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {/* Unchecked Items (Need to Buy) */}
            {uncheckedItems.map(item => (
              <div
                key={item.id}
                onClick={() => onToggleCheckItem(item.id)}
                className="p-4 flex items-center justify-between gap-3 hover:bg-stone-50/70 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md border-2 border-stone-300 group-hover:border-emerald-500 flex items-center justify-center transition-colors bg-white">
                    {/* Empty box */}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-stone-900">{item.name}</span>
                    <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span>{item.category}</span>
                      <span>·</span>
                      <span>{item.quantity}</span>
                      <span>·</span>
                      <span>Est. shelf life: {item.defaultShelfLifeDays} days</span>
                      {item.sourceRecipe && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-700 font-medium">For {item.sourceRecipe}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-stone-500">
                    ${item.estimatedPrice.toFixed(2)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteShoppingItem(item.id);
                    }}
                    className="p-1.5 text-stone-300 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Checked Items (Bought in Cart) */}
            {checkedItems.length > 0 && (
              <div className="bg-emerald-50/40">
                <div className="px-4 py-2 bg-emerald-50 text-[11px] font-bold uppercase tracking-wider text-emerald-900 border-t border-b border-emerald-100 flex items-center justify-between">
                  <span>Picked Up / Bought ({checkedItems.length})</span>
                  <span className="text-emerald-700 normal-case font-semibold">
                    Ready to turn into pantry products
                  </span>
                </div>

                {checkedItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => onToggleCheckItem(item.id)}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-emerald-50/80 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-md bg-emerald-600 border-2 border-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-stone-900 line-through opacity-85">
                          {item.name}
                        </span>
                        <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-1.5">
                          <span>{item.category}</span>
                          <span>·</span>
                          <span>{item.quantity}</span>
                          <span>·</span>
                          <span className="text-emerald-800 font-medium">
                            Will expire in {item.defaultShelfLifeDays} days
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-stone-500">
                        ${item.estimatedPrice.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteShoppingItem(item.id);
                        }}
                        className="p-1.5 text-stone-300 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CONVERT BOUGHT ITEMS TO PANTRY MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs" 
            onClick={() => setShowConfirmModal(false)} 
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Turn Bought Items into Pantry Products
                  </h3>
                  <p className="text-xs text-stone-500">
                    Calculates expiration date starting today based on FoodKeeper shelf-life standards.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 border border-stone-200 rounded-2xl p-3 bg-stone-50/50">
              {checkedItems.map(item => {
                const calculatedDate = getOffsetDateString(item.defaultShelfLifeDays);

                return (
                  <div 
                    key={item.id}
                    className="p-3 bg-white rounded-xl border border-stone-200 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-stone-900">{item.name}</div>
                      <div className="text-[11px] text-stone-500">
                        {item.category} · {item.quantity} · {item.defaultLocation}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-emerald-700 block">
                        Expires in {item.defaultShelfLifeDays} days
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {formatHumanDate(calculatedDate)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                These items will be removed from your Shopping List and immediately tracked in your active Pantry with urgent notifications as they near expiration.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmConversion}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Move to Pantry Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
