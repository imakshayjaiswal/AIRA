# ARIA: AI-Powered Email Triage Assistant

![ARIA Banner](https://raw.githubusercontent.com/imakshayjaiswal/AIRA/main/frontend/assets/logo.png)

**ARIA** is a high-performance, minimalist email management system designed to eliminate digital noise and surface what truly matters. Built with a strict **Black & White Glassmorphism** aesthetic, ARIA leverages state-of-the-art AI (NVIDIA NIM, Gemini, or OpenAI) to categorize your inbox and provide executive summaries of your messages.

## ✨ Features

- **Minimalist Glassmorphism UI:** A stunning, non-distractive interface with smooth transitions and tactile feedback.
- **AI Triage Engine:** Automatically categorizes emails into `Urgent`, `Reply`, `FYI`, `Promo`, or `Noise`.
- **Executive Summaries:** Get a concise, human-readable 3-4 sentence TL;DR for every email.
- **Interactive Reader:** A dual-view modal that combines deep AI reasoning with the original message body.
- **Smart Actions:** Quick-resolve, archive, or snooze emails directly from the dashboard with fluid animations.
- **Unified Sync:** Optimized for high-speed IMAP fetching with a focus on your last 4 days of activity.

## 🛠️ Tech Stack

- **Frontend:** Vanilla JavaScript, HTML5, CSS3 (Custom Glassmorphism framework).
- **Backend:** Node.js, Express.js.
- **AI Integration:** NVIDIA NIM (Llama 3.1), Google Gemini, or OpenAI.
- **Database:** SQLite (efficient local cache).
- **Security:** Helmet.js, Rate Limiting, and delimeter-protected AI prompts.

## 🚀 Quick Start

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/imakshayjaiswal/AIRA.git
   cd AIRA
   ```

2. **Install dependencies:**
   ```bash
   npm run install-backend
   ```

3. **Configure Environment:**
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=8080
   AI_PROVIDER=nvidia # or gemini, openai
   NVIDIA_API_KEY=your_key_here
   ```

4. **Launch:**
   ```bash
   npm start
   ```
   Open `http://localhost:8080` in your browser.

## ☁️ Deployment

ARIA is pre-configured for **Render** via the included `render.yaml` blueprint.

1. Create a "New Blueprint" on Render.
2. Connect this repository.
3. Add your `NVIDIA_API_KEY` and `AI_PROVIDER` to the environment variables.
4. Deploy!

## 🔐 Gmail Setup Instructions

To allow ARIA to sync your emails securely, follow these steps:
1. **Enable IMAP:** In Gmail Settings ⚙️ → See All Settings → Forwarding and POP/IMAP → Enable IMAP → Save.
2. **Generate App Password:** Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) → Select "Mail" → "Windows PC" → Generate.
3. **Sync:** Paste the 16-character code into ARIA.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Designed for the ARIA Hackathon. Built for focus.*
