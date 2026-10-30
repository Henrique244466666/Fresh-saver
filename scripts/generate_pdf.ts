import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

async function generateDocumentationPDF() {
  const doc = await PDFDocument.create();
  
  // Embed standard Helvetica fonts
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique);
  const fontBoldItalic = await doc.embedFont(StandardFonts.HelveticaBoldOblique);

  // Palette
  const primaryEmerald = rgb(5 / 255, 150 / 255, 105 / 255); // #059669
  const darkSlate = rgb(15 / 255, 23 / 255, 42 / 255);       // #0f172a
  const textMuted = rgb(71 / 255, 85 / 255, 105 / 255);      // #475569
  const lightBg = rgb(248 / 255, 250 / 255, 252 / 255);       // #f8fafc
  const cardBorder = rgb(226 / 255, 232 / 255, 240 / 255);    // #e2e8f0
  const badgeBg = rgb(236 / 255, 253 / 255, 245 / 255);       // #ecfdf5
  const badgeBorder = rgb(167 / 255, 243 / 255, 208 / 255);   // #a7f3d0
  const amberColor = rgb(217 / 255, 119 / 255, 6 / 255);      // #d97706
  const amberBg = rgb(254 / 255, 243 / 255, 199 / 255);       // #fef3c7

  const PAGE_WIDTH = 595.28; // Standard A4 points
  const PAGE_HEIGHT = 841.89;
  const MARGIN_X = 48;
  const MARGIN_TOP = 52;
  const MARGIN_BOTTOM = 54;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

  let currentPage: PDFPage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let currentY = PAGE_HEIGHT - MARGIN_TOP;

  function newPage() {
    currentPage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    currentY = PAGE_HEIGHT - MARGIN_TOP;
  }

  function ensureSpace(neededHeight: number) {
    if (currentY - neededHeight < MARGIN_BOTTOM) {
      newPage();
    }
  }

  // Draw header bar on each page
  function drawPageHeader(title: string) {
    currentPage.drawRectangle({
      x: MARGIN_X,
      y: currentY - 2,
      width: CONTENT_WIDTH,
      height: 1.5,
      color: primaryEmerald,
    });
    currentPage.drawText('FRESHSAVER  |  SYSTEM SPECIFICATION & FEATURE GUIDE', {
      x: MARGIN_X,
      y: currentY + 4,
      size: 7.5,
      font: fontBold,
      color: primaryEmerald,
    });
    currentPage.drawText(title.toUpperCase(), {
      x: PAGE_WIDTH - MARGIN_X - (title.length * 4.5),
      y: currentY + 4,
      size: 7.5,
      font: fontRegular,
      color: textMuted,
    });
    currentY -= 18;
  }

  // Draw Section Header
  function drawSectionHeader(title: string, subtitle?: string) {
    ensureSpace(60);
    currentPage.drawRectangle({
      x: MARGIN_X,
      y: currentY - 24,
      width: 4,
      height: 22,
      color: primaryEmerald,
    });
    currentPage.drawText(title, {
      x: MARGIN_X + 12,
      y: currentY - 18,
      size: 15,
      font: fontBold,
      color: darkSlate,
    });
    currentY -= 30;

    if (subtitle) {
      currentPage.drawText(subtitle, {
        x: MARGIN_X + 12,
        y: currentY,
        size: 9.5,
        font: fontItalic,
        color: textMuted,
      });
      currentY -= 16;
    }
  }

  // Draw Subheading
  function drawSubheading(text: string) {
    ensureSpace(35);
    currentPage.drawText(text, {
      x: MARGIN_X,
      y: currentY,
      size: 11.5,
      font: fontBold,
      color: darkSlate,
    });
    currentY -= 16;
  }

  // Draw paragraph with word wrapping
  function drawParagraph(text: string, options?: { indent?: number; fontSize?: number; color?: any; font?: PDFFont; lineHeight?: number }) {
    const fontSize = options?.fontSize || 9.5;
    const font = options?.font || fontRegular;
    const color = options?.color || darkSlate;
    const indent = options?.indent || 0;
    const lineHeight = options?.lineHeight || (fontSize + 4.5);
    const maxWidth = CONTENT_WIDTH - indent;

    const words = text.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (textWidth > maxWidth) {
        ensureSpace(lineHeight);
        currentPage.drawText(currentLine, {
          x: MARGIN_X + indent,
          y: currentY,
          size: fontSize,
          font: font,
          color: color,
        });
        currentY -= lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine.length > 0) {
      ensureSpace(lineHeight);
      currentPage.drawText(currentLine, {
        x: MARGIN_X + indent,
        y: currentY,
        size: fontSize,
        font: font,
        color: color,
      });
      currentY -= lineHeight;
    }

    currentY -= 4; // small spacing after paragraph
  }

  // Draw bullet point
  function drawBullet(boldPrefix: string, text: string) {
    const fontSize = 9;
    const lineHeight = 13.5;
    const bulletIndent = 14;
    const maxWidth = CONTENT_WIDTH - bulletIndent;

    ensureSpace(lineHeight * 2);

    // Bullet icon/dot
    currentPage.drawCircle({
      x: MARGIN_X + 5,
      y: currentY + 3,
      size: 2.2,
      color: primaryEmerald,
    });

    const fullText = `${boldPrefix} ${text}`;
    const words = fullText.split(' ');
    let currentLine = '';
    let isFirstLine = true;

    for (const word of words) {
      const testLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
      const textWidth = fontRegular.widthOfTextAtSize(testLine, fontSize);
      if (textWidth > maxWidth) {
        ensureSpace(lineHeight);
        renderBulletLine(currentLine, isFirstLine, boldPrefix, fontSize);
        currentY -= lineHeight;
        currentLine = word;
        isFirstLine = false;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine.length > 0) {
      ensureSpace(lineHeight);
      renderBulletLine(currentLine, isFirstLine, boldPrefix, fontSize);
      currentY -= lineHeight;
    }

    currentY -= 2;
  }

  function renderBulletLine(lineText: string, isFirstLine: boolean, boldPrefix: string, fontSize: number) {
    if (isFirstLine && boldPrefix && lineText.startsWith(boldPrefix)) {
      const prefixWidth = fontBold.widthOfTextAtSize(boldPrefix, fontSize);
      currentPage.drawText(boldPrefix, {
        x: MARGIN_X + 14,
        y: currentY,
        size: fontSize,
        font: fontBold,
        color: darkSlate,
      });
      const remainder = lineText.substring(boldPrefix.length);
      currentPage.drawText(remainder, {
        x: MARGIN_X + 14 + prefixWidth,
        y: currentY,
        size: fontSize,
        font: fontRegular,
        color: darkSlate,
      });
    } else {
      currentPage.drawText(lineText, {
        x: MARGIN_X + 14,
        y: currentY,
        size: fontSize,
        font: fontRegular,
        color: darkSlate,
      });
    }
  }

  // Draw a styled highlight card
  function drawCard(title: string, bullets: Array<{ prefix: string; text: string }>, badgeText?: string) {
    const cardHeight = 36 + bullets.length * 19;
    ensureSpace(cardHeight + 12);

    // Card background
    currentPage.drawRectangle({
      x: MARGIN_X,
      y: currentY - cardHeight,
      width: CONTENT_WIDTH,
      height: cardHeight,
      color: lightBg,
      borderColor: cardBorder,
      borderWidth: 1,
    });

    // Top border accent
    currentPage.drawRectangle({
      x: MARGIN_X,
      y: currentY - 2,
      width: CONTENT_WIDTH,
      height: 2,
      color: primaryEmerald,
    });

    // Title
    currentPage.drawText(title, {
      x: MARGIN_X + 14,
      y: currentY - 20,
      size: 11,
      font: fontBold,
      color: darkSlate,
    });

    // Optional badge
    if (badgeText) {
      const badgeWidth = fontBold.widthOfTextAtSize(badgeText, 7.5) + 12;
      currentPage.drawRectangle({
        x: MARGIN_X + CONTENT_WIDTH - badgeWidth - 12,
        y: currentY - 22,
        width: badgeWidth,
        height: 14,
        color: badgeBg,
        borderColor: badgeBorder,
        borderWidth: 1,
      });
      currentPage.drawText(badgeText, {
        x: MARGIN_X + CONTENT_WIDTH - badgeWidth - 6,
        y: currentY - 18,
        size: 7.5,
        font: fontBold,
        color: primaryEmerald,
      });
    }

    currentY -= 32;

    for (const b of bullets) {
      drawBullet(b.prefix, b.text);
    }

    currentY -= 8;
  }

  // ==========================================
  // PAGE 1: TITLE COVER & EXECUTIVE SUMMARY
  // ==========================================

  // Hero Cover Header Banner
  currentPage.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 170,
    width: PAGE_WIDTH,
    height: 170,
    color: primaryEmerald,
  });

  // App Title & Tagline in Banner
  currentPage.drawText('FreshSaver', {
    x: MARGIN_X,
    y: PAGE_HEIGHT - 75,
    size: 34,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  currentPage.drawText('SMART FOOD TRACKING, RECIPE GENERATION & FOOD RESCUE PLATFORM', {
    x: MARGIN_X,
    y: PAGE_HEIGHT - 98,
    size: 9.5,
    font: fontBold,
    color: rgb(209 / 255, 250 / 255, 229 / 255), // light mint
  });

  currentPage.drawText('Comprehensive Functionality & Architecture Guide  |  Version 2.0  |  Production Release', {
    x: MARGIN_X,
    y: PAGE_HEIGHT - 124,
    size: 8.5,
    font: fontRegular,
    color: rgb(240 / 255, 253 / 255, 244 / 255),
  });

  currentY = PAGE_HEIGHT - 200;

  drawParagraph(
    'FreshSaver is a full-featured, zero-waste grocery intelligence system engineered to eliminate household food waste. The platform provides real-time barcode and receipt scanning, intelligent shelf-life tracking, automated expiry notifications, generative AI meal creation prioritizing at-risk ingredients, direct community food bank donations, smart shopping lists with automatic inventory transformation, and a competitive community leaderboard offering real savings discounts.',
    { fontSize: 10, lineHeight: 15, color: darkSlate }
  );

  currentY -= 6;

  // Executive Core Pillars
  drawSubheading('Executive Overview of Application Pillars');

  drawCard('1. Real-Time Pantry Inventory & Expiration Engine', [
    { prefix: 'Smart Lifecycle Badging:', text: 'Calculates dynamic expiration windows with color-coded urgency states (Expired, Urgent <= 3 days, Safe).' },
    { prefix: 'Granular Organization:', text: 'Filter and sort inventory by category (Produce, Dairy, Meat, Pantry, Bakery, Freezer) and physical storage location.' },
    { prefix: 'Instant Actions:', text: 'One-tap controls to mark food consumed, donate directly to local charities, adjust quantities, or edit shelf life.' }
  ], 'CORE ENGINE');

  drawCard('2. Multi-Mode Scanner: Barcodes, Receipts & Quick Add', [
    { prefix: 'Camera Barcode Scanner:', text: 'Browser BarcodeDetector API with real-time continuous video preview and Open Food Facts API product lookup.' },
    { prefix: 'OCR Receipt Parser:', text: 'Ingests itemized supermarket receipts and extracts line items, quantities, and auto-assigns category shelf lives.' },
    { prefix: 'Custom Manual Entry:', text: 'Includes pre-configured food category expiration presets and manual date overrides for farmers-market goods.' }
  ], 'SCANNER');

  drawCard('3. Zero-Waste AI Recipe Studio (Powered by Gemini AI)', [
    { prefix: 'Expiring Ingredients First:', text: 'Prioritizes pantry items nearest to expiration to prevent spoilage before it happens.' },
    { prefix: 'Dietary Customization:', text: 'Customized recipes for Vegan, Vegetarian, Gluten-Free, High-Protein, Quick (<20m), and Kid-Friendly diets.' },
    { prefix: 'Pantry Match Score:', text: 'Analyzes which ingredients you have and lists missing staples with one-click additions to your shopping list.' }
  ], 'AI STUDIO');

  // ==========================================
  // PAGE 2: INVENTORY & SCANNER DEEP DIVE
  // ==========================================
  newPage();
  drawPageHeader('Module 1: Pantry & Scanner Specifications');

  drawSectionHeader('1. Pantry Lifecycle & Expiration Monitoring', 'Automated freshness tracking, days-left countdowns, and storage management.');

  drawParagraph(
    'The Pantry module acts as the central command center for all food items currently owned by the user. Each food entry maintains rich metadata including date added, estimated expiry date, calculated days remaining, quantity, unit type, category, and storage zone.'
  );

  drawBullet('Dynamic Expiry Formula:', 'Days remaining are calculated daily relative to midnight local time. The system categorizes items into three critical tiers:');
  drawBullet('  • Red (Expired or Expiring Today):', 'Items requiring immediate use or compost logging.');
  drawBullet('  • Amber (Urgent - 1 to 3 Days):', 'High-priority items automatically flagged for AI recipe generation and donation suggestions.');
  drawBullet('  • Emerald (Fresh - 4+ Days):', 'Standard items safely stored with plenty of shelf life remaining.');
  drawBullet('Physical Storage Zones:', 'Supports distinct separation between Fridge, Freezer, and Pantry/Dry Storage to accommodate differing shelf-life realities.');
  drawBullet('Quick Filtration & Search:', 'Instant search query matching item names, plus category chips (All, Produce, Dairy, Meat, Bakery, Pantry, Frozen).');
  drawBullet('Lifecycle State Transitions:', 'Items can transition into Consumed (earning food saver XP), Donated (generating donation manifest), or Removed.');

  currentY -= 8;
  drawSectionHeader('2. Multi-Mode Scanner System', 'Hardware camera barcode scanning, receipt OCR, and manual entry.');

  drawParagraph(
    'FreshSaver eliminates tedious manual food entry by providing three unified input methods designed for speed and convenience.'
  );

  drawSubheading('Camera Barcode Scanning');
  drawBullet('Hardware Camera Access:', 'Requests standard video capture with autofocus and environment (rear) camera preference.');
  drawBullet('Native BarcodeDetector Integration:', 'Leverages modern browser hardware acceleration supporting EAN-13, EAN-8, UPC-A, UPC-E, and QR codes.');
  drawBullet('Product Data Resolution:', 'Scanned barcodes query the global Open Food Facts API database, retrieving official brand names, food categories, and package weights.');
  drawBullet('Automatic Expiration Projection:', 'Assigns realistic baseline expiration dates based on recognized categories (e.g. Dairy defaults to 7 days, Fresh Meat to 4 days, Pantry dry goods to 90 days).');

  drawSubheading('Smart Supermarket Receipt Parser');
  drawBullet('Line-by-Line Tokenizer:', 'Users can paste or capture raw text from digital receipts, supermarket loyalty emails, or delivery summaries.');
  drawBullet('Receipt Cleanup Heuristics:', 'Strips out store codes, dates, transaction IDs, tax lines, and currency amounts ($0.00) to isolate genuine food names.');
  drawBullet('Batch Ingestion:', 'Adds 10 to 30 items to the pantry inventory in a single click, saving users 15+ minutes of manual entry per shopping trip.');

  // ==========================================
  // PAGE 3: AI RECIPES & DONATIONS
  // ==========================================
  newPage();
  drawPageHeader('Module 2: AI Recipe Studio & Food Rescue');

  drawSectionHeader('3. Generative AI Recipe Studio', 'Zero-waste culinary intelligence powered by Google Gemini AI.');

  drawParagraph(
    'Food waste often occurs because households do not know how to combine disparate, half-used ingredients. The AI Recipe Studio analyzes your unique pantry inventory and constructs tailored, appetizing recipes designed specifically to rescue expiring goods.'
  );

  drawCard('Gemini AI Recipe Generation Engine', [
    { prefix: 'Pantry-Aware Prompts:', text: 'Injects urgent items expiring within 3 days into the system prompt with explicit instructions to prioritize them.' },
    { prefix: 'Dietary & Lifestyle Filters:', text: 'Enforces user preferences: Vegetarian, Vegan, Gluten-Free, High-Protein, Quick & Easy (<20 mins), and Family-Friendly.' },
    { prefix: 'Structured Recipe Output:', text: 'Generates detailed step-by-step instructions, prep and cook timings, difficulty rankings, estimated calories, and pantry utilization scores.' },
    { prefix: 'Missing Ingredients Sync:', text: 'Identifies missing pantry staples and allows users to push missing items directly into their Shopping List with one tap.' },
    { prefix: 'Offline Recipe Library:', text: 'Includes a robust curated offline fallback database with smart ingredient matching if internet access or API connectivity is temporarily unavailable.' }
  ], 'AI INTEGRATION');

  currentY -= 6;
  drawSectionHeader('4. Local Food Donation & Community Rescue', 'Connecting surplus edible food to local food banks and community fridges.');

  drawParagraph(
    'When households realize they have surplus edible food that will not be consumed in time, FreshSaver facilitates seamless donation to verified local charities, emergency food pantries, and community fridges.'
  );

  drawBullet('Verified Community Directory:', 'Built-in directory of community food organizations featuring street addresses, hours of operation, phone numbers, and distance markers.');
  drawBullet('Accepted Foods Filter:', 'Clear guidelines indicating which organizations accept fresh produce, sealed dairy, unexpired canned items, or prepared meals.');
  drawBullet('Digital Donation Manifest:', 'Select expiring items directly from your pantry to generate an itemized digital receipt/manifest to hand over to volunteers upon drop-off.');
  drawBullet('Impact Tracking & Rewards:', 'Every item donated awards bonus Food Saver XP and community tier points, reflecting tangible community impact.');

  // ==========================================
  // PAGE 4: SHOPPING LIST & TOP SAVERS LEADERBOARD
  // ==========================================
  newPage();
  drawPageHeader('Module 3: Shopping List, Gamification & Accounts');

  drawSectionHeader('5. Smart Shopping List with Auto-Pantry Conversion', 'Seamless cycle from planning to purchasing to pantry tracking.');

  drawParagraph(
    'FreshSaver closes the food lifecycle loop through an interactive shopping list. Instead of re-typing groceries when you get home from the store, the list directly promotes bought items into active pantry tracking.'
  );

  drawBullet('One-Tap Auto-Pantry Transition:', 'Checking off an item prompts the user or automatically converts the grocery item into a live pantry item.');
  drawBullet('Pre-Assigned Expiry Presets:', 'Items inherit category shelf lives upon purchase, eliminating manual date calculation.');
  drawBullet('Recipe Integration:', 'Add missing ingredients directly from any generated recipe with a single tap.');
  drawBullet('Item Grouping & Sorting:', 'Organized by supermarket aisles (Produce, Dairy, Meat, Frozen, Pantry) for efficient in-store navigation.');

  currentY -= 8;
  drawSectionHeader('6. Top Savers Leaderboard & Discount Rewards', 'Gamified motivation and tangible economic incentives for reducing food waste.');

  drawParagraph(
    'To build lasting habits, FreshSaver incorporates a motivating tier and reward system that celebrates food waste reduction and unlocks real-world partner discounts.'
  );

  drawCard('Community Tier Hierarchy & Real Discounts', [
    { prefix: 'Bronze Saver (0 - 249 pts):', text: '5% off select local organic grocery partners & bulk food bins.' },
    { prefix: 'Silver Saver (250 - 599 pts):', text: '10% off eco-friendly grocery partners, farm stands & bakery surprise bags.' },
    { prefix: 'Gold Saver (600 - 1,199 pts):', text: '15% off fresh market partners + free zero-waste food storage container kit.' },
    { prefix: 'Zero-Waste Champion (1,200+ pts):', text: '20% off all participating green partners, featured spotlight, and VIP community badge.' }
  ], 'REWARDS TIER');

  drawBullet('Environmental Impact Metrics:', 'Tracks total estimated CO2 emissions avoided (kg), edible meals rescued, and household dollars saved ($).');
  drawBullet('Community Leaderboard:', 'Monthly ranking displaying top local food savers with badges, streak counters, and peer encouragement.');

  // ==========================================
  // PAGE 5: ARCHITECTURE, PWA & ANDROID DISTRIBUTION
  // ==========================================
  newPage();
  drawPageHeader('Module 4: Technical Architecture & Android APK');

  drawSectionHeader('7. Security, User Auth & Cross-Device Sync', 'Privacy-first architecture with multi-device synchronization.');

  drawBullet('Flexible Auth Flow:', 'Supports Email/Password registration, instant login, and seamless guest mode for immediate evaluation.');
  drawBullet('Local-First Resilience:', 'All user data (pantry items, shopping lists, points, settings) caches reliably in browser local storage and syncs upon connection.');
  drawBullet('Data Sovereignty & Export:', 'Full JSON export and import capabilities, allowing users to backup their complete pantry and donation history at any time.');
  drawBullet('Clean UI Architecture:', 'Adheres to strict anti-slop guidelines: no debug overlays, high-contrast typography, and intuitive mobile ergonomics.');

  currentY -= 8;
  drawSectionHeader('8. Progressive Web App & Android App Download', 'Standards-compliant PWA, WebAPK, and GitHub Actions Android compilation.');

  drawParagraph(
    'FreshSaver is engineered as both a responsive modern web application and an installable native-like mobile application for Android and iOS.'
  );

  drawCard('Download & Distribution Specifications', [
    { prefix: 'Standards-Compliant Web Manifest:', text: 'Includes high-res 192x192, 512x512, and maskable icons, standalone display mode, and theme color #059669.' },
    { prefix: 'Offline Service Worker (PWA):', text: 'Powered by Workbox & vite-plugin-pwa, caching core assets, icons, fonts, and application bundles for offline usage.' },
    { prefix: 'Trusted Web Activity (TWA):', text: 'Pre-configured twa-manifest.json enabling automated packaging into native Android APK / AAB bundles via Google Bubblewrap.' },
    { prefix: 'Automated GitHub Action:', text: '.github/workflows/build-apk.yml compiles the Android APK directly on every release tag, making release APKs downloadable via GitHub Releases.' }
  ], 'DISTRIBUTION');

  // Summary Table of Key Features
  ensureSpace(120);
  currentPage.drawText('SUMMARY OF CORE APPLICATION CAPABILITIES', {
    x: MARGIN_X,
    y: currentY - 10,
    size: 10,
    font: fontBold,
    color: darkSlate,
  });
  currentY -= 22;

  const tableRows = [
    ['Feature Module', 'Primary User Capability', 'Technology Used'],
    ['Pantry Tracker', 'Tracks shelf life, expiry countdowns, storage zones', 'React + TypeScript + LocalStorage'],
    ['Barcode Scanner', 'Live camera scan, barcode lookup via Open Food Facts', 'BarcodeDetector API + HTTP Fetch'],
    ['Receipt OCR', 'Extracts and parses itemized supermarket receipts', 'Regex Line Tokenizer + Category Classifier'],
    ['AI Recipe Studio', 'Cooks meals prioritizing at-risk ingredients', '@google/genai (Gemini AI API)'],
    ['Food Donation', 'Finds local food banks, builds donation manifests', 'Geolocated Org Registry + Manifest Export'],
    ['Smart Shopping', 'Aisle-sorted list that auto-converts to pantry items', 'State Machine + Shelf-life presets'],
    ['Top Savers', 'Points, tiers, CO2 stats & real grocery discounts', 'Gamification Logic + Partner Promo Engine'],
    ['Android & PWA', 'Installable on home screen, offline cache, APK build', 'vite-plugin-pwa + Bubblewrap + GH Actions'],
  ];

  const colWidths = [110, 240, 150];
  const rowHeight = 18;

  for (let r = 0; r < tableRows.length; r++) {
    const row = tableRows[r];
    const isHeader = r === 0;

    currentPage.drawRectangle({
      x: MARGIN_X,
      y: currentY - rowHeight + 4,
      width: CONTENT_WIDTH,
      height: rowHeight,
      color: isHeader ? primaryEmerald : (r % 2 === 0 ? lightBg : rgb(1, 1, 1)),
      borderColor: cardBorder,
      borderWidth: 0.5,
    });

    let currentX = MARGIN_X + 6;
    for (let c = 0; c < row.length; c++) {
      currentPage.drawText(row[c], {
        x: currentX,
        y: currentY - 8,
        size: isHeader ? 8 : 7.5,
        font: isHeader ? fontBold : fontRegular,
        color: isHeader ? rgb(1, 1, 1) : darkSlate,
      });
      currentX += colWidths[c];
    }

    currentY -= rowHeight;
  }

  // ==========================================
  // FOOTER & PAGE NUMBERING ON ALL PAGES
  // ==========================================
  const totalPages = doc.getPageCount();
  for (let i = 0; i < totalPages; i++) {
    const page = doc.getPage(i);
    // Draw footer line
    page.drawRectangle({
      x: MARGIN_X,
      y: MARGIN_BOTTOM - 12,
      width: CONTENT_WIDTH,
      height: 0.8,
      color: cardBorder,
    });

    page.drawText('FreshSaver - Stop Food Waste  |  Official Documentation', {
      x: MARGIN_X,
      y: MARGIN_BOTTOM - 24,
      size: 7.5,
      font: fontRegular,
      color: textMuted,
    });

    const pageStr = `Page ${i + 1} of ${totalPages}`;
    const pageStrWidth = fontRegular.widthOfTextAtSize(pageStr, 7.5);
    page.drawText(pageStr, {
      x: PAGE_WIDTH - MARGIN_X - pageStrWidth,
      y: MARGIN_BOTTOM - 24,
      size: 7.5,
      font: fontRegular,
      color: textMuted,
    });
  }

  // Save PDF bytes
  const pdfBytes = await doc.save();

  // Write to public directory
  const publicPath = path.resolve('public', 'FreshSaver_App_Documentation.pdf');
  fs.writeFileSync(publicPath, pdfBytes);
  console.log(`Successfully generated public documentation PDF at: ${publicPath} (${pdfBytes.length} bytes)`);

  // Write to artifacts directory if available
  const artifactDir = '/.aistudio/artifacts/brain/8e1f828b-2d2a-41b1-8128-1553b075b407';
  if (fs.existsSync(artifactDir)) {
    const artifactPath = path.join(artifactDir, 'FreshSaver_App_Documentation.pdf');
    fs.writeFileSync(artifactPath, pdfBytes);
    console.log(`Successfully copied documentation PDF to artifacts at: ${artifactPath}`);
  }
}

generateDocumentationPDF().catch((err) => {
  console.error('Failed to generate PDF:', err);
  process.exit(1);
});
