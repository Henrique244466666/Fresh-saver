import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Barcode, 
  FileText, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Video, 
  VideoOff, 
  RefreshCw,
  ShoppingBag,
  Info,
  SwitchCamera,
  ScanLine
} from 'lucide-react';
import { PantryItem, FoodCategory, StorageLocation } from '../types/pantry';
import { 
  SCANNABLE_BARCODE_PRESETS, 
  SHELF_LIFE_DATABASE, 
  MOCK_RECEIPT_ITEMS, 
  getOffsetDateString,
  ShelfLifeGuideItem 
} from '../data/mockData';

interface ScannerViewProps {
  onAddItem: (item: PantryItem) => void;
  onAddBatchItems: (items: PantryItem[]) => void;
  onNavigateToPantry: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  onAddItem,
  onAddBatchItems,
  onNavigateToPantry
}) => {
  const [activeMode, setActiveMode] = useState<'barcode' | 'receipt' | 'manual'>('barcode');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isBarcodeDetecting, setIsBarcodeDetecting] = useState(false);

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
      setCameraError('Camera access API is not supported in this browser. You can use the barcode simulator.');
      return;
    }

    try {
      let stream: MediaStream;
      try {
        // Try requesting ideal facingMode (back camera on mobile)
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (firstErr) {
        // Fallback to any available video stream (e.g. desktop webcam)
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
          console.warn('Autoplay failed, user interaction needed:', playErr);
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
            // Ignore frame detection hiccups
          }
        }, 600);
      } catch (e) {
        console.log('BarcodeDetector initialization skipped');
      }
    }
  };

  const handleDetectedBarcode = (barcodeVal: string) => {
    // Match with sample presets or create new item
    const matched = SCANNABLE_BARCODE_PRESETS.find(p => p.barcode === barcodeVal);
    if (matched) {
      handleSimulateScan(matched);
    } else {
      const newItem: PantryItem = {
        id: `scan-${Date.now()}`,
        name: `Scanned Item (${barcodeVal.slice(-4)})`,
        category: 'Pantry & Dry Goods',
        location: 'Pantry',
        quantity: '1 item',
        daysLeft: 14,
        expiryDate: getOffsetDateString(14),
        addedDate: getOffsetDateString(0),
        barcode: barcodeVal,
        notes: `Scanned with live camera: ${barcodeVal}`,
        estimatedPrice: 3.99,
        weightLbs: 1.0
      };
      onAddItem(newItem);
      setToastMessage(`Detected barcode ${barcodeVal} — Added to pantry!`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleSimulateScan = (preset?: typeof SCANNABLE_BARCODE_PRESETS[0]) => {
    const itemToScan = preset || SCANNABLE_BARCODE_PRESETS[Math.floor(Math.random() * SCANNABLE_BARCODE_PRESETS.length)];

    const newItem: PantryItem = {
      id: `scanned-${Date.now()}`,
      name: itemToScan.name,
      category: itemToScan.category,
      location: itemToScan.location,
      quantity: itemToScan.quantity,
      daysLeft: itemToScan.daysLeft,
      expiryDate: getOffsetDateString(itemToScan.daysLeft),
      addedDate: getOffsetDateString(0),
      barcode: itemToScan.barcode,
      notes: `${itemToScan.brand} · ${itemToScan.notes}`,
      estimatedPrice: itemToScan.estimatedPrice,
      weightLbs: itemToScan.weightLbs
    };

    onAddItem(newItem);
    setToastMessage(`Scanned & added "${newItem.name}" (${itemToScan.daysLeft} days shelf life)`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleScanReceipt = () => {
    const batch = MOCK_RECEIPT_ITEMS.map((item, idx) => ({
      ...item,
      id: `rcpt-${Date.now()}-${idx}`
    }));

    onAddBatchItems(batch);
    setToastMessage(`Receipt verified: Successfully added 4 grocery items to your pantry!`);
    setTimeout(() => {
      setToastMessage(null);
      onNavigateToPantry();
    }, 2000);
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
      estimatedPrice: 3.50,
      weightLbs: 0.8
    };

    onAddItem(newItem);
    setToastMessage(`Added "${newItem.name}" to your pantry!`);
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
          Add Groceries & Scan Barcodes
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Scan item barcodes using your device camera, verify grocery receipts, or use smart shelf-life recommendations.
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
          <span>Barcode Scanner</span>
        </button>

        <button
          onClick={() => setActiveMode('receipt')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeMode === 'receipt' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Receipt OCR</span>
        </button>

        <button
          onClick={() => setActiveMode('manual')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeMode === 'manual' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Manual & Advisor</span>
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

            {/* Inactive Camera Placeholder Screen */}
            {!isCameraActive && (
              <div className="relative z-10 flex flex-col items-center text-center max-w-sm px-4">
                <div className="w-16 h-16 rounded-2xl bg-stone-900 text-stone-300 flex items-center justify-center mb-4 border border-stone-800 shadow-inner">
                  <Camera className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Live Camera Preview</h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  Click "Start Camera" below to activate your webcam or phone camera for real-time barcode scanning.
                </p>
              </div>
            )}

            {/* Target Reticle & Laser Beam Overlay */}
            <div className="absolute inset-8 sm:inset-14 border-2 border-dashed border-emerald-400/70 rounded-2xl pointer-events-none z-10 overflow-hidden">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t-3 border-l-3 border-emerald-400" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t-3 border-r-3 border-emerald-400" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-3 border-l-3 border-emerald-400" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-3 border-r-3 border-emerald-400" />
              
              {/* Animated Laser line */}
              <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-scan-laser" />
            </div>

            {/* Status indicator pill on top of camera */}
            {isCameraActive && (
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-stone-700 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-stone-200">
                  {isBarcodeDetecting ? 'Live Auto-Detect Active' : 'Camera Running'}
                </span>
              </div>
            )}

            {/* Viewfinder Controls */}
            <div className="absolute bottom-5 z-20 flex items-center gap-2.5 flex-wrap justify-center px-3">
              {isCameraActive ? (
                <>
                  <button
                    onClick={() => handleSimulateScan()}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-1.5"
                  >
                    <ScanLine className="w-4 h-4" />
                    <span>Snap & Identify Food</span>
                  </button>

                  <button
                    onClick={toggleCameraFacing}
                    className="p-2.5 bg-stone-900/90 hover:bg-stone-800 text-stone-200 rounded-xl border border-stone-700 transition-colors"
                    title="Flip camera (front / back)"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>

                  <button
                    onClick={stopCamera}
                    className="px-3.5 py-2.5 bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-semibold rounded-xl border border-red-800/60 transition-colors flex items-center gap-1.5"
                  >
                    <VideoOff className="w-3.5 h-3.5" />
                    <span>Stop Camera</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startCamera()}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Start Live Camera</span>
                  </button>

                  <button
                    onClick={() => handleSimulateScan()}
                    className="px-4 py-2.5 bg-stone-800/90 hover:bg-stone-800 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 transition-colors flex items-center gap-1.5"
                  >
                    <Barcode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Instant Sample Scan</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Camera Error Message */}
          {cameraError && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Camera Access Notice:</strong>
                <p className="mt-0.5 text-amber-800">{cameraError}</p>
                <p className="mt-1 text-stone-600">
                  Tip: If using an embedded browser or sandbox, you can always test barcodes seamlessly using the library below!
                </p>
              </div>
            </div>
          )}

          {/* Scanned Sample Preset Bar */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Interactive Barcode Library
                </h3>
                <p className="text-xs text-stone-500">
                  Click any verified grocery item to test real-time product parsing and shelf-life tracking.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
              {SCANNABLE_BARCODE_PRESETS.map((preset) => (
                <button
                  key={preset.barcode}
                  onClick={() => handleSimulateScan(preset)}
                  className="p-3 text-left bg-stone-50 hover:bg-emerald-50/70 hover:border-emerald-300 rounded-xl border border-stone-200 transition-all group"
                >
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                    <span className="font-mono">{preset.barcode}</span>
                    <span className="text-emerald-700 font-semibold">{preset.daysLeft}d shelf life</span>
                  </div>
                  <div className="text-xs font-bold text-stone-900 group-hover:text-emerald-800">
                    {preset.name}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    {preset.brand} · ${preset.estimatedPrice.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: RECEIPT SCANNER */}
      {activeMode === 'receipt' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="max-w-xl">
            <h3 className="text-lg font-bold text-stone-900">Grocery Receipt Parser</h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Snap or upload your paper store receipt (Safeway, Trader Joe's, Kroger, Whole Foods). FreshSaver reads the line items and populates your pantry in seconds.
            </p>
          </div>

          <div className="p-6 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-800">
                Sample Supermarket Receipt #4892
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                4 items detected: Strawberries, Sharp Cheddar, Whole Grain Bread, Atlantic Salmon
              </p>
            </div>
            <button
              onClick={handleScanReceipt}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Process Receipt & Add 4 Items</span>
            </button>
          </div>

          {/* Receipt Preview Items */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
              Items to be added:
            </h4>
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
              {MOCK_RECEIPT_ITEMS.map(item => (
                <div key={item.name} className="p-3.5 flex items-center justify-between bg-white text-xs">
                  <div>
                    <span className="font-semibold text-stone-900">{item.name}</span>
                    <span className="text-stone-400 ml-2">({item.category})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-700 font-semibold">{item.daysLeft} days expiry</span>
                    <span className="font-mono text-stone-600">${item.estimatedPrice.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: MANUAL & SMART SHELF-LIFE ADVISOR */}
      {activeMode === 'manual' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              Manual Add with Smart Shelf-Life Advisor
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Start typing any ingredient. FreshSaver automatically calculates standard USDA FoodKeeper shelf life and storage recommendations.
            </p>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={manualName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Baby Spinach, Chicken Breast, Bananas, Sourdough..."
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>

            {/* Smart Advisor Recommendation Banner */}
            {suggestedGuide && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">
                    Smart Shelf-Life Applied for {suggestedGuide.name}
                  </div>
                  <p className="text-emerald-800 mt-0.5">
                    Recommended: <strong>{suggestedGuide.shelfLifeDays} days</strong> in {suggestedGuide.defaultLocation}. Tip: {suggestedGuide.storageTip}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Category
                </label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value as FoodCategory)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                >
                  <option value="Produce">Produce</option>
                  <option value="Dairy & Eggs">Dairy & Eggs</option>
                  <option value="Meat & Seafood">Meat & Seafood</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Pantry & Dry Goods">Pantry & Dry Goods</option>
                  <option value="Frozen">Frozen</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Storage Location
                </label>
                <select
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value as StorageLocation)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                >
                  <option value="Fridge">Fridge</option>
                  <option value="Pantry">Pantry</option>
                  <option value="Freezer">Freezer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Days Left Until Expiry
                </label>
                <input
                  type="number"
                  min="0"
                  max="720"
                  value={manualDaysLeft}
                  onChange={(e) => setManualDaysLeft(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Quantity / Packaging
                </label>
                <input
                  type="text"
                  value={manualQuantity}
                  onChange={(e) => setManualQuantity(e.target.value)}
                  placeholder="e.g. 1 carton, 500g, 3 pieces"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Notes or Storage Tip
                </label>
                <input
                  type="text"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="e.g. Crisp leaves, store in crisper"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Save to My Pantry</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
