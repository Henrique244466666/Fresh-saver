import { SupportedLanguage } from './types';

export interface Translations {
  // Navigation & Header
  navPantry: string;
  navShopping: string;
  navScan: string;
  navRecipes: string;
  navDonate: string;
  navTopSavers: string;
  navAccount: string;
  navAndroid: string;
  navGuidePdf: string;
  navSignInSync: string;
  navCloudSynced: string;

  // Common units & metrics
  unitKg: string;
  currencySymbol: string;
  statRescuedKg: string;
  statEurosSaved: string;
  statCo2Avoided: string;
  statItemsCooked: string;
  statItemsDonated: string;
  streakDays: string;

  // Status & Urgency
  statusExpired: string;
  statusExpiresToday: string;
  status1DayLeft: string;
  statusDaysLeft: string;
  statusFresh: string;
  statusUrgent: string;
  statusSafe: string;

  // Categories
  catAll: string;
  catProduce: string;
  catDairy: string;
  catMeat: string;
  catBakery: string;
  catPantry: string;
  catFrozen: string;
  catExpiringSoon: string;

  // Storage Locations
  locFridge: string;
  locPantry: string;
  locFreezer: string;

  // Common Actions
  actionAdd: string;
  actionAddGroceries: string;
  actionEdit: string;
  actionDelete: string;
  actionCancel: string;
  actionSave: string;
  actionCook: string;
  actionCookItem: string;
  actionDonate: string;
  actionDonateItem: string;
  actionMarkConsumed: string;
  actionSearchPlaceholder: string;
  actionSortBy: string;
  actionSortEarliest: string;
  actionSortAlpha: string;
  actionSortCategory: string;
  actionSortRecent: string;

  // Pantry View
  pantryTitle: string;
  pantrySubtitle: string;
  pantryEmptyTitle: string;
  pantryEmptyDesc: string;
  pantryAddFirstBtn: string;
  pantryAlertHeadsUp: string;
  pantryAlertMessage: string;
  pantryEstValue: string;
  pantryShowingCount: string;

  // Shopping List View
  shopTitle: string;
  shopSubtitle: string;
  shopAddItemPlaceholder: string;
  shopAddBtn: string;
  shopConvertToPantryBtn: string;
  shopEmptyTitle: string;
  shopEmptyDesc: string;
  shopClearCompleted: string;
  shopEstimatedTotal: string;

  // Scanner View
  scannerTitle: string;
  scannerSubtitle: string;
  scanTabCamera: string;
  scanTabReceipt: string;
  scanTabManual: string;
  scanStartCamera: string;
  scanStopCamera: string;
  scanBarcodePlaceholder: string;
  scanLookupBtn: string;
  scanReceiptPlaceholder: string;
  scanParseReceiptBtn: string;
  scanUploadReceiptImg: string;
  scanManualName: string;
  scanManualQty: string;
  scanManualExpiryDays: string;
  scanManualSubmit: string;

  // Recipes View
  recipesTitle: string;
  recipesSubtitle: string;
  recipesGenerateAiBtn: string;
  recipesFilterAll: string;
  recipesMatchScore: string;
  recipesPrepTime: string;
  recipesCookTime: string;
  recipesServings: string;
  recipesMissingIngredients: string;
  recipesAddMissingToShop: string;
  recipesCookMealBtn: string;

  // Donation View
  donateTitle: string;
  donateSubtitle: string;
  donateLogBtn: string;
  donateAcceptedTitle: string;
  donateCannotAcceptTitle: string;
  donateHours: string;
  donatePhone: string;
  donateSelectModalTitle: string;
  donateConfirmDropOff: string;

  // Top Savers View
  saversTitle: string;
  saversSubtitle: string;
  saversCurrentTier: string;
  saversLeaderboardTitle: string;
  saversYourRank: string;
  saversDiscountsTitle: string;
  saversClaimDiscountBtn: string;
  saversClaimedBadge: string;
  saversNextTierIn: string;

  // Account View
  accountTitle: string;
  accountSubtitle: string;
  accountSignInTab: string;
  accountSignUpTab: string;
  accountNameLabel: string;
  accountEmailLabel: string;
  accountPasswordLabel: string;
  accountSignInBtn: string;
  accountSignUpBtn: string;
  accountSignOutBtn: string;
  accountSyncNowBtn: string;
  accountDeviceCodeTitle: string;
  accountGenerateCodeBtn: string;
  accountEnterCodePlaceholder: string;
  accountConnectCodeBtn: string;
  accountPdfGuideTitle: string;
  accountPdfGuideDesc: string;
  accountDownloadPdfBtn: string;
  accountLanguageLabel: string;

  // Allergies
  allergyTitle: string;
  allergySubtitle: string;
  allergyWarningBadge: string;
  allergyFilterSafeOnly: string;
  allergyRecipeWarning: string;
  allergyItemWarning: string;
  allergyNoneSelected: string;
  allergySavedSuccess: string;

  // Top Savers Extras
  saversAllPartners: string;
  saversUnlocked: string;
  saversKgReq: string;
  saversViewVoucher: string;
  saversSaveMoreKg: string;
  saversTierRequired: string;
  saversHowItWorksTitle: string;
  saversStep1Title: string;
  saversStep1Desc: string;
  saversStep2Title: string;
  saversStep2Desc: string;
  saversStep3Title: string;
  saversStep3Desc: string;
  saversTimeThisMonth: string;
  saversTimeThisWeek: string;
  saversTimeAllTime: string;
  saversRankCol: string;
  saversSaverCol: string;
  saversTierCol: string;
  saversRescuedCol: string;
  saversSavedCol: string;
  saversDiscountCol: string;
  saversYouBadge: string;
  saversNextTier: string;
  saversKgToUnlock: string;
  saversUnlockedStatus: string;

  // Account Extras
  accountCloudActive: string;
  accountPantrySynced: string;
  accountShoppingItems: string;
  accountItemsCount: string;
  accountStep1Push: string;
  accountStep1Title: string;
  accountStep1Desc: string;
  accountOneTimeCode: string;
  accountCopyCode: string;
  accountCopied: string;
  accountValidMinutes: string;
  accountStep2Pull: string;
  accountStep2Title: string;
  accountStep2Desc: string;
  accountLoadRemote: string;
  accountMultiDeviceSync: string;
  accountAutoCloudBackup: string;
  accountGetAndroid: string;
  accountAndroidBannerDesc: string;

  // Notifications
  notifyTitle: string;
  notifySubtitle: string;
  notifyCritical: string;
  notifyApproaching: string;
  notifyPast: string;
  notifyAllFresh: string;
  notifyAllFreshDesc: string;
  notifySchedule: string;
  notifyMorningCheck: string;
  notifyDinnerSuggestions: string;
  notifyUrgentThreshold: string;
  notifyEnablePush: string;
  notifyPushActive: string;
  notifyTestAlert: string;

  // Voucher Modal
  voucherTitle: string;
  voucherScanCheckout: string;
  voucherPromoCode: string;
  voucherCopy: string;
  voucherCopied: string;
  voucherValidUntil: string;
  voucherDone: string;

  // AI Recipe Modal
  aiChefTitle: string;
  aiChefSubtitle: string;
  aiChefTargeting: string;
  aiChefMealType: string;
  aiChefMaxTime: string;
  aiChefDietary: string;
  aiChefGenerateBtn: string;
  aiChefCrafting: string;
  aiChefIngredients: string;
  aiChefInstructions: string;
  aiChefCookNow: string;
  aiChefAddMissing: string;
  aiChefRegenerate: string;
  aiChefInPantry: string;
  aiChefPantryStaple: string;

  // Allergies Extras
  allergyProtectionActive: string;
  allergyProtectionDesc: string;
  allergyClearAll: string;
  allergyActiveCount: string;
  allergyDairy: string;
  allergyWheatGluten: string;
  allergyPeanuts: string;
  allergyTreeNuts: string;
  allergyEggs: string;
  allergySoy: string;
  allergyFish: string;
  allergyShellfish: string;
  allergySesame: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    navPantry: 'Pantry',
    navShopping: 'Shopping List',
    navScan: 'Scan & Add',
    navRecipes: 'AI Recipes',
    navDonate: 'Donate Drop-off',
    navTopSavers: 'Top Savers',
    navAccount: 'Account & Sync',
    navAndroid: 'Android App',
    navGuidePdf: 'Guide (PDF)',
    navSignInSync: 'Sign In / Sync',
    navCloudSynced: 'Cloud Synced',

    unitKg: 'kg',
    currencySymbol: '€',
    statRescuedKg: 'Food Rescued',
    statEurosSaved: 'Money Saved',
    statCo2Avoided: 'CO₂ Avoided',
    statItemsCooked: 'Meals Cooked',
    statItemsDonated: 'Items Donated',
    streakDays: 'day streak',

    statusExpired: 'Expired',
    statusExpiresToday: 'Expires Today',
    status1DayLeft: '1 Day Left',
    statusDaysLeft: 'days left',
    statusFresh: 'Fresh',
    statusUrgent: 'Urgent (≤3d)',
    statusSafe: 'Safe',

    catAll: 'All Items',
    catProduce: 'Produce',
    catDairy: 'Dairy & Eggs',
    catMeat: 'Meat & Seafood',
    catBakery: 'Bakery',
    catPantry: 'Pantry & Dry Goods',
    catFrozen: 'Frozen',
    catExpiringSoon: 'Expiring Soon (≤3d)',

    locFridge: 'Fridge',
    locPantry: 'Pantry',
    locFreezer: 'Freezer',

    actionAdd: 'Add',
    actionAddGroceries: 'Add Groceries',
    actionEdit: 'Edit',
    actionDelete: 'Delete',
    actionCancel: 'Cancel',
    actionSave: 'Save Changes',
    actionCook: 'Cook',
    actionCookItem: 'Cook Meal',
    actionDonate: 'Donate',
    actionDonateItem: 'Donate Item',
    actionMarkConsumed: 'Mark Consumed',
    actionSearchPlaceholder: 'Search groceries by name, category or note...',
    actionSortBy: 'Sort',
    actionSortEarliest: 'Sort: Expiring Earliest',
    actionSortAlpha: 'Sort: Alphabetical (A-Z)',
    actionSortCategory: 'Sort: Category',
    actionSortRecent: 'Sort: Recently Added',

