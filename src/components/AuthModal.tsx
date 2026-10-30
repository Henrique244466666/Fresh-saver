import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Smartphone, 
  RefreshCw, 
  CheckCircle2, 
  Copy, 
  Check, 
  LogOut, 
  Cloud, 
  KeyRound,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { AuthUser, PantryItem, ShoppingListItem, UserImpactStats } from '../types/pantry';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onLoginSuccess: (user: AuthUser) => void;
  onLogout: () => void;
  inventory: PantryItem[];
  shoppingList: ShoppingListItem[];
  userStats: UserImpactStats;
  onApplySyncedData: (data: { inventory: PantryItem[]; shoppingList: ShoppingListItem[]; userStats: UserImpactStats }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  inventory,
  shoppingList,
  userStats,
  onApplySyncedData
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'sync'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Device sync code states
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [inputCode, setInputCode] = useState('');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [isClaimingCode, setIsClaimingCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
    const payload = mode === 'signup' ? { name, email, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed.');
      }

      onLoginSuccess(data.user);
      setSuccessMessage(mode === 'signup' ? 'Account created successfully!' : 'Signed in successfully!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSyncCode = async () => {
    setIsGeneratingCode(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/sync/code/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id || 'guest-user',
          inventory,
          shoppingList,
          userStats
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate sync code.');
      }
      setGeneratedCode(data.code);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate device sync code.');
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleClaimSyncCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setIsClaimingCode(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/sync/code/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inputCode.trim() })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to sync with this code.');
      }

      onApplySyncedData({
        inventory: data.data.inventory,
        shoppingList: data.data.shoppingList,
        userStats: data.data.userStats
      });

      setSuccessMessage('Pantry, shopping list & saver stats synced from other device!');
      setInputCode('');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to sync device code.');
    } finally {
      setIsClaimingCode(false);
    }
  };

  const copyCodeToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {currentUser ? 'My Account & Device Sync' : 'Sign in to FreshSaver'}
              </h3>
              <p className="text-xs text-stone-300">
                {currentUser ? currentUser.email : 'Sync your pantry across phones & computers'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-100 bg-stone-50/70 p-1">
          {currentUser ? (
            <>
              <button
                onClick={() => setMode('sync')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  mode === 'sync' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Multi-Device Sync</span>
              </button>
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  mode === 'login' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Account Profile</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  mode === 'login' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  mode === 'signup' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => setMode('sync')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 ${
                  mode === 'sync' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>Device Code</span>
              </button>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* MODE: LOGGED IN USER PROFILE */}
          {currentUser && mode === 'login' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Name:</span>
                  <span className="font-bold text-stone-900">{currentUser.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Email:</span>
                  <span className="font-semibold text-stone-900">{currentUser.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Cloud Status:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Cloud className="w-3.5 h-3.5" /> Synced & Active
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                <p className="font-medium">
                  Your {inventory.length} pantry items, {shoppingList.length} shopping list items, and {userStats.rescuedLbs} lbs rescued are safely stored in your cloud account.
                </p>
              </div>

              <button
                onClick={onLogout}
                className="w-full py-2.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>
            </div>
          )}

          {/* MODE: LOGIN & SIGNUP FORMS */}
          {(!currentUser || mode === 'signup') && mode !== 'sync' && (
            <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
              {mode === 'signup' && (
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Miller"
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-stone-700 font-bold mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>{mode === 'signup' ? 'Create Account & Sync Cloud' : 'Sign In & Load Cloud Pantry'}</span>
                  )}
                </button>
              </div>

              <div className="text-center pt-2 text-[11px] text-stone-500">
                {mode === 'signup' ? (
                  <span>
                    Already have an account?{' '}
                    <button 
                      type="button" 
                      onClick={() => setMode('login')} 
                      className="font-bold text-emerald-700 underline"
                    >
                      Log in
                    </button>
                  </span>
                ) : (
                  <span>
                    New to FreshSaver?{' '}
                    <button 
                      type="button" 
                      onClick={() => setMode('signup')} 
                      className="font-bold text-emerald-700 underline"
                    >
                      Sign up for free
                    </button>
                  </span>
                )}
              </div>
            </form>
          )}

          {/* MODE: MULTI-DEVICE SYNC WITH 6-DIGIT CODE */}
          {mode === 'sync' && (
            <div className="space-y-5 text-xs">
              {/* Option 1: Generate Code */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div>
                  <h4 className="font-bold text-stone-900">Sync TO Another Device</h4>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    Generate a 6-digit sync code to beam your pantry to your phone or tablet.
                  </p>
                </div>

                {generatedCode ? (
                  <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-mono">YOUR SYNC CODE</span>
                      <span className="text-2xl font-mono font-black text-stone-900 tracking-wider">
                        {generatedCode}
                      </span>
                    </div>
                    <button
                      onClick={copyCodeToClipboard}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-1 transition-colors"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateSyncCode}
                    disabled={isGeneratingCode}
                    className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    {isGeneratingCode ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Generate 6-Digit Device Code</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Option 2: Claim Code */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div>
                  <h4 className="font-bold text-stone-900">Sync FROM Another Device</h4>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    Enter the 6-digit code shown on your other computer or smartphone.
                  </p>
                </div>

                <form onSubmit={handleClaimSyncCode} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 849201"
                      className="flex-1 px-3 py-2 text-base font-mono font-bold tracking-widest text-center bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                    <button
                      type="submit"
                      disabled={inputCode.length !== 6 || isClaimingCode}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center gap-1"
                    >
                      {isClaimingCode ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <span>Load</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
