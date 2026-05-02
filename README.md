# 🚗 Tesla Fleet HUD

> Real-time Tesla vehicle dashboard PWA using Fleet API with OAuth 2.0 + PKCE.

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=pwa&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Tesla Fleet API](https://img.shields.io/badge/Tesla_Fleet_API-cc0000?style=flat-square)

## Overview

A lightweight Progressive Web App (PWA) that connects to the Tesla Fleet API via OAuth 2.0 + PKCE to display real-time vehicle telemetry. Designed for wall-mounted displays and mobile home screens.

Built as a single-page vanilla JS app — no framework dependencies, deployable to Vercel in one click.

## Features

- 🔐 **OAuth 2.0 + PKCE** — Secure auth flow with no client secret exposed
- ⚡ **Real-time telemetry** — Battery %, range, charge state, temperature, lock status
- 📱 **PWA** — Installable on iOS/Android home screen, works offline (cached assets)
- 🌙 **Dark HUD UI** — Optimized for low-light visibility
- 🔄 **Auto-polling** — Updates every 8 seconds while active
- 🇨🇦 **Metric units** — Range converted from miles to km

## Architecture

```
/
├── index.html          — Main dashboard UI + telemetry polling
├── auth.js             — OAuth 2.0 + PKCE flow, token exchange
├── sw.js               — Service worker (cache-first static, network-first API)
├── manifest.json       — PWA manifest
├── config.example.js   — Config template (copy to config.js)
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

## Dashboard Panels

| Panel | Data |
|---|---|
| Battery | Charge % with animated bar |
| Range | Estimated range in km |
| Inside Temp | Cabin temperature °C |
| Outside Temp | Ambient temperature °C |
| Charging | State, rate (km/hr), time to full |
| Lock | Locked / Unlocked |
| Climate | On / Off |
| State | Online / Asleep / Charging |

## Setup

### 1. Register a Tesla Developer App

1. Go to [developer.tesla.com](https://developer.tesla.com)
2. Create an app — set Redirect URI to your Vercel deployment URL
3. Note your **Client ID**

### 2. Configure

```bash
cp config.example.js config.js
# Edit config.js with your CLIENT_ID and REDIRECT_URI
```

### 3. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### 4. Authorize

Open your app URL, click **Connect with Tesla**, complete OAuth flow.

## Security

- PKCE (Proof Key for Code Exchange) prevents authorization code interception
- State parameter prevents CSRF
- Access token stored in `sessionStorage` only (cleared on tab close)
- `config.js` is gitignored — never commit credentials

## Status

🟡 Personal use / demo — tested on Model Y (North America). Fleet API access requires Tesla approval for production use.