    pantryTitle: 'My Food Pantry',
    pantrySubtitle: 'Monitor shelf lives, prevent waste, and turn expiring goods into delicious meals or donations.',
    pantryEmptyTitle: 'Your pantry is completely empty!',
    pantryEmptyDesc: 'Scan barcodes with your camera, paste a supermarket receipt, or add items manually to start tracking expiration dates.',
    pantryAddFirstBtn: 'Scan & Add Groceries',
    pantryAlertHeadsUp: 'Heads Up! Items Expiring Soon',
    pantryAlertMessage: 'You have {count} item(s) expiring within 3 days. Cook or donate them before they spoil.',
    pantryEstValue: 'Est. value',
    pantryShowingCount: 'Showing {count} of {total} items',

    shopTitle: 'Smart Grocery Shopping List',
    shopSubtitle: 'Plan what you need. Checked items can be automatically transferred into your pantry with realistic shelf lives.',
    shopAddItemPlaceholder: 'Add grocery item (e.g. Sourdough Bread, 2L Milk, Fresh Apples)...',
    shopAddBtn: 'Add to List',
    shopConvertToPantryBtn: 'Turn {count} Bought Item(s) into Pantry Food',
    shopEmptyTitle: 'Shopping list is empty',
    shopEmptyDesc: 'Add staples you need to replenish or import missing ingredients directly from any AI recipe.',
    shopClearCompleted: 'Clear Checked',
    shopEstimatedTotal: 'Estimated Total',

    scannerTitle: 'Grocery Scanner & Food Intake',
    scannerSubtitle: 'Quickly register groceries into your pantry using barcode scanning, receipt parsing, or quick entry.',
    scanTabCamera: 'Live Barcode Camera',
    scanTabReceipt: 'Receipt OCR Parser',
    scanTabManual: 'Manual Quick Entry',
    scanStartCamera: 'Open Camera Scanner',
    scanStopCamera: 'Stop Camera',
    scanBarcodePlaceholder: 'Enter UPC / EAN barcode digits...',
    scanLookupBtn: 'Lookup Barcode',
    scanReceiptPlaceholder: 'Paste itemized supermarket receipt lines here...',
    scanParseReceiptBtn: 'Parse Receipt Lines',
    scanUploadReceiptImg: 'Upload Receipt Photo',
    scanManualName: 'Food / Product Name',
    scanManualQty: 'Quantity / Size',
    scanManualExpiryDays: 'Shelf Life (Days)',
    scanManualSubmit: 'Add Item to Pantry',

    recipesTitle: 'Zero-Waste AI Recipe Studio',
    recipesSubtitle: 'Generate tailored gourmet recipes powered by Gemini AI that prioritize food expiring in your pantry.',
    recipesGenerateAiBtn: 'Generate AI Recipe from Expiring Food',
    recipesFilterAll: 'All Recipes',
    recipesMatchScore: 'Pantry Match',
    recipesPrepTime: 'Prep',
    recipesCookTime: 'Cook',
    recipesServings: 'Servings',
    recipesMissingIngredients: 'Missing Ingredients',
    recipesAddMissingToShop: 'Add Missing Items to Shopping List',
    recipesCookMealBtn: 'Cook This Recipe & Rescue Food',

    donateTitle: 'Local Food Donation Drop-Offs',
    donateSubtitle: 'Donate unopened, surplus groceries to nearby food banks, community fridges, and soup kitchens.',
    donateLogBtn: 'Log Food Donation',
    donateAcceptedTitle: 'Accepted Food Items',
    donateCannotAcceptTitle: 'Cannot Accept',
    donateHours: 'Hours',
    donatePhone: 'Phone',
    donateSelectModalTitle: 'Log Food Donation Drop-off',
    donateConfirmDropOff: 'Record Drop-off & Award Points',

    saversTitle: 'Top Savers Leaderboard & Discount Rewards',
    saversSubtitle: 'Rescue food from spoiling, reduce carbon emissions, and unlock real grocery discounts.',
    saversCurrentTier: 'Current Saver Tier',
    saversLeaderboardTitle: 'Community Food Rescue Ranking',
    saversYourRank: 'Your Rank',
    saversDiscountsTitle: 'Exclusive Grocery Partner Discounts',
    saversClaimDiscountBtn: 'Claim Discount Voucher',
    saversClaimedBadge: 'Voucher Claimed',
    saversNextTierIn: 'Next Tier in',

    accountTitle: 'Account & Cross-Device Cloud Sync',
    accountSubtitle: 'Synchronize your grocery pantry, shopping cart, and food rescue badges across all your devices.',
    accountSignInTab: 'Sign In',
    accountSignUpTab: 'Create Account',
    accountNameLabel: 'Full Name',
    accountEmailLabel: 'Email Address',
    accountPasswordLabel: 'Password',
    accountSignInBtn: 'Sign In & Load Cloud Pantry',
    accountSignUpBtn: 'Create Account & Enable Sync',
    accountSignOutBtn: 'Sign Out',
    accountSyncNowBtn: 'Sync Cloud Now',
    accountDeviceCodeTitle: 'Instant Multi-Device Sync Hub',
    accountGenerateCodeBtn: 'Generate 6-Digit Device Code',
    accountEnterCodePlaceholder: 'e.g. 749210',
    accountConnectCodeBtn: 'Connect & Load Remote Pantry',
    accountPdfGuideTitle: 'FreshSaver Official Functionality Guide (PDF)',
    accountPdfGuideDesc: 'Complete 5-page manual covering pantry engine, AI recipe studio, food rescue & Android PWA.',
    accountDownloadPdfBtn: 'Download PDF',
    accountLanguageLabel: 'Select Language',

    allergyTitle: 'Personal Allergies & Food Sensitivities',
    allergySubtitle: 'Select ingredients you are allergic to. Items and recipes containing them will be automatically flagged or excluded.',
    allergyWarningBadge: 'Allergy Alert: Contains',
    allergyFilterSafeOnly: 'Safe For My Allergies Only',
    allergyRecipeWarning: 'Warning: This recipe contains allergens you selected',
    allergyItemWarning: 'Contains an ingredient you are allergic to',
    allergyNoneSelected: 'No personal allergies configured',
    allergySavedSuccess: 'Allergies updated successfully!',

    saversAllPartners: 'All Partners',
    saversUnlocked: 'Unlocked',
    saversKgReq: '{kg} kg req.',
    saversViewVoucher: 'View Voucher & Barcode',
    saversSaveMoreKg: 'Save {kg} more kg',
    saversTierRequired: 'Tier Required',
    saversHowItWorksTitle: 'How The FreshSaver Grocery Discount Program Works',
    saversStep1Title: '1. Scan & Track',
    saversStep1Desc: 'Scan your grocery receipts or barcodes when you shop. FreshSaver logs your shelf-life and monitors expiry windows.',
    saversStep2Title: '2. Cook or Donate',
    saversStep2Desc: 'Use suggested recipes to cook items expiring within 3 days, or drop off excess unopened food at verified community fridges.',
    saversStep3Title: '3. Unlock Store Discounts',
    saversStep3Desc: 'Every kg diverted counts toward your saver tier. Redeem real partner grocery vouchers for up to 25% OFF your next checkout.',
    saversTimeThisMonth: 'This Month',
    saversTimeThisWeek: 'This Week',
    saversTimeAllTime: 'All Time',
    saversRankCol: 'Rank',
    saversSaverCol: 'Saver',
    saversTierCol: 'Tier Status',
    saversRescuedCol: 'Food Rescued',
    saversSavedCol: 'Value Saved',
    saversDiscountCol: 'Discount Earned',
    saversYouBadge: 'YOU',
    saversNextTier: 'Next Tier',
    saversKgToUnlock: '({kg} kg to unlock)',
    saversUnlockedStatus: '(Unlocked!)',

    accountCloudActive: 'Cloud Active',
    accountPantrySynced: 'Pantry Synced',
    accountShoppingItems: 'Shopping Items',
    accountItemsCount: 'items',
    accountStep1Push: 'Step 1 · Push from this device',
    accountStep1Title: 'Generate Sync Code for Other Devices',
    accountStep1Desc: 'Creates a temporary 6-digit sync key. Enter this code on your phone to immediately mirror your groceries.',
    accountOneTimeCode: 'ONE-TIME 6-DIGIT CODE',
    accountCopyCode: 'Copy Code',
    accountCopied: 'Code Copied!',
    accountValidMinutes: 'Valid for 30 minutes',
    accountStep2Pull: 'Step 2 · Pull into this device',
    accountStep2Title: 'Enter Code from Another Device',
    accountStep2Desc: 'Have a code from another phone or computer? Enter it here to import and sync that pantry right away.',
    accountLoadRemote: 'Connect & Load Remote Pantry',
    accountMultiDeviceSync: 'Multi-device synchronization',
    accountAutoCloudBackup: 'Automatic cloud backup',
    accountGetAndroid: 'Get Android App',
    accountAndroidBannerDesc: 'Install native WebAPK on Android or compile signed APK from GitHub.',

    notifyTitle: 'Food Expiry Notifications',
    notifySubtitle: 'Live alerts & waste prevention',
    notifyCritical: 'Critical Expiration',
    notifyApproaching: 'Expiring in 2-3 Days',
    notifyPast: 'Past Expiration',
    notifyAllFresh: 'Everything is fresh!',
    notifyAllFreshDesc: 'No items in your pantry are expiring in the next 3 days. Keep scanning your groceries to stay ahead of spoilage.',
    notifySchedule: 'Reminder Schedule',
    notifyMorningCheck: 'Morning Fridge Check',
    notifyDinnerSuggestions: 'Dinner Recipe Suggestions',
    notifyUrgentThreshold: 'Urgent Expiry Threshold',
    notifyEnablePush: 'Enable Push Notifications',
    notifyPushActive: 'Browser Notifications Active',
    notifyTestAlert: 'Send Test Expiry Alert',

    voucherTitle: 'Top Saver Partner Voucher',
    voucherScanCheckout: 'Scan at Checkout or Apply Online',
    voucherPromoCode: 'PROMO CODE',
    voucherCopy: 'Copy Code',
    voucherCopied: 'Copied!',
    voucherValidUntil: 'Valid Until',
    voucherDone: 'Done',

