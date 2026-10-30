import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Utensils, 
  Clock, 
  AlertCircle, 
  ChefHat, 
  ShoppingBag, 
  CheckCircle2, 
  RefreshCw,
  Flame,
  Check
} from 'lucide-react';
import { PantryItem, Recipe } from '../types/pantry';

interface AiRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: PantryItem[];
  onAddCustomRecipe: (recipe: Recipe) => void;
  onAddMissingToShoppingList: (ingredients: { name: string; amount: string }[], recipeTitle: string) => void;
  onStartCooking: (recipe: Recipe) => void;
}

export const AiRecipeModal: React.FC<AiRecipeModalProps> = ({
  isOpen,
  onClose,
  inventory,
  onAddCustomRecipe,
  onAddMissingToShoppingList,
  onStartCooking
}) => {
  const [mealType, setMealType] = useState('Dinner');
  const [maxTime, setMaxTime] = useState('25 minutes');
  const [dietary, setDietary] = useState('Any');
  const [customNotes, setCustomNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Find expiring items (sorted by daysLeft ascending)
  const expiringItems = inventory
    .filter(i => i.daysLeft <= 3 && i.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const handleGenerateRecipe = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setGeneratedRecipe(null);

    try {
      const res = await fetch('/api/ai/generate-custom-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pantryItems: inventory.map(i => ({ name: i.name, category: i.category, daysLeft: i.daysLeft })),
          expiringItems: expiringItems.map(i => ({ name: i.name, daysLeft: i.daysLeft })),
          dietaryPreferences: dietary,
          mealType,
          maxTime
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate recipe from AI.');
      }

      setGeneratedRecipe(data.recipe);
      onAddCustomRecipe(data.recipe);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to Gemini AI model.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMissing = () => {
    if (!generatedRecipe) return;
    const missing = generatedRecipe.ingredients.filter(ing => {
      const clean = ing.name.toLowerCase();
      return !inventory.some(item => 
        item.name.toLowerCase().includes(clean) || clean.includes(item.name.toLowerCase())
      );
    });

    onAddMissingToShoppingList(missing, generatedRecipe.title);
    setToastMessage(`Added ${missing.length} missing items to your shopping list!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-800 via-teal-900 to-stone-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-emerald-300">
                Powered by Gemini 3.8 Flash
              </span>
              <h3 className="text-xl font-extrabold text-white">
                AI Zero-Waste Chef
              </h3>
              <p className="text-xs text-stone-300">
                Creates custom gourmet recipes specifically prioritizing your closest-to-expiring groceries.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {toastMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!generatedRecipe ? (
            <div className="space-y-5">
              {/* Expiring Ingredients Targeted Banner */}
              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>Targeting Ingredients Closest to Expiring:</span>
                </div>
                {expiringItems.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {expiringItems.map(item => (
                      <span 
                        key={item.id}
                        className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-xs text-amber-900 font-semibold shadow-2xs"
                      >
                        {item.name} ({item.daysLeft === 0 ? 'Today' : `${item.daysLeft}d left`})
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500">
                    No items in your pantry are critically expiring. The AI will formulate a balanced meal from all available inventory.
                  </p>
                )}
              </div>

              {/* Preferences Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Meal Type</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Dinner">Dinner</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Breakfast">Breakfast / Brunch</option>
                    <option value="Fast Snack">Fast Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Max Cooking Time</label>
                  <select
                    value={maxTime}
                    onChange={(e) => setMaxTime(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  >
                    <option value="15 minutes">Under 15 mins (Speedy)</option>
                    <option value="25 minutes">Under 25 mins (Standard)</option>
                    <option value="45 minutes">Under 45 mins (Comfort)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Dietary Focus</label>
                  <select
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Any">Any Style</option>
                    <option value="High Protein">High Protein</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Dairy-Free">Dairy-Free</option>
                    <option value="Low Carb">Low Carb</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerateRecipe}
                disabled={isLoading}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini AI is crafting your recipe...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Generate Custom Recipe to Rescue Food</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* GENERATED RECIPE PREVIEW */
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-emerald-800 uppercase tracking-wider text-[10px]">
                    Custom AI Creation · {generatedRecipe.category}
                  </span>
                  <span className="font-mono text-stone-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {generatedRecipe.prepTime} prep · {generatedRecipe.cookTime} cook
                  </span>
                </div>
                <h3 className="text-xl font-black text-stone-900 tracking-tight">
                  {generatedRecipe.title}
                </h3>
                <div className="text-xs text-stone-500 mt-1 flex items-center gap-2 flex-wrap">
                  <span>{generatedRecipe.difficulty} difficulty</span>
                  <span>·</span>
                  <span>{generatedRecipe.servings} servings</span>
                  <span>·</span>
                  <span>{generatedRecipe.caloriesPerServing} kcal</span>
                </div>
              </div>

              {/* Chef Waste-Rescue Tip */}
              {generatedRecipe.tipsForExpiringFood && (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                  <ChefHat className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Chef's Waste-Saving Strategy:</div>
                    <p className="mt-0.5 leading-relaxed text-amber-900">
                      {generatedRecipe.tipsForExpiringFood}
                    </p>
                  </div>
                </div>
              )}

              {/* Ingredients */}
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                  Ingredients List
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {generatedRecipe.ingredients.map(ing => {
                    const match = inventory.find(i => 
                      i.name.toLowerCase().includes(ing.name.toLowerCase()) || 
                      ing.name.toLowerCase().includes(i.name.toLowerCase())
                    );

                    return (
                      <div 
                        key={ing.name}
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          match ? 'bg-emerald-50/60 border-emerald-200 text-stone-900' : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                      >
                        <span className="font-medium">{ing.name} ({ing.amount})</span>
                        {match ? (
                          <span className="text-[10px] font-semibold text-emerald-800 flex items-center gap-0.5">
                            <Check className="w-3 h-3 text-emerald-600" /> In Pantry
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400">Pantry staple</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                  Cooking Instructions
                </h4>
                <ol className="space-y-2.5">
                  {generatedRecipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2 border-t border-stone-100">
                <button
                  onClick={() => {
                    onStartCooking(generatedRecipe);
                    onClose();
                  }}
                  className="w-full sm:flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Cook This Recipe Now</span>
                </button>

                <button
                  onClick={handleAddMissing}
                  className="w-full sm:w-auto px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-stone-600" />
                  <span>Add Missing to Shopping List</span>
                </button>

                <button
                  onClick={() => setGeneratedRecipe(null)}
                  className="w-full sm:w-auto px-3 py-2.5 bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 font-semibold text-xs rounded-xl transition-colors"
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
