import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside aria-label="Network status" className="fixed bottom-18 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 text-stone-100 text-xs px-3.5 py-2 rounded-full shadow-lg border border-stone-700/60 backdrop-blur-sm flex items-center gap-2 animate-bounce">
      <WifiOff className="w-3.5 h-3.5 text-amber-400" />
      <span>Offline Mode active — pantry & shopping list saved locally</span>
    </aside>
  );
};
