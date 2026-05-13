from tradingagents.graph.trading_graph import TradingAgentsGraph
from tradingagents.default_config import DEFAULT_CONFIG
from database.database_service import process_results, store_agent_reports
from dotenv import load_dotenv
from datetime import datetime
import os
import uuid

# Load environment variables from .env file
load_dotenv()

# Create a custom config
config = DEFAULT_CONFIG.copy()
config["backend_url"]= "https://api.groq.com/openai/v1"
config["deep_think_llm"] = "meta-llama/llama-4-scout-17b-16e-instruct"  # Use a different model
config["quick_think_llm"] = "meta-llama/llama-4-scout-17b-16e-instruct"  # Use a different model
config["max_debate_rounds"] = 1  # Increase debate rounds

# Configure data vendors (default uses yfinance, no extra API keys needed)
config["data_vendors"] = {
    "core_stock_apis": "yfinance",           # Options: alpha_vantage, yfinance
    "technical_indicators": "yfinance",      # Options: alpha_vantage, yfinance
    "fundamental_data": "yfinance",          # Options: alpha_vantage, yfinance
    "news_data": "yfinance",                 # Options: alpha_vantage, yfinance
}

# Initialize with custom config - use only market analyst to avoid recursion
ta = TradingAgentsGraph(selected_analysts=["market"], debug=True, config=config)


company_symbol = str(os.environ.get("COMPANY_NAME"))
# analysis_date = datetime.today().strftime('%Y-%m-%d')
analysis_date="2026-02-05"


# forward propagate
_, decision = ta.propagate(company_symbol + ".NS", analysis_date)

analysis_id = str(uuid.uuid4())

process_results(company_symbol, analysis_date, decision, analysis_id)
store_agent_reports(analysis_id)
print(decision)

# Memorize mistakes and reflect
# ta.reflect_and_remember(1000) # parameter is the position returns
