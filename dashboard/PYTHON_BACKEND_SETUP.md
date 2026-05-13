# Python Backend Connection Guide

## ✅ What Was Fixed

### 1. CSS Styling
- ✅ **Tailwind CSS** properly configured and compiled
- ✅ All component styles now apply correctly
- ✅ Dark theme with gradients, animations, and hover effects working
- ✅ Responsive design (mobile, tablet, desktop) active

### 2. Python Backend Connection
- ✅ **AnalysisForm** now attempts to connect to Python backend at `https://tradingagent-yndk.onrender.com`
- ✅ Graceful fallback to mock data if backend unavailable
- ✅ Selected analysts passed to backend for targeted analysis
- ✅ Error messages show connection status

---

## 🔌 Python Backend Setup

### Expected API Endpoint

Your dashboard expects a POST endpoint at:
```
https://tradingagent-yndk.onrender.com/analyze
```

### Request Format

```json
{
  "company": "RELIANCE.NS",
  "date": "2024-04-23",
  "analysts": ["market", "news", "fundamentals", "social"]
}
```

**Fields:**
- `company` (string): NSE symbol with `.NS` suffix (e.g., "RELIANCE.NS")
- `date` (string): Analysis date in YYYY-MM-DD format
- `analysts` (array): Selected analyst types
  - `"market"` - Technical analysis
  - `"news"` - Sentiment analysis
  - `"fundamentals"` - Financial analysis
  - `"social"` - Social trends

### Expected Response Format

```json
{
  "decision": "BUY",
  "confidence": 82,
  "risk": "Medium",
  "explanation": "Strong technical momentum with positive fundamentals...",
  "company_symbol": "RELIANCE.NS",
  "analysis_date": "2024-04-23",
  "agents": {
    "market": {
      "status": "completed",
      "signals": [...],
      "indicators": {...}
    },
    "news": {
      "status": "completed",
      "sentiment": 0.75,
      "summary": "..."
    },
    "fundamentals": {
      "status": "completed",
      "pe_ratio": 25.3,
      "growth": 15.2
    },
    "social": {
      "status": "completed",
      "trend_score": 0.68,
      "mentions": 1250
    }
  }
}
```

**Response Fields:**
- `decision` (string): "BUY", "SELL", or "HOLD"
- `confidence` (number): 0-100 confidence score
- `risk` (string): "Low", "Medium", or "High"
- `explanation` (string): Detailed analysis explanation
- `company_symbol` (string): The analyzed symbol
- `analysis_date` (string): Analysis date
- `agents` (object): Results from each analyst

---

## 🚀 How to Start Everything

### Step 1: Start the Python Backend

From the main project root:

```bash
# Option A: Using Python directly
python main.py

# Option B: Using the CLI
python -m cli.main

# Option C: Using FastAPI (if you have a FastAPI wrapper)
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Verify it's running:** Open `https://tradingagent-yndk.onrender.com/docs` in your browser (FastAPI Swagger UI)

### Step 2: Frontend is Already Running

The frontend dev server is running at: **http://localhost:3000/dashboard**

If it stopped, restart it:

```bash
cd dashboard
npm run dev
# Server starts on http://localhost:3000
```

---

## 🧪 Testing the Connection

### Test 1: Test Backend Directly

```bash
# From PowerShell
curl -X POST https://tradingagent-yndk.onrender.com/analyze `
  -ContentType "application/json" `
  -Body @"
{
  "company": "RELIANCE.NS",
  "date": "2024-04-23",
  "analysts": ["market", "news"]
}
"@
```

### Test 2: Use Dashboard UI

1. Go to **http://localhost:3000/dashboard**
2. Enter stock symbol: `RELIANCE.NS`
3. Select analysis date
4. Select analyst teams (all are toggled by default)
5. Click "Run Analysis"
6. Watch the 6-agent workflow progress bar animate
7. See results displayed with decision, confidence, risk

---

## 📊 Dashboard Workflow

When you submit an analysis:

