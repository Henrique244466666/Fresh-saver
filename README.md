# FreshSaver 🍃 — Food Expiry, Recipe AI & Donation Tracker
> A modern, browser-based Android app (PWA & APK ready) to end food waste, turn expiring groceries into delicious chef recipes, and donate surplus food to local community centers.

[![PWA Ready](https://img.shields.io/badge/PWA-Android%20WebAPK%20Ready-emerald.svg)](https://web.dev/progressive-web-apps/)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-blue.svg)](https://developer.android.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📱 How to Download & Install on Android

You have **3 simple ways** to get FreshSaver on your Android phone:

### 1. Direct WebAPK Install (Recommended — Fast & Instant)
No app store or developer tools needed!
1. Open this app in **Google Chrome**, **Brave**, or **Samsung Internet** on your Android device.
2. Tap the **"Install Android App"** button at the top of the screen (or tap the **⋮** menu in Chrome and select **"Install app"** / **"Add to Home screen"**).
3. Android will automatically package and install **FreshSaver** as a standalone application on your home screen and app drawer with:
   - Full-screen immersion (no browser address bar)
   - Home screen launcher icon and splash screen
   - Offline support via Service Worker caching
   - Hardware camera access for instant barcode scanning

---

### 2. Download from GitHub Releases (Direct APK)
If this repository has GitHub Releases configured:
1. Head to the **[Releases](https://github.com/your-repo/freshsaver/releases)** tab on GitHub.
2. Download the latest `freshsaver-app.apk` directly to your Android device.
3. Tap the downloaded file in your Downloads folder and tap **Install** (allow "Install Unknown Apps" for your browser if prompted).

---

### 3. Build Your Own Android APK via GitHub & Bubblewrap CLI
You can compile your own signed Android `.apk` or `.aab` file from this repository using Google's official **Bubblewrap CLI** (Trusted Web Activity):

#### Prerequisites
- **Node.js 18+**
- **Java Development Kit (JDK) 17+**
- **Android SDK command-line tools**

#### Build Steps
```bash
# 1. Clone this repository
git clone https://github.com/your-username/freshsaver.git
cd freshsaver

# 2. Install dependencies
npm install

# 3. Build production web assets
npm run build

# 4. Generate Android Project & APK via Bubblewrap
npx @bubblewrap/cli build

# 5. Install the generated APK onto your Android phone via USB debugging
adb install app-release-signed.apk
```
*Note: A ready-to-run `twa-manifest.json` is already provided in the repository root, pre-configured with the app launcher name, theme colors, and icons.*

---

## 🌟 Key Features

- 📸 **Camera Barcode & Grocery Scanner**: Interactive viewfinder with live camera video feed or simulated barcode scan to quickly log pantry items.
- ⏳ **Smart Expiration Alerts**: Visual countdowns, days-remaining badges, and automatic triage for items expiring within 3 days.
- 🧑‍🍳 **Gemini Generative AI Chef**: Creates custom culinary recipes specifically tailored to salvage your soonest-expiring ingredients first.
- 🗺️ **Local Food Donation Directory**: Search and filter nearby food banks, community fridges, and shelters with distance, hours, accepting items, and Google Maps turn-by-turn routing.
- 🛒 **Smart Shopping List**: Add items to buy, check them off, and tap **"Send to Pantry"** to instantly convert them into tracked food inventory.
- 🏆 **Top Savers Discount Club**: Earn points, advance tiers (Eco Saver, Green Champion, Zero-Waste Hero), and unlock real grocery discounts.
- ☁️ **Cloud Data Sync & Auth**: Guest mode or personal account with real-time persistent data storage across devices.
- 📴 **Offline PWA Engine**: Full offline caching via Service Worker so your grocery list and pantry stay accessible even inside underground supermarkets with zero signal.

---

## 💻 Local Development Setup

To run FreshSaver locally on your computer:

```bash
# Install dependencies
npm install

# Start local dev server (Express + Vite)
npm run dev

# Open in your browser
http://localhost:3000
```

To build for production:
```bash
npm run build
```

---

## 📄 License
MIT License. Open source and community driven to combat food waste worldwide.
