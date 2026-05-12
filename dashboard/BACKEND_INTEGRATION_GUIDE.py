"""
Backend Integration Guide for Trading Dashboard
================================================

This file shows how to implement the /analyze endpoint in your Python backend
to work with the Trading Dashboard frontend.

Example implementations for different frameworks:
"""

# ============================================================================
# FASTAPI EXAMPLE
# ============================================================================

"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class AnalysisRequest(BaseModel):
    company: str
    date: str

# Response model
class AnalysisResponse(BaseModel):
    decision: Literal["BUY", "SELL", "HOLD"]
    confidence: int  # 0-100
    risk: Literal["Low", "Medium", "High"]
    explanation: str
    company_symbol: str
    analysis_date: str

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_stock(request: AnalysisRequest):
    '''
    Analyzes a stock and returns trading recommendation.
    
    Args:
        request: Contains company symbol and analysis date
        
    Returns:
        AnalysisResponse with decision, confidence, risk, and explanation
    '''
    try:
        # Your analysis logic here
        decision = "BUY"  # or SELL, HOLD
        confidence = 78   # 0-100
        risk = "Medium"   # Low, Medium, High
        explanation = "Your detailed analysis here..."
        
        return AnalysisResponse(
            decision=decision,
            confidence=confidence,
            risk=risk,
            explanation=explanation,
            company_symbol=request.company,
            analysis_date=request.date
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Start: uvicorn app:app --reload --port 8000
"""

# ============================================================================
# FLASK EXAMPLE
# ============================================================================

"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/analyze": {"origins": "http://localhost:3000"}})

@app.route("/analyze", methods=["POST"])
def analyze_stock():
    '''
    Analyzes a stock and returns trading recommendation.
    '''
    try:
        data = request.get_json()
        company = data.get("company")
        date = data.get("date")
        
        if not company or not date:
            return jsonify({"error": "Missing company or date"}), 400
        
        # Your analysis logic here
        response = {
            "decision": "BUY",           # BUY, SELL, or HOLD
            "confidence": 78,            # 0-100
            "risk": "Medium",            # Low, Medium, or High
            "explanation": "Your detailed analysis here...",
            "company_symbol": company,
            "analysis_date": date
        }
        
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8000)
"""

# ============================================================================
# DJANGO EXAMPLE
# ============================================================================

"""
# views.py
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.middleware.cors import CorsMiddlewareNotApplied
import json

@csrf_exempt
@require_http_methods(["POST"])
def analyze_stock(request):
    '''
    Analyzes a stock and returns trading recommendation.
    '''
    try:
        data = json.loads(request.body)
        company = data.get("company")
        date = data.get("date")
        
        if not company or not date:
            return JsonResponse({"error": "Missing company or date"}, status=400)
        
        # Your analysis logic here
        response = {
            "decision": "BUY",           # BUY, SELL, or HOLD
            "confidence": 78,            # 0-100
            "risk": "Medium",            # Low, Medium, or High
            "explanation": "Your detailed analysis here...",
            "company_symbol": company,
            "analysis_date": date
        }
        
        return JsonResponse(response, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("analyze", views.analyze_stock, name="analyze_stock"),
]

# settings.py - Add CORS
INSTALLED_APPS = [
    ...
    "corsheaders",
]

MIDDLEWARE = [
    ...
    "corsheaders.middleware.CorsMiddleware",
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
"""

# ============================================================================
# RESPONSE FORMAT SPECIFICATION
# ============================================================================

"""
REQUIRED Response Format (JSON):
{
    "decision": "BUY" | "SELL" | "HOLD",
    "confidence": 0-100 (integer, percentage),
    "risk": "Low" | "Medium" | "High",
    "explanation": "Multi-line string with analysis points...",
    "company_symbol": "TCS" (string, matches input),
    "analysis_date": "2024-01-25" (string, matches input)
}

RESPONSE CODES:
- 200: Success with valid analysis
- 400: Bad request (missing company or date)
- 500: Server error

EXPLANATION FORMAT:
The explanation should be multi-line, with each line representing a key point.
Lines are separated by newlines (\n).

Example:
"Technical indicators show strong bullish momentum
Support levels are holding above key thresholds
Volume trends indicate institutional buying
Recent news sentiment is positive"

The frontend will:
- Split by newline
- Display each line as a bullet point
- Show scrollable if text is long
"""

# ============================================================================
# ANALYSIS IMPLEMENTATION TIPS
# ============================================================================

"""
1. DECISION LOGIC:
   - Combine multiple technical indicators (RSI, MACD, etc.)
   - Check fundamental ratios
   - Analyze news sentiment
   - Aggregate signals → BUY/SELL/HOLD

2. CONFIDENCE SCORING:
   - Higher when multiple indicators align
   - Lower when mixed signals
   - Base on signal strength (0-100%)
   - Example: If 3/4 indicators bullish → 75%

3. RISK ASSESSMENT:
   - Low: Volatility < 2%, strong support, consensus
   - Medium: Volatility 2-5%, moderate indicators
   - High: Volatility > 5%, mixed signals, breakout zone

4. EXPLANATION GENERATION:
   - List top 5-7 key factors
   - Be specific (not generic)
   - Include numbers/metrics
   - Keep lines short (~80 chars)
   - Use bullet point format

5. COMMON METRICS:
   - RSI (Relative Strength Index)
   - MACD (Moving Average Convergence Divergence)
   - Bollinger Bands
   - Moving Averages
   - Volume analysis
   - Support/Resistance
   - Fibonacci levels
   - Elliott Wave patterns
   - Divergences
   - Trend analysis
"""

# ============================================================================
# TESTING YOUR ENDPOINT
# ============================================================================

"""
Test with curl:
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"company": "TCS", "date": "2024-01-25"}'

Test with Python:
import requests

url = "http://localhost:8000/analyze"
data = {
    "company": "TCS",
    "date": "2024-01-25"
}

response = requests.post(url, json=data)
print(response.json())

Expected Response:
{
    "decision": "BUY",
    "confidence": 78,
    "risk": "Medium",
    "explanation": "Technical indicators show strong bullish momentum...",
    "company_symbol": "TCS",
    "analysis_date": "2024-01-25"
}
"""

# ============================================================================
# ERROR HANDLING
# ============================================================================

"""
Handle these errors gracefully:

1. Invalid stock symbol:
   Return: {"error": "Invalid stock symbol", status: 400}

2. Bad date format:
   Return: {"error": "Invalid date format", status: 400}

3. Data not available:
   Return: {"error": "No data available for this date", status: 404}

4. Server errors:
   Return: {"error": "Internal server error", status: 500}

5. Rate limiting:
   Return: {"error": "Too many requests", status: 429}
"""

# ============================================================================
# FRONTEND INTEGRATION
# ============================================================================

"""
The frontend at app/dashboard/page.tsx calls your endpoint:

fetch('http://localhost:8000/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    company: 'TCS',
    date: '2024-01-25',
  }),
})

IMPORTANT:
- Ensure CORS is enabled
- Return JSON format only
- Response must match specification
- Handle timeouts (recommend < 5 seconds)
- Frontend has mock data fallback
"""

# ============================================================================
# BEST PRACTICES
# ============================================================================

"""
1. Performance:
   - Cache results if possible
   - Return within 5 seconds
   - Use async/await for I/O

2. Reliability:
   - Validate all inputs
   - Handle missing data gracefully
   - Log errors for debugging
   - Provide meaningful error messages

3. Security:
   - Sanitize inputs
   - Rate limit requests
   - Use HTTPS in production
   - Validate API keys if needed

4. Testing:
   - Test with various stock symbols
   - Test with different dates (past, present)
   - Test error conditions
   - Test CORS headers

5. Documentation:
   - Document your analysis algorithm
   - List data sources
   - Explain confidence calculation
   - Note any limitations
"""

# ============================================================================
# SAMPLE ANALYSIS DATA
# ============================================================================

"""
Example data structures for analysis:

TECHNICAL INDICATORS:
{
    'RSI': 65,              # 0-100
    'MACD': 0.45,          # Positive = bullish
    'MACD_signal': 0.35,
    'BB_upper': 150,       # Bollinger Bands
    'BB_lower': 140,
    'BB_middle': 145,
    'MA_50': 148,          # 50-day moving average
    'MA_200': 142,         # 200-day moving average
    'support': 140,
    'resistance': 152,
}

FUNDAMENTAL DATA:
{
    'PE_ratio': 25.5,
    'PB_ratio': 3.2,
    'debt_to_equity': 0.5,
    'ROE': 0.18,
    'ROA': 0.08,
    'profit_margin': 0.15,
}

SENTIMENT DATA:
{
    'news_sentiment': 0.65,     # -1 to 1
    'social_media_sentiment': 0.58,
    'analyst_rating': 4.2,      # 1-5
    'insider_buying': True,
}

PRICE DATA:
{
    'current': 147.5,
    'open': 145.0,
    'high': 150.0,
    'low': 144.5,
    'volume': 2500000,
    'change_percent': 1.72,
}
"""

print("Backend Integration Guide loaded successfully!")
