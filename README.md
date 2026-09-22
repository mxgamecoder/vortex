<p align="center">
  <h1 align="center">🌪️ VORTEX WHATSAPP BOT 🌪️</h1>
  <p align="center">A Next-Generation, Feature-Rich Multi-Device WhatsApp Bot</p>
</p>

<p align="center">
  <a href="https://github.com/mxgamecoder/vortex/stargazers">
    <img src="https://img.shields.io/github/stars/mxgamecoder/vortex?style=for-the-badge&logo=github&color=blue" alt="Stars">
  </a>
  <a href="https://github.com/mxgamecoder/vortex/network/members">
    <img src="https://img.shields.io/github/forks/mxgamecoder/vortex?style=for-the-badge&logo=github&color=cyan" alt="Forks">
  </a>
  <a href="https://github.com/mxgamecoder/vortex/issues">
    <img src="https://img.shields.io/github/issues/mxgamecoder/vortex?style=for-the-badge&logo=github&color=orange" alt="Issues">
  </a>
  <a href="https://github.com/mxgamecoder/vortex/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.2-brightgreen?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/Release%20Date-22%20September%202026-blueviolet?style=flat-square" alt="Release Date">
  <img src="https://img.shields.io/badge/Developer-mxgamecoder-blue?style=flat-square" alt="Developer">
  <img src="https://img.shields.io/badge/Node.js-%3E%3D20.x-green?style=flat-square" alt="Node Version">
</p>

---

## 📌 Project Overview

