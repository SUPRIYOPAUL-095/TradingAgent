from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
from stockstats import StockDataFrame
from tradingagents.dataflows.config import get_config
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
import os
import time

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
    model="gemini-2.0-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

@app.get("/")
def home():
    return {"status": "Trading Agent Running"}

from datetime import datetime, timedelta
import pandas as pd


def generate_local_summary(symbol: str, rsi: float, sma20: float, sma50: float, latest_price: float, signal: str) -> str:
    """Generate a professional market analysis summary from technical indicators.
    Used as a fallback when Gemini API is unavailable."""
    stock_name = symbol.replace(".NS", "").replace(".BO", "")

    # RSI interpretation
    if rsi < 20:
        rsi_desc = (
            f"The RSI at {rsi} places {stock_name} in deeply oversold territory, "
            "which historically precedes mean-reversion rallies. This is a technically "
            "significant level that warrants close attention from value-oriented investors."
        )
    elif rsi < 30:
        rsi_desc = (
            f"The RSI of {rsi} indicates that {stock_name} is approaching the oversold region, "
            "suggesting the recent selling pressure may be nearing exhaustion. While not yet at "
            "extreme levels, this reading signals potential for a near-term technical bounce."
        )
    elif rsi < 45:
        rsi_desc = (
            f"The RSI of {rsi} indicates that {stock_name} is trading with neutral to slightly "
            "bearish momentum. The stock is approaching the oversold region but has not yet "
            "reached a strong reversal signal."
        )
    elif rsi < 55:
        rsi_desc = (
            f"The RSI of {rsi} shows {stock_name} trading in a balanced zone with neither "
            "overbought nor oversold conditions. Momentum is neutral, suggesting the stock "
            "is in a consolidation phase."
        )
    elif rsi < 70:
        rsi_desc = (
            f"With an RSI of {rsi}, {stock_name} displays moderately bullish momentum. "
            "The stock has room to advance further before entering overbought territory, "
            "suggesting continued positive sentiment."
        )
    elif rsi < 80:
        rsi_desc = (
            f"The RSI of {rsi} places {stock_name} in overbought territory, indicating "
            "strong recent buying pressure. While the trend remains bullish, traders should "
            "be cautious of potential profit-taking at these elevated levels."
        )
    else:
        rsi_desc = (
            f"At an RSI of {rsi}, {stock_name} is in extremely overbought territory. "
            "This level historically signals an elevated probability of a corrective pullback. "
            "Risk management is critical at this juncture."
        )

    # SMA crossover
    sma_diff_pct = ((sma20 - sma50) / sma50) * 100 if sma50 != 0 else 0
    if sma20 > sma50:
        if sma_diff_pct > 3:
            trend = (
                f"The 20-day SMA ({sma20:.2f}) is trading well above the 50-day SMA ({sma50:.2f}), "
                "confirming a strong bullish trend. This golden cross formation indicates "
                "sustained institutional buying interest."
            )
        else:
            trend = (
                f"The 20-day SMA ({sma20:.2f}) remains slightly above the 50-day SMA ({sma50:.2f}), "
                "suggesting a mildly bullish long-term trend despite recent weakness."
            )
    elif sma20 < sma50:
        if sma_diff_pct < -3:
            trend = (
                f"The 20-day SMA ({sma20:.2f}) is trading significantly below the 50-day SMA ({sma50:.2f}), "
                "confirming a bearish death cross pattern. This suggests sustained downward pressure."
            )
        else:
            trend = (
                f"The 20-day SMA ({sma20:.2f}) is slightly below the 50-day SMA ({sma50:.2f}), "
                "indicating a mildly bearish short-term trend. However, the narrow gap suggests "
                "the selling pressure may be moderating."
            )
    else:
        trend = (
            f"The 20-day SMA and 50-day SMA are converging near {sma20:.2f}, suggesting "
            "a period of consolidation."
        )

    # Sentiment
    if rsi < 30 and sma20 < sma50:
        sentiment = (
            "Current market sentiment is bearish with oversold conditions. "
            "While the technical setup is weak, oversold readings may attract "
            "contrarian buying interest at these levels."
        )
    elif rsi > 70 and sma20 > sma50:
        sentiment = (
            "Current market sentiment is strongly bullish with overbought conditions. "
            "Elevated RSI levels suggest the risk-reward ratio is becoming less favorable "
            "for new long positions."
        )
    elif sma20 > sma50:
        sentiment = (
            "Current market sentiment is neutral to slightly positive. Volatility remains "
            "moderate, and no major bearish technical breakdown is observed."
        )
    elif sma20 < sma50:
        sentiment = (
            "Current market sentiment leans cautious. The bearish moving average alignment "
            "warrants monitoring, though current volatility levels remain within normal ranges."
        )
    else:
        sentiment = (
            "Market sentiment is neutral with balanced technical signals. Volatility remains "
            "contained, and no significant directional bias is detected in the near term."
        )

    # Recommendation
    if signal == "BUY":
        rec = (
            "Investors may consider initiating or adding to positions, with appropriate "
            "stop-loss levels in place. The technical indicators support a favorable entry "
            "point for medium-term positions."
        )
    elif signal == "SELL":
        rec = (
            "Investors should consider booking profits or tightening stop-losses on existing "
            "positions. The technical indicators signal elevated downside risk in the near term."
        )
    else:
        rec = (
            "Investors may continue holding existing positions while monitoring RSI movement "
            "and price action over the next few trading sessions."
        )

    return (
        f"{stock_name} is currently trading at ₹{latest_price:.2f}. {rsi_desc}\n\n"
        f"{trend}\n\n"
        f"{sentiment}\n\n"
        f"Recommendation: {signal}\n\n"
        f"{rec}"
    )