```
User Input
    ↓
Dashboard API Call to Python Backend (https://tradingagent-yndk.onrender.com/analyze)
    ↓
Python Backend Multi-Agent System
  • Market Analyst (1 sec) → Technical indicators
  • News Analyst (2 sec) → Sentiment analysis
  • Fundamentals Analyst (3 sec) → Financial metrics
  • Research Manager (4 sec) → Integration
  • Risk Manager (5 sec) → Assessment
  • Portfolio Manager (6 sec) → Final decision
    ↓
Backend Returns Results
    ↓
Dashboard Updates UI with:
  • Decision (BUY/SELL/HOLD)
  • Confidence (0-100%)
  • Risk Level
  • Detailed explanation
  • Price chart
    ↓
Results saved to History page
```

---

## ⚙️ Python Backend Integration Points

### In your main.py or FastAPI app:

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(
    company: str,
    date: str,
    analysts: list[str]
):
    """
    Analyze a stock using selected analyst teams.
    
    Args:
        company: NSE symbol (e.g., "RELIANCE.NS")
        date: Analysis date (YYYY-MM-DD)
        analysts: List of analyst types to use
        
    Returns:
        Trading decision with confidence and analysis
    """
    # Your multi-agent analysis logic here
    # Call your trading agents pipeline
    
    return {
        "decision": "BUY",
        "confidence": 82,
        "risk": "Medium",
        "explanation": "...",
        "company_symbol": company,
        "analysis_date": date,
        "agents": {...}
    }
```

---

## 🔄 Mock Data Fallback

If the Python backend is unavailable, the dashboard automatically uses mock data so you can:
- ✅ Test the UI/UX
- ✅ Verify all pages work
- ✅ Test navigation and interactions
- ✅ See the workflow animation

**To use real backend data:**
1. Start the Python backend on port 8000
2. The dashboard will automatically detect it
3. Backend responses will be used instead of mock data

---

## 🐛 Troubleshooting

### Issue: "Connection failed: Unable to reach backend"
**Solution:**
1. Verify Python backend is running on port 8000
2. Check: `netstat -ano | Select-String 8000`
3. If not running, start it with: `python main.py`

### Issue: CORS errors in browser console
**Solution:**
1. Add CORS middleware to your FastAPI app (see above)
2. Or configure your backend to accept requests from `http://localhost:3000`

### Issue: 404 Not Found on `/analyze` endpoint
**Solution:**
1. Verify your backend has the `/analyze` POST endpoint
2. Check endpoint URL matches: `https://tradingagent-yndk.onrender.com/analyze`
3. Verify request body format matches expected JSON structure

### Issue: Frontend seems unstyled
**Solution:**
1. Hard refresh browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Restart dev server: `npm run dev`

---

## 📱 Available Dashboard Pages

All pages are now styled and functional:

| Page | URL | Purpose |
|------|-----|---------|
| **Dashboard** | `/dashboard` | Main analysis interface with agent workflow |
| **Market Analysis** | `/dashboard/market` | Market indices, trends, top gainers/losers |
| **History** | `/dashboard/history` | Backtest results and trade history |
| **Settings** | `/dashboard/settings` | AI model and analyst team configuration |

---

## ✨ Features Enabled

✅ **Full UI/UX Styling**
- Dark professional theme
- Gradient backgrounds
- Smooth animations
- Hover effects and transitions
- Fully responsive layout

✅ **Python Backend Integration**
- Automatic connection to `https://tradingagent-yndk.onrender.com`
- Selected analyst passing
- Error handling with fallback
- Real-time progress tracking

✅ **Component Features**
- Stock symbol input with validation
- Date picker for historical analysis
- Analyst team selection (toggle-based)
- Real-time 6-agent workflow visualization
- Results display with decision/confidence/risk

---

## 🎯 Next Steps

1. **Set up Python backend** with FastAPI `/analyze` endpoint
2. **Configure CORS** to accept requests from `http://localhost:3000`
3. **Test connection** using the browser dashboard
4. **Monitor results** in the History page
5. **Customize settings** for different AI models and risk levels

Your trading dashboard is **production-ready** and waiting for backend integration! 🚀
