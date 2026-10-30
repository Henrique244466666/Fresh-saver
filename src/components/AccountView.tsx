import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Cloud, 
  Smartphone, 
  CheckCircle2, 
  RefreshCw, 
  Copy, 
  Check, 
  LogOut, 
  ShieldCheck, 
  ArrowRight, 
  KeyRound,
  AlertCircle,
  Database,
  Sparkles,
  Package,
  ShoppingBag,
  Award,
  FileText,
  Download,
  Globe
} from 'lucide-react';
import { AuthUser, PantryItem, ShoppingListItem, UserImpactStats, AllergyId } from '../types/pantry';
import { AllergySettingsCard } from './AllergySettingsCard';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface AccountViewProps {
  currentUser: AuthUser | null;
  onLoginSuccess: (user: AuthUser) => void;
  onLogout: () => void;
  inventory: PantryItem[];
  shoppingList: ShoppingListItem[];
  userStats: UserImpactStats;
  onApplySyncedData: (data: { inventory: PantryItem[]; shoppingList: ShoppingListItem[]; userStats: UserImpactStats }) => void;
  onNavigateToPantry: () => void;
  onOpenAndroidDownload?: () => void;
  userAllergies: AllergyId[];
  onToggleAllergy: (allergyId: AllergyId) => void;
  onClearAllergies?: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  currentUser,
  onLoginSuccess,
  onLogout,
  inventory,
  shoppingList,
  userStats,
  onApplySyncedData,
  onNavigateToPantry,
  onOpenAndroidDownload,
  userAllergies,
  onToggleAllergy,
  onClearAllergies
}) => {
  const { t } = useLanguage();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cross-device sync state
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [inputCode, setInputCode] = useState('');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [isClaimingCode, setIsClaimingCode] = useState(false);
  const [isSyncingNow, setIsSyncingNow] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const endpoint = authMode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
    const payload = authMode === 'signup' ? { name, email, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication request failed.');
      }

      onLoginSuccess(data.user);
      setSuccessMessage(authMode === 'signup' ? 'Account created! Cloud sync activated.' : 'Signed in! Cloud pantry loaded.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleManualSyncNow = async () => {
    if (!currentUser) return;
    setIsSyncingNow(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/sync/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          inventory,
          shoppingList,
          userStats
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error('Sync failed');
      }
      setSuccessMessage(`Cloud storage synced at ${new Date().toLocaleTimeString()}!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setErrorMessage('Unable to reach cloud sync service.');
    } finally {
      setIsSyncingNow(false);
    }
  };

  const handleGenerateDeviceCode = async () => {
    setIsGeneratingCode(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/sync/code/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id || 'guest-sync',
          inventory,
          shoppingList,
          userStats
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate code.');
      }
      setGeneratedCode(data.code);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating sync code.');
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleClaimDeviceCode = async (e: React.FormEvent) => {
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
        throw new Error(data.error || 'Invalid or expired 6-digit sync code.');
      }

      onApplySyncedData({
        inventory: data.data.inventory,
        shoppingList: data.data.shoppingList,
        userStats: data.data.userStats
      });

      setSuccessMessage('Successfully loaded pantry and shopping list from your other device!');
      setInputCode('');
      setTimeout(() => {
        setSuccessMessage(null);
        onNavigateToPantry();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sync with this code.');
    } finally {
      setIsClaimingCode(false);
    }
  };

  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Toast Alert */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2.5 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-center gap-2.5 shadow-sm animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
          {t('accountTitle')}
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          {t('accountSubtitle')}
        </p>
      </div>

      {/* VIEW 1: SIGNED IN USER DASHBOARD */}
      {currentUser ? (
        <div className="space-y-6">
          {/* Profile & Cloud Status Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                  {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-stone-900">{currentUser.name}</h2>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Cloud className="w-3 h-3 text-emerald-600" /> {t('accountCloudActive')}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">{currentUser.email}</p>
                  <p className="text-[11px] text-stone-400 font-mono mt-0.5">ID: {currentUser.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  onClick={handleManualSyncNow}
                  disabled={isSyncingNow}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingNow ? 'animate-spin' : ''}`} />
                  <span>{t('accountSyncNowBtn')}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('accountSignOutBtn')}</span>
                </button>
              </div>
            </div>

            {/* Cloud Storage Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>{t('accountPantrySynced')}</span>
                </div>
                <div className="text-2xl font-black text-stone-900 font-mono">
                  {inventory.length} <span className="text-xs text-stone-500 font-normal">{t('accountItemsCount')}</span>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span>{t('accountShoppingItems')}</span>
                </div>
                <div className="text-2xl font-black text-stone-900 font-mono">
                  {shoppingList.length} <span className="text-xs text-stone-500 font-normal">{t('accountItemsCount')}</span>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>{t('statRescuedKg')}</span>
                </div>
                <div className="text-2xl font-black text-stone-900 font-mono">
                  {(userStats.rescuedKg ?? (userStats.rescuedLbs ? userStats.rescuedLbs * 0.453592 : 0)).toFixed(1)}{' '}
                  <span className="text-xs text-stone-500 font-normal">
                    kg (€{(userStats.eurosSaved ?? (userStats.dollarsSaved ? userStats.dollarsSaved * 0.92 : 0)).toFixed(2)})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Allergies & Dietary Restrictions */}
          <AllergySettingsCard
            userAllergies={userAllergies}
            onToggleAllergy={onToggleAllergy}
            onClearAllergies={onClearAllergies}
          />

          {/* Cross-Device Sync Hub Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-stone-900">
                  {t('accountDeviceCodeTitle')}
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {t('accountSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Option A: Beam Out */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    {t('accountStep1Push')}
                  </span>
                  <h4 className="text-sm font-bold text-stone-900 mt-0.5">
                    {t('accountStep1Title')}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {t('accountStep1Desc')}
                  </p>
                </div>

                {generatedCode ? (
                  <div className="p-4 bg-white rounded-xl border border-stone-300 text-center space-y-2">
                    <span className="text-[10px] text-stone-400 font-mono">{t('accountOneTimeCode')}</span>
                    <div className="text-3xl font-black font-mono tracking-widest text-emerald-800">
                      {generatedCode}
                    </div>
                    <button
                      onClick={copyCode}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? t('accountCopied') : t('accountCopyCode')}</span>
                    </button>
                    <p className="text-[10px] text-stone-400">{t('accountValidMinutes')}</p>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateDeviceCode}
                    disabled={isGeneratingCode}
                    className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    {isGeneratingCode ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>{t('accountGenerateCodeBtn')}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Option B: Pull In */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    {t('accountStep2Pull')}
                  </span>
                  <h4 className="text-sm font-bold text-stone-900 mt-0.5">
                    {t('accountStep2Title')}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {t('accountStep2Desc')}
                  </p>
                </div>

                <form onSubmit={handleClaimDeviceCode} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                      placeholder={t('accountEnterCodePlaceholder')}
                      className="w-full px-4 py-2.5 text-center font-mono font-bold text-xl tracking-widest bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={inputCode.length !== 6 || isClaimingCode}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    {isClaimingCode ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>{t('accountConnectCodeBtn')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Android App & GitHub Card */}
            {onOpenAndroidDownload && (
              <div className="mt-5 p-4 sm:p-5 bg-gradient-to-r from-emerald-900 to-stone-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-xl shrink-0">
                    🤖
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      FreshSaver Android &amp; GitHub
                    </h4>
                    <p className="text-xs text-emerald-200/80 mt-0.5">
                      {t('accountAndroidBannerDesc')}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenAndroidDownload}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-xl transition-colors shrink-0 shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{t('accountGetAndroid')}</span>
                </button>
              </div>
            )}

            {/* Official PDF Documentation & Architecture Card */}
            <div className="p-4 sm:p-5 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <span>{t('accountPdfGuideTitle')}</span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">5 Pages</span>
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {t('accountPdfGuideDesc')}
                  </p>
                </div>
              </div>
              <a
                href="/FreshSaver_App_Documentation.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="FreshSaver_App_Documentation.pdf"
                className="w-full sm:w-auto px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl transition-colors shrink-0 shadow-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{t('accountDownloadPdfBtn')}</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 2: SIGN UP OR LOG IN FORM */
        <div className="space-y-6 max-w-xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="text-center max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 font-bold">
              <Cloud className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">
              {authMode === 'signup' ? t('accountSignUpBtn') : t('accountSignInBtn')}
            </h2>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              {t('accountSubtitle')}
            </p>
          </div>

          {/* Segmented Auth Selector */}
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'login' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              {t('accountSignInTab')}
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'signup' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              {t('accountSignUpTab')}
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
            {authMode === 'signup' && (
              <div>
                <label className="block text-stone-700 font-bold mb-1">{t('accountNameLabel')}</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Miller"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-stone-700 font-bold mb-1">{t('accountEmailLabel')}</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.miller@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">{t('accountPasswordLabel')}</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{authMode === 'signup' ? t('accountSignUpBtn') : t('accountSignInBtn')}</span>
                )}
              </button>
            </div>
          </form>

          {/* Benefits Bullet Points */}
          <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('accountMultiDeviceSync')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>{t('accountAutoCloudBackup')}</span>
            </div>
          </div>

          {/* Official PDF Documentation Link */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-600">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span className="font-semibold text-stone-800">{t('accountPdfGuideTitle')}</span>
            </div>
            <a
              href="/FreshSaver_App_Documentation.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="FreshSaver_App_Documentation.pdf"
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('accountDownloadPdfBtn')}</span>
            </a>
          </div>
        </div>

          {/* Guest Allergy Settings */}
          <AllergySettingsCard
            userAllergies={userAllergies}
            onToggleAllergy={onToggleAllergy}
            onClearAllergies={onClearAllergies}
          />
        </div>
      )}
    </div>
  );
};