def retry_gemini_call(prompt: str, max_retries: int = 5) -> str | None:
    """Call Gemini with exponential backoff. Returns content string or None on failure."""
    for attempt in range(max_retries):
        try:
            response = llm.invoke([HumanMessage(content=prompt)])
            if response and response.content:
                return response.content
        except Exception as e:
            error_msg = str(e).lower()
            is_retryable = any(
                kw in error_msg
                for kw in ["429", "resource_exhausted", "quota", "timeout", "rate", "overloaded"]
            )
            if is_retryable and attempt < max_retries - 1:
                wait_time = min(2 ** attempt, 16)  # 1, 2, 4, 8, 16 seconds
                time.sleep(wait_time)
                continue
            # Non-retryable error or final attempt — give up
            break
    return None


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
    
    # AI Summary with retry and fallback
    summary = ""
    summary_source = "gemini"
    
    date_str = date if date else "today"
    prompt = (
        f"You are a professional equity research analyst. Analyze the following technical indicators "
        f"for {symbol} as of {date_str}:\n"
        f"- Current Price: ₹{round(latest_price, 2)}\n"
        f"- RSI (14): {round(rsi, 2)}\n"
        f"- 20-day SMA: {round(sma20, 2)}\n"
        f"- 50-day SMA: {round(sma50, 2)}\n"
        f"- Signal: {signal}\n\n"
        f"Provide a professional 4-5 paragraph market analysis summary covering:\n"
        f"1. RSI analysis and momentum assessment\n"
        f"2. Moving average trend analysis\n"
        f"3. Overall market sentiment and volatility\n"
        f"4. Clear BUY/HOLD/SELL recommendation with rationale\n"
        f"Keep the tone institutional and data-driven. Do not use bullet points."
    )
    
    # Try Gemini with retries
    gemini_result = retry_gemini_call(prompt, max_retries=5)
    
    if gemini_result:
        summary = gemini_result
        summary_source = "gemini"
    else:
        # Generate professional local fallback — never show error messages
        summary = generate_local_summary(
            symbol=symbol,
            rsi=round(float(rsi), 2),
            sma20=round(float(sma20), 2),
            sma50=round(float(sma50), 2),
            latest_price=round(float(latest_price), 2),
            signal=signal,
        )
        summary_source = "local"
    
    return {
        "symbol": symbol,
        "date": end_date.strftime("%Y-%m-%d"),
        "rsi": round(float(rsi), 2),
        "sma20": round(float(sma20), 2),
        "sma50": round(float(sma50), 2),
        "latest_price": round(float(latest_price), 2),
        "signal": signal,
        "summary": summary,
        "summary_source": summary_source,
        "history": history
    }

