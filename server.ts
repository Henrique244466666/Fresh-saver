import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK with required telemetry headers
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Storage path for cloud synced users & pantries
const DATA_DIR = path.join(__dirname, '.data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CLOUD_SYNC_FILE = path.join(DATA_DIR, 'cloud_sync.json');
const SYNC_CODES_FILE = path.join(DATA_DIR, 'sync_codes.json');

function readJsonFile<T>(filePath: string, defaultVal: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as T;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return defaultVal;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// -------------------------------------------------------------
// 1. GENERATIVE AI: Custom Zero-Waste Recipe Generator Endpoint
// -------------------------------------------------------------
app.post('/api/ai/generate-custom-recipe', async (req: Request, res: Response) => {
  try {
    const { 
      pantryItems = [], 
      expiringItems = [], 
      dietaryPreferences = 'Any', 
      mealType = 'Dinner',
      maxTime = '30 minutes'
    } = req.body;

    if (!pantryItems || pantryItems.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one pantry ingredient.' });
    }

    const expiringNames = expiringItems.map((i: any) => `${i.name} (expires in ${i.daysLeft}d)`).join(', ');
    const allPantryNames = pantryItems.map((i: any) => i.name).join(', ');

    const prompt = `
Create an inspiring, delicious, and practical zero-waste recipe based on the user's available groceries.
PRIORITY REQUIREMENT: The recipe MUST actively prioritize using the ingredients closest to expiring!
- Urgently Expiring Ingredients (use as many as possible): ${expiringNames || 'None strictly urgent'}
- All Available Pantry Items: ${allPantryNames}
- Meal Type: ${mealType}
- Maximum Prep + Cooking Time: ${maxTime}
- Dietary Preferences: ${dietaryPreferences}

Rules:
1. Make sure the recipe relies primarily on the items listed above. Standard household seasonings like salt, pepper, cooking oil, and water are acceptable.
2. Provide precise measurements, realistic prep and cook times, and clear step-by-step cooking instructions.
3. Include an insightful "tipsForExpiringFood" field explaining how this recipe rescues the expiring produce/dairy/meat and prevents spoilage.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert executive chef and food waste reduction scientist. You create flavorful, accessible home-cooked recipes designed specifically to rescue ingredients nearing expiration.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Creative name of the recipe.' },
            prepTime: { type: Type.STRING, description: 'e.g. "10 min"' },
            cookTime: { type: Type.STRING, description: 'e.g. "20 min"' },
            difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Advanced'] },
            servings: { type: Type.NUMBER },
            caloriesPerServing: { type: Type.NUMBER },
            category: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'e.g. ["Zero Waste", "High Protein", "Kid Friendly"]'
            },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: 'Name of the ingredient' },
                  amount: { type: Type.STRING, description: 'e.g. "2 cups chopped" or "1 tbsp"' }
                },
                required: ['name', 'amount']
              }
            },
            instructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Step-by-step numbered cooking instructions.'
            },
            tipsForExpiringFood: {
              type: Type.STRING,
              description: 'Specific explanation of how this recipe rescues the closest-to-expiring ingredients.'
            }
          },
          required: [
            'title',
            'prepTime',
            'cookTime',
            'difficulty',
            'servings',
            'caloriesPerServing',
            'category',
            'tags',
            'ingredients',
            'instructions',
            'tipsForExpiringFood'
          ]
        }
      }
    });

    const jsonStr = response.text?.trim() || '{}';
    const recipeData = JSON.parse(jsonStr);

    res.json({
      success: true,
      recipe: {
        id: `ai-rec-${Date.now()}`,
        ...recipeData,
        isAiGenerated: true,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Error generating AI recipe:', error);
    res.status(500).json({ 
      error: 'Failed to generate recipe from AI.', 
      details: error?.message || String(error) 
    });
  }
});

// -------------------------------------------------------------
// 2. USER AUTHENTICATION & CLOUD DATA STORAGE API
// -------------------------------------------------------------
interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  lastLoginAt: string;
}

interface CloudUserData {
  userId: string;
  inventory: any[];
  shoppingList: any[];
  userStats: any;
  updatedAt: string;
}

// Quick password hash simulation
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `h_${Math.abs(hash)}_${str.length}`;
}

// Signup
app.post('/api/auth/signup', (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const users = readJsonFile<UserRecord[]>(USERS_FILE, []);
  const normalizedEmail = email.toLowerCase().trim();

  if (users.find(u => u.email === normalizedEmail)) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const newUser: UserRecord = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: simpleHash(password),
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };

  users.push(newUser);
  writeJsonFile(USERS_FILE, users);

  const token = `tok_${newUser.id}_${Date.now()}`;
  res.json({
    success: true,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      token
    }
  });
});

// Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const users = readJsonFile<UserRecord[]>(USERS_FILE, []);
  const normalizedEmail = email.toLowerCase().trim();
  const user = users.find(u => u.email === normalizedEmail && u.passwordHash === simpleHash(password));

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  user.lastLoginAt = new Date().toISOString();
  writeJsonFile(USERS_FILE, users);

  const token = `tok_${user.id}_${Date.now()}`;
  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      token
    }
  });
});

// Cloud Sync: Fetch user's cloud pantry & shopping list
app.get('/api/sync/data', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const userId = req.query.userId as string;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }

  const cloudStore = readJsonFile<Record<string, CloudUserData>>(CLOUD_SYNC_FILE, {});
  const data = cloudStore[userId] || null;

  res.json({
    success: true,
    data
  });
});

// Cloud Sync: Save user's cloud pantry & shopping list
app.post('/api/sync/data', (req: Request, res: Response) => {
  const { userId, inventory, shoppingList, userStats } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }

  const cloudStore = readJsonFile<Record<string, CloudUserData>>(CLOUD_SYNC_FILE, {});
  cloudStore[userId] = {
    userId,
    inventory: inventory || [],
    shoppingList: shoppingList || [],
    userStats: userStats || {},
    updatedAt: new Date().toISOString()
  };

  writeJsonFile(CLOUD_SYNC_FILE, cloudStore);

  res.json({
    success: true,
    updatedAt: cloudStore[userId].updatedAt
  });
});

// Multi-Device Sync Code: Generate a 6-digit sync code
app.post('/api/sync/code/generate', (req: Request, res: Response) => {
  const { userId, inventory, shoppingList, userStats } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }

  // Generate 6 digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const syncCodes = readJsonFile<Record<string, any>>(SYNC_CODES_FILE, {});

  syncCodes[code] = {
    code,
    userId,
    inventory: inventory || [],
    shoppingList: shoppingList || [],
    userStats: userStats || {},
    expiresAt: Date.now() + 1000 * 60 * 30 // valid for 30 minutes
  };

  writeJsonFile(SYNC_CODES_FILE, syncCodes);

  res.json({
    success: true,
    code,
    expiresInMinutes: 30
  });
});

// Multi-Device Sync Code: Claim on another device
app.post('/api/sync/code/claim', (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Sync code is required.' });
  }

  const syncCodes = readJsonFile<Record<string, any>>(SYNC_CODES_FILE, {});
  const record = syncCodes[code.trim()];

  if (!record) {
    return res.status(404).json({ error: 'Invalid or expired 6-digit sync code.' });
  }

  if (Date.now() > record.expiresAt) {
    delete syncCodes[code];
    writeJsonFile(SYNC_CODES_FILE, syncCodes);
    return res.status(410).json({ error: 'Sync code has expired. Please generate a new one.' });
  }

  res.json({
    success: true,
    data: {
      userId: record.userId,
      inventory: record.inventory,
      shoppingList: record.shoppingList,
      userStats: record.userStats,
      syncedAt: new Date().toISOString()
    }
  });
});

// -------------------------------------------------------------
// 3. VITE MIDDLEWARES & STATIC SERVING
// -------------------------------------------------------------
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FreshSaver full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
