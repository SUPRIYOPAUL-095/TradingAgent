# 🎯 Dashboard Quick Guide - Test & Verify

## ✅ Current Status

Your dashboard is now **LIVE** at: **http://localhost:3000/dashboard**

### Fixed Issues:
1. ✅ **CSS Styling** - Tailwind CSS properly compiled and applied
2. ✅ **Python Backend Connection** - Configured with graceful fallback
3. ✅ **Mock Data** - Working as fallback when backend unavailable

---

## 🚀 How to Use the Dashboard Now

### **Option A: Test with Mock Data (Right Now!)**

1. **Open the dashboard:**
   - Go to: http://localhost:3000/dashboard

2. **Fill the form:**
   - Stock Symbol: `RELIANCE.NS`
   - Date: Any date (default is today)
   - Analyst Teams: All 4 are selected by default ✅

3. **Click "Run Analysis"**
   - Watch the 6-agent workflow progress bar
   - See the results display with:
     - Decision (BUY/SELL/HOLD)
     - Confidence score (0-100%)
     - Risk level (Low/Medium/High)
     - Detailed explanation
     - Price chart

4. **Explore other pages:**
   - **Market Analysis**: http://localhost:3000/dashboard/market
   - **History**: http://localhost:3000/dashboard/history
   - **Settings**: http://localhost:3000/dashboard/settings

---

### **Option B: Connect Real Python Backend**

#### Step 1: Create `/analyze` Endpoint

Your Python backend needs this endpoint:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

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
async def analyze(request: dict):
    """
    Expected request:
    {
      "company": "RELIANCE.NS",
      "date": "2024-04-23",
      "analysts": ["market", "news", "fundamentals", "social"]
    }
    """
    company = request.get("company")
    date = request.get("date")
    analysts = request.get("analysts", [])
    
    # Your analysis logic here
    # Call your trading agents
    
    return {
        "decision": "BUY",
        "confidence": 85,
        "risk": "Medium",
        "explanation": "Strong technical setup with positive momentum",
        "company_symbol": company,
        "analysis_date": date,
        "agents": {
            "market": {"status": "completed"},
            "news": {"status": "completed"},
            "fundamentals": {"status": "completed"},
            "social": {"status": "completed"}
        }
    }
```

#### Step 2: Start Backend on Port 8000

```bash
# Using FastAPI
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Or your existing Python server on port 8000
python main.py --port 8000
```

#### Step 3: Test Connection

1. Open dashboard: http://localhost:3000/dashboard
2. Fill form and click "Run Analysis"
3. Should see: "Running backend analysis..." (not the mock data warning)
4. Results will come from your Python backend!

---

## 📊 Page Guide

### 1. **Dashboard** (Main Page)
- **Purpose**: Run analysis and see agent workflow
- **Features**:
  - Stock symbol input
  - Date picker
  - Analyst team selection (4 teams)
  - Real-time 6-agent progress bar
  - Results display with decision/confidence/risk
  - Price chart

### 2. **Market Analysis**
- **Purpose**: View market trends and data
- **Features**:
  - 4 Market indices cards
  - Trend line chart
  - Tabbed interface:
    - Overview (stats + sectors)
    - Top Gainers
    - Top Losers
    - Sector Analysis

### 3. **History**
- **Purpose**: Review past analysis results
- **Features**:
  - 7 key performance metrics
  - Trade records table with filtering
  - Sortable by date/return/confidence
  - Backtest analytics
  - Performance visualization

### 4. **Settings**
- **Purpose**: Configure AI behavior
- **Features**:
  - AI model selection
  - Analyst team toggles
  - Debate rounds (1-5)
  - Risk level (Conservative/Moderate/Aggressive)
  - Feature toggles
  - Persistent storage (localStorage)

---

## ⚠️ Current Behavior

### With Backend Running (Port 8000):
- Dashboard connects to Python backend
- Real analysis results displayed
- 6-agent workflow shows real progress
- Results saved to history

### Without Backend (Currently):
- Dashboard uses mock data automatically
- Shows realistic example results
- Perfect for testing UI/navigation
- Demo the workflow visualization
- Message shows: "⚠ Backend unavailable - using mock data for demo"

---

## 🔧 Troubleshooting

### Dashboard Shows Error: "Connection Failed"
**Fix:**
- This is normal! Your Python backend isn't running yet
- Dashboard automatically uses mock data
- Start your Python backend on port 8000 to connect

### No Styling/CSS Visible
**Fix:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Restart dev server: `npm run dev`

### Port 3000 Already in Use
**Fix:**
```powershell
# Stop all Node processes
Get-Process node | Stop-Process -Force

# Or use different port
$env:PORT=3001
npm run dev
```

### Can't Connect to Backend
**Check:**
1. Is Python backend running? `netstat -ano | Select-String 8000`
2. Is CORS enabled in backend?
3. Is endpoint at `/analyze`?
4. Is it responding to POST requests?

---

## 🎯 Testing Checklist

- [ ] Visit http://localhost:3000/dashboard
- [ ] See professional dark theme (not plain text)
- [ ] Fill in stock symbol and click "Run Analysis"
- [ ] Watch 6-agent progress bar animate
- [ ] See results display with BUY/SELL/HOLD decision
- [ ] Click "Market Analysis" and see indices chart
- [ ] Click "History" and see backtest table
- [ ] Click "Settings" and toggle analysts
- [ ] Verify all pages have styled dark theme
- [ ] Test stock symbol input validation
- [ ] Test analyst team selection toggling

---

## 🚀 Next Steps

1. **Immediate**: Test with mock data (works now!)
2. **Soon**: Connect Python backend on port 8000
3. **Later**: Customize settings for different models
4. **Deploy**: Build and deploy to production

---

## 📞 Quick Links

- **Frontend**: http://localhost:3000/dashboard
- **Backend**: http://localhost:8000/docs (when running)
- **Dev Server Logs**: Terminal where you ran `npm run dev`
- **Python Backend**: Your main.py or FastAPI app

---

**Your dashboard is ready! Start exploring and connect your Python backend when ready.** 🎉
