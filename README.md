# NSS Polytechnic College Assistant (Chatbot)

A modern, full-stack chatbot application designed for NSS Polytechnic College. This project features a unified, intelligent frontend chat interface powered by Google's Gemini AI, alongside a secure, enterprise-grade Admin Panel for managing the chatbot's knowledge base and appearance.

## Features
- **Seamless Hybrid Chat Interface:** Users can either navigate through predefined category-based questions or type custom queries directly.
- **AI-Powered Answers:** Integrates with Google's Gemini 2.5 Flash model, utilizing an injected knowledge base (`website_data.md`) scraped from the official college website to answer custom queries accurately.
- **Professional Admin Dashboard:** A beautifully designed SaaS-style admin panel to manage Categories, Questions, and Bot Avatars.
- **Secure Authentication:** The backend is locked down with strict `express-session` middleware and environment variable-based credentials.

---

## Tech Stack
- **Frontend:** React 18, Vite, CSS (Glassmorphism & Modern UI)
- **Backend:** Node.js, Express, Handlebars (hbs) for Admin UI
- **Database:** MongoDB (Mongoose)
- **AI Integration:** `@google/generative-ai`

---

## Prerequisites
Before running the project locally, ensure you have the following installed:
1. **Node.js** (v16 or higher)
2. **MongoDB** (running locally on `mongodb://127.0.0.1:27017/chatbot` or an active MongoDB Atlas cluster).
3. A **Google Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/)).

---

## Local Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Amal-05/ChatBot.git
cd ChatBot
```

### 2. Configure & Run the Backend (Admin Panel)
The backend manages the database, the AI logic, and the Admin portal.

```bash
cd ChatBootAdmin
npm install
```

**Set up Environment Variables:**
Create a `.env` file inside the `ChatBootAdmin` directory and add the following:
```env
ADMIN_EMAIL=admin@gamil.com
ADMIN_PASSWORD=123
SESSION_SECRET=super_secret_session_key_chatbot_nss!
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Start the Server:**
```bash
npm start
```
*The backend runs on `http://localhost:3000`. `nodemon` will automatically restart the server if you modify the `.env` file or backend code.*

### 3. Configure & Run the Frontend (Chatbot UI)
Open a **new terminal window** and navigate to the frontend directory:

```bash
cd chatbot
npm install
npm run dev
```
*The React frontend runs on `http://localhost:5173`.*

---

## Usage Guide

### Accessing the Chatbot
Simply navigate to `http://localhost:5173/` in your browser. The bot will introduce itself and ask for your name, followed by offering quick-reply categories or allowing you to type custom questions.

### Accessing the Admin Panel
Navigate to `http://localhost:3000/`. 
1. Log in using the credentials you defined in your `.env` file (e.g., `admin@gamil.com` / `123`).
2. Once logged in, you can add new questions, manage categories, and upload new avatar images.
3. If you ever forget your password, simply check your local `.env` file or your hosting provider's environment variable dashboard.

---

## Deployment Notes
When deploying to a platform like Render, Vercel, or Heroku:
1. **Do not** push your `.env` file to GitHub (this is already prevented by `.gitignore`).
2. You **must** manually configure the Environment Variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `GEMINI_API_KEY`) within your hosting provider's dashboard for the Admin Panel to function securely.

---

## Credits
**Made by Amal**
