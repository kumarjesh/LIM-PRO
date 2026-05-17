# ⚡ LIM PRO — Calorie Intelligence Scanner

> **AI-powered tetra pack scanner for fitness freaks and actors who track every calorie.**  
> Point your camera at any tetra pack → get instant calorie, macro & safety intel — based on WHO standards.

![LIM Pro](https://img.shields.io/badge/LIM-PRO-22d3ee?style=for-the-badge&logo=react&logoColor=white)
![WHO Compliant](https://img.shields.io/badge/WHO-Compliant-16a34a?style=for-the-badge)
![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?style=for-the-badge&logo=google)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)
![PWA](https://img.shields.io/badge/PWA-Ready-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

---

## 📱 Live Demo

> 🔗 **[lim-pro.vercel.app](https://lim-pro.vercel.app)**  
> Open on your phone and add to Home Screen for the full PWA experience.

---

## 📖 Table of Contents

- [What is LIM Pro?](#-what-is-lim-pro)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [WHO Safety Guidelines](#-who-safety-guidelines)
- [Verdict System](#-verdict-system)
- [Feature Details](#-feature-details)
- [Deployment](#-deployment)
- [Install as PWA on Phone](#-install-as-pwa-on-phone)
- [Known Issues & Fixes](#-known-issues--fixes)
- [Roadmap](#-roadmap)
- [Disclaimer](#-disclaimer)
- [License](#-license)

---

## 🧠 What is LIM Pro?

**LIM Pro (Large Image Model — Pro Edition)** is a Progressive Web App built for fitness enthusiasts, athletes, and actors who obsessively track their calorie intake.

Scan any tetra pack label using your phone camera, barcode scanner, or gallery upload. The AI reads the nutrition label, calculates macros for your **exact quantity consumed**, and gives you an instant **GREEN / YELLOW / RED** verdict based on WHO dietary standards.

**No app store. No install. Just open the URL on your phone.**

---

## ✨ Features

| Feature | Description |
|---|---|
| 📷 **Camera Scan** | Live rear camera with corner-bracket overlay for label capture |
| ▦ **Barcode Scanner** | Scan barcode → auto-fetch from Open Food Facts database |
| 🖼️ **Gallery Upload** | Upload from photo gallery for already-photographed packs |
| 🎯 **Quantity Selector** | 8 presets (100–1000ml) + custom ml input for any amount |
| 🤖 **Gemini Vision AI** | Gemini 2.5 Flash reads and understands nutrition labels |
| 🏥 **WHO Compliance** | Checks sugar, sodium, additives, allergens, expiry date |
| 🟢🟡🔴 **Traffic Light Verdict** | DRINK IT / THINK TWICE / SKIP IT — instant and clear |
| 🔥 **Calorie Tracker** | Daily counter with customizable goal and color progress bar |
| 📊 **Macro Pie Chart** | Visual Protein / Carbs / Fat breakdown per your quantity |
| 🚩 **Ingredient Flags** | Red chips for harmful additives, green chips for positives |
| 🔊 **Voice Summary** | Auto-reads the 20-word verdict aloud — hands-free at gym |
| 📋 **Drink History Log** | Every scan saved with thumbnail, calories, time, verdict |
| 📤 **Weekly Report Export** | Download a .txt summary of your week's drink intake |
| 📱 **PWA** | Installable on Android & iPhone, opens fullscreen like native app |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                CAPTURE LAYER                    │
│                                                 │
│  📷 Camera      ▦ Barcode       🖼️ Gallery      │
│  getUserMedia   html5-qrcode    FileReader       │
│         └─────────────┴──────────────┘          │
│                      │                          │
│              base64 JPEG image                  │
└──────────────────────┼──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│                ANALYZE LAYER                    │
│                                                 │
│        Gemini 2.5 Flash Vision API              │
│        + WHO Fitness System Prompt              │
│        + Quantity (ml) proportional scaling     │
│                      │                          │
│             Structured JSON response            │
└──────────────────────┼──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│                 JUDGE LAYER                     │
│                                                 │
│   ✅ GREEN       ⚠️ YELLOW        🚫 RED         │
│   DRINK IT     THINK TWICE      SKIP IT         │
│                                                 │
│  Macros · Pie Chart · Flags · Voice · History   │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 (CRA) | UI, state management, camera |
| Vision AI | Google Gemini 2.5 Flash | Label reading & nutrition analysis |
| Barcode | html5-qrcode (CDN) | Camera-based barcode scanning |
| Food Database | Open Food Facts API | Free barcode-to-nutrition lookup |
| Voice | Web Speech API | Built-in browser text-to-speech |
| Storage | localStorage | Scan history & daily calorie log |
| Styling | Custom CSS | Dark gym aesthetic, no UI library |
| Hosting | Vercel (free) | HTTPS + auto-deploy from GitHub |

---

## 📁 Project Structure

```
lim-pro/
├── public/
│   └── index.html                  # Google Fonts + PWA meta tags
├── src/
│   ├── components/
│   │   ├── Camera.js               # Live camera with snap overlay
│   │   ├── MlSelector.js           # Quantity picker (presets + custom)
│   │   ├── VerdictCard.js          # Verdict, macros, pie, flags, voice
│   │   ├── DailyTracker.js         # Calorie goal + progress bar
│   │   ├── History.js              # Today's scan log + export button
│   │   └── BarcodeScanner.js       # Barcode → Open Food Facts API
│   ├── services/
│   │   ├── geminiService.js        # Gemini API call + WHO prompt
│   │   └── storageService.js       # localStorage: log, goal, export
│   ├── App.js                      # Main shell: 3 tabs, steps, state
│   ├── App.css                     # Full dark gym aesthetic styles
│   └── index.js                    # React entry point
├── .env                            # API key — NEVER commit this
├── .env.example                    # Template for new developers
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- npm v7+
- Free Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/lim-pro.git
cd lim-pro
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Get a Free Gemini API Key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **Get API Key** → **Create API key in new project**
4. Copy the key — it starts with `AIzaSy...`
5. No credit card required ✅

### 4. Create Your .env File

In the project root (same folder as `package.json`):

```env
REACT_APP_GEMINI_API_KEY=AIzaSyYOUR_KEY_HERE
```

> ⚠️ Variable MUST start with `REACT_APP_` or React won't load it.  
> ⚠️ Never commit `.env` to GitHub — it's in `.gitignore`.

### 5. Run Locally

```bash
npm start
```

Opens at `http://localhost:3000`

To test camera on your phone (same WiFi network):
```
http://192.168.x.x:3000
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_GEMINI_API_KEY` | ✅ Yes | From aistudio.google.com — free |

> Always restart `npm start` after editing `.env`.

---

## 🏥 WHO Safety Guidelines Used

| Parameter | WHO Threshold | Verdict Impact |
|---|---|---|
| Free Sugar | > 12g per 100ml | CAUTION / UNSAFE |
| Sodium | > 600mg per 100ml | CAUTION / UNSAFE |
| Aspartame / Saccharin / Ace-K | Any amount | CAUTION |
| Sudan dyes / Cyclamate / Trans fats | Any amount | UNSAFE |
| High Fructose Corn Syrup (HFCS) | Any amount | CAUTION |
| Artificial colors (Red 40, Yellow 5) | Any amount | CAUTION |
| Expired product | Any | UNSAFE |
| Unreadable label | — | RED (cannot verify) |

Reference: [WHO Healthy Diet Fact Sheet](https://www.who.int/news-room/fact-sheets/detail/healthy-diet)

---

## 🎯 Verdict System

```
Calories < 80  AND sugar < 8g  AND no sweeteners  →  ✅ GREEN   →  DRINK IT
Calories 80–150  OR  sugar 8–15g  OR some additives →  ⚠️ YELLOW  →  THINK TWICE
Calories > 150  OR  sugar > 15g  OR WHO violation    →  🚫 RED     →  SKIP IT
```

### JSON Response Format

```json
{
  "product": "Tropicana Orange Juice",
  "brand": "Tropicana",
  "verdict": "GREEN",
  "calories": 45,
  "sugar_g": 9.5,
  "protein_g": 0.5,
  "fat_g": 0.1,
  "carbs_g": 10.5,
  "summary": "Low calorie juice, fits your macros well today.",
  "tip": "Pair with protein to slow sugar absorption.",
  "flags_bad": [],
  "flags_good": ["No preservatives", "Natural flavors", "Vitamin C source"]
}
```

All values are **scaled to the exact ml quantity** the user selected.

---

## 🔍 Feature Details

### 📷 Camera Scan
Rear camera (`facingMode: environment`) with corner bracket overlay. Captures at 640×480 JPEG. Works on Android Chrome and iPhone Safari.

### ▦ Barcode Scanner
Dynamically loads `html5-qrcode` from CDN. Fetches from Open Food Facts (free, no key). Converts nutrition table into a canvas image for Gemini analysis.

### 🎯 Quantity Selector
8 presets: 100 / 150 / 200 / 250 / 330 / 500 / 750 / 1000ml  
Custom input: 1ml to 5000ml  
All macros scaled proportionally to selected quantity.

### 🔊 Voice Summary
Uses browser's built-in `SpeechSynthesis` API. Zero cost, zero library. Auto-plays when verdict loads. Tap 🔊 to replay.

### 📊 Macro Pie Chart
Custom SVG pie chart — no library. Shows Protein / Carbs / Fat as percentage of total calories.

### 🚩 Ingredient Flags
Color-coded chips below the verdict card. Red = harmful ingredients found. Green = positive attributes confirmed.

### 🔥 Daily Calorie Tracker
All scans stored in localStorage by date. Progress bar color: green → yellow → red as goal approaches. Default 2000 kcal, fully editable.

### 📤 Weekly Report Export
Plain `.txt` file with 7 days of history. Per-day calorie totals, per-scan details, weekly summary with GREEN/YELLOW/RED counts.

---

## 🌐 Deployment

### Deploy to Vercel (Free)

```bash
npm install -g vercel
vercel
```

Or connect GitHub repo at [vercel.com](https://vercel.com) → Import → Deploy.

### Add API Key in Vercel

```
Project → Settings → Environment Variables

Name:   REACT_APP_GEMINI_API_KEY
Value:  AIzaSyYOUR_KEY_HERE

☑ Production   ☑ Preview   ☑ Development
```

Save → Deployments → ⋯ → Redeploy.

### Push Future Updates

```bash
git add .
git commit -m "your update"
git push origin main
# Vercel auto-deploys in ~60 seconds
```

---

## 📱 Install as PWA on Phone

### Android (Chrome)
1. Open Vercel URL in Chrome
2. Tap ⋮ menu → **Add to Home screen** → **Add**

### iPhone (Safari only)
1. Open Vercel URL in Safari
2. Tap Share button → **Add to Home Screen** → **Add**

Opens fullscreen, no browser bar — just like a native app. 📱

---

## 🐛 Known Issues & Fixes

| Issue | Fix |
|---|---|
| Black camera screen | Ensure `<video muted autoPlay playsInline>` and use `onloadedmetadata` |
| "Analysis failed" error | Add API key in Vercel Environment Variables and redeploy |
| Camera permission denied | Tap camera icon in browser bar → Allow → Refresh |
| Barcode product not found | Use Camera mode to scan the label directly |
| Build fails on Vercel | Run `npm run build` locally first, fix all ESLint errors |
| API key not loading | Variable must start with `REACT_APP_`, restart `npm start` |

---

## 🗺️ Roadmap

- [x] Camera scan with WHO verdict
- [x] Custom ml quantity input
- [x] Daily calorie tracker with editable goal
- [x] Ingredient red flag / green flag chips
- [x] Macro pie chart (SVG)
- [x] Voice summary (Web Speech API)
- [x] Barcode scanner + Open Food Facts
- [x] Weekly report export (.txt)
- [x] PWA — installable on phone via Vercel
- [ ] Goal-based verdict (Muscle Gain / Fat Loss / Endurance mode)
- [ ] Compare two drinks side by side
- [ ] Share verdict as image card
- [ ] Multi-language support
- [ ] Dark / light mode toggle
- [ ] Push notification when daily limit reached

---

## ⚠️ Disclaimer

LIM Pro provides **AI-assisted guidance** based on WHO dietary standards for **informational purposes only**. It is **not a substitute for professional medical or nutritional advice**.

AI accuracy depends on image quality, label clarity, and lighting. Always verify critical nutritional information manually. Consult a qualified health professional for specific dietary decisions.

---

## 📄 License

MIT License — free to use, modify, and distribute with attribution.

---

## 🙌 Built With

- [React](https://reactjs.org/) — UI framework
- [Google Gemini API](https://aistudio.google.com/) — Vision AI (free tier)
- [Open Food Facts](https://world.openfoodfacts.org/) — Free food database
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) — Barcode scanning
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) — Voice output
- [Vercel](https://vercel.com/) — Free hosting with HTTPS
- [WHO Guidelines](https://www.who.int/news-room/fact-sheets/detail/healthy-diet) — Health standards

---

*Built with 💪 for fitness freaks, athletes, and actors who take nutrition seriously.*  
*Powered by LIM (Large Image Model) architecture + Google Gemini 2.5 Flash Vision AI*
