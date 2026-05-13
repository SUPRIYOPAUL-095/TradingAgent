from fastapi import FastAPI
import yfinance as yf
from stockstats import StockDataFrame
from tradingagents.dataflows.config import get_config
from tradingagents.llm_clients.factory import create_llm_client
from langchain_core.messages import HumanMessage
import os

app = FastAPI()

# Initialize LLM client
config = get_config()
llm_client = create_llm_client(
    provider=config.get("llm_provider", "openai"),
    model=config.get("quick_think_llm", "gpt-5-mini"),
    base_url=config.get("backend_url")
)
llm = llm_client.get_llm()

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