| Detail | Specification |
| :--- | :--- |
| **Bot Name** | **Vortex** |
| **Developer** | [**mxgamecoder**](https://github.com/mxgamecoder) |
| **Version** | **1.2** |
| **Release Date** | **22 September 2026** |
| **Official Website** | [**lumorapp.app**](https://lumorapp.app) |
| **Pairing Server** | [**vortex-pair-site.lumorapp.name.ng**](https://vortex-pair-site.lumorapp.name.ng/) |

**Vortex** is an advanced, ultra-responsive, multi-device WhatsApp userbot built with `@whiskeysockets/baileys`. Designed for speed, security, and effortless automation, Vortex provides over 180 modular plugins spanning AI assistants, media downloaders, group management systems, multimedia conversion tools, and automated privacy features.

---

## 🌟 Advantages & What You Will See in the Bot

Vortex is packed with powerful features designed to supercharge your WhatsApp experience:

- ⚡ **High Performance & Stability**: Built on the latest Baileys library for instantaneous message handling and robust 24/7 uptime.
- 🤖 **Built-in AI Assistants**: Integrated with intelligent conversational models (ChatGPT, Meta AI) and AI image generation (`.imagine`).
- 📥 **Universal Downloader Suite**: High-speed downloads for TikTok (no watermark), YouTube (Audio & Video), Instagram (Reels & Posts), Facebook, Twitter/X, Pinterest, MediaFire, APKs, and more.
- 🎨 **Creative Media & Audio Studio**:
  - Convert videos to MP3, reverse audio, adjust tempo, add bass, and apply audio effects.
  - Create custom stickers (`.sticker`), memes, remove image backgrounds (`.rmbg`), and generate stylized logos (`.logo`).
- 🛡️ **Comprehensive Group & Security Suite**:
  - **Anti-Delete**: Intercept and view deleted messages.
  - **Anti-ViewOnce**: Automatically view and save one-time media.
  - **Anti-Link & Delete-Links**: Block and auto-purge unauthorized group invite links.
  - **Anti-Call**: Automatically reject unwanted calls with a custom prompt.
  - **Anti-Badword**: Keep conversations clean with automated moderation.
- 👥 **Group Administration**: Kick inactive members, bulk promote/demote, tag all members (`.tagall`), create polls, and manage join requests.
- 🎮 **Fun & Utility Tools**: Interactive games, quizzes, weather forecasts, Wikipedia search, URL shorteners, temporary email generators, Bible passages, and dictionary definitions.

---

## 📜 Bot Menu & Profile Preview

### 📋 Dynamic Bot Menu (`.vortex` / `.allmenu` / `.menu`)
When triggered, Vortex displays a categorized interactive dashboard accompanied by optional voice audio:

```text
╭━━━[ VORTEX ]━━━╮
│ User: @user
│ Uptime: 14h 32m 10s
│ Mode: public / private
│ Prefix: .
│ Commands: 185+
╰━━━━━━━━━━━━━━╯

╭─ AI ─╮
│ .ai  │ .meta  │ .imagine  │ .chatbot
╰━━━━━━━━━━━━━━╯
╭─ DOWNLOADER ─╮
│ .tiktok  │ .ytdl  │ .play  │ .ig  │ .fb  │ .mediafire  │ .apk
╰━━━━━━━━━━━━━━╯
╭─ TOOLS & UTILITY ─╮
│ .profile  │ .tourl  │ .tempmail  │ .scanqr  │ .tts  │ .shorturl
╰━━━━━━━━━━━━━━╯
╭─ SECURITY ─╮
│ .antidelete  │ .antivv  │ .antilink  │ .anticall
╰━━━━━━━━━━━━━━╯
```

### 👤 User Profile Card (`.profile` / `.person` / `.userinfo`)
Inspect in-depth details of any contact or group participant:
- Profile Avatar preview
- Username & Push Name
- WhatsApp JID
- Bio / About Status with last updated timestamp
- Admin & Group Member standing

---

## 🚀 Steps to Use & Deploy Vortex

Follow these 2 straightforward steps to get Vortex up and running:

### Step 1: Generate Your Pair Code (Get `SESSION_ID`)
1. Visit the official Vortex pairing portal:
   👉 **[https://vortex-pair-site.lumorapp.name.ng/](https://vortex-pair-site.lumorapp.name.ng/)**
2. Enter your WhatsApp phone number including your international country code (e.g., `234xxxxxxxxxx`).
3. Click to receive your 8-digit pairing code.
4. On your phone, open **WhatsApp > Linked Devices > Link a Device > Link with phone number instead**.
5. Type the 8-digit code shown on the site.
6. Once connected, Vortex will send your unique **`SESSION_ID`** to your WhatsApp inbox. Copy this string!

---

### Step 2: Deploy the Bot

#### 🌟 Primary Deployment: Lumor App (Recommended)
1. Go to **[lumorapp.app](https://lumorapp.app)**.
2. Sign up or log into your account.
3. Once logged in, tap on **Cluvra** to initiate deployment.
4. Paste your `SESSION_ID` and configure your preferences.
5. Deploy and your bot will come online instantly!

#### 🌐 Alternative Cloud Platforms
You can also deploy Vortex across any of your preferred hosting providers:
- **Render** ([render.com](https://render.com))
- **Railway** ([railway.app](https://railway.app))
- **Replit** ([replit.com](https://replit.com))
- **Heroku / VPS / Docker**

### ⚙️ Environment Variables Configuration

| Variable | Description | Default | Required |
| :--- | :--- | :--- | :--- |
| `SESSION_ID` | Your generated session string from the pair site | `None` | **Yes** |
| `BOT_NAME` | Display name of the bot | `vortex` | No |
| `PREFIX` | Command prefix symbol | `.` | No |
| `MODE` | Bot accessibility (`public` or `private`) | `private` | No |
| `OWNER_NUMBER` | WhatsApp number of the bot owner | `2349021506036` | No |
| `OWNER_NAME` | Name of the bot owner | `mxgamecoder` | No |
| `MENU_IMAGE_URL`| Custom image banner for the menu | Default banner | No |
| `MENU_AUDIO_URL`| Audio intro played on menu command | Included audio | No |
| `ANTI_DELETE` | Re-send deleted messages (`true`/`false`) | `true` | No |
| `ANTI_VV` | Auto-forward View-Once media (`true`/`false`) | `true` | No |
| `ANTI_LINK` | Delete messages containing links (`true`/`false`)| `true` | No |

---

## 🌐 More Information & Official Sites

- **Official Platform**: [lumorapp.app](https://lumorapp.app)
- **Pairing Portal**: [vortex-pair-site.lumorapp.name.ng](https://vortex-pair-site.lumorapp.name.ng/)

---

## 🗂️ Other Projects by mxgamecoder

Check out more projects by the developer:
- 🚀 **[Lumor App](https://lumorapp.app)** — Cloud management and application platform.
- ⚡ **[Baton](https://github.com/mxgamecoder/baton)** — High-efficiency WhatsApp automation and developer tooling.

---

## 🤝 Credits & Attribution

Developed with ❤️ by **[mxgamecoder](https://github.com/mxgamecoder)**.

> 📢 **Credit Notice**: If you clone, fork, or reuse any part of this code or project, **do not forget to give developer `mxgamecoder` proper credit and attribution**. Respect open-source authorship!

---

## ⚠️ Disclaimer & Risk Notice

> [!CAUTION]
> **Use at Your Own Risk:**
> - Users are strictly on their own and assume full responsibility if WhatsApp restricts or permanently bans their account.
> - Automating WhatsApp through third-party libraries (userbots/scrapers) is **not officially supported or endorsed by WhatsApp/Meta**.
> - The developer (`mxgamecoder`) accepts no liability for any banned numbers, data loss, or terms-of-service violations resulting from the use of this software.