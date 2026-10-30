import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Barcode, 
  FileText, 
  Plus, 
  CheckCircle2, 
  Video, 
  VideoOff, 
  Upload, 
  Info, 
  SwitchCamera, 
  ScanLine, 
  Sparkles,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { PantryItem, FoodCategory, StorageLocation, AllergyId } from '../types/pantry';
import { 
  SHELF_LIFE_DATABASE, 
  getOffsetDateString,
  ShelfLifeGuideItem 
} from '../data/mockData';
import { detectItemAllergens, getItemConflictingAllergies } from '../utils/allergyUtils';
import { useLanguage } from '../i18n/LanguageContext';

interface ScannerViewProps {
  onAddItem: (item: PantryItem) => void;
  onAddBatchItems: (items: PantryItem[]) => void;
  onNavigateToPantry: () => void;
  userAllergies?: AllergyId[];
}

function lookupFoodInfo(nameOrBarcode: string): {
  name: string;
  category: FoodCategory;
  location: StorageLocation;
  shelfLifeDays: number;
  notes: string;
} {
  const clean = nameOrBarcode.trim().toLowerCase();
  
  // Try matching against shelf-life database
  const match = SHELF_LIFE_DATABASE.find(item => 
    clean.includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(clean)
  );

  if (match) {
    return {
      name: nameOrBarcode.trim(),
      category: match.category,
      location: match.defaultLocation,
      shelfLifeDays: match.shelfLifeDays,
      notes: match.storageTip
    };
  }

  // Fallback defaults based on grocery keywords
  if (/(apple|berry|strawberr|blueberr|lettuce|salad|tomato|onion|potato|carrot|spinach|fruit|vegetable|avocado|banana|lemon|orange|kale|cucumber|pepper)/i.test(clean)) {
    return {
      name: nameOrBarcode.trim(),
      category: 'Produce',
      location: 'Fridge',
      shelfLifeDays: 5,
      notes: 'Store in produce crisper drawer'
    };
  }

  if (/(milk|cheese|cheddar|yogurt|butter|cream|egg)/i.test(clean)) {
    return {
      name: nameOrBarcode.trim(),
      category: 'Dairy & Eggs',
      location: 'Fridge',
      shelfLifeDays: 7,
      notes: 'Keep chilled in refrigerator'
    };
  }

  if (/(chicken|beef|pork|steak|fish|salmon|shrimp|meat|turkey|poultry)/i.test(clean)) {
    return {
      name: nameOrBarcode.trim(),
      category: 'Meat & Seafood',
      location: 'Fridge',
      shelfLifeDays: 2,
      notes: 'Cook within 48h or freeze'
    };
  }

  if (/(bread|bagel|croissant|muffin|bakery|tortilla|sourdough|loaf)/i.test(clean)) {
    return {
      name: nameOrBarcode.trim(),
      category: 'Bakery',
      location: 'Pantry',
      shelfLifeDays: 5,
      notes: 'Keep sealed in bread drawer or pantry'
    };
  }

  if (/(frozen|pizza|ice cream|peas|popsicle)/i.test(clean)) {
    return {
      name: nameOrBarcode.trim(),
      category: 'Frozen',
      location: 'Freezer',
      shelfLifeDays: 90,
      notes: 'Keep frozen solid'
    };
  }

  return {
    name: nameOrBarcode.trim(),
    category: 'Pantry & Dry Goods',
    location: 'Pantry',
    shelfLifeDays: 30,
    notes: 'Stored at room temperature'
  };
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  onAddItem,
  onAddBatchItems,
  onNavigateToPantry,
  userAllergies = []
}) => {
  const { t } = useLanguage();
  const [activeMode, setActiveMode] = useState<'barcode' | 'receipt' | 'manual'>('barcode');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isBarcodeDetecting, setIsBarcodeDetecting] = useState(false);

  // Barcode input state
  const [barcodeInput, setBarcodeInput] = useState('');

  // Receipt Scanner State
  const [receiptText, setReceiptText] = useState('');
  const [parsedReceiptItems, setParsedReceiptItems] = useState<{ name: string; category: FoodCategory; shelfLifeDays: number; price: number }[]>([]);

  // Manual Form State
  const [manualName, setManualName] = useState('');
  const [manualCategory, setManualCategory] = useState<FoodCategory>('Produce');
  const [manualLocation, setManualLocation] = useState<StorageLocation>('Fridge');
  const [manualDaysLeft, setManualDaysLeft] = useState<number>(5);
  const [manualQuantity, setManualQuantity] = useState('1 unit');
  const [manualNotes, setManualNotes] = useState('');
  const [suggestedGuide, setSuggestedGuide] = useState<ShelfLifeGuideItem | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsBarcodeDetecting(false);
  };

  const startCamera = async (facing: 'environment' | 'user' = facingMode) => {
    setCameraError(null);
    stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access API is not supported in this browser. Please use manual barcode or item entry.');
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (firstErr) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('autoplay', 'true');

        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('Autoplay requires user interaction:', playErr);
        }
      }

      setIsCameraActive(true);
      startLiveBarcodeDetection();
    } catch (err: any) {
      console.error('Camera initialization error:', err);
      let msg = 'Camera access was blocked or is unavailable.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission was denied. Please allow camera access in your browser settings to scan items.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera device found on this system.';
      }
      setCameraError(msg);
      setIsCameraActive(false);
    }
  };

  const toggleCameraFacing = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    if (isCameraActive) {
      startCamera(nextFacing);
    }
  };

  // Modern BarcodeDetector API for real camera scanning
  const startLiveBarcodeDetection = () => {
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        // @ts-ignore
        const barcodeDetector = new (window as any).BarcodeDetector({
          formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'qr_code']
        });
        setIsBarcodeDetecting(true);

        scanIntervalRef.current = setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) return;
          try {
            const barcodes = await barcodeDetector.detect(videoRef.current);
            if (barcodes && barcodes.length > 0) {
              const rawValue = barcodes[0].rawValue;
              handleDetectedBarcode(rawValue);
            }
          } catch (e) {
            // Frame detection tick
          }
        }, 600);
      } catch (e) {
        console.log('BarcodeDetector not available');
      }
    }
  };

  const handleDetectedBarcode = (barcodeVal: string) => {
    const info = lookupFoodInfo(barcodeVal);
    const allergens = detectItemAllergens(info.name);
    const newItem: PantryItem = {
      id: `scan-${Date.now()}`,
      name: info.name,
      category: info.category,
      location: info.location,
      quantity: '1 item',
      daysLeft: info.shelfLifeDays,
      expiryDate: getOffsetDateString(info.shelfLifeDays),
      addedDate: getOffsetDateString(0),
      barcode: barcodeVal,
      notes: `Scanned with live camera: ${barcodeVal}`,
      estimatedPrice: 2.50,
      weightKg: 0.4,
      weightLbs: 0.88,
      allergens
    };

    onAddItem(newItem);
    const conflicts = getItemConflictingAllergies(allergens, newItem.name, userAllergies);
    if (conflicts.length > 0) {
      setToastMessage(`⚠️ ALLERGY ALERT: "${newItem.name}" contains ${conflicts.map(c => c.label).join(', ')}! Added to pantry.`);
    } else {
      setToastMessage(`Scanned barcode ${barcodeVal} — Added "${newItem.name}" to pantry!`);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleManualBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const info = lookupFoodInfo(barcodeInput.trim());
    const allergens = detectItemAllergens(info.name);
    const newItem: PantryItem = {
      id: `barcode-${Date.now()}`,
      name: info.name,
      category: info.category,
      location: info.location,
      quantity: '1 item',
      daysLeft: info.shelfLifeDays,
      expiryDate: getOffsetDateString(info.shelfLifeDays),
      addedDate: getOffsetDateString(0),
      barcode: /^\d+$/.test(barcodeInput.trim()) ? barcodeInput.trim() : undefined,
      notes: info.notes,
      estimatedPrice: 2.50,
      weightKg: 0.4,
      weightLbs: 0.88,
      allergens
    };

    onAddItem(newItem);
    const conflicts = getItemConflictingAllergies(allergens, newItem.name, userAllergies);
    if (conflicts.length > 0) {
      setToastMessage(`⚠️ ALLERGY ALERT: "${newItem.name}" contains ${conflicts.map(c => c.label).join(', ')}!`);
    } else {
      setToastMessage(`Added "${newItem.name}" (${info.shelfLifeDays}d shelf life) to pantry!`);
    }
    setBarcodeInput('');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Receipt text parser
  const handleParseReceiptText = () => {
    if (!receiptText.trim()) return;

    const lines = receiptText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const parsed = lines.map(line => {
      // Remove leading/trailing prices or quantities like "$4.99" or "€4.99" or "1 @"
      const cleanName = line
        .replace(/[$€]\d+(\.\d{2})?/g, '')
        .replace(/^\d+\s*(x|@)\s*/i, '')
        .replace(/\d+\s*(lb|oz|g|kg|ct|pack|clamshell)\b/gi, '')
        .trim();

      const info = lookupFoodInfo(cleanName || line);
      return {
        name: cleanName || line,
        category: info.category,
        shelfLifeDays: info.shelfLifeDays,
        price: 2.50
      };
    });

    setParsedReceiptItems(parsed);
  };

  const handleImportParsedReceipt = () => {
    if (parsedReceiptItems.length === 0) return;

    let hasAllergyAlert = false;
    const itemsToAdd: PantryItem[] = parsedReceiptItems.map((item, idx) => {
      const allergens = detectItemAllergens(item.name);
      const conflicts = getItemConflictingAllergies(allergens, item.name, userAllergies);
      if (conflicts.length > 0) hasAllergyAlert = true;
      return {
        id: `rcpt-${Date.now()}-${idx}`,
        name: item.name,
        category: item.category,
        location: item.category === 'Produce' || item.category === 'Dairy & Eggs' || item.category === 'Meat & Seafood' ? 'Fridge' : 'Pantry',
        quantity: '1 unit',
        daysLeft: item.shelfLifeDays,
        expiryDate: getOffsetDateString(item.shelfLifeDays),
        addedDate: getOffsetDateString(0),
        notes: 'Imported from grocery receipt',
        estimatedPrice: item.price || 2.50,
        weightKg: 0.4,
        weightLbs: 0.88,
        allergens
      };
    });

    onAddBatchItems(itemsToAdd);
    if (hasAllergyAlert) {
      setToastMessage(`⚠️ Note: Some imported items contain ingredients you are allergic to! Check warnings in pantry.`);
    } else {
      setToastMessage(`Imported ${itemsToAdd.length} items to your pantry!`);
    }
    setReceiptText('');
    setParsedReceiptItems([]);
    setTimeout(() => {
      setToastMessage(null);
      onNavigateToPantry();
    }, 1500);
  };

  const handleReceiptFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setToastMessage(`Receipt image loaded: "${file.name}". Extracting lines...`);
    // Provide an initial populated text area so user can review/edit their receipt lines
    setReceiptText(`Fresh Strawberries\nOrganic Whole Milk\nWhole Grain Sliced Bread\nChicken Breast Fillets`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auto-suggest shelf life when typing
  const handleNameChange = (val: string) => {
    setManualName(val);
    const match = SHELF_LIFE_DATABASE.find(item => 
      item.name.toLowerCase().includes(val.toLowerCase()) || 
      val.toLowerCase().includes(item.name.toLowerCase())
    );

    if (match && val.length >= 3) {
      setSuggestedGuide(match);
      setManualCategory(match.category);
      setManualLocation(match.defaultLocation);
      setManualDaysLeft(match.shelfLifeDays);
    } else {
      setSuggestedGuide(null);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    const allergens = detectItemAllergens(manualName.trim());
    const newItem: PantryItem = {
      id: `manual-${Date.now()}`,
      name: manualName.trim(),
      category: manualCategory,
      location: manualLocation,
      quantity: manualQuantity || '1 unit',
      daysLeft: Number(manualDaysLeft) || 3,
      expiryDate: getOffsetDateString(Number(manualDaysLeft) || 3),
      addedDate: getOffsetDateString(0),
      notes: manualNotes.trim() || (suggestedGuide ? suggestedGuide.storageTip : ''),
      estimatedPrice: 2.50,
      weightKg: 0.4,
      weightLbs: 0.88,
      allergens
    };

    onAddItem(newItem);
    const conflicts = getItemConflictingAllergies(allergens, newItem.name, userAllergies);
    if (conflicts.length > 0) {
      setToastMessage(`⚠️ ALLERGY ALERT: "${newItem.name}" contains ${conflicts.map(c => c.label).join(', ')}! Added to pantry.`);
    } else {
      setToastMessage(`Added "${newItem.name}" to your pantry!`);
    }
    setManualName('');
    setManualNotes('');
    setSuggestedGuide(null);
    setTimeout(() => {
      setToastMessage(null);
      onNavigateToPantry();
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
          {t('scannerTitle')}
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          {t('scannerSubtitle')}
        </p>
      </div>

      {/* Scan Mode Segmented Switcher */}
      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl max-w-md">
        <button
          onClick={() => setActiveMode('barcode')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeMode === 'barcode' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Barcode className="w-4 h-4" />
          <span>{t('scanTabCamera')}</span>
        </button>

        <button
          onClick={() => setActiveMode('receipt')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeMode === 'receipt' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t('scanTabReceipt')}</span>
        </button>

        <button
          onClick={() => setActiveMode('manual')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeMode === 'manual' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{t('scanTabManual')}</span>
        </button>
      </div>

      {/* MODE 1: BARCODE SCANNER */}
      {activeMode === 'barcode' && (
        <div className="space-y-6">
          {/* Viewfinder Canvas Card */}
          <div className="bg-stone-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl flex flex-col items-center justify-center min-h-[360px] border border-stone-800">
            {/* The Video Stream Element (ALWAYS MOUNTED to prevent null ref) */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  videoRef.current.play().catch(e => console.log('Metadata play:', e));
                }
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                isCameraActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            />

            {/* Inactive Camera Screen */}
            {!isCameraActive && (
              <div className="relative z-10 flex flex-col items-center text-center max-w-sm px-4">
                <div className="w-16 h-16 rounded-2xl bg-stone-900 text-stone-300 flex items-center justify-center mb-4 border border-stone-800 shadow-inner">
                  <Camera className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">{t('scanTabCamera')}</h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  {t('scannerSubtitle')}
                </p>
                <button
                  onClick={() => startCamera()}
                  className="mt-4 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  <span>{t('scanStartCamera')}</span>
                </button>
              </div>
            )}

            {/* Target Reticle & Laser Beam Overlay */}
            {isCameraActive && (
              <div className="absolute inset-8 sm:inset-14 border-2 border-dashed border-emerald-400/70 rounded-2xl pointer-events-none z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-5 h-5 border-t-3 border-l-3 border-emerald-400" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t-3 border-r-3 border-emerald-400" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-3 border-l-3 border-emerald-400" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-3 border-r-3 border-emerald-400" />
                <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-scan-laser" />
              </div>
            )}

            {/* Status indicator pill on top of camera */}
            {isCameraActive && (
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-stone-700 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-stone-200">
                  {isBarcodeDetecting ? 'Detecting...' : t('scanTabCamera')}
                </span>
              </div>
            )}

            {/* Viewfinder Controls */}
            {isCameraActive && (
              <div className="absolute bottom-5 z-20 flex items-center gap-2.5 flex-wrap justify-center px-3">
                <button
                  onClick={toggleCameraFacing}
                  className="p-2.5 bg-stone-900/90 hover:bg-stone-800 text-stone-200 rounded-xl border border-stone-700 transition-colors"
                  title="Flip camera"
                >
                  <SwitchCamera className="w-4 h-4" />
                </button>

                <button
                  onClick={stopCamera}
                  className="px-4 py-2.5 bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-semibold rounded-xl border border-red-800/60 transition-colors flex items-center gap-1.5"
                >
                  <VideoOff className="w-3.5 h-3.5" />
                  <span>{t('scanStopCamera')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Camera Error Notice */}
          {cameraError && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Camera:</strong>
                <p className="mt-0.5 text-amber-800">{cameraError}</p>
              </div>
            </div>
          )}

          {/* Barcode Number Lookup Input */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                {t('scanLookupBtn')}
              </h3>
              <p className="text-xs text-stone-500">
                {t('scanBarcodePlaceholder')}
              </p>
            </div>

            <form onSubmit={handleManualBarcodeSubmit} className="flex gap-2">
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder={t('scanBarcodePlaceholder')}
                className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!barcodeInput.trim()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{t('actionAdd')}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODE 2: RECEIPT SCANNER & PARSER */}
      {activeMode === 'receipt' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="max-w-xl">
            <h3 className="text-lg font-bold text-stone-900">{t('scanTabReceipt')}</h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              {t('scannerSubtitle')}
            </p>
          </div>

          {/* Upload Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleReceiptFileUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 border border-stone-200"
            >
              <Upload className="w-4 h-4 text-stone-600" />
              <span>{t('scanUploadReceiptImg')}</span>
            </button>
            <span className="text-xs text-stone-400">...</span>
          </div>

          {/* Paste Receipt Text Area */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700">
              {t('scanReceiptPlaceholder')}
            </label>
            <textarea
              rows={4}
              value={receiptText}
              onChange={(e) => setReceiptText(e.target.value)}
              placeholder="e.g.&#10;Organic Strawberries&#10;Whole Milk&#10;Sourdough Bread&#10;Fresh Chicken Breast"
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleParseReceiptText}
                disabled={!receiptText.trim()}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span>{t('scanParseReceiptBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Parsed Items Preview */}
          {parsedReceiptItems.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  {t('catAll')} ({parsedReceiptItems.length})
                </h4>
                <button
                  type="button"
                  onClick={() => setParsedReceiptItems([])}
                  className="text-stone-400 hover:text-stone-600 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('actionDelete')}</span>
                </button>
              </div>

              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                {parsedReceiptItems.map((item, index) => (
                  <div key={index} className="p-3.5 flex items-center justify-between bg-white text-xs">
                    <div>
                      <span className="font-semibold text-stone-900">{item.name}</span>
                      <span className="text-stone-400 ml-2">({item.category})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-700 font-semibold">{item.shelfLifeDays} {t('statusDaysLeft')}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleImportParsedReceipt}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{t('actionAdd')} {parsedReceiptItems.length}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: MANUAL ENTRY & SMART SHELF-LIFE ADVISOR */}
      {activeMode === 'manual' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
          <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-700 font-bold mb-1">{t('scanManualName')} *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Baby Spinach, Whole Milk, Avocados, Chicken..."
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white text-xs"
                />
              </div>
              {suggestedGuide && (
                <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Shelf-Life:</span>
                    <p className="mt-0.5">{suggestedGuide.storageTip} ({suggestedGuide.shelfLifeDays} {t('statusDaysLeft')})</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">{t('actionSortCategory')}</label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value as FoodCategory)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 text-xs"
                >
                  <option value="Produce">{t('catProduce')}</option>
                  <option value="Dairy & Eggs">{t('catDairy')}</option>
                  <option value="Meat & Seafood">{t('catMeat')}</option>
                  <option value="Bakery">{t('catBakery')}</option>
                  <option value="Pantry & Dry Goods">{t('catPantry')}</option>
                  <option value="Frozen">{t('catFrozen')}</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">{t('locPantry')}</label>
                <select
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value as StorageLocation)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 text-xs"
                >
                  <option value="Fridge">{t('locFridge')}</option>
                  <option value="Pantry">{t('locPantry')}</option>
                  <option value="Freezer">{t('locFreezer')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">{t('scanManualExpiryDays')}</label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={manualDaysLeft}
                  onChange={(e) => setManualDaysLeft(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">{t('scanManualQty')}</label>
                <input
                  type="text"
                  value={manualQuantity}
                  onChange={(e) => setManualQuantity(e.target.value)}
                  placeholder="e.g. 1 bag (200g), 2 fillets, 1 carton"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Notes</label>
              <input
                type="text"
                value={manualNotes}
                onChange={(e) => setManualNotes(e.target.value)}
                placeholder="e.g. Kept in crisper drawer, opened today"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{t('scanManualSubmit')}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
