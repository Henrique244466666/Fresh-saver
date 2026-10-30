import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  Github, 
  Check, 
  Copy, 
  Layers, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Wifi, 
  Camera 
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../i18n/LanguageContext';

interface AndroidDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidDownloadModal: React.FC<AndroidDownloadModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { isInstallable, isInstalled, isAndroid, install } = usePWAInstall();
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      const outcome = await install();
      if (outcome) {
        setInstallSuccess(true);
      }
    } finally {
      setIsInstalling(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(key);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const bubblewrapSnippet = `# 1. Clone repository from GitHub
git clone https://github.com/freshsaver-app/freshsaver.git
cd freshsaver

# 2. Install dependencies & build PWA
npm install
npm run build

# 3. Build signed Android APK using the included twa-manifest.json
npx @bubblewrap/cli build

# 4. Install onto your connected Android device
adb install app-release-signed.apk`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="android-modal-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-5 sm:p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-emerald-200 hover:text-white hover:bg-emerald-800/60 rounded-full transition-colors focus:outline-none"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-2xl shadow-inner">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200">
                  Android & GitHub Ready
                </span>
                {isInstalled && (
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-400 text-emerald-950">
                    Installed
                  </span>
                )}
              </div>
              <h2 id="android-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
                FreshSaver for Android
              </h2>
            </div>
          </div>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-2 max-w-lg">
            Download or install FreshSaver directly on your Android phone. Experience full offline caching, live camera scanning, and zero food waste.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-stone-800 text-sm">
          
          {/* Method 1: Instant Browser / WebAPK Installation */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-stone-900 text-base">
                    Method 1: Direct Browser Install (WebAPK)
                  </h3>
                </div>
                <p className="text-xs text-stone-600">
                  Instant install straight from your Android browser (Chrome, Edge, Samsung Internet). No Play Store required.
                </p>
              </div>
              <span className="text-[11px] font-semibold bg-emerald-700 text-white px-2.5 py-1 rounded-full shrink-0">
                Recommended
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-emerald-200/60 flex flex-col sm:flex-row items-center gap-3">
              {isInstalled || installSuccess ? (
                <div className="w-full py-2.5 px-4 bg-emerald-600 text-white rounded-lg flex items-center justify-center gap-2 font-medium text-xs sm:text-sm">
                  <Check className="w-4 h-4" />
                  <span>FreshSaver is Installed on this device!</span>
                </div>
              ) : isInstallable ? (
                <button
                  onClick={handleInstallClick}
                  disabled={isInstalling}
                  className="w-full sm:w-auto flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-lg font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{isInstalling ? 'Installing...' : 'Install FreshSaver on Android'}</span>
                </button>
              ) : (
                <div className="w-full p-3 bg-white/80 rounded-lg border border-emerald-200 text-xs text-stone-700">
                  <p className="font-semibold text-emerald-900 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    How to install on Chrome for Android:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 pl-1 text-stone-600">
                    <li>Tap the Chrome menu button (three vertical dots <span className="font-bold">⋮</span> at top right).</li>
                    <li>Select <span className="font-semibold text-stone-900">&quot;Install app&quot;</span> or <span className="font-semibold text-stone-900">&quot;Add to Home screen&quot;</span>.</li>
                    <li>Tap <span className="font-semibold text-stone-900">&quot;Install&quot;</span> — an Android native WebAPK is placed on your home screen.</li>
                  </ol>
                </div>
              )}
            </div>

            {/* Feature chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-emerald-200/50 text-[11px] text-stone-600">
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Full Offline Mode</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Live Barcode Cam</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Lightweight (~2MB)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Standalone Display</span>
              </div>
            </div>
          </div>

          {/* Method 2: Build APK from GitHub via Bubblewrap */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Github className="w-5 h-5 text-stone-900" />
                  <h3 className="font-bold text-stone-900 text-base">
                    Method 2: Compile Standalone APK from GitHub
                  </h3>
                </div>
                <p className="text-xs text-stone-600">
                  Build a signed Android <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">.apk</code> or <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">.aab</code> package using Google&apos;s official <strong>Bubblewrap CLI</strong> and the included <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">twa-manifest.json</code>.
                </p>
              </div>
            </div>

            {/* Code Block */}
            <div className="mt-3 relative">
              <pre className="bg-stone-900 text-stone-100 p-3.5 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed">
                {bubblewrapSnippet}
              </pre>
              <button
                onClick={() => copyToClipboard(bubblewrapSnippet, 'cli')}
                className="absolute top-2.5 right-2.5 p-1.5 rounded bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors flex items-center gap-1 text-[11px]"
                aria-label="Copy commands"
              >
                {copiedCmd === 'cli' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 text-xs text-stone-500 flex items-center justify-between">
              <span>Android package ID: <strong className="text-stone-700 font-mono">com.freshsaver.app</strong></span>
              <span className="text-emerald-700 font-medium">Pre-configured twa-manifest.json included</span>
            </div>
          </div>

          {/* Method 3: GitHub Actions APK CI/CD */}
          <div className="border border-stone-200 rounded-xl p-4 sm:p-5 bg-white">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 mb-2">
              <Download className="w-4 h-4 text-emerald-600" />
              Automated GitHub Releases Workflow
            </h4>
            <p className="text-xs text-stone-600 mb-3">
              This repository contains <code className="bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded text-[11px]">.github/workflows/build-apk.yml</code>. Whenever you push to GitHub, GitHub Actions compiles the PWA and automatically uploads the compiled Android APK as an artifact for instant download.
            </p>
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
              <span>Branch: <span className="font-mono text-stone-800">main</span></span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
                Workflow Ready
              </span>
            </div>
          </div>

          {/* Android App Specifications */}
          <div className="bg-stone-50 rounded-xl p-4 text-xs space-y-2 border border-stone-200">
            <h5 className="font-bold text-stone-800 uppercase tracking-wider text-[10px]">
              Android Application Specifications
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-stone-600">
              <div>
                <span className="block text-stone-400 text-[10px]">App Name</span>
                <span className="font-semibold text-stone-800">FreshSaver</span>
              </div>
              <div>
                <span className="block text-stone-400 text-[10px]">Target OS</span>
                <span className="font-semibold text-stone-800">Android 7.0+ (API 24+)</span>
              </div>
              <div>
                <span className="block text-stone-400 text-[10px]">Display Mode</span>
                <span className="font-semibold text-stone-800">Standalone (Full Screen)</span>
              </div>
              <div>
                <span className="block text-stone-400 text-[10px]">Orientation</span>
                <span className="font-semibold text-stone-800">Portrait Primary</span>
              </div>
              <div>
                <span className="block text-stone-400 text-[10px]">Theme Color</span>
                <span className="font-semibold text-emerald-700">#059669 (Emerald)</span>
              </div>
              <div>
                <span className="block text-stone-400 text-[10px]">Architecture</span>
                <span className="font-semibold text-stone-800">TWA &amp; Service Worker</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-stone-100 px-5 py-3.5 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            {isAndroid ? '📱 Android Device Detected' : '🌐 Browser Mode Active'}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            {t('voucherDone')}
          </button>
        </div>
      </div>
    </div>
  );
};
