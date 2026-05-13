from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"status": "Trading Agent Running v2"}

@app.get("/analyze")
def analyze(symbol: str):
    return {
        "symbol": symbol,
        "decision": "BUY"
    }
