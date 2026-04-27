# Humanitarian Aid Relief Portal - NGO Command Center

A full-stack, AI-powered platform designed to help Non-Governmental Organizations (NGOs) and disaster relief teams triage, manage, and track field incidents in real-time. 

This platform uses a **Hybrid Priority Assignment Engine** that combines a deterministic rule-engine with Google's Gemini 2.5 Flash LLM to intelligently score and assign priority levels to incoming crisis tickets.

## 🚀 Features

- **Hybrid AI Triage Engine**: Uses Google Gemini to analyze unstructured emergency reports, outputting structured JSON with a Priority (EXTREME, STRONG, MEDIUM, LOW) and an LLM Reasoning score.
- **Role-Based Access Control**: Secure login via Supabase Authentication. 'Admins' get command center access, while 'Volunteers' get field access.
- **Live Incident Database**: A beautiful, sortable, and filterable real-time data table synchronized with Supabase.
- **Status Workflows**: Update ticket resolutions effortlessly via the interactive UI (Open → In Progress → Resolved).
- **Responsive Dashboard**: Features dynamic glassmorphism aesthetics, modern Tailwind styling, and fully responsive layouts.

## 🛠️ Technology Stack

### Frontend (`/src/frontend`)
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v4 + Lucide React (Icons)
- **State Management**: Zustand
- **API Client**: Axios
- **Authentication**: Supabase Auth

### Backend (`/src/backend`)
- **Framework**: FastAPI (Python)
- **AI Integration**: Google GenAI SDK (`gemini-2.5-flash`)
- **Database**: Supabase (PostgreSQL)
- **Data Validation**: Pydantic
- **Resilience**: Tenacity (Exponential Backoff for LLM calls)

## 📂 Project Structure
```text
.
├── .env                  # Global Environment Variables
├── src/
│   ├── frontend/         # React Application
│   └── backend/          # FastAPI Server
└── README.md
```

## ⚙️ Quick Start

### 1. Environment Setup
Create a `.env` file in the root directory with the following credentials:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Start the Backend
Open a terminal and run the following:
```bash
cd src/backend
pip install -e .
uvicorn app.main:app --reload --port 8000
```
*The API will be running at `http://127.0.0.1:8000`.*

### 3. Start the Frontend
Open a second terminal and run:
```bash
cd src/frontend
npm install
npm run dev
```
*The app will be accessible at `http://localhost:5173`.*

## 🔒 Authentication Note
The platform uses Supabase for authentication. For demo and testing convenience, if you attempt to log in with an email that does not exist, the system will automatically sign you up and assign you the role (Admin/Volunteer) you selected on the login screen.
