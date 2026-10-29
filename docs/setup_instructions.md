# System Setup & Installation Guide

## 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **bun**
- **Python** (optional for standalone Python training/inference): Python 3.10+
- **Hardware**: GPU optional (NVIDIA CUDA recommended for high-density 16+ 4K camera streams)

---

## 2. Quickstart Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/your-org/AI-Traffic-Enforcement-System.git
cd AI-Traffic-Enforcement-System
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Configure Environment
Copy template from `config/.env.example`:
```bash
cp config/.env.example .env
```
Ensure `PORT=3000` is set for standard local web access.

### Step 4: Initialize Relational Database
```bash
bash scripts/setup_db.sh
```

### Step 5: Start System
To run the full stack (Express API + Vite React UI + AI Detection Pipeline):
```bash
npm run dev
# OR: bash scripts/run_fullstack.sh
```
Access the dashboard at `http://localhost:3000`.
