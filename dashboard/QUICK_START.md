# Quick Start Guide - Trading Dashboard

## 🚀 Start in 30 Seconds

### Option 1: Using the Setup Script (macOS/Linux)

```bash
chmod +x setup.sh
./setup.sh
npm run dev
```

### Option 2: Manual Setup (All Platforms)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:3000/dashboard
```

## 📊 First Analysis

1. **Open Dashboard**: Go to `http://localhost:3000/dashboard`

2. **Enter Stock Symbol**: 
   - Type: `TCS`, `INFY`, `RELIANCE`, or any Indian stock symbol
   - Or use: `AAPL`, `GOOGL`, `MSFT` for US stocks

3. **Select Date**: Choose any date for analysis

4. **Click "Run Analysis"**: Wait for results (uses mock data if backend not available)

5. **View Results**:
   - ✅ AI Decision (BUY/SELL/HOLD)
   - 📊 Confidence Score (0-100%)
   - ⚠️ Risk Level (Low/Medium/High)
   - 📝 AI Explanation (detailed analysis)
   - 📈 Price Chart (historical data)

## 🔧 Connecting Your Python Backend

### Step 1: Start Your Python Backend

```bash
# In your Python project
python app.py  # or your startup command
```

Ensure your backend is running on: `https://tradingagent-yndk.onrender.com`

### Step 2: Setup Endpoint

Your backend should have a POST endpoint:

```
POST /analyze
Content-Type: application/json

{
  "company": "TCS",
  "date": "2024-01-25"
}
```

### Step 3: Response Format

Backend should return:

```json
{
  "decision": "BUY",
  "confidence": 78,
  "risk": "Medium",
  "explanation": "Technical indicators show strong bullish momentum...",
  "company_symbol": "TCS",
  "analysis_date": "2024-01-25"
}
```

### Step 4: Dashboard Automatically Connects

No code changes needed! Dashboard will automatically call your backend when available.

## 📱 Responsive Design

- ✅ Works on Desktop (1440px+)
- ✅ Works on Tablets (768px-1440px)  
- ✅ Works on Mobile (320px-768px)

Try resizing your browser or testing on your phone!

## 🎨 UI Features

### Sidebar Navigation
Click the sidebar icons to navigate between:
- 📊 **Dashboard** - Main analysis interface
- 📈 **Market Analysis** - Market insights
- 📋 **History** - Past analyses
- ⚙️ **Settings** - User preferences

### Decision Colors
- 🟢 Green = **BUY** (bullish signal)
- 🔴 Red = **SELL** (bearish signal)
- 🟡 Yellow = **HOLD** (neutral signal)

### Confidence Indicator
- The progress bar shows AI confidence (0-100%)
- Longer bar = More confident decision
- Shorter bar = Less certain (risky)

### Risk Levels
- 🟢 **Low Risk** - Stable, minimal volatility
- 🟡 **Medium Risk** - Moderate movement possible
- 🔴 **High Risk** - High volatility expected

## 💡 Tips

1. **Mock Data**: Dashboard works standalone with realistic mock data
2. **No API Errors**: If backend fails, mock data is used automatically
3. **Save Analyses**: History page shows all your past analyses
4. **Responsive**: Works great on any device
5. **Dark Theme**: Easy on the eyes, professional trading appearance

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
# Then visit: http://localhost:3001/dashboard
```

### Backend Not Connecting
1. Check if backend is running
2. Verify it's on `https://tradingagent-yndk.onrender.com`
3. Check browser console for errors
4. Dashboard will use mock data as fallback

### Styles Look Broken
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run dev
```

### Chart Not Displaying
- Ensure you're seeing the Price Trend section
- Mock data includes 10 days of price history
- Try refreshing the page

## 📚 Full Documentation

For complete details, see: **AI_DASHBOARD_README.md**

## 🚀 Next Steps

1. **Explore Components**: Check files in `components/` folder
2. **Customize Colors**: Edit `tailwind.config.ts`
3. **Add More Pages**: Create new files in `app/dashboard/`
4. **Connect Real Backend**: Update fetch URL in `app/dashboard/page.tsx`
5. **Deploy Online**: Use Vercel, Netlify, or your hosting

## 🎯 Common Tasks

### Deploy to Vercel
```bash
npm install -g vercel
vercel
# Follow the prompts
```

### Build for Production
```bash
npm run build
npm start
```

### Run Linter
```bash
npm run lint
```

## ❓ Need Help?

1. Check browser console for errors (F12)
2. Review API response in Network tab
3. Verify backend is running correctly
4. See AI_DASHBOARD_README.md for detailed docs

---

**Happy Trading! 📈**
