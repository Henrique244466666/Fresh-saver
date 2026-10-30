import React from 'react';
import { Bell, Sparkles, Award, ShoppingBag, User, Cloud, Smartphone, FileText } from 'lucide-react';
import { PantryItem, ShoppingListItem, AuthUser } from '../types/pantry';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  currentTab: 'pantry' | 'scanner' | 'recipes' | 'donate' | 'top-savers' | 'shopping-list' | 'account';
  onSelectTab: (tab: 'pantry' | 'scanner' | 'recipes' | 'donate' | 'top-savers' | 'shopping-list' | 'account') => void;
  inventory: PantryItem[];
  shoppingList: ShoppingListItem[];
  currentUser: AuthUser | null;
  onOpenNotifications: () => void;
  onOpenTopSavers: () => void;
  onOpenAuth: () => void;
  onOpenAndroidDownload: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  inventory,
  shoppingList,
  currentUser,
  onOpenNotifications,
  onOpenTopSavers,
  onOpenAuth,
  onOpenAndroidDownload
}) => {
  const { t } = useLanguage();
  const expiringSoonCount = inventory.filter(item => item.daysLeft <= 3 && item.daysLeft >= 0).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 md:gap-6 h-16">
          {/* Zone 1: Single text wordmark with minimal clean identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('pantry')}
              className="group flex items-center gap-2 text-left focus:outline-none"
              aria-label="FreshSaver Home"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-xs group-hover:bg-emerald-700 transition-colors">
                🍃
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-stone-900 group-hover:text-emerald-800 transition-colors">
                  FreshSaver
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Single-line navigation links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('pantry')}
              className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                currentTab === 'pantry'
                  ? 'bg-stone-100 text-stone-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {t('navPantry')} ({inventory.length})
            </button>

            <button
              onClick={() => onSelectTab('shopping-list')}
              className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 ${
                currentTab === 'shopping-list'
                  ? 'bg-stone-100 text-stone-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t('navShopping')} ({shoppingList.length})</span>
            </button>

            <button
              onClick={() => onSelectTab('scanner')}
              className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                currentTab === 'scanner'
                  ? 'bg-stone-100 text-stone-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {t('navScan')}
            </button>

            <button
              onClick={() => onSelectTab('recipes')}
              className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 ${
                currentTab === 'recipes'
                  ? 'bg-stone-100 text-stone-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('navRecipes')}</span>
            </button>

            <button
              onClick={() => onSelectTab('donate')}
              className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                currentTab === 'donate'
                  ? 'bg-stone-100 text-stone-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {t('navDonate')}
            </button>

            <button
              onClick={() => onSelectTab('top-savers')}
              className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 ${
                currentTab === 'top-savers'
                  ? 'bg-amber-50 text-amber-900 font-semibold ring-1 ring-amber-200'
                  : 'text-stone-700 hover:text-amber-800 hover:bg-amber-50/50'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('navTopSavers')}</span>
            </button>
          </nav>

          {/* Zone 3: Actions & Language Cluster */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Selector Dropdown */}
            <LanguageSelector compact={true} />

            {/* PDF Documentation Download */}
            <a
              href="/FreshSaver_App_Documentation.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="FreshSaver_App_Documentation.pdf"
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors border border-stone-200"
              title="Download comprehensive PDF feature guide"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('navGuidePdf')}</span>
            </a>

            {/* Android App & GitHub Download */}
            <button
              onClick={onOpenAndroidDownload}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white transition-all shadow-xs"
              title="Install Android App or compile APK from GitHub"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-100" />
              <span>{t('navAndroid')}</span>
            </button>

            {/* User Account / Sync Trigger */}
            <button
              onClick={() => onSelectTab('account')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                currentTab === 'account'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : currentUser
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
              title={currentUser ? `Logged in as ${currentUser.name}` : 'Sign in to sync pantry'}
            >
              {currentUser ? <Cloud className="w-3.5 h-3.5 text-emerald-600" /> : <User className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {currentUser ? `${currentUser.name.split(' ')[0]} (${t('navCloudSynced')})` : t('navSignInSync')}
              </span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center focus:outline-none"
              aria-label="View Expiration Alerts"
            >
              <Bell className="w-5 h-5" />
              {expiringSoonCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center leading-none">
                  {expiringSoonCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

