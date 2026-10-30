import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  TrendingUp, 
  Store, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  ShoppingBag,
  ExternalLink,
  Info
} from 'lucide-react';
import { TopSaverUser, DiscountReward, SaverTier } from '../types/pantry';
import { DiscountVoucherModal } from './DiscountVoucherModal';

interface TopSaversViewProps {
  topSavers: TopSaverUser[];
  discountRewards: DiscountReward[];
  currentUserStats: {
    rescuedLbs: number;
    dollarsSaved: number;
    itemsCooked: number;
    itemsDonated: number;
  };
  onNavigateToRecipes: () => void;
  onNavigateToDonate: () => void;
  onClaimReward: (rewardId: string) => void;
}

export const TopSaversView: React.FC<TopSaversViewProps> = ({
  topSavers,
  discountRewards,
  currentUserStats,
  onNavigateToRecipes,
  onNavigateToDonate,
  onClaimReward
}) => {
  const [selectedReward, setSelectedReward] = useState<DiscountReward | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<'month' | 'all-time' | 'week'>('month');

  // Compute current user's dynamic values
  const currentUser = topSavers.find(u => u.isCurrentUser) || {
    id: 'usr-4',
    rank: 4,
    name: 'You (Alex Miller)',
    avatar: 'AM',
    tier: 'Eco Champion' as SaverTier,
    rescuedLbs: currentUserStats.rescuedLbs,
    dollarsSaved: currentUserStats.dollarsSaved,
    streakDays: 19,
    eligibleDiscount: '15% OFF',
    badge: '🌟 Zero Waste Chef'
  };

  const currentLbs = currentUserStats.rescuedLbs;
  
  // Calculate tier dynamically
  let calculatedTier: SaverTier = 'Rising Saver';
  let nextTierName = 'Conscious Consumer (10% OFF)';
  let nextTierLbs = 15;
  let activeDiscountLabel = '5% OFF';

  if (currentLbs >= 45) {
    calculatedTier = 'Master Saver';
    nextTierName = 'Max Tier Achieved!';
    nextTierLbs = 45;
    activeDiscountLabel = '25% OFF';
  } else if (currentLbs >= 25) {
    calculatedTier = 'Eco Champion';
    nextTierName = 'Master Saver (25% OFF)';
    nextTierLbs = 45;
    activeDiscountLabel = '15% OFF';
  } else if (currentLbs >= 15) {
    calculatedTier = 'Conscious Consumer';
    nextTierName = 'Eco Champion (15% OFF)';
    nextTierLbs = 25;
    activeDiscountLabel = '10% OFF';
  }

  const progressPercent = Math.min(100, Math.round((currentLbs / nextTierLbs) * 100));
  const lbsRemaining = Math.max(0, Number((nextTierLbs - currentLbs).toFixed(1)));

  // Filter rewards
  const categories = ['all', 'Produce & Groceries', 'Organic Markets', 'Bakery & Deli', 'Local Delivery'];
  const filteredRewards = discountRewards.filter(rew => {
    if (activeCategory === 'all') return true;
    return rew.category === activeCategory;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Intro */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-600/40">
            <Award className="w-3.5 h-3.5 text-emerald-300" />
            <span>Community Food Waste Rewards Program</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Top Savers Get Exclusive Grocery Discounts
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100 leading-relaxed">
            The more food you rescue from spoiling, the higher your saver tier. Save money on your monthly bills and unlock up to 25% OFF at participating grocers and organic markets.
          </p>
        </div>
      </div>

      {/* User Status & Tier Progress Card */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 font-bold text-2xl flex items-center justify-center shrink-0 border border-amber-200">
              #{currentUser.rank}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-stone-900">{currentUser.name}</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {calculatedTier}
                </span>
                <span className="text-xs font-medium text-stone-500 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  {currentUser.streakDays} day streak
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Active Reward Level: <strong className="text-emerald-700 font-bold">{activeDiscountLabel} Storewide</strong> · Total Rescued: <span className="font-mono font-bold text-stone-800">{currentLbs.toFixed(1)} lbs</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const eligible = discountRewards.find(r => currentLbs >= r.minLbsRequired);
                if (eligible) setSelectedReward(eligible);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Claim Active Discounts</span>
            </button>
            <button
              onClick={onNavigateToRecipes}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors"
            >
              Rescue Food in Recipes
            </button>
          </div>
        </div>

        {/* Tier Progress Bar */}
        <div className="mt-6 pt-5 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-stone-600">
              Next Tier: <strong className="text-stone-900">{nextTierName}</strong>
            </span>
            <span className="text-stone-500 font-mono">
              {currentLbs.toFixed(1)} / {nextTierLbs} lbs {lbsRemaining > 0 ? `(${lbsRemaining} lbs to unlock)` : '(Unlocked!)'}
            </span>
          </div>
          <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-stone-400 mt-2">
            <span>Rising (5%)</span>
            <span>Conscious (10% - 15 lbs)</span>
            <span>Eco Champion (15% - 25 lbs)</span>
            <span>Master Saver (25% - 45 lbs)</span>
          </div>
        </div>
      </div>

      {/* Discount Rewards Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Partner Grocery Discounts</h2>
            <p className="text-xs text-stone-500">
              Discounts unlock automatically as your food rescue weight grows.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat === 'all' ? 'All Partners' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRewards.map(reward => {
            const isUnlocked = currentLbs >= reward.minLbsRequired;

            return (
              <div 
                key={reward.id}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isUnlocked 
                    ? 'border-emerald-200 hover:shadow-md' 
                    : 'border-stone-200 opacity-85'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <Store className="w-3.5 h-3.5 text-stone-400" />
                      <span className="font-medium text-stone-700">{reward.partnerStore}</span>
                    </div>
                    {isUnlocked ? (
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" /> {reward.minLbsRequired} lbs req.
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="text-2xl font-black text-emerald-700 tracking-tight">
                      {reward.discountValue}
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {reward.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-400">
                    <span>Tier Required: <strong>{reward.minTier}</strong></span>
                  </div>
                </div>

                <div className="mt-5">
                  {isUnlocked ? (
                    <button
                      onClick={() => setSelectedReward(reward)}
                      className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>View Voucher & Barcode</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 bg-stone-100 text-stone-400 text-xs font-medium rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Save {(reward.minLbsRequired - currentLbs).toFixed(1)} more lbs</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Leaderboard */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Community Top Savers</h2>
            <p className="text-xs text-stone-500">
              Rankings based on verifiable food waste diverted from landfills.
            </p>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                timeframe === 'month' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                timeframe === 'week' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeframe('all-time')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                timeframe === 'all-time' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-xs font-semibold text-stone-400">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Saver</th>
                <th className="py-3 px-3">Tier Status</th>
                <th className="py-3 px-3 text-right">Food Rescued</th>
                <th className="py-3 px-3 text-right">Value Saved</th>
                <th className="py-3 px-3 text-right">Discount Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {topSavers.map(user => {
                const isUser = user.isCurrentUser;

                return (
                  <tr 
                    key={user.id}
                    className={`transition-colors ${
                      isUser ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-stone-50/50'
                    }`}
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        {user.rank === 1 && <span className="text-base">🥇</span>}
                        {user.rank === 2 && <span className="text-base">🥈</span>}
                        {user.rank === 3 && <span className="text-base">🥉</span>}
                        {user.rank > 3 && (
                          <span className="w-6 text-center text-xs font-mono font-bold text-stone-500">
                            #{user.rank}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isUser ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700'
                        }`}>
                          {user.avatar}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {isUser && (
                              <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded-xs">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400 font-normal">
                            {user.badge}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-xs">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-medium ${
                        user.tier === 'Master Saver' 
                          ? 'bg-amber-50 text-amber-900 border border-amber-200' 
                          : user.tier === 'Eco Champion' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        {user.tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-xs tabular-nums text-stone-900">
                      {user.rescuedLbs.toFixed(1)} lbs
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-xs tabular-nums text-emerald-700">
                      ${user.dollarsSaved.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-right text-xs">
                      <span className="font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                        {user.eligibleDiscount}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* How Discounts Work Banner */}
      <div className="bg-stone-100 rounded-2xl p-6 border border-stone-200 text-stone-700 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-700" />
          <h3 className="text-sm font-bold text-stone-900">
            How The FreshSaver Grocery Discount Program Works
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-600">
          <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1.5">
            <div className="font-bold text-stone-900">1. Scan & Track</div>
            <p className="leading-relaxed">
              Scan your grocery receipts or barcodes when you shop. FreshSaver logs your shelf-life and monitors expiry windows.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1.5">
            <div className="font-bold text-stone-900">2. Cook or Donate</div>
            <p className="leading-relaxed">
              Use suggested recipes to cook items expiring within 3 days, or drop off excess unopened food at verified community fridges.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1.5">
            <div className="font-bold text-stone-900">3. Unlock Store Discounts</div>
            <p className="leading-relaxed">
              Every pound diverted counts toward your saver tier. Redeem real partner grocery vouchers for up to 25% OFF your next checkout.
            </p>
          </div>
        </div>
      </div>

      {/* Voucher Modal */}
      {selectedReward && (
        <DiscountVoucherModal
          reward={selectedReward}
          onClose={() => setSelectedReward(null)}
          onMarkClaimed={(id) => onClaimReward(id)}
        />
      )}
    </div>
  );
};
