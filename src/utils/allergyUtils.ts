import { AllergyId, AllergyOption, Recipe } from '../types/pantry';

export const COMMON_ALLERGIES: AllergyOption[] = [
  {
    id: 'dairy',
    label: 'Dairy & Milk',
    icon: '🥛',
    keywords: [
      'milk', 'cheese', 'yogurt', 'butter', 'cream', 'whey', 'casein', 
      'lactose', 'parmesan', 'cheddar', 'mozzarella', 'sour cream', 
      'leche', 'queso', 'mantequilla', 'nata', 'leite', 'queijo', 
      '牛奶', '芝士', '奶酪', '黄油', '奶油', '酸奶'
    ]
  },
  {
    id: 'wheat_gluten',
    label: 'Wheat & Gluten',
    icon: '🌾',
    keywords: [
      'wheat', 'gluten', 'flour', 'bread', 'pasta', 'bagel', 'croissant',
      'sourdough', 'dough', 'barley', 'rye', 'spelt', 'semolina', 'couscous',
      'trigo', 'pan', 'harina', 'fariña', 'pão', 'farinha', 'massa',
      '小麦', '面粉', '面包', '面条', '麸质'
    ]
  },
  {
    id: 'peanuts',
    label: 'Peanuts',
    icon: '🥜',
    keywords: [
      'peanut', 'peanuts', 'peanut butter', 'cacahuete', 'cacahuate', 
      'maní', 'amendoim', 'cahuete', '花生', '花生酱'
    ]
  },
  {
    id: 'tree_nuts',
    label: 'Tree Nuts',
    icon: '🌰',
    keywords: [
      'almond', 'walnut', 'cashew', 'pecan', 'pistachio', 'hazelnut', 'macadamia',
      'almendra', 'nuez', 'anacardo', 'pistacho', 'avellana', 'amêndoa', 
      'noz', 'castanha', 'avelã', '坚果', '杏仁', '核桃', '腰果', '开心果', '榛子'
    ]
  },
  {
    id: 'eggs',
    label: 'Eggs',
    icon: '🥚',
    keywords: [
      'egg', 'eggs', 'egg white', 'egg yolk', 'mayonnaise', 'mayo', 
      'huevo', 'huevos', 'mayonesa', 'ovo', 'ovos', 'maionese', 
      'ouvo', 'ouvos', '鸡蛋', '蛋黄', '蛋白', '蛋类', '蛋黄酱'
    ]
  },
  {
    id: 'soy',
    label: 'Soy & Soya',
    icon: '🌱',
    keywords: [
      'soy', 'soya', 'tofu', 'edamame', 'soy sauce', 'soy milk', 'tempeh', 'miso',
      'soja', 'salsa de soja', 'molho de soja', '大豆', '黄豆', '豆腐', '酱油', '豆奶', '毛豆'
    ]
  },
  {
    id: 'fish',
    label: 'Fish',
    icon: '🐟',
    keywords: [
      'fish', 'salmon', 'tuna', 'cod', 'trout', 'halibut', 'sardine', 'anchovy',
      'pescado', 'salmón', 'atún', 'bacalao', 'sardina', 'peixe', 'bacalhau',
      'peixe', 'salmón', 'atún', 'bacallau', '鱼', '三文鱼', '金枪鱼', '鳕鱼', '沙丁鱼'
    ]
  },
  {
    id: 'shellfish',
    label: 'Crustaceans & Shellfish',
    icon: '🦐',
    keywords: [
      'shrimp', 'prawn', 'crab', 'lobster', 'clam', 'mussel', 'oyster', 'scallop',
      'marisco', 'gamba', 'langostino', 'cangrejo', 'mejillón', 'almeja',
      'camarão', 'lagosta', 'caranguejo', 'mexilhão', 'ostra', 'camarón',
      '虾', '蟹', '龙虾', '贝类', '生蚝', '蛤蜊', '海鲜'
    ]
  },
  {
    id: 'sesame',
    label: 'Sesame',
    icon: '🥯',
    keywords: [
      'sesame', 'tahini', 'sesame oil', 'sesame seed', 'sésamo', 'ajonjolí',
      'gergelim', '芝麻', '芝麻油', '芝麻酱'
    ]
  }
];

export function detectItemAllergens(nameOrText: string): AllergyId[] {
  if (!nameOrText) return [];
  const lower = nameOrText.toLowerCase();
  const detected: AllergyId[] = [];

  for (const allergy of COMMON_ALLERGIES) {
    for (const kw of allergy.keywords) {
      // Check word boundary or substring
      const regex = new RegExp(`(^|\\s|[.,()\\-/])${kw}($|\\s|[.,()\\-/]|s|es)`, 'i');
      if (regex.test(lower) || lower.includes(kw)) {
        if (!detected.includes(allergy.id)) {
          detected.push(allergy.id);
        }
        break;
      }
    }
  }

  return detected;
}

export function getItemConflictingAllergies(
  itemAllergens: AllergyId[] | undefined,
  itemName: string,
  userAllergies: AllergyId[]
): AllergyOption[] {
  if (!userAllergies || userAllergies.length === 0) return [];
  
  // Combine pre-stored allergens and dynamically detected allergens
  const detected = detectItemAllergens(itemName);
  const combinedAllergens = Array.from(new Set([...(itemAllergens || []), ...detected]));
  
  const conflicting = combinedAllergens.filter(a => userAllergies.includes(a));
  return COMMON_ALLERGIES.filter(opt => conflicting.includes(opt.id));
}

export function getRecipeConflictingAllergies(
  recipe: Recipe,
  userAllergies: AllergyId[]
): AllergyOption[] {
  if (!userAllergies || userAllergies.length === 0) return [];

  const textToScan = [
    recipe.title,
    recipe.category,
    ...(recipe.ingredients.map(i => i.name)),
    ...(recipe.instructions || [])
  ].join(' ');

  const detected = detectItemAllergens(textToScan);
  const combined = Array.from(new Set([...(recipe.allergens || []), ...detected]));

  const conflicting = combined.filter(a => userAllergies.includes(a));
  return COMMON_ALLERGIES.filter(opt => conflicting.includes(opt.id));
}
