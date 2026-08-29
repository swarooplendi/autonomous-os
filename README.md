# Autonomous OS — Swaroop Lendi Personal Portfolio

A premium personal portfolio that behaves like a complete interactive operating system, built with **Flask (Python) + React (Vite)**.

## 🖥️ Stack

| Layer | Technology |
|---|---|
| **Backend API** | Python 3.12 + Flask 3.x |
| **Real-time** | Flask-SocketIO (WebSocket clock sync) |
| **PDF Resume** | fpdf2 |
| **Frontend** | React 18 + Vite 6 |
| **Styling** | Vanilla CSS (custom OS design system) |
| **Icons** | Lucide React |
| **Typography** | Space Grotesk + JetBrains Mono (via @fontsource) |

## 🚀 Quick Start

### 1. Start the Flask Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Flask will start at **http://localhost:5000**

### 2. Start the React Frontend (Development)

```bash
cd frontend
npm install
npm run dev
```

Vite will start at **http://localhost:5173** (proxies `/api` to Flask)

## 📡 Flask API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/profile` | Owner profile, identity, metrics |
| GET | `/api/projects` | Flagship systems portfolio |
| GET | `/api/projects/:id` | Single project detail |
| GET | `/api/journey` | Career milestones |
| GET | `/api/articles` | AI Field Notes (technical articles) |
| GET | `/api/skills` | Technical skills map |
| GET | `/api/status` | Live system status (time, availability) |
| GET | `/api/resume` | Download PDF resume |
| POST | `/api/terminal` | Execute CLI command |
| POST | `/api/contact` | Submit contact form |

## 🏗️ Project Structure

```
autonomous-os/
  backend/
    app.py              ← Flask REST API + SocketIO + PDF generator
    requirements.txt
    .env                ← Environment variables (never commit secrets)
  frontend/
    src/
      App.jsx           ← Complete OS shell (all 12 apps + window manager)
      index.css         ← Full OS design system (Dark/Day/Midnight themes)
      main.jsx          ← React entry point
    index.html          ← SEO + structured data
    vite.config.js      ← API proxy config
    package.json
  content/
    owner-profile.js    ← Canonical owner data
    projects.js         ← Flagship systems data
    cases.js            ← Case Files explorer data
  README.md
```

## 🎨 OS Applications

| App | Description |
|---|---|
| **Projects** | Flagship systems — 4 production case studies |
| **Results** | Verified platform metrics with status labels |
| **Systems** | 5-step Platform Engineering Operating Loop |
| **Journey** | Career timeline with milestones |
| **Case Files** | Finder-style explorer with file preview |
| **AI Field Notes** | Technical articles (SEO-crawlable) |
| **Whiteboard** | Draggable sticky notes (localStorage) |
| **Terminal** | Autonomous CLI powered by Flask API |
| **Founder.txt** | Engineering principles & philosophy |
| **Contact** | WhatsApp + Email + contact form |
| **Socials** | Public profiles and networks |
| **Focus Player** | Ambient audio (Web Audio API synthesis) |

## 🌙 Theme Support

- `Dark` — Deep indigo/midnight (default)
- `Day` — Clean light workstation
- `Midnight` — Deep violet atmosphere

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl/Cmd + K` | Open Command Palette |
| `Escape` | Close command palette / window |
| `Enter` | Open selected item in palette |

## 🔒 Environment Variables

Copy `.env` template and customize:

```env
FLASK_ENV=development
SECRET_KEY=your-secret-here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Never commit API keys or secrets.**

## 🌐 Production Build

```bash
# Build React frontend
cd frontend && npm run build

# Start Flask (serves built React frontend)
cd backend && gunicorn app:app --bind 0.0.0.0:5000
```

---

© 2026 Swaroop Lendi. All rights reserved.