    aiChefTitle: 'AI Zero-Waste Chef',
    aiChefSubtitle: 'Creates custom gourmet recipes specifically prioritizing your closest-to-expiring groceries.',
    aiChefTargeting: 'Targeting Ingredients Closest to Expiring:',
    aiChefMealType: 'Meal Type',
    aiChefMaxTime: 'Max Cooking Time',
    aiChefDietary: 'Dietary Focus',
    aiChefGenerateBtn: 'Generate Custom Recipe to Rescue Food',
    aiChefCrafting: 'Gemini AI is crafting your recipe...',
    aiChefIngredients: 'Ingredients List',
    aiChefInstructions: 'Cooking Instructions',
    aiChefCookNow: 'Cook This Recipe Now',
    aiChefAddMissing: 'Add Missing to Shopping List',
    aiChefRegenerate: 'Regenerate',
    aiChefInPantry: 'In Pantry',
    aiChefPantryStaple: 'Pantry staple',

    allergyProtectionActive: 'Active Allergy Protection Enabled',
    allergyProtectionDesc: 'Items containing these allergens will be prominently flagged in your Pantry, Scanner, and Shopping List. AI Recipe Studio will automatically eliminate these ingredients from meal suggestions.',
    allergyClearAll: 'Clear all',
    allergyActiveCount: 'active',
    allergyDairy: 'Dairy & Milk',
    allergyWheatGluten: 'Wheat & Gluten',
    allergyPeanuts: 'Peanuts',
    allergyTreeNuts: 'Tree Nuts',
    allergyEggs: 'Eggs',
    allergySoy: 'Soy & Soya',
    allergyFish: 'Fish',
    allergyShellfish: 'Crustaceans & Shellfish',
    allergySesame: 'Sesame',
  },

  es: {
    navPantry: 'Despensa',
    navShopping: 'Lista de la Compra',
    navScan: 'Escanear y Añadir',
    navRecipes: 'Recetas IA',
    navDonate: 'Donar Alimentos',
    navTopSavers: 'Mejores Ahorradores',
    navAccount: 'Cuenta y Sincronización',
    navAndroid: 'App Android',
    navGuidePdf: 'Guía (PDF)',
    navSignInSync: 'Iniciar Sesión / Sincronizar',
    navCloudSynced: 'Sincronizado en la Nube',

    unitKg: 'kg',
    currencySymbol: '€',
    statRescuedKg: 'Comida Rescatada',
    statEurosSaved: 'Dinero Ahorrado',
    statCo2Avoided: 'CO₂ Evitado',
    statItemsCooked: 'Comidas Cocinadas',
    statItemsDonated: 'Artículos Donados',
    streakDays: 'días de racha',

    statusExpired: 'Caducado',
    statusExpiresToday: 'Caduca Hoy',
    status1DayLeft: '1 Día Restante',
    statusDaysLeft: 'días restantes',
    statusFresh: 'Fresco',
    statusUrgent: 'Urgente (≤3d)',
    statusSafe: 'Seguro',

    catAll: 'Todos los Artículos',
    catProduce: 'Frutas y Verduras',
    catDairy: 'Lácteos y Huevos',
    catMeat: 'Carne y Pescado',
    catBakery: 'Panadería',
    catPantry: 'Despensa y Secos',
    catFrozen: 'Congelados',
    catExpiringSoon: 'Caducan Pronto (≤3d)',

    locFridge: 'Nevera',
    locPantry: 'Despensa',
    locFreezer: 'Congelador',

    actionAdd: 'Añadir',
    actionAddGroceries: 'Añadir Alimentos',
    actionEdit: 'Editar',
    actionDelete: 'Eliminar',
    actionCancel: 'Cancelar',
    actionSave: 'Guardar Cambios',
    actionCook: 'Cocinar',
    actionCookItem: 'Cocinar Receta',
    actionDonate: 'Donar',
    actionDonateItem: 'Donar Artículo',
    actionMarkConsumed: 'Marcar Consumido',
    actionSearchPlaceholder: 'Buscar alimentos por nombre, categoría o nota...',
    actionSortBy: 'Ordenar',
    actionSortEarliest: 'Ordenar: Caducidad Próxima',
    actionSortAlpha: 'Ordenar: Alfabético (A-Z)',
    actionSortCategory: 'Ordenar: Categoría',
    actionSortRecent: 'Ordenar: Añadidos Recientemente',

    pantryTitle: 'Mi Despensa de Alimentos',
    pantrySubtitle: 'Controla fechas de caducidad, reduce el desperdicio y aprovecha tus alimentos antes de que caduquen.',
    pantryEmptyTitle: '¡Tu despensa está completamente vacía!',
    pantryEmptyDesc: 'Escanea códigos de barras con tu cámara, pega un ticket del supermercado o añade productos manualmente.',
    pantryAddFirstBtn: 'Escanear y Añadir Alimentos',
    pantryAlertHeadsUp: '¡Atención! Alimentos a Punto de Caducar',
    pantryAlertMessage: 'Tienes {count} artículo(s) que caducan en menos de 3 días. Cocínalos o dónalos para no desperdiciarlos.',
    pantryEstValue: 'Valor est.',
    pantryShowingCount: 'Mostrando {count} de {total} artículos',

    shopTitle: 'Lista Inteligente de la Compra',
    shopSubtitle: 'Planifica tus compras. Los productos marcados como comprados se transforman automáticamente en alimentos de tu despensa.',
    shopAddItemPlaceholder: 'Añadir alimento (ej. Pan Integral, 2L Leche, Manzanas Frescas)...',
    shopAddBtn: 'Añadir a la Lista',
    shopConvertToPantryBtn: 'Convertir {count} Producto(s) en Alimentos de Despensa',
    shopEmptyTitle: 'La lista de la compra está vacía',
    shopEmptyDesc: 'Añade los básicos que necesites reponer o importa ingredientes que falten desde cualquier receta IA.',
    shopClearCompleted: 'Limpiar Comprados',
    shopEstimatedTotal: 'Total Estimado',

    scannerTitle: 'Escáner de Alimentos y Registro',
    scannerSubtitle: 'Registra rápidamente alimentos en tu despensa mediante código de barras, lectura de tickets o entrada rápida.',
    scanTabCamera: 'Cámara Escáner en Vivo',
    scanTabReceipt: 'Lector OCR de Tickets',
    scanTabManual: 'Entrada Rápida Manual',
    scanStartCamera: 'Abrir Cámara Escáner',
    scanStopCamera: 'Detener Cámara',
    scanBarcodePlaceholder: 'Introduce dígitos de código de barras UPC / EAN...',
    scanLookupBtn: 'Buscar Código',
    scanReceiptPlaceholder: 'Pega las líneas del ticket del supermercado aquí...',
    scanParseReceiptBtn: 'Procesar Líneas del Ticket',
    scanUploadReceiptImg: 'Subir Foto de Ticket',
    scanManualName: 'Nombre del Alimento',
    scanManualQty: 'Cantidad / Tamaño',
    scanManualExpiryDays: 'Días de Vida Útil',
    scanManualSubmit: 'Añadir a la Despensa',

    recipesTitle: 'Estudio de Recetas IA Cero Desperdicio',
    recipesSubtitle: 'Crea deliciosas recetas personalizadas con Gemini AI priorizando los alimentos que van a caducar en tu despensa.',
    recipesGenerateAiBtn: 'Generar Receta IA con Alimentos Próximos a Caducar',
    recipesFilterAll: 'Todas las Recetas',
    recipesMatchScore: 'Coincidencia Despensa',
    recipesPrepTime: 'Prep',
    recipesCookTime: 'Cocción',
    recipesServings: 'Porciones',
    recipesMissingIngredients: 'Ingredientes Faltantes',
    recipesAddMissingToShop: 'Añadir Faltantes a la Lista de la Compra',
    recipesCookMealBtn: 'Cocinar esta Receta y Salvar Alimentos',

    donateTitle: 'Puntos de Donación de Alimentos Locales',
    donateSubtitle: 'Dona alimentos excedentes en buen estado a bancos de alimentos, neveras solidarias y comedores sociales.',
    donateLogBtn: 'Registrar Donación',
    donateAcceptedTitle: 'Alimentos Aceptados',
    donateCannotAcceptTitle: 'No Aceptados',
    donateHours: 'Horario',
    donatePhone: 'Teléfono',
    donateSelectModalTitle: 'Registrar Entrega de Donación',
    donateConfirmDropOff: 'Confirmar Entrega y Ganar Puntos',

    saversTitle: 'Clasificación de Ahorradores y Descuentos',
    saversSubtitle: 'Rescata alimentos, reduce tu huella de carbono y desbloquea descuentos reales en supermercados.',
    saversCurrentTier: 'Nivel Actual de Ahorrador',
    saversLeaderboardTitle: 'Ranking Comunitario de Rescate Alimentario',
    saversYourRank: 'Tu Puesto',
    saversDiscountsTitle: 'Descuentos Exclusivos en Tiendas Colaboradoras',
    saversClaimDiscountBtn: 'Canjear Cupón de Descuento',
    saversClaimedBadge: 'Cupón Canjeado',
    saversNextTierIn: 'Siguiente nivel en',

    accountTitle: 'Cuenta y Sincronización en la Nube',
    accountSubtitle: 'Sincroniza tu despensa, lista de la compra y logros en todos tus teléfonos, tabletas y ordenadores.',
    accountSignInTab: 'Iniciar Sesión',
    accountSignUpTab: 'Crear Cuenta',
    accountNameLabel: 'Nombre Completo',
    accountEmailLabel: 'Correo Electrónico',
    accountPasswordLabel: 'Contraseña',
    accountSignInBtn: 'Iniciar Sesión y Cargar Despensa',
    accountSignUpBtn: 'Crear Cuenta y Activar Nube',
    accountSignOutBtn: 'Cerrar Sesión',
    accountSyncNowBtn: 'Sincronizar Nube Ahora',
    accountDeviceCodeTitle: 'Sincronización Rápida entre Dispositivos',
    accountGenerateCodeBtn: 'Generar Código de 6 Dígitos',
    accountEnterCodePlaceholder: 'ej. 749210',
    accountConnectCodeBtn: 'Conectar y Cargar Despensa Remota',
    accountPdfGuideTitle: 'Guía Oficial de Funcionalidades FreshSaver (PDF)',
    accountPdfGuideDesc: 'Manual completo de 5 páginas con la despensa, recetas IA, donaciones y PWA Android.',
    accountDownloadPdfBtn: 'Descargar PDF',
    accountLanguageLabel: 'Seleccionar Idioma',

    allergyTitle: 'Alergias Personales e Intolerancias',
    allergySubtitle: 'Selecciona los ingredientes a los que tienes alergia. Los alimentos y recetas que los contengan se marcarán o excluirán automáticamente.',
    allergyWarningBadge: 'Alerta de Alergia: Contiene',
    allergyFilterSafeOnly: 'Solo Aptos para Mis Alergias',
    allergyRecipeWarning: 'Aviso: Esta receta contiene alérgenos que has indicado',
    allergyItemWarning: 'Contiene un ingrediente al que eres alérgico',
    allergyNoneSelected: 'Sin alergias configuradas',
    allergySavedSuccess: '¡Alergias actualizadas con éxito!',

    saversAllPartners: 'Todos los Colaboradores',
    saversUnlocked: 'Desbloqueado',
    saversKgReq: '{kg} kg nec.',
    saversViewVoucher: 'Ver Cupón y Código',
    saversSaveMoreKg: 'Ahorra {kg} kg más',
    saversTierRequired: 'Nivel Requerido',
    saversHowItWorksTitle: 'Cómo Funciona el Programa de Descuentos FreshSaver',
    saversStep1Title: '1. Escanear y Controlar',
    saversStep1Desc: 'Escanea tus tickets o códigos al comprar. FreshSaver registra la caducidad y vigila las fechas.',
    saversStep2Title: '2. Cocinar o Donar',
    saversStep2Desc: 'Aprovecha recetas para consumir alimentos en 3 días, o dona excedentes a neveras comunitarias.',
    saversStep3Title: '3. Desbloquear Descuentos',
    saversStep3Desc: 'Cada kg rescatado cuenta para tu nivel. Canjea cupones de hasta un 25% de descuento en el supermercado.',
    saversTimeThisMonth: 'Este Mes',
    saversTimeThisWeek: 'Esta Semana',
    saversTimeAllTime: 'Histórico',
    saversRankCol: 'Puesto',
    saversSaverCol: 'Ahorrador',
    saversTierCol: 'Nivel',
    saversRescuedCol: 'Comida Rescatada',
    saversSavedCol: 'Dinero Ahorrado',
    saversDiscountCol: 'Descuento Obtenido',
    saversYouBadge: 'TÚ',
    saversNextTier: 'Siguiente Nivel',
    saversKgToUnlock: '({kg} kg para desbloquear)',
    saversUnlockedStatus: '(¡Desbloqueado!)',

    accountCloudActive: 'Nube Activa',
    accountPantrySynced: 'Despensa Sincronizada',
    accountShoppingItems: 'Artículos de Compra',
    accountItemsCount: 'artículos',
    accountStep1Push: 'Paso 1 · Enviar desde este dispositivo',
    accountStep1Title: 'Generar Código de Sincronización',
    accountStep1Desc: 'Crea una clave temporal de 6 dígitos. Introdúcela en tu teléfono para clonar tu despensa al instante.',
    accountOneTimeCode: 'CÓDIGO DE UN SOLO USO',
    accountCopyCode: 'Copiar Código',
    accountCopied: '¡Código Copiado!',
    accountValidMinutes: 'Válido durante 30 minutos',
    accountStep2Pull: 'Paso 2 · Recibir en este dispositivo',
    accountStep2Title: 'Introducir Código de Otro Dispositivo',
    accountStep2Desc: '¿Tienes un código generado en otro dispositivo? Introdúcelo aquí para cargar esa despensa.',
    accountLoadRemote: 'Conectar y Cargar Despensa Remota',
    accountMultiDeviceSync: 'Sincronización multidispositivo',
    accountAutoCloudBackup: 'Copia de seguridad en la nube',
    accountGetAndroid: 'Descargar App Android',
    accountAndroidBannerDesc: 'Instala la WebAPK nativa en Android o compila el APK firmado desde GitHub.',

    notifyTitle: 'Notificaciones de Caducidad',
    notifySubtitle: 'Alertas en directo y prevención de desperdicio',
    notifyCritical: 'Caducidad Crítica',
    notifyApproaching: 'Caduca en 2-3 Días',
    notifyPast: 'Ya Caducados',
    notifyAllFresh: '¡Todo está fresco!',
    notifyAllFreshDesc: 'Ningún artículo de tu despensa caduca en los próximos 3 días. Sigue escaneando tu compra.',
    notifySchedule: 'Horario de Recordatorios',
    notifyMorningCheck: 'Revisión Matutina de Nevera',
    notifyDinnerSuggestions: 'Sugerencias para la Cena',
    notifyUrgentThreshold: 'Límite de Alerta Urgente',
    notifyEnablePush: 'Activar Notificaciones Push',
    notifyPushActive: 'Notificaciones del Navegador Activas',
    notifyTestAlert: 'Enviar Alerta de Prueba',

    voucherTitle: 'Cupón de Descuento de Socio',
    voucherScanCheckout: 'Escanear en Caja o Aplicar Online',
    voucherPromoCode: 'CÓDIGO PROMOCIONAL',
    voucherCopy: 'Copiar Código',
    voucherCopied: '¡Copiado!',
    voucherValidUntil: 'Válido Hasta',
    voucherDone: 'Listo',

    aiChefTitle: 'Chef IA Residuo Cero',
    aiChefSubtitle: 'Crea recetas personalizadas con Gemini AI dando prioridad a tus alimentos más próximos a caducar.',
    aiChefTargeting: 'Priorizando Alimentos Más Próximos a Caducar:',
    aiChefMealType: 'Tipo de Comida',
    aiChefMaxTime: 'Tiempo Máximo',
    aiChefDietary: 'Enfoque Dietético',
    aiChefGenerateBtn: 'Generar Receta Personalizada para Rescatar Comida',
    aiChefCrafting: 'Gemini IA está preparando tu receta...',
    aiChefIngredients: 'Lista de Ingredientes',
    aiChefInstructions: 'Instrucciones de Cocina',
    aiChefCookNow: 'Cocinar Esta Receta Ahora',
    aiChefAddMissing: 'Añadir Faltantes a la Lista de la Compra',
    aiChefRegenerate: 'Volver a Generar',
    aiChefInPantry: 'En la Despensa',
    aiChefPantryStaple: 'Básico común',

    allergyProtectionActive: 'Protección Antialérgenos Activa',
    allergyProtectionDesc: 'Los productos con estos alérgenos se marcarán en tu Despensa, Escáner y Lista. El Chef IA los excluirá de las recetas.',
    allergyClearAll: 'Borrar todas',
    allergyActiveCount: 'activas',
    allergyDairy: 'Lácteos y Leche',
    allergyWheatGluten: 'Trigo y Gluten',
    allergyPeanuts: 'Cacahuetes',
    allergyTreeNuts: 'Frutos de Cáscara',
    allergyEggs: 'Huevos',
    allergySoy: 'Soja',
    allergyFish: 'Pescado',
    allergyShellfish: 'Mariscos y Crustáceos',
    allergySesame: 'Sésamo',
  },

  pt: {
    navPantry: 'Despensa',
    navShopping: 'Lista de Compras',
    navScan: 'Escanear e Adicionar',
    navRecipes: 'Receitas IA',
    navDonate: 'Doação de Alimentos',
    navTopSavers: 'Maiores Poupadores',
    navAccount: 'Conta e Sincronização',
    navAndroid: 'App Android',
    navGuidePdf: 'Guia (PDF)',
    navSignInSync: 'Entrar / Sincronizar',
    navCloudSynced: 'Sincronizado na Nuvem',

    unitKg: 'kg',
    currencySymbol: '€',
    statRescuedKg: 'Alimentos Resgatados',
    statEurosSaved: 'Dinheiro Poupado',
    statCo2Avoided: 'CO₂ Evitado',
    statItemsCooked: 'Refeições Cozinhadas',
    statItemsDonated: 'Itens Doados',
    streakDays: 'dias seguidos',

    statusExpired: 'Vencido',
    statusExpiresToday: 'Vence Hoje',
    status1DayLeft: '1 Dia Restante',
    statusDaysLeft: 'dias restantes',
    statusFresh: 'Fresco',
    statusUrgent: 'Urgente (≤3d)',
    statusSafe: 'Seguro',

    catAll: 'Todos os Produtos',
    catProduce: 'Hortifrúti e Legumes',
    catDairy: 'Laticínios e Ovos',
    catMeat: 'Carnes e Peixes',
    catBakery: 'Padaria',
    catPantry: 'Despensa e Secos',
    catFrozen: 'Congelados',
    catExpiringSoon: 'A Vencer em Breve (≤3d)',

    locFridge: 'Frigorífico',
    locPantry: 'Despensa',
    locFreezer: 'Congelador',

    actionAdd: 'Adicionar',
    actionAddGroceries: 'Adicionar Alimentos',
    actionEdit: 'Editar',
    actionDelete: 'Eliminar',
    actionCancel: 'Cancelar',
    actionSave: 'Guardar Alterações',
    actionCook: 'Cozinhar',
    actionCookItem: 'Cozinhar Receita',
    actionDonate: 'Doar',
    actionDonateItem: 'Doar Alimento',
    actionMarkConsumed: 'Marcar Consumido',
    actionSearchPlaceholder: 'Pesquisar alimentos por nome, categoria ou nota...',
    actionSortBy: 'Ordenar',
    actionSortEarliest: 'Ordenar: Validade Mais Próxima',
    actionSortAlpha: 'Ordenar: Alfabética (A-Z)',
    actionSortCategory: 'Ordenar: Categoria',
    actionSortRecent: 'Ordenar: Adicionados Recentemente',

    pantryTitle: 'A Minha Despensa',
    pantrySubtitle: 'Controle validades, evite o desperdício alimentar e transforme comida a vencer em deliciosas refeições.',
    pantryEmptyTitle: 'A sua despensa está completamente vazia!',
    pantryEmptyDesc: 'Escaneie códigos de barras com a câmara, cole um talão de supermercado ou adicione itens manualmente.',
    pantryAddFirstBtn: 'Escanear e Adicionar Alimentos',
    pantryAlertHeadsUp: 'Atenção! Alimentos Próximos do Fim da Validade',
    pantryAlertMessage: 'Tem {count} item(ns) a vencer em menos de 3 dias. Cozinhe ou doe antes que se estraguem.',
    pantryEstValue: 'Valor est.',
    pantryShowingCount: 'A mostrar {count} de {total} itens',

    shopTitle: 'Lista Inteligente de Compras',
    shopSubtitle: 'Planeie as suas compras. Os itens marcados como comprados transformam-se automaticamente em itens da despensa.',
    shopAddItemPlaceholder: 'Adicionar item (ex: Pão de Fermentação Natural, Leite, Maçãs)...',
    shopAddBtn: 'Adicionar à Lista',
    shopConvertToPantryBtn: 'Converter {count} Item(ns) Comprado(s) na Despensa',
    shopEmptyTitle: 'A lista de compras está vazia',
    shopEmptyDesc: 'Adicione itens essenciais ou importe ingredientes em falta diretamente de receitas geradas por IA.',
    shopClearCompleted: 'Limpar Concluídos',
    shopEstimatedTotal: 'Total Estimado',

    scannerTitle: 'Scanner de Alimentos e Registo',
    scannerSubtitle: 'Registe alimentos na despensa através de código de barras, leitura de talões ou inserção manual.',
    scanTabCamera: 'Câmara Scanner ao Vivo',
    scanTabReceipt: 'Leitor OCR de Talões',
    scanTabManual: 'Entrada Rápida Manual',
    scanStartCamera: 'Abrir Câmara Scanner',
    scanStopCamera: 'Parar Câmara',
    scanBarcodePlaceholder: 'Introduza os dígitos do código de barras...',
    scanLookupBtn: 'Pesquisar Código',
    scanReceiptPlaceholder: 'Cole aqui as linhas do talão do supermercado...',
    scanParseReceiptBtn: 'Processar Linhas do Talão',
    scanUploadReceiptImg: 'Carregar Foto de Talão',
    scanManualName: 'Nome do Alimento',
    scanManualQty: 'Quantidade / Embalagem',
    scanManualExpiryDays: 'Dias de Validade',
    scanManualSubmit: 'Adicionar à Despensa',

    recipesTitle: 'Estúdio de Receitas IA Desperdício Zero',
    recipesSubtitle: 'Receitas gourmet personalizadas geradas pela Gemini AI priorizando alimentos a vencer na sua despensa.',
    recipesGenerateAiBtn: 'Gerar Receita IA com Alimentos a Vencer',
    recipesFilterAll: 'Todas as Receitas',
    recipesMatchScore: 'Compatibilidade com Despensa',
    recipesPrepTime: 'Prep',
    recipesCookTime: 'Cozedura',
    recipesServings: 'Doses',
    recipesMissingIngredients: 'Ingredientes em Falta',
    recipesAddMissingToShop: 'Adicionar Ingredientes em Falta à Lista de Compras',
    recipesCookMealBtn: 'Cozinhar Esta Receita e Resgatar Alimentos',

    donateTitle: 'Pontos Locais de Doação de Alimentos',
    donateSubtitle: 'Doe comida boa e intocada a bancos alimentares, frigoríficos comunitários e associações locais.',
    donateLogBtn: 'Registar Doação',
    donateAcceptedTitle: 'Alimentos Aceites',
    donateCannotAcceptTitle: 'Não Aceites',
    donateHours: 'Horário',
    donatePhone: 'Telefone',
    donateSelectModalTitle: 'Registar Entrega de Alimentos',
    donateConfirmDropOff: 'Confirmar Entrega e Ganhar Pontos',

    saversTitle: 'Classificação de Poupadores e Descontos',
    saversSubtitle: 'Resgate comida, reduza emissões de carbono e desbloqueie descontos exclusivos em supermercados parceiros.',
    saversCurrentTier: 'Nível Atual de Poupador',
    saversLeaderboardTitle: 'Ranking Comunitário de Resgate de Comida',
    saversYourRank: 'Sua Posição',
    saversDiscountsTitle: 'Descontos Exclusivos em Lojas Parceiras',
    saversClaimDiscountBtn: 'Resgatar Voucher de Desconto',
    saversClaimedBadge: 'Voucher Resgatado',
    saversNextTierIn: 'Próximo nível em',

    accountTitle: 'Conta e Sincronização na Nuvem',
    accountSubtitle: 'Sincronize a sua despensa, carrinho de compras e pontos em todos os seus telemóveis e computadores.',
    accountSignInTab: 'Iniciar Sessão',
    accountSignUpTab: 'Criar Conta',
    accountNameLabel: 'Nome Completo',
    accountEmailLabel: 'Correio Eletrónico',
    accountPasswordLabel: 'Palavra-passe',
    accountSignInBtn: 'Iniciar Sessão e Carregar Despensa',
    accountSignUpBtn: 'Criar Conta e Ativar Nuvem',
    accountSignOutBtn: 'Terminar Sessão',
    accountSyncNowBtn: 'Sincronizar Nuvem Agora',
    accountDeviceCodeTitle: 'Sincronização Rápida Entre Dispositivos',
    accountGenerateCodeBtn: 'Gerar Código de 6 Dígitos',
    accountEnterCodePlaceholder: 'ex: 749210',
    accountConnectCodeBtn: 'Ligar e Carregar Despensa Remota',
    accountPdfGuideTitle: 'Guia Oficial de Funcionalidades FreshSaver (PDF)',
    accountPdfGuideDesc: 'Manual completo de 5 páginas sobre despensa, receitas IA, doações e PWA Android.',
    accountDownloadPdfBtn: 'Descarregar PDF',
    accountLanguageLabel: 'Selecionar Idioma',

    allergyTitle: 'Alergias Pessoais e Intolerâncias',
    allergySubtitle: 'Selecione os ingredientes a que tem alergia. Os produtos e receitas que os contenham serão sinalizados ou excluídos automaticamente.',
    allergyWarningBadge: 'Alerta de Alergia: Contém',
    allergyFilterSafeOnly: 'Apenas Apto para as Minhas Alergias',
    allergyRecipeWarning: 'Aviso: Esta receita contém alergénios que indicou',
    allergyItemWarning: 'Contém um ingrediente ao qual tem alergia',
    allergyNoneSelected: 'Nenhuma alergia configurada',
    allergySavedSuccess: 'Alergias atualizadas com sucesso!',

    saversAllPartners: 'Todos os Parceiros',
    saversUnlocked: 'Desbloqueado',
    saversKgReq: '{kg} kg nec.',
    saversViewVoucher: 'Ver Cupom e Código',
    saversSaveMoreKg: 'Poupe mais {kg} kg',
    saversTierRequired: 'Nível Necessário',
    saversHowItWorksTitle: 'Como Funciona o Programa de Descontos FreshSaver',
    saversStep1Title: '1. Escanear e Monitorar',
    saversStep1Desc: 'Escaneie notas fiscais ou códigos de barras. O FreshSaver calcula a validade automaticamente.',
    saversStep2Title: '2. Cozinhar ou Doar',
    saversStep2Desc: 'Use receitas para cozinhar itens a vencer em 3 dias ou doe a geladeiras comunitárias.',
    saversStep3Title: '3. Desbloquear Descontos',
    saversStep3Desc: 'Cada kg salvo conta para o seu nível. Resgate cupons de até 25% OFF nas suas compras.',
    saversTimeThisMonth: 'Este Mês',
    saversTimeThisWeek: 'Esta Semana',
    saversTimeAllTime: 'Todo o Período',
    saversRankCol: 'Posição',
    saversSaverCol: 'Poupador',
    saversTierCol: 'Nível',
    saversRescuedCol: 'Comida Salva',
    saversSavedCol: 'Valor Poupado',
    saversDiscountCol: 'Desconto Obtido',
    saversYouBadge: 'VOCÊ',
    saversNextTier: 'Próximo Nível',
    saversKgToUnlock: '({kg} kg para desbloquear)',
    saversUnlockedStatus: '(Desbloqueado!)',

    accountCloudActive: 'Nuvem Ativa',
    accountPantrySynced: 'Despensa Sincronizada',
    accountShoppingItems: 'Itens de Compras',
    accountItemsCount: 'itens',
    accountStep1Push: 'Passo 1 · Enviar deste dispositivo',
    accountStep1Title: 'Gerar Código de Sincronização',
    accountStep1Desc: 'Cria uma chave de 6 dígitos. Insira este código no telemóvel para clonar a sua despensa.',
    accountOneTimeCode: 'CÓDIGO ÚNICO DE 6 DÍGITOS',
    accountCopyCode: 'Copiar Código',
    accountCopied: 'Código Copiado!',
    accountValidMinutes: 'Válido por 30 minutos',
    accountStep2Pull: 'Passo 2 · Puxar para este dispositivo',
    accountStep2Title: 'Inserir Código de Outro Dispositivo',
    accountStep2Desc: 'Tem um código de outro dispositivo? Introduza-o aqui para carregar essa despensa.',
    accountLoadRemote: 'Conectar e Carregar Despensa Remota',
    accountMultiDeviceSync: 'Sincronização multidispositivo',
    accountAutoCloudBackup: 'Cópia de segurança na nuvem',
    accountGetAndroid: 'Obter App Android',
    accountAndroidBannerDesc: 'Instale o WebAPK nativo no Android ou compile o APK assinado do GitHub.',

    notifyTitle: 'Notificações de Validade',
    notifySubtitle: 'Alertas em direto e prevenção de desperdício',
    notifyCritical: 'Validade Crítica',
    notifyApproaching: 'A Vencer em 2-3 Dias',
    notifyPast: 'Já Vencidos',
    notifyAllFresh: 'Tudo fresco!',
    notifyAllFreshDesc: 'Nenhum item na despensa expira nos próximos 3 dias. Continue a escanear as compras.',
    notifySchedule: 'Horário de Lembretes',
    notifyMorningCheck: 'Verificação Matinal do Frigorífico',
    notifyDinnerSuggestions: 'Sugestões para o Jantar',
    notifyUrgentThreshold: 'Limite de Alerta Urgente',
    notifyEnablePush: 'Ativar Notificações Push',
    notifyPushActive: 'Notificações do Navegador Ativas',
    notifyTestAlert: 'Enviar Alerta de Teste',

    voucherTitle: 'Cupom de Parceiro FreshSaver',
    voucherScanCheckout: 'Escanear no Caixa ou Usar Online',
    voucherPromoCode: 'CÓDIGO PROMOCIONAL',
    voucherCopy: 'Copiar Código',
    voucherCopied: 'Copiado!',
    voucherValidUntil: 'Válido Até',
    voucherDone: 'Concluído',

    aiChefTitle: 'Chef IA Desperdício Zero',
    aiChefSubtitle: 'Cria receitas personalizadas com Gemini AI dando prioridade aos alimentos mais próximos da validade.',
    aiChefTargeting: 'Priorizando Alimentos Próximos do Vencimento:',
    aiChefMealType: 'Tipo de Refeição',
    aiChefMaxTime: 'Tempo Máximo',
    aiChefDietary: 'Foco Alimentar',
    aiChefGenerateBtn: 'Gerar Receita Personalizada para Poupar Comida',
    aiChefCrafting: 'O Gemini AI está a preparar a receita...',
    aiChefIngredients: 'Lista de Ingredientes',
    aiChefInstructions: 'Instruções de Preparação',
    aiChefCookNow: 'Cozinhar Esta Receita Agora',
    aiChefAddMissing: 'Adicionar Faltantes à Lista de Compras',
    aiChefRegenerate: 'Gerar Novamente',
    aiChefInPantry: 'Na Despensa',
    aiChefPantryStaple: 'Básico comum',

    allergyProtectionActive: 'Proteção Antialérgica Ativa',
    allergyProtectionDesc: 'Alimentos com estes alergénios serão sinalizados na Despensa, Escâner e Lista. O Chef IA irá excluí-los.',
    allergyClearAll: 'Limpar todos',
    allergyActiveCount: 'ativos',
    allergyDairy: 'Laticínios e Leite',
    allergyWheatGluten: 'Trigo e Glúten',
    allergyPeanuts: 'Amendoim',
    allergyTreeNuts: 'Frutos Secos',
    allergyEggs: 'Ovos',
    allergySoy: 'Soja',
    allergyFish: 'Peixe',
    allergyShellfish: 'Crustáceos e Mariscos',
    allergySesame: 'Sésamo',
  },

  zh: {
    navPantry: '食品库',
    navShopping: '购物清单',
    navScan: '扫码录入',
    navRecipes: 'AI 食谱',
    navDonate: '捐赠投放点',
    navTopSavers: '减耗先锋榜',
    navAccount: '账户与云同步',
    navAndroid: '安卓 App',
    navGuidePdf: '说明文档 (PDF)',
    navSignInSync: '登录 / 云同步',
    navCloudSynced: '云端已同步',

    unitKg: '公斤',
    currencySymbol: '€',
    statRescuedKg: '拯救食材',
    statEurosSaved: '节省金额',
    statCo2Avoided: '减排 CO₂',
    statItemsCooked: '已烹饪餐数',
    statItemsDonated: '已捐赠件数',
    streakDays: '天连续减耗',

    statusExpired: '已过期',
    statusExpiresToday: '今日到期',
    status1DayLeft: '仅剩 1 天',
    statusDaysLeft: '天剩余',
    statusFresh: '新鲜',
    statusUrgent: '紧急 (≤3天)',
    statusSafe: '安全',

    catAll: '所有食材',
    catProduce: '蔬菜与生鲜果蔬',
    catDairy: '乳制品与蛋类',
    catMeat: '肉类与水产海鲜',
    catBakery: '烘焙与面包',
    catPantry: '常温食品与粮油',
    catFrozen: '冷冻速冻',
    catExpiringSoon: '临期告急 (≤3天)',

    locFridge: '冷藏室',
    locPantry: '常温储物柜',
    locFreezer: '冷冻柜',

    actionAdd: '添加',
    actionAddGroceries: '录入食材',
    actionEdit: '编辑',
    actionDelete: '删除',
    actionCancel: '取消',
    actionSave: '保存更改',
    actionCook: '烹饪',
    actionCookItem: '烹饪做菜',
    actionDonate: '捐赠',
    actionDonateItem: '捐赠该食物',
    actionMarkConsumed: '标记为已吃完',
    actionSearchPlaceholder: '按名称、分类或备注快速搜索食材...',
    actionSortBy: '排序方式',
    actionSortEarliest: '按保质期：最早到期',
    actionSortAlpha: '按字母顺序 (A-Z)',
    actionSortCategory: '按分类整理',
    actionSortRecent: '按最新录入时间',

    pantryTitle: '家庭食材管理库',
    pantrySubtitle: '实时监测食材保质期，遏制家庭食物浪费，让临期食材化身美味大餐或爱心捐助。',
    pantryEmptyTitle: '您的食材库当前为空！',
    pantryEmptyDesc: '使用摄像头扫码录入条形码、粘贴超市小票明细，或手动快速录入您的生鲜食材。',
    pantryAddFirstBtn: '立即扫描录入食材',
    pantryAlertHeadsUp: '注意！临期食材预警',
    pantryAlertMessage: '您有 {count} 种食材将在 3 天内到期，建议优先烹饪或爱心捐赠。',
    pantryEstValue: '预估价值',
    pantryShowingCount: '正在显示 {count} / {total} 种食材',

    shopTitle: '智能采购清单',
    shopSubtitle: '科学规划采购。勾选已购买的项目可一键自动转入食品库并预设保质期。',
    shopAddItemPlaceholder: '添加待购生鲜或日用品 (例如：全麦酸面团面包、2L有机鲜牛奶)...',
    shopAddBtn: '加入清单',
    shopConvertToPantryBtn: '将 {count} 件已购商品转入食品库',
    shopEmptyTitle: '购物清单暂无项目',
    shopEmptyDesc: '添加需要补充的生活必需品，或直接从 AI 食谱中一键导入缺少的食材。',
    shopClearCompleted: '清除已勾选',
    shopEstimatedTotal: '预估总额',

    scannerTitle: '食材扫码与录入中心',
    scannerSubtitle: '支持摄像头条码识别、超市购物小票 OCR 文本解析或手动极速录入。',
    scanTabCamera: '摄像头扫码',
    scanTabReceipt: '小票文本识别',
    scanTabManual: '手动快速录入',
    scanStartCamera: '开启摄像头扫码',
    scanStopCamera: '关闭摄像头',
    scanBarcodePlaceholder: '输入 UPC / EAN 商品条形码数字...',
    scanLookupBtn: '查询条形码',
    scanReceiptPlaceholder: '在此处粘贴超市购物小票文本或商品明细...',
    scanParseReceiptBtn: '智能解析小票清单',
    scanUploadReceiptImg: '上传小票照片',
    scanManualName: '食材商品名称',
    scanManualQty: '规格 / 份量',
    scanManualExpiryDays: '预计保质天数',
    scanManualSubmit: '添加到食品库',

    recipesTitle: 'AI 零浪费美食厨房',
    recipesSubtitle: '由 Google Gemini AI 驱动，深度结合食品库临期食材，为您智能量身定制零浪费美味佳肴。',
    recipesGenerateAiBtn: '根据临期食材智能生成 AI 食谱',
    recipesFilterAll: '全部食谱',
    recipesMatchScore: '食品库食材匹配度',
    recipesPrepTime: '备料时间',
    recipesCookTime: '烹饪时间',
    recipesServings: '食用份量',
    recipesMissingIngredients: '缺少辅料',
    recipesAddMissingToShop: '将缺少辅料一键加入采购清单',
    recipesCookMealBtn: '烹饪此道菜并记录拯救食物',

    donateTitle: '社区爱心食物捐赠点',
    donateSubtitle: '将未开封的多余食物捐赠给附近的食物银行、社区冰箱或爱心庇护所。',
    donateLogBtn: '登记食物捐赠',
    donateAcceptedTitle: '接受捐赠种类',
    donateCannotAcceptTitle: '暂不接收种类',
    donateHours: '开放时间',
    donatePhone: '联系电话',
    donateSelectModalTitle: '登记并记录食物捐赠',
    donateConfirmDropOff: '确认送达并获得先锋积分',

    saversTitle: '减耗先锋榜与超市专属折扣',
    saversSubtitle: '拯救食物避免浪费，减少碳排放，解锁合作超市最高 25% 独家立减优惠券。',
    saversCurrentTier: '当前减耗达人等级',
    saversLeaderboardTitle: '社区食物救助先锋排行榜',
    saversYourRank: '我的排名',
    saversDiscountsTitle: '合作生鲜超市专享折扣券',
    saversClaimDiscountBtn: '立即领取优惠券',
    saversClaimedBadge: '优惠券已领取',
    saversNextTierIn: '距离下一达人等级还需',

    accountTitle: '用户账户与多端云同步',
    accountSubtitle: '在手机、平板与电脑间安全同步您的食品库存、购物清单和减耗积分。',
    accountSignInTab: '登录账户',
    accountSignUpTab: '注册新账户',
    accountNameLabel: '真实姓名',
    accountEmailLabel: '电子邮箱',
    accountPasswordLabel: '设置密码',
    accountSignInBtn: '登录并同步云端食品库',
    accountSignUpBtn: '创建账户并启用云端备份',
    accountSignOutBtn: '退出当前登录',
    accountSyncNowBtn: '立即同步云端',
    accountDeviceCodeTitle: '极速设备配对中转站',
    accountGenerateCodeBtn: '生成 6 位设备同步码',
    accountEnterCodePlaceholder: '例如：749210',
    accountConnectCodeBtn: '验证同步码并拉取库存',
    accountPdfGuideTitle: 'FreshSaver 官方功能全景手册 (PDF)',
    accountPdfGuideDesc: '完整 5 页技术与功能全解，涵盖食品库、AI食谱、爱心捐助与安卓原生 PWA。',
    accountDownloadPdfBtn: '下载 PDF 说明书',
    accountLanguageLabel: '切换语言',

    allergyTitle: '个人过敏原与饮食禁忌',
    allergySubtitle: '选择您过敏或不耐受的食材。食品库与食谱中包含这些成分的项目将自动高亮警示或智能过滤。',
    allergyWarningBadge: '过敏警示：含有',
    allergyFilterSafeOnly: '仅显示适合我过敏原的安全食谱',
    allergyRecipeWarning: '警告：此食谱包含您设定的过敏原成分',
    allergyItemWarning: '该商品含有您过敏的食材成分',
    allergyNoneSelected: '暂未配置过敏原',
    allergySavedSuccess: '过敏原设置已更新！',

    saversAllPartners: '全部合作商户',
    saversUnlocked: '已解锁',
    saversKgReq: '需 {kg} kg',
    saversViewVoucher: '查看优惠券和条形码',
    saversSaveMoreKg: '再拯救 {kg} kg 解锁',
    saversTierRequired: '所需等级',
    saversHowItWorksTitle: 'FreshSaver 优惠折扣计划运作方式',
    saversStep1Title: '1. 扫描与追踪',
    saversStep1Desc: '购物时扫描小票或条形码，FreshSaver 自动记录保质期并监控临期时间。' ,
    saversStep2Title: '2. 烹饪或捐赠',
    saversStep2Desc: '利用推荐食谱在3天内做完临期食材，或将未拆封的多余食品送到社区爱心冰箱。',
    saversStep3Title: '3. 解锁超市折扣',
    saversStep3Desc: '每拯救一公斤食物即可提升环保等级，兑换高达 25% 优惠的合作超市折扣券。',
    saversTimeThisMonth: '本月',
    saversTimeThisWeek: '本周',
    saversTimeAllTime: '总榜',
    saversRankCol: '排名',
    saversSaverCol: '环保达人',
    saversTierCol: '等级',
    saversRescuedCol: '拯救食物',
    saversSavedCol: '节省金额',
    saversDiscountCol: '已获折扣',
    saversYouBadge: '你',
    saversNextTier: '下一等级',
    saversKgToUnlock: '(还需 {kg} kg 解锁)',
    saversUnlockedStatus: '(已解锁!)',

    accountCloudActive: '云同步生效中',
    accountPantrySynced: '食品库已同步',
    accountShoppingItems: '待购清单条目',
    accountItemsCount: '件',
    accountStep1Push: '步骤 1 · 从本设备共享',
    accountStep1Title: '生成多设备同步码',
    accountStep1Desc: '生成临时的 6 位同步密钥。在手机上输入此码即可即时镜像所有食品数据。',
    accountOneTimeCode: '一次性 6 位同步码',
    accountCopyCode: '复制同步码',
    accountCopied: '已复制！',
    accountValidMinutes: '30 分钟内有效',
    accountStep2Pull: '步骤 2 · 导入到本设备',
    accountStep2Title: '输入其他设备的同步码',
    accountStep2Desc: '在其他手机或电脑上获得了同步码？输入即可立即加载并同步该食品库。',
    accountLoadRemote: '连接并加载远程食品库',
    accountMultiDeviceSync: '多设备实时同步',
    accountAutoCloudBackup: '自动云端备份',
    accountGetAndroid: '下载 Android 应用',
    accountAndroidBannerDesc: '在 Android 上安装原生 WebAPK 或从 GitHub 编译已签名的 APK。',

    notifyTitle: '食品保质期通知',
    notifySubtitle: '实时预警与防浪费提醒',
    notifyCritical: '极度临期预警',
    notifyApproaching: '2-3天内临期',
    notifyPast: '已过期食材',
    notifyAllFresh: '所有食材都很新鲜！',
    notifyAllFreshDesc: '您的食品库中未来 3 天内没有即将过期的食物。继续扫描保持记录！',
    notifySchedule: '提醒时间表',
    notifyMorningCheck: '早间冰箱检查',
    notifyDinnerSuggestions: '晚餐食谱推荐',
    notifyUrgentThreshold: '紧急过期阈值',
    notifyEnablePush: '开启推送通知',
    notifyPushActive: '浏览器通知已开启',
    notifyTestAlert: '发送测试预警提醒',

    voucherTitle: '环保省钱达人合作超市优惠券',
    voucherScanCheckout: '结账时扫描条形码或在线使用',
    voucherPromoCode: '优惠码',
    voucherCopy: '复制优惠码',
    voucherCopied: '已复制！',
    voucherValidUntil: '有效期至',
    voucherDone: '完成',

    aiChefTitle: 'AI 零浪费主厨',
    aiChefSubtitle: '由 Gemini AI 为您量身定制美食食谱，优先消化食品库中最快临期的食材。',
    aiChefTargeting: '重点消化的临期食材：',
    aiChefMealType: '餐食类型',
    aiChefMaxTime: '最长烹饪时间',
    aiChefDietary: '饮食偏好',
    aiChefGenerateBtn: '生成专属拯救食材食谱',
    aiChefCrafting: 'Gemini AI 正在为您创作食谱...',
    aiChefIngredients: '食材清单',
    aiChefInstructions: '烹饪步骤',
    aiChefCookNow: '立即烹饪此食谱',
    aiChefAddMissing: '将缺少食材加入购物清单',
    aiChefRegenerate: '重新生成',
    aiChefInPantry: '已有食材',
    aiChefPantryStaple: '常备基础料',

    allergyProtectionActive: '过敏原防护已开启',
    allergyProtectionDesc: '含有选中过敏原的食品将在食品库、扫描仪和购物清单中高亮警示。AI 食谱工作室将自动排除这些成分。',
    allergyClearAll: '清空全部',
    allergyActiveCount: '项已生效',
    allergyDairy: '奶制品与牛奶',
    allergyWheatGluten: '小麦与麸质',
    allergyPeanuts: '花生',
    allergyTreeNuts: '坚果类',
    allergyEggs: '蛋类',
    allergySoy: '大豆',
    allergyFish: '鱼类',
    allergyShellfish: '甲壳类与贝类海鲜',
    allergySesame: '芝麻',
  },

  gl: {
    navPantry: 'Despensa',
    navShopping: 'Lista da Compra',
    navScan: 'Escanear e Engadir',
    navRecipes: 'Receitas IA',
    navDonate: 'Doazón de Alimentos',
    navTopSavers: 'Mellores Aforradores',
    navAccount: 'Conta e Sincronización',
    navAndroid: 'App Android',
    navGuidePdf: 'Guía (PDF)',
    navSignInSync: 'Iniciar Sesión / Sincronizar',
    navCloudSynced: 'Sincronizado na Nube',

    unitKg: 'kg',
    currencySymbol: '€',
    statRescuedKg: 'Comida Rescatada',
    statEurosSaved: 'Diñeiro Aforrado',
    statCo2Avoided: 'CO₂ Evitado',
    statItemsCooked: 'Comidas Cociñadas',
    statItemsDonated: 'Artigos Doados',
    streakDays: 'días de refacho',

    statusExpired: 'Caducado',
    statusExpiresToday: 'Caduca Hoxe',
    status1DayLeft: '1 Día Restante',
    statusDaysLeft: 'días restantes',
    statusFresh: 'Fresco',
    statusUrgent: 'Urxente (≤3d)',
    statusSafe: 'Seguro',

    catAll: 'Tódolos Artigos',
    catProduce: 'Froitas e Verduras',
    catDairy: 'Lácteos e Ovos',
    catMeat: 'Carne e Peixe',
    catBakery: 'Panadaría',
    catPantry: 'Despensa e Secos',
    catFrozen: 'Conxelados',
    catExpiringSoon: 'Caducan Axiña (≤3d)',

    locFridge: 'Frigorífico',
    locPantry: 'Despensa',
    locFreezer: 'Conxelador',

    actionAdd: 'Engadir',
    actionAddGroceries: 'Engadir Alimentos',
    actionEdit: 'Editar',
    actionDelete: 'Eliminar',
    actionCancel: 'Cancelar',
    actionSave: 'Gardar Cambios',
    actionCook: 'Cociñar',
    actionCookItem: 'Cociñar Receita',
    actionDonate: 'Doar',
    actionDonateItem: 'Doar Artigo',
    actionMarkConsumed: 'Marcar Consumido',
    actionSearchPlaceholder: 'Buscar alimentos por nome, categoría ou nota...',
    actionSortBy: 'Ordenar',
    actionSortEarliest: 'Ordenar: Caducidade Máis Próxima',
    actionSortAlpha: 'Ordenar: Alfabético (A-Z)',
    actionSortCategory: 'Ordenar: Categoría',
    actionSortRecent: 'Ordenar: Engadidos Recentemente',

    pantryTitle: 'A Miña Despensa de Alimentos',
    pantrySubtitle: 'Controla datas de caducidade, evita o despilfarro e aproveita a comida antes de que estrague.',
    pantryEmptyTitle: 'A túa despensa está completamente baleira!',
    pantryEmptyDesc: 'Escanea códigos de barras coa túa cámara, pega un tícket de supermercado ou engade produtos a man.',
    pantryAddFirstBtn: 'Escanear e Engadir Alimentos',
    pantryAlertHeadsUp: 'Atención! Alimentos a Piques de Caducar',
    pantryAlertMessage: 'Tes {count} artigo(s) que caducan en menos de 3 días. Cociña ou doa antes de que se estraguen.',
    pantryEstValue: 'Valor est.',
    pantryShowingCount: 'Amosando {count} de {total} artigos',

    shopTitle: 'Lista Intelixente da Compra',
    shopSubtitle: 'Planifica as túas compras. Os produtos marcados como mercados pasan automaticamente á túa despensa.',
    shopAddItemPlaceholder: 'Engadir alimento (ex: Pan de Broa, 2L Leite, Mazás Frescas)...',
    shopAddBtn: 'Engadir á Lista',
    shopConvertToPantryBtn: 'Converter {count} Produto(s) en Comida da Despensa',
    shopEmptyTitle: 'A lista da compra está baleira',
    shopEmptyDesc: 'Engade básicos que precises repoñer ou importa ingredientes que falten dende calquera receita IA.',
    shopClearCompleted: 'Limpar Mercados',
    shopEstimatedTotal: 'Total Estimado',

    scannerTitle: 'Escáner de Alimentos e Rexistro',
    scannerSubtitle: 'Rexistra rapidamente alimentos na despensa mediante código de barras, lectura de tíckets ou entrada manual.',
    scanTabCamera: 'Cámara Escáner en Vivo',
    scanTabReceipt: 'Lector OCR de Tíckets',
    scanTabManual: 'Entrada Rápida Manual',
    scanStartCamera: 'Abrir Cámara Escáner',
    scanStopCamera: 'Parar Cámara',
    scanBarcodePlaceholder: 'Introduce díxitos do código de barras UPC / EAN...',
    scanLookupBtn: 'Buscar Código',
    scanReceiptPlaceholder: 'Pega as liñas do tícket do supermercado aquí...',
    scanParseReceiptBtn: 'Procesar Liñas do Tícket',
    scanUploadReceiptImg: 'Subir Foto de Tícket',
    scanManualName: 'Nome do Alimento',
    scanManualQty: 'Cantidade / Tamaño',
    scanManualExpiryDays: 'Días de Vida Útil',
    scanManualSubmit: 'Engadir á Despensa',

    recipesTitle: 'Estudio de Receitas IA Sen Desperdicio',
    recipesSubtitle: 'Crea receitas personalizadas con Gemini AI dando prioridade aos alimentos que van caducar na despensa.',
    recipesGenerateAiBtn: 'Xerar Receita IA con Alimentos Próximos a Caducar',
    recipesFilterAll: 'Tódalas Receitas',
    recipesMatchScore: 'Coincidencia Despensa',
    recipesPrepTime: 'Prep',
    recipesCookTime: 'Cocción',
    recipesServings: 'Racións',
    recipesMissingIngredients: 'Ingredientes que Faltan',
    recipesAddMissingToShop: 'Engadir os que Faltan á Lista da Compra',
    recipesCookMealBtn: 'Cociñar Esta Receita e Salvar Alimentos',

    donateTitle: 'Puntos Locais de Doazón de Comida',
    donateSubtitle: 'Doa alimentos sans e sen abrir a bancos de alimentos, neveiras solidarias e comedores comunitarios.',
    donateLogBtn: 'Rexistrar Doazón',
    donateAcceptedTitle: 'Alimentos Aceptados',
    donateCannotAcceptTitle: 'Non Aceptados',
    donateHours: 'Horario',
    donatePhone: 'Teléfono',
    donateSelectModalTitle: 'Rexistrar Entrega de Alimentos',
    donateConfirmDropOff: 'Confirmar Entrega e Gañar Puntos',

    saversTitle: 'Clasificación de Aforradores e Descontos',
    saversSubtitle: 'Rescata comida, reduce as emisións de carbono e consegue descontos reais en supermercados colaboradores.',
    saversCurrentTier: 'Nivel Actual de Aforrador',
    saversLeaderboardTitle: 'Ranking Comunitario de Rescate de Alimentos',
    saversYourRank: 'O Teu Posto',
    saversDiscountsTitle: 'Descontos Exclusivos en Tendas Colaboradoras',
    saversClaimDiscountBtn: 'Trocar Cupón de Desconto',
    saversClaimedBadge: 'Cupón Trocado',
    saversNextTierIn: 'Seguinte nivel en',

    accountTitle: 'Conta e Sincronización na Nube',
    accountSubtitle: 'Sincroniza a túa despensa, lista da compra e fitos en tódolos teus móbiles, tabletas e ordenadores.',
    accountSignInTab: 'Iniciar Sesión',
    accountSignUpTab: 'Crear Conta',
    accountNameLabel: 'Nome Completo',
    accountEmailLabel: 'Correo Electrónico',
    accountPasswordLabel: 'Contrasinal',
    accountSignInBtn: 'Iniciar Sesión e Cargar Despensa',
    accountSignUpBtn: 'Crear Conta e Activar Nube',
    accountSignOutBtn: 'Pechar Sesión',
    accountSyncNowBtn: 'Sincronizar Nube Agora',
    accountDeviceCodeTitle: 'Sincronización Rápida entre Dispositivos',
    accountGenerateCodeBtn: 'Xerar Código de 6 Díxitos',
    accountEnterCodePlaceholder: 'ex: 749210',
    accountConnectCodeBtn: 'Conectar e Cargar Despensa Remota',
    accountPdfGuideTitle: 'Guía Oficial de Funcionalidades FreshSaver (PDF)',
    accountPdfGuideDesc: 'Manual completo de 5 páxinas sobre despensa, receitas IA, doazóns e PWA Android.',
    accountDownloadPdfBtn: 'Descargar PDF',
    accountLanguageLabel: 'Seleccionar Idioma',

    allergyTitle: 'Alerxias Persoais e Intolerancias',
    allergySubtitle: 'Selecciona os ingredientes aos que tes alerxia. Os alimentos e receitas que os conteñan marcaranse ou excluiranse de xeito automático.',
    allergyWarningBadge: 'Alerta de Alerxia: Contén',
    allergyFilterSafeOnly: 'Só Aptos para as Miñas Alerxias',
    allergyRecipeWarning: 'Aviso: Esta receita contén alérxenos que indicaches',
    allergyItemWarning: 'Contén un ingrediente ao que tes alerxia',
    allergyNoneSelected: 'Sen alerxias configuradas',
    allergySavedSuccess: 'Alerxias actualizadas con éxito!',

    saversAllPartners: 'Tódolos Colaboradores',
    saversUnlocked: 'Desbloqueado',
    saversKgReq: '{kg} kg nec.',
    saversViewVoucher: 'Ver Cupón e Código',
    saversSaveMoreKg: 'Aforra {kg} kg máis',
    saversTierRequired: 'Nivel Requirido',
    saversHowItWorksTitle: 'Como Funciona o Programa de Descontos FreshSaver',
    saversStep1Title: '1. Escanear e Controlar',
    saversStep1Desc: 'Escanea os teus tíckets ou códigos ao mercar. FreshSaver calcula a vida útil e vixía as datas.',
    saversStep2Title: '2. Cociñar ou Doar',
    saversStep2Desc: 'Aproveita receitas para cociñar produtos que caducan en 3 días, ou doa comida a neveiras solidarias.',
    saversStep3Title: '3. Desbloquear Descontos',
    saversStep3Desc: 'Cada kg rescatado suma para o teu nivel. Troca cupóns reais para aforrar ata un 25% na túa compra.',
    saversTimeThisMonth: 'Este Mes',
    saversTimeThisWeek: 'Esta Semana',
    saversTimeAllTime: 'Todo o Tempo',
    saversRankCol: 'Posto',
    saversSaverCol: 'Aforrador',
    saversTierCol: 'Nivel',
    saversRescuedCol: 'Comida Rescatada',
    saversSavedCol: 'Valor Aforrado',
    saversDiscountCol: 'Desconto Obtido',
    saversYouBadge: 'TI',
    saversNextTier: 'Seguinte Nivel',
    saversKgToUnlock: '({kg} kg para desbloquear)',
    saversUnlockedStatus: '(Desbloqueado!)',

    accountCloudActive: 'Nube Activa',
    accountPantrySynced: 'Despensa Sincronizada',
    accountShoppingItems: 'Artigos da Compra',
    accountItemsCount: 'artigos',
    accountStep1Push: 'Paso 1 · Enviar dende este dispositivo',
    accountStep1Title: 'Xerar Código de Sincronización',
    accountStep1Desc: 'Crea unha clave temporal de 6 díxitos. Introdúcea no teu móbil para clonar a túa despensa ao instante.',
    accountOneTimeCode: 'CÓDIGO DE USO ÚNICO',
    accountCopyCode: 'Copiar Código',
    accountCopied: 'Código Copiado!',
    accountValidMinutes: 'Válido durante 30 minutos',
    accountStep2Pull: 'Paso 2 · Traer a este dispositivo',
    accountStep2Title: 'Introducir Código doutro Dispositivo',
    accountStep2Desc: 'Tes un código doutro móbil ou ordenador? Introdúceo aquí para cargar e sincronizar esa despensa.',
    accountLoadRemote: 'Conectar e Cargar Despensa Remota',
    accountMultiDeviceSync: 'Sincronización multidispositivo',
    accountAutoCloudBackup: 'Copia de seguridade na nube',
    accountGetAndroid: 'Descargar App Android',
    accountAndroidBannerDesc: 'Instala a WebAPK nativa en Android ou compila o APK asinado dende GitHub.',

    notifyTitle: 'Notificacións de Caducidade',
    notifySubtitle: 'Alertas en directo e prevención de desperdicio',
    notifyCritical: 'Caducidade Crítica',
    notifyApproaching: 'Caduca en 2-3 Días',
    notifyPast: 'Xa Caducados',
    notifyAllFresh: 'Todo está fresco!',
    notifyAllFreshDesc: 'Ningún artigo da túa despensa caduca nos vindeiros 3 días. Segue escaneando a túa compra.',
    notifySchedule: 'Horario de Avisos',
    notifyMorningCheck: 'Revisión Matinal da Neveira',
    notifyDinnerSuggestions: 'Suxestións para a Cea',
    notifyUrgentThreshold: 'Límite de Alerta Urxente',
    notifyEnablePush: 'Activar Notificacións Push',
    notifyPushActive: 'Notificacións do Navegador Activas',
    notifyTestAlert: 'Enviar Alerta de Proba',

    voucherTitle: 'Cupón de Desconto de Colaborador',
    voucherScanCheckout: 'Escanear en Caixa ou Aplicar Online',
    voucherPromoCode: 'CÓDIGO PROMOCIONAL',
    voucherCopy: 'Copiar Código',
    voucherCopied: 'Copiado!',
    voucherValidUntil: 'Válido Ata',
    voucherDone: 'Feito',

    aiChefTitle: 'Chef IA Residuo Cero',
    aiChefSubtitle: 'Crea receitas personalizadas con Gemini AI dando prioridade aos alimentos máis próximos a caducar.',
    aiChefTargeting: 'Priorizando Alimentos Máis Próximos a Caducar:',
    aiChefMealType: 'Tipo de Comida',
    aiChefMaxTime: 'Tempo Máximo',
    aiChefDietary: 'Enfoque Dietético',
    aiChefGenerateBtn: 'Xerar Receita Personalizada para Rescatar Comida',
    aiChefCrafting: 'Gemini IA está a preparar a túa receita...',
    aiChefIngredients: 'Lista de Ingredientes',
    aiChefInstructions: 'Instrucións de Cociña',
    aiChefCookNow: 'Cociñar Esta Receita Agora',
    aiChefAddMissing: 'Engadir os que Faltan á Lista da Compra',
    aiChefRegenerate: 'Xerar de Novo',
    aiChefInPantry: 'Na Despensa',
    aiChefPantryStaple: 'Básico común',

    allergyProtectionActive: 'Protección Antialérxica Activa',
    allergyProtectionDesc: 'Os alimentos con estes alérxenos marcaranse na túa Despensa, Escáner e Lista. O Chef IA excluirá estes ingredientes das receitas.',
    allergyClearAll: 'Borrar todas',
    allergyActiveCount: 'activas',
    allergyDairy: 'Lácteos e Leite',
    allergyWheatGluten: 'Trigo e Glute',
    allergyPeanuts: 'Cacahuetes',
    allergyTreeNuts: 'Froitos de Casca',
    allergyEggs: 'Ovos',
    allergySoy: 'Soia',
    allergyFish: 'Peixe',
    allergyShellfish: 'Mariscos e Crustáceos',
    allergySesame: 'Sésamo',
  },
};
