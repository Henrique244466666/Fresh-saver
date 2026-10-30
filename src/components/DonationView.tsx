import React, { useState } from 'react';
import { 
  HeartHandshake, 
  MapPin, 
  Clock, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  Navigation, 
  Sparkles, 
  Check, 
  X, 
  ArrowUpRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { DonationCenter, PantryItem } from '../types/pantry';
import { DONATION_CENTERS } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';

interface DonationViewProps {
  inventory: PantryItem[];
  preSelectedDonationItem?: PantryItem | null;
  onClearPreSelectedDonationItem?: () => void;
  onDonationCompleted: (donatedItems: PantryItem[], centerName: string) => void;
  onNavigateToTopSavers: () => void;
}

export const DonationView: React.FC<DonationViewProps> = ({
  inventory,
  preSelectedDonationItem,
  onClearPreSelectedDonationItem,
  onDonationCompleted,
  onNavigateToTopSavers
}) => {
  const { t } = useLanguage();
  const [selectedCenter, setSelectedCenter] = useState<DonationCenter | null>(DONATION_CENTERS[0]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showDirectionsModal, setShowDirectionsModal] = useState<boolean>(false);
  const [isLogDonationModalOpen, setIsLogDonationModalOpen] = useState<boolean>(false);
  const [selectedPantryItemIds, setSelectedPantryItemIds] = useState<string[]>(
    preSelectedDonationItem ? [preSelectedDonationItem.id] : []
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter centers
  const filteredCenters = DONATION_CENTERS.filter(center => {
    if (typeFilter === 'all') return true;
    return center.type === typeFilter;
  });

  // Calculate items eligible for donation (unopened, non-expired)
  const donatablePantryItems = inventory.filter(i => i.daysLeft >= 0);

  const toggleItemSelection = (id: string) => {
    if (selectedPantryItemIds.includes(id)) {
      setSelectedPantryItemIds(selectedPantryItemIds.filter(i => i !== id));
    } else {
      setSelectedPantryItemIds([...selectedPantryItemIds, id]);
    }
  };

  const handleConfirmDonation = () => {
    const donatedItems = inventory.filter(i => selectedPantryItemIds.includes(i.id));
    if (donatedItems.length === 0) return;

    const centerName = selectedCenter ? selectedCenter.name : 'Local Community Fridge';
    onDonationCompleted(donatedItems, centerName);

    setIsLogDonationModalOpen(false);
    setSelectedPantryItemIds([]);
    setToastMessage(`Donated ${donatedItems.length} items to ${centerName}! Top Saver points awarded.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast */}
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
            {t('donateTitle')}
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            {t('donateSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsLogDonationModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-2 self-start sm:self-center shrink-0"
        >
          <HeartHandshake className="w-4 h-4" />
          <span>{t('donateLogBtn')}</span>
        </button>
      </div>

      {/* Pre-selected donation item notice */}
      {preSelectedDonationItem && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Ready to donate: <strong>{preSelectedDonationItem.name}</strong> ({preSelectedDonationItem.category}). Check drop-off points below!</span>
          </div>
          <button
            onClick={() => setIsLogDonationModalOpen(true)}
            className="px-2.5 py-1 bg-emerald-700 text-white font-semibold rounded-lg text-xs hover:bg-emerald-800 transition-colors"
          >
            Confirm Drop-off
          </button>
        </div>
      )}

      {/* Interactive Map & Drop-off List Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Stylized Street Grid Map (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Drop-Off Radius Map</span>
            </span>
            <span className="text-stone-500 font-mono">3.0 mi radius</span>
          </div>

          {/* Map Canvas Visual */}
          <div className="relative h-72 sm:h-80 bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 flex items-center justify-center select-none">
            {/* Street Grid SVG Lines */}
            <svg className="absolute inset-0 w-full h-full stroke-stone-300 stroke-[1.5] opacity-60">
              <line x1="0" y1="25%" x2="100%" y2="25%" />
              <line x1="0" y1="55%" x2="100%" y2="55%" />
              <line x1="0" y1="80%" x2="100%" y2="80%" />
              <line x1="25%" y1="0" x2="25%" y2="100%" />
              <line x1="60%" y1="0" x2="60%" y2="100%" />
              <line x1="85%" y1="0" x2="85%" y2="100%" />
              {/* Radius concentric circles */}
              <circle cx="50%" cy="50%" r="50" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
              <circle cx="50%" cy="50%" r="105" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" opacity="0.25" />
            </svg>

            {/* Current User Location Pin */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
              <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md animate-ping opacity-60 absolute" />
              <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md" />
              <span className="text-[10px] font-bold text-blue-900 bg-white/90 px-1.5 py-0.2 rounded-xs shadow-xs mt-1 border border-stone-200">
                You
              </span>
            </div>

            {/* Donation Center Pins */}
            {filteredCenters.map(center => {
              const isSelected = selectedCenter?.id === center.id;

              return (
                <button
                  key={center.id}
                  onClick={() => setSelectedCenter(center)}
                  style={{
                    left: `${center.coordinates.x}%`,
                    top: `${center.coordinates.y}%`
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all flex flex-col items-center group focus:outline-none`}
                  title={center.name}
                >
                  <div className={`p-1.5 rounded-full shadow-lg transition-transform ${
                    isSelected 
                      ? 'bg-emerald-600 text-white scale-125 ring-4 ring-emerald-300/60' 
                      : 'bg-white text-stone-700 group-hover:scale-110 border border-stone-300'
                  }`}>
                    <HeartHandshake className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs mt-1 whitespace-nowrap ${
                    isSelected ? 'bg-stone-900 text-white' : 'bg-white/95 text-stone-800 border border-stone-200'
                  }`}>
                    {center.distance}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Center Summary Card */}
          {selectedCenter && (
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    {selectedCenter.type}
                  </span>
                  <h3 className="text-sm font-bold text-stone-900">{selectedCenter.name}</h3>
                  <p className="text-xs text-stone-600 mt-0.5">{selectedCenter.address}</p>
                </div>
                <button
                  onClick={() => setShowDirectionsModal(true)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors shrink-0"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Route</span>
                </button>
              </div>

              <div className="text-xs text-stone-600 flex items-center justify-between border-t border-emerald-100 pt-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-700" /> {selectedCenter.hours}
                </span>
                <span className="font-mono">{selectedCenter.phone}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Donation Locations List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Facility Type Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {['all', 'Community Fridge', 'Food Bank', 'Soup Kitchen', 'Food Rescue Hub'].map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  typeFilter === type
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {type === 'all' ? 'All Drop-offs' : type}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="space-y-4">
            {filteredCenters.map(center => {
              const isSelected = selectedCenter?.id === center.id;

              return (
                <div
                  key={center.id}
                  onClick={() => setSelectedCenter(center)}
                  className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer shadow-xs ${
                    isSelected ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {center.type}
                        </span>
                        <span className="text-xs font-bold text-stone-500">
                          · {center.distance} away
                        </span>
                        {center.verified && (
                          <span className="text-[11px] text-teal-700 flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" /> Verified Partner
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-stone-900 mt-1">
                        {center.name}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        {center.address}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCenter(center);
                        setShowDirectionsModal(true);
                      }}
                      className="p-2.5 bg-stone-100 hover:bg-emerald-100 hover:text-emerald-800 rounded-xl transition-colors shrink-0"
                      title="Get directions"
                    >
                      <Navigation className="w-4 h-4 text-stone-700" />
                    </button>
                  </div>

                  {/* Acceptance Guidelines */}
                  <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-emerald-900 flex items-center gap-1 mb-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> {t('donateAcceptedTitle')}:
                      </div>
                      <ul className="text-stone-600 space-y-0.5 text-[11px]">
                        {center.accepts.map((acc, i) => (
                          <li key={i}>• {acc}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="font-semibold text-stone-700 flex items-center gap-1 mb-1">
                        <X className="w-3.5 h-3.5 text-stone-400" /> {t('donateCannotAcceptTitle')}:
                      </div>
                      <ul className="text-stone-500 space-y-0.5 text-[11px]">
                        {center.cannotAccept.map((rej, i) => (
                          <li key={i}>• {rej}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Drop-off Instructions */}
                  <div className="mt-3 bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-[11px] text-stone-600 leading-relaxed">
                    <strong>Instructions:</strong> {center.dropOffInstructions}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Directions Modal */}
      {showDirectionsModal && selectedCenter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs" 
            onClick={() => setShowDirectionsModal(false)} 
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 z-10 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">Directions & Contact</h3>
              </div>
              <button 
                onClick={() => setShowDirectionsModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="font-bold text-stone-900">{selectedCenter.name}</div>
                <p className="text-stone-600 mt-0.5">{selectedCenter.address}</p>
                <p className="text-emerald-700 font-semibold mt-1">Distance: {selectedCenter.distance}</p>
              </div>

              <div>
                <span className="font-bold text-stone-800 block mb-1">Recommended Route:</span>
                <ol className="space-y-1.5 text-stone-600 list-decimal pl-4">
                  <li>Head North on Main St for 0.3 miles</li>
                  <li>Turn right onto Oak Grove Ave</li>
                  <li>Drop-off fridge is located next to community garden mural on your left</li>
                </ol>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <span>Phone: <strong>{selectedCenter.phone}</strong></span>
                <span>Hours: <strong>{selectedCenter.hours}</strong></span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowDirectionsModal(false);
                setIsLogDonationModalOpen(true);
              }}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
            >
              Log Food Items Dropped Off Here
            </button>
          </div>
        </div>
      )}

      {/* Log a Donation Workflow Modal */}
      {isLogDonationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs" 
            onClick={() => setIsLogDonationModalOpen(false)} 
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 z-10 space-y-5 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">Log Food Donation</h3>
                <p className="text-xs text-stone-500">
                  Select which items from your pantry you are dropping off.
                </p>
              </div>
              <button 
                onClick={() => setIsLogDonationModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Destination Drop-off Center
                </label>
                <select
                  value={selectedCenter?.id || DONATION_CENTERS[0].id}
                  onChange={(e) => {
                    const found = DONATION_CENTERS.find(c => c.id === e.target.value);
                    if (found) setSelectedCenter(found);
                  }}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                >
                  {DONATION_CENTERS.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type} - {c.distance})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  Select Pantry Items to Donate:
                </label>
                {donatablePantryItems.length === 0 ? (
                  <p className="text-xs text-stone-400 p-4 bg-stone-50 rounded-xl text-center">
                    No active items in your pantry. Scan groceries to start tracking!
                  </p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {donatablePantryItems.map(item => {
                      const isChecked = selectedPantryItemIds.includes(item.id);

                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleItemSelection(item.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                            isChecked 
                              ? 'bg-emerald-50 border-emerald-300' 
                              : 'bg-white border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                              isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'
                            }`}>
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <div>
                              <span className="font-semibold text-stone-900">{item.name}</span>
                              <span className="text-stone-500 ml-2">({item.category} · {item.quantity})</span>
                            </div>
                          </div>
                          <span className="text-stone-600 font-mono">
                            {(item.weightKg ?? 0.4).toFixed(1)} kg (€{item.estimatedPrice.toFixed(2)})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
              <span className="text-stone-600">
                Selected: <strong>{selectedPantryItemIds.length} item(s)</strong>
              </span>
              <span className="text-emerald-800 font-semibold">
                Awards +Top Saver Points
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setIsLogDonationModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                {t('actionCancel')}
              </button>
              <button
                disabled={selectedPantryItemIds.length === 0}
                onClick={handleConfirmDonation}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('donateConfirmDropOff')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
