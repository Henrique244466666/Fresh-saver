import React, { useState } from 'react';
import { X, AlertTriangle, Clock, CheckCircle2, BellRing, Utensils, HeartHandshake } from 'lucide-react';
import { PantryItem } from '../types/pantry';
import { formatHumanDate } from '../data/mockData';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: PantryItem[];
  onCookItem: (itemName: string) => void;
  onDonateItem: (item: PantryItem) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  inventory,
  onCookItem,
  onDonateItem,
}) => {
  const [notificationStatus, setNotificationStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [toastMessage, setToastMessage] = useState<string>('');

  if (!isOpen) return null;

  const urgentItems = inventory.filter(i => i.daysLeft <= 1 && i.daysLeft >= 0);
  const approachingItems = inventory.filter(i => i.daysLeft > 1 && i.daysLeft <= 3);
  const expiredItems = inventory.filter(i => i.daysLeft < 0);

  const handleRequestPushPermission = async () => {
    if (!('Notification' in window)) {
      setToastMessage('Web Notifications are not supported in this browser.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);
      if (permission === 'granted') {
        new Notification('FreshSaver Expiry Alert Enabled', {
          body: `You have ${urgentItems.length} item(s) expiring within 24 hours. We'll remind you before anything spoils!`,
          icon: '/favicon.ico'
        });
        setToastMessage('Browser notifications enabled successfully!');
      } else {
        setToastMessage('Notification permissions were declined.');
      }
    } catch {
      setToastMessage('Unable to configure notifications in this environment.');
    }
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleSendTestAlert = () => {
    if (urgentItems.length > 0) {
      setToastMessage(`Simulated Alert: "${urgentItems[0].name}" expires today! Suggested: Check 2 quick recipes.`);
    } else {
      setToastMessage('Simulated Alert: All your groceries are fresh for the next 3 days.');
    }
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Food Expiry Notifications</h2>
              <p className="text-xs text-stone-500">Live alerts & waste prevention</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
            aria-label="Close notifications drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {toastMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Urgent Items */}
          {urgentItems.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-900">
                  Critical Expiration ({urgentItems.length})
                </h3>
              </div>
              <div className="space-y-2.5">
                {urgentItems.map(item => (
                  <div 
                    key={item.id}
                    className="p-3 rounded-xl border border-red-200 bg-red-50/40 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-stone-900">{item.name}</h4>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {item.category} · {item.quantity} · {item.location}
                        </p>
                        <p className="text-xs font-semibold text-red-700 mt-1">
                          {item.daysLeft === 0 ? 'Expires Today' : 'Expires in 24 hours'} ({formatHumanDate(item.expiryDate)})
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            onCookItem(item.name);
                            onClose();
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap"
                        >
                          <Utensils className="w-3 h-3" />
                          <span>Cook</span>
                        </button>
                        <button
                          onClick={() => {
                            onDonateItem(item);
                            onClose();
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 rounded-lg border border-stone-200 flex items-center gap-1 transition-colors whitespace-nowrap"
                        >
                          <HeartHandshake className="w-3 h-3 text-emerald-600" />
                          <span>Donate</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approaching Expiry */}
          {approachingItems.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Expiring in 2-3 Days ({approachingItems.length})
                </h3>
              </div>
              <div className="space-y-2">
                {approachingItems.map(item => (
                  <div 
                    key={item.id}
                    className="p-3 rounded-xl border border-stone-200 bg-white hover:border-amber-300 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-stone-900">{item.name}</h4>
                      <p className="text-xs text-stone-500">
                        {item.quantity} · {item.daysLeft} days left · {formatHumanDate(item.expiryDate)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onCookItem(item.name);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200"
                    >
                      Ideas
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expired Items */}
          {expiredItems.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Past Expiration ({expiredItems.length})
              </h3>
              <div className="space-y-2">
                {expiredItems.map(item => (
                  <div 
                    key={item.id}
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-medium line-through">{item.name}</h4>
                      <p className="text-xs">
                        Expired {Math.abs(item.daysLeft)} days ago ({formatHumanDate(item.expiryDate)})
                      </p>
                    </div>
                    <span className="text-xs text-stone-400">Discarded</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {urgentItems.length === 0 && approachingItems.length === 0 && expiredItems.length === 0 && (
            <div className="text-center py-10">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
              <h3 className="text-base font-semibold text-stone-800">Everything is fresh!</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                No items in your pantry are expiring in the next 3 days. Keep scanning your groceries to stay ahead of spoilage.
              </p>
            </div>
          )}

          {/* Notification Preferences Card */}
          <div className="mt-6 p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Reminder Schedule
            </h4>
            <div className="text-xs text-stone-600 space-y-1.5">
              <div className="flex items-center justify-between">
                <span>Morning Fridge Check</span>
                <span className="font-semibold text-stone-800">8:00 AM</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Dinner Recipe Suggestions</span>
                <span className="font-semibold text-stone-800">5:30 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Urgent Expiry Threshold</span>
                <span className="font-semibold text-stone-800">48 Hours</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleRequestPushPermission}
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>
                  {notificationStatus === 'granted'
                    ? 'Browser Notifications Active'
                    : 'Enable Push Notifications'}
                </span>
              </button>
              <button
                onClick={handleSendTestAlert}
                className="w-full py-1.5 px-3 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors"
              >
                Send Test Expiry Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
