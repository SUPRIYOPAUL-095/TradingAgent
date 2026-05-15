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

@app.get("/analyze")
def analyze(symbol: str):
    ticker = yf.Ticker(symbol)
    # Fetch enough data for indicators (SMA50 needs at least 50 days)
    data = ticker.history(period="1y")
    if data.empty:
        return {"error": "No data found for symbol"}
    
    # Use stockstats for indicators
    stock = StockDataFrame.retype(data)
    
    rsi = stock['rsi_14'].iloc[-1]
    sma20 = stock['close_20_sma'].iloc[-1]
    sma50 = stock['close_50_sma'].iloc[-1]
    latest_price = data['Close'].iloc[-1]
    
    # Simple signal logic
    signal = "HOLD"
    if rsi < 30:
        signal = "BUY"
    elif rsi > 70:
        signal = "SELL"
    
    # Lightweight AI Summary
    summary = ""
    try:
        prompt = (
            f"Analyze RSI: {round(rsi, 2)}, SMA20: {round(sma20, 2)}, SMA50: {round(sma50, 2)} "
            f"and latest price: {round(latest_price, 2)} for {symbol}. "
            "Give BUY/HOLD/SELL in 2 sentences."
        )
        response = llm.invoke([HumanMessage(content=prompt)])
        summary = response.content
    except Exception as e:
        summary = f"AI Analysis currently unavailable: {str(e)}"
    
    return {
        "symbol": symbol,
        "rsi": round(float(rsi), 2),
        "sma20": round(float(sma20), 2),
        "sma50": round(float(sma50), 2),
        "latest_price": round(float(latest_price), 2),
        "signal": signal,
        "summary": summary
    }
