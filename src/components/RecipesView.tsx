import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Clock, 
  Check, 
  AlertCircle, 
  Flame, 
  Sparkles, 
  ChefHat, 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Recipe, PantryItem } from '../types/pantry';
import { RECIPES_CATALOG } from '../data/mockData';
import { ShoppingBag } from 'lucide-react';

interface RecipesViewProps {
  inventory: PantryItem[];
  preSelectedIngredient?: string;
  onClearPreSelectedIngredient?: () => void;
  onMealCooked: (usedIngredientNames: string[], recipeTitle: string) => void;
  onOpenAiRecipeGenerator: () => void;
  onAddMissingToShoppingList: (ingredients: { name: string; amount: string }[], recipeTitle: string) => void;
}

export const RecipesView: React.FC<RecipesViewProps> = ({
  inventory,
  preSelectedIngredient,
  onClearPreSelectedIngredient,
  onMealCooked,
  onOpenAiRecipeGenerator,
  onAddMissingToShoppingList
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Helper to check if ingredient is in user's active pantry
  const isIngredientInPantry = (ingredientName: string): PantryItem | undefined => {
    const cleanName = ingredientName.toLowerCase();
    return inventory.find(item => 
      item.daysLeft >= 0 && (
        item.name.toLowerCase().includes(cleanName) ||
        cleanName.includes(item.name.toLowerCase())
      )
    );
  };

  // Find recipes that rescue urgent items (daysLeft <= 2)
  const urgentItems = inventory.filter(i => i.daysLeft <= 2 && i.daysLeft >= 0);

  // Score recipes by:
  // 1. How many urgent items they rescue (weighted x 10)
  // 2. Total matched pantry ingredients (weighted x 2)
  const evaluatedRecipes = RECIPES_CATALOG.map(recipe => {
    let matchedCount = 0;
    let rescuedUrgentNames: string[] = [];

    recipe.ingredients.forEach(ing => {
      const pantryMatch = isIngredientInPantry(ing.name);
      if (pantryMatch) {
        matchedCount++;
        if (pantryMatch.daysLeft <= 2) {
          rescuedUrgentNames.push(pantryMatch.name);
        }
      }
    });

    const matchPercent = Math.round((matchedCount / recipe.ingredients.length) * 100);
    const score = (rescuedUrgentNames.length * 10) + matchedCount;

    return {
      ...recipe,
      matchedCount,
      totalCount: recipe.ingredients.length,
      matchPercent,
      rescuedUrgentNames,
      score
    };
  });

  // Sort: highest score first
  const sortedRecipes = [...evaluatedRecipes].sort((a, b) => {
    // If preSelectedIngredient is specified, prioritize recipes with it
    if (preSelectedIngredient) {
      const aHas = a.ingredients.some(i => i.name.toLowerCase().includes(preSelectedIngredient.toLowerCase()));
      const bHas = b.ingredients.some(i => i.name.toLowerCase().includes(preSelectedIngredient.toLowerCase()));
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
    }
    return b.score - a.score;
  });

  // Filter tags
  const tags = ['all', 'High Protein', 'Vegetarian', 'Quick & Easy', 'Zero Waste', 'Fast Dinner'];
  const filteredRecipes = sortedRecipes.filter(recipe => {
    if (selectedTag === 'all') return true;
    return recipe.tags.includes(selectedTag);
  });

  const handleStartTimer = (minutes: number) => {
    setTimerSeconds(minutes * 60);
    setIsTimerRunning(true);
  };

  const handleCookMeal = (recipe: Recipe) => {
    const matchedNames: string[] = [];
    recipe.ingredients.forEach(ing => {
      const match = isIngredientInPantry(ing.name);
      if (match) {
        matchedNames.push(match.name);
      }
    });

    onMealCooked(matchedNames, recipe.title);
    setToastMessage(`Delicious! Rescued ${matchedNames.length} pantry items and earned Top Saver points.`);
    setActiveRecipe(null);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
            Zero-Waste Recipe Suggestions
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Recipes automatically prioritized by the foods in your pantry that need to be eaten first.
          </p>
        </div>

        <button
          onClick={onOpenAiRecipeGenerator}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-center shrink-0 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Ask Gemini AI for Custom Recipe</span>
        </button>
      </div>

      {/* AI Chef Promo Callout */}
      <div className="p-4 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
            <ChefHat className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-teal-950">Have unique ingredients or dietary needs?</span>
            <p className="text-teal-800">
              Gemini 3.8 Flash can generate a tailor-made dish using your exact expiring pantry items right now.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenAiRecipeGenerator}
          className="px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-lg transition-colors shrink-0"
        >
          Generate Custom Meal
        </button>
      </div>

      {/* Pre-selected ingredient indicator banner */}
      {preSelectedIngredient && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Filtering recipes using your pantry item: <strong>{preSelectedIngredient}</strong></span>
          </div>
          <button
            onClick={onClearPreSelectedIngredient}
            className="text-emerald-700 hover:text-emerald-900 font-semibold underline text-xs"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Tag Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedTag === tag
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
            }`}
          >
            {tag === 'all' ? 'All Recipes' : tag}
          </button>
        ))}
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecipes.map(recipe => {
          const hasUrgentRescue = recipe.rescuedUrgentNames.length > 0;

          return (
            <div
              key={recipe.id}
              className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                hasUrgentRescue ? 'border-amber-300 ring-1 ring-amber-200' : 'border-stone-200'
              }`}
            >
              <div>
                {/* Visual Card Cover with CSS Art & Category Badge */}
                <div className="h-36 bg-gradient-to-br from-stone-800 via-stone-900 to-emerald-950 p-4 text-white relative flex flex-col justify-between overflow-hidden">
                  {/* Subtle Geometric Graphic Mesh */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px]" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-900/70 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      {recipe.category}
                    </span>
                    <span className="text-xs text-stone-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{recipe.cookTime}</span>
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                      {recipe.title}
                    </h3>
                    <div className="text-[11px] text-stone-300 mt-1 flex items-center gap-2">
                      <span>{recipe.difficulty}</span>
                      <span>·</span>
                      <span>{recipe.caloriesPerServing} kcal</span>
                      <span>·</span>
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>
                </div>

                {/* Urgent Rescue Alert Strip */}
                {hasUrgentRescue && (
                  <div className="bg-amber-50 px-4 py-2 border-b border-amber-200 text-xs text-amber-900 flex items-center gap-1.5 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span className="truncate">
                      Rescues: {recipe.rescuedUrgentNames.join(', ')}
                    </span>
                  </div>
                )}

                {/* Ingredients Match List */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500 font-medium">Pantry Ingredients Match:</span>
                    <span className="font-bold text-stone-900 font-mono">
                      {recipe.matchedCount} of {recipe.totalCount} in Pantry ({recipe.matchPercent}%)
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {recipe.ingredients.slice(0, 4).map((ing) => {
                      const inPantry = isIngredientInPantry(ing.name);
                      return (
                        <div 
                          key={ing.name} 
                          className="flex items-center justify-between text-xs py-1 border-b border-stone-50"
                        >
                          <span className={inPantry ? 'text-stone-900 font-medium' : 'text-stone-400'}>
                            {ing.name}
                          </span>
                          {inPantry ? (
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-xs flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" /> Have it
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-400">Pantry staple</span>
                          )}
                        </div>
                      );
                    })}
                    {recipe.ingredients.length > 4 && (
                      <div className="text-[11px] text-stone-400 pt-1">
                        + {recipe.ingredients.length - 4} more seasoning ingredients
                      </div>
                    )}
                  </div>

                  {recipe.tipsForExpiringFood && (
                    <p className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100 leading-relaxed">
                      💡 {recipe.tipsForExpiringFood}
                    </p>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => setActiveRecipe(recipe)}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Start Cooking & Rescue Food</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Recipe Modal with Step-by-Step Cooking Mode */}
      {activeRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity" 
            onClick={() => setActiveRecipe(null)} 
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-stone-900 text-white flex items-start justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                  {activeRecipe.category} · {activeRecipe.cookTime}
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1">
                  {activeRecipe.title}
                </h3>
                <p className="text-xs text-stone-300 mt-1">
                  {activeRecipe.servings} Servings · {activeRecipe.caloriesPerServing} Calories per serving
                </p>
              </div>
              <button
                onClick={() => setActiveRecipe(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Kitchen Timer Widget */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-stone-700">Kitchen Cooking Timer</div>
                  <div className="text-2xl font-mono font-bold text-stone-900 mt-0.5">
                    {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:
                    {(timerSeconds % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {timerSeconds === 0 ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStartTimer(5)}
                        className="px-2.5 py-1.5 text-xs font-semibold bg-white border border-stone-200 rounded-lg hover:bg-stone-100"
                      >
                        5 min
                      </button>
                      <button
                        onClick={() => handleStartTimer(10)}
                        className="px-2.5 py-1.5 text-xs font-semibold bg-white border border-stone-200 rounded-lg hover:bg-stone-100"
                      >
                        10 min
                      </button>
                      <button
                        onClick={() => handleStartTimer(15)}
                        className="px-2.5 py-1.5 text-xs font-semibold bg-white border border-stone-200 rounded-lg hover:bg-stone-100"
                      >
                        15 min
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className="p-2 bg-stone-900 text-white rounded-lg"
                      >
                        {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => {
                          setIsTimerRunning(false);
                          setTimerSeconds(0);
                        }}
                        className="p-2 bg-stone-200 text-stone-700 rounded-lg"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Ingredients Breakdown */}
              <div>
                <h4 className="text-sm font-bold text-stone-900 mb-3">Ingredients</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeRecipe.ingredients.map(ing => {
                    const match = isIngredientInPantry(ing.name);
                    return (
                      <div 
                        key={ing.name}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                          match ? 'bg-emerald-50/70 border-emerald-200 text-stone-900' : 'bg-stone-50 border-stone-200 text-stone-500'
                        }`}
                      >
                        <span className="font-medium">{ing.name} ({ing.amount})</span>
                        {match ? (
                          <span className="text-[10px] font-semibold text-emerald-800 flex items-center gap-0.5">
                            <Check className="w-3 h-3 text-emerald-600" /> In Pantry
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400">Needed</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div>
                <h4 className="text-sm font-bold text-stone-900 mb-3">Preparation Instructions</h4>
                <ol className="space-y-3">
                  {activeRecipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveRecipe(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-xl transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const missing = activeRecipe.ingredients.filter(ing => !isIngredientInPantry(ing.name));
                    onAddMissingToShoppingList(missing, activeRecipe.title);
                    setToastMessage(`Added ${missing.length} missing ingredients to Shopping List!`);
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="px-3 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-stone-600" />
                  <span>Add Missing to Shopping List</span>
                </button>
              </div>

              <button
                onClick={() => handleCookMeal(activeRecipe)}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Finished Cooking! (Log Food Saved)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
