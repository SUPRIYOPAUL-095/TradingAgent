# TradingAgents: Gemini-Powered Financial Trading Framework

TradingAgents is a streamlined financial analysis framework powered exclusively by **Google Gemini AI**. It provides real-time technical analysis, sentiment insights, and trading recommendations through a clean, production-ready dashboard.

## Key Features
- **Gemini 1.5 Flash Integration**: Ultra-fast and accurate market analysis.
- **Real-time Indicators**: Live calculation of RSI, SMA20, and SMA50.
- **Actionable Insights**: Clear BUY/HOLD/SELL signals with AI-generated summaries.
- **Production-Ready Dashboard**: Clean, responsive UI for modern trading workflows.

## Quick Start

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/TauricResearch/TradingAgents.git
   cd TradingAgents
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up your Google API Key:
   ```bash
   export GOOGLE_API_KEY=your_gemini_api_key
   ```

### Running the App
1. Start the backend:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```

2. Start the frontend:
   ```bash
   cd dashboard
   npm install
   npm run dev
   ```

## Technical Analysis
The framework utilizes `yfinance` for live market data and `stockstats` for technical indicators:
- **RSI (14)**: Relative Strength Index for overbought/oversold conditions.
- **SMA20**: 20-day Simple Moving Average for short-term trends.
- **SMA50**: 50-day Simple Moving Average for medium-term trends.

## Production Cleanup
This version has been simplified to remove experimental multi-agent "debate" features and legacy LLM providers (OpenAI, Anthropic, Groq), resulting in a faster, more reliable, and cleaner codebase suitable for real-world deployment.

---
*Disclaimer: This tool is for research purposes and does not constitute financial advice.*
