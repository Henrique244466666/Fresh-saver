import React from 'react';
import { ShieldAlert, Check, AlertTriangle } from 'lucide-react';
import { AllergyId } from '../types/pantry';
import { COMMON_ALLERGIES } from '../utils/allergyUtils';
import { useLanguage } from '../i18n/LanguageContext';

interface AllergySettingsCardProps {
  userAllergies: AllergyId[];
  onToggleAllergy: (allergyId: AllergyId) => void;
  onClearAllergies?: () => void;
}

export const AllergySettingsCard: React.FC<AllergySettingsCardProps> = ({
  userAllergies,
  onToggleAllergy,
  onClearAllergies
}) => {
  const { t } = useLanguage();

  const getAllergyLabel = (id: AllergyId): string => {
    switch (id) {
      case 'dairy': return t('allergyDairy');
      case 'wheat_gluten': return t('allergyWheatGluten');
      case 'peanuts': return t('allergyPeanuts');
      case 'tree_nuts': return t('allergyTreeNuts');
      case 'eggs': return t('allergyEggs');
      case 'soy': return t('allergySoy');
      case 'fish': return t('allergyFish');
      case 'shellfish': return t('allergyShellfish');
      case 'sesame': return t('allergySesame');
      default: return id;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <span>{t('allergyTitle')}</span>
              {userAllergies.length > 0 && (
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                  {userAllergies.length} {t('allergyActiveCount')}
                </span>
              )}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {t('allergySubtitle')}
            </p>
          </div>
        </div>

        {userAllergies.length > 0 && onClearAllergies && (
          <button
            type="button"
            onClick={onClearAllergies}
            className="text-xs text-stone-400 hover:text-stone-700 font-medium self-start sm:self-center transition-colors"
          >
            {t('allergyClearAll')}
          </button>
        )}
      </div>

      {/* Allergies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
        {COMMON_ALLERGIES.map((allergy) => {
          const isSelected = userAllergies.includes(allergy.id);
          const localizedLabel = getAllergyLabel(allergy.id);

          return (
            <button
              key={allergy.id}
              type="button"
              onClick={() => onToggleAllergy(allergy.id)}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-2.5 ${
                isSelected
                  ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/40 shadow-xs'
                  : 'bg-stone-50/60 border-stone-200 hover:bg-stone-100/70 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl shrink-0" role="img" aria-label={localizedLabel}>
                  {allergy.icon}
                </span>
                <span className={`text-xs font-semibold truncate ${
                  isSelected ? 'text-amber-950 font-bold' : 'text-stone-700'
                }`}>
                  {localizedLabel}
                </span>
              </div>

              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                isSelected
                  ? 'bg-amber-600 border-amber-600 text-white'
                  : 'border-stone-300 bg-white'
              }`}>
                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Safety Summary Banner */}
      {userAllergies.length > 0 ? (
        <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">{t('allergyProtectionActive')}</p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              {t('allergyProtectionDesc')}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-[11px] text-stone-400 text-center py-1">
          {t('allergyNoneSelected')}
        </div>
      )}
    </div>
  );
};
