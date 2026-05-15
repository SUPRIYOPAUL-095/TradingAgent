from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
from stockstats import StockDataFrame
from tradingagents.dataflows.config import get_config
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
import os

app = FastAPI()

# Configure CORS
origins = [
    "https://trading-agent-ai-two.vercel.app",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex="https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini LLM client
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

@app.get("/")
def home():
    return {"status": "Trading Agent Running"}

from datetime import datetime, timedelta
import pandas as pd

@app.get("/analyze")
def analyze(symbol: str, date: str = None):
    ticker = yf.Ticker(symbol)
    
    # Fetch data up to current or specified date
    end_date = datetime.now()
    if date:
        try:
            end_date = datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
            return {"error": "Invalid date format. Use YYYY-MM-DD"}
    
    # Fetch 1 year of data ending at specified date
    start_date = end_date - timedelta(days=365)
    data = ticker.history(start=start_date.strftime("%Y-%m-%d"), end=(end_date + timedelta(days=1)).strftime("%Y-%m-%d"))
    
    if data.empty:
        return {"error": f"No data found for symbol {symbol} around {date or 'today'}"}
    
    # Use stockstats for indicators
    stock = StockDataFrame.retype(data.copy())
    
    # Get values at the specified date (last row of fetched data)
    rsi = stock['rsi_14'].iloc[-1]
    sma20 = stock['close_20_sma'].iloc[-1]
    sma50 = stock['close_50_sma'].iloc[-1]
    latest_price = data['Close'].iloc[-1]
    
    # Prepare history for chart (last 10 trading days)
    history_data = data.tail(10)
    history = [
        {"date": d.strftime("%d %b"), "price": round(float(p), 2)}
        for d, p in zip(history_data.index, history_data['Close'])
    ]
    
    # Simple signal logic
    signal = "HOLD"
    if rsi < 30:
        signal = "BUY"
    elif rsi > 70:
        signal = "SELL"
    
    # Lightweight AI Summary
    summary = ""
    try:
        date_str = date if date else "today"
        prompt = (
            f"Analyze RSI: {round(rsi, 2)}, SMA20: {round(sma20, 2)}, SMA50: {round(sma50, 2)} "
            f"and price: {round(latest_price, 2)} for {symbol} as of {date_str}. "
            "Give BUY/HOLD/SELL recommendation in 2 sentences based on these technicals."
        )
        response = llm.invoke([HumanMessage(content=prompt)])
        summary = response.content
    except Exception as e:
        summary = f"AI Analysis currently unavailable: {str(e)}"
    
    return {
        "symbol": symbol,
        "date": end_date.strftime("%Y-%m-%d"),
        "rsi": round(float(rsi), 2),
        "sma20": round(float(sma20), 2),
        "sma50": round(float(sma50), 2),
        "latest_price": round(float(latest_price), 2),
        "signal": signal,
        "summary": summary,
        "history": history
    }
