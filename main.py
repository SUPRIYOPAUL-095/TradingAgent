from fastapi import FastAPI
import os
from tradingagents.graph.trading_graph import TradingAgentsGraph

app = FastAPI()

@app.get("/")
def home():
    return {"status": "Trading Agent Running"}

@app.get("/analyze")
def analyze():
    company_symbol = os.getenv("COMPANY_NAME", "RELIANCE")
    analysis_date = "2026-02-05"

    ta = TradingAgentsGraph()

    _, decision = ta.propagate(
        company_symbol + ".NS",
        analysis_date
    )

    return {
        "company": company_symbol,
        "decision": str(decision)
    }
