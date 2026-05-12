import yfinance as yf
import pandas as pd
import matplotlib.pyplot as plt
from datetime import timedelta
import itertools
from database.database_service import execute_query

# -------------------------
# 1. PARAMETER GRID
# -------------------------

ticker = "ETERNAL.NS"
initial_capital = 100000

# Define the grid of parameters to test
position_sizes = [0.25, 0.50, 0.75, 1.0]
stop_loss_pcts = [0.02, 0.05, 0.08, 0.10]
take_profit_pcts = [0.05, 0.10, 0.15, 0.20]

# Generate all possible combinations
parameter_combinations = list(
    itertools.product(position_sizes, stop_loss_pcts, take_profit_pcts)
)

# -------------------------
# 2. DATA FETCHING
# -------------------------

query = """
SELECT trade_date, decision
FROM final_trading_decisions
WHERE company_symbol='RELIANCE'
ORDER BY trade_date
"""

signals = execute_query(query)

if not signals:
    print("ERROR: No signals retrieved from database.")
    exit()

dates = [pd.to_datetime(row["trade_date"]) for row in signals]
start_date_str = min(dates).strftime("%Y-%m-%d")
end_date_str = (max(dates) + timedelta(days=1)).strftime("%Y-%m-%d")

prices = yf.download(ticker, start=start_date_str, end=end_date_str, auto_adjust=True)

if prices.empty:
    print("ERROR: No price data downloaded.")
    exit()

prices.index = pd.to_datetime(prices.index)

# -------------------------
# 3. BUY & HOLD BASELINE
# -------------------------

first_price = (
    float(prices["Close"].iloc[0].item())
    if isinstance(prices["Close"].iloc[0], pd.Series)
    else float(prices["Close"].iloc[0])
)
final_price = (
    float(prices["Close"].iloc[-1].item())
    if isinstance(prices["Close"].iloc[-1], pd.Series)
    else float(prices["Close"].iloc[-1])
)

bnh_shares = initial_capital / first_price
bnh_final_value = bnh_shares * final_price
bnh_total_return = ((bnh_final_value - initial_capital) / initial_capital) * 100

bnh_portfolio_values = []
plot_dates = []

for date in dates:
    if date in prices.index:
        p = (
            float(prices.loc[date]["Close"].iloc[0])
            if isinstance(prices.loc[date]["Close"], pd.Series)
            else float(prices.loc[date]["Close"])
        )
        bnh_portfolio_values.append(bnh_shares * p)
        plot_dates.append(date.date())

# -------------------------
# 4. SIMULATION FUNCTION
# -------------------------


def run_backtest(pos_size, sl_pct, tp_pct):
    capital = initial_capital
    shares = 0
    buy_price = None
    portfolio_values = []

    for row in signals:
        date = pd.Timestamp(row["trade_date"])
        decision = row["decision"]

        if date not in prices.index:
            continue

        price_obj = prices.loc[date]["Close"]
        price = (
            float(price_obj.iloc[0])
            if isinstance(price_obj, pd.Series)
            else float(price_obj)
        )

        if shares > 0 and buy_price is not None:
            stop_loss = buy_price * (1 - sl_pct)
            take_profit = buy_price * (1 + tp_pct)

            if price <= stop_loss or price >= take_profit:
                capital += shares * price
                shares = 0
                buy_price = None

        if decision == "BUY" and capital > 0:
            investment = capital * pos_size
            shares += investment / price
            capital -= investment
            buy_price = price

        elif decision == "SELL" and shares > 0:
            capital += shares * price
            shares = 0
            buy_price = None

        portfolio_values.append(capital + shares * price)

    final_val = capital + shares * final_price
    total_ret = ((final_val - initial_capital) / initial_capital) * 100
    alpha = total_ret - bnh_total_return

    return {
        "pos_size": pos_size,
        "sl_pct": sl_pct,
        "tp_pct": tp_pct,
        "final_value": final_val,
        "total_return": total_ret,
        "alpha": alpha,
        "portfolio_values": portfolio_values,
    }


# -------------------------
# 5. EXECUTE GRID SEARCH
# -------------------------

print(f"Running grid search over {len(parameter_combinations)} combinations...\n")

results = []
for ps, sl, tp in parameter_combinations:
    res = run_backtest(ps, sl, tp)
    results.append(res)

# Sort by highest alpha (margin over Buy & Hold)
results.sort(key=lambda x: x["alpha"], reverse=True)
top_5 = results[:5]

# -------------------------
# 6. RESULTS & CHARTING
# -------------------------

print("=======================================================================")
print(f"Top 5 AI Strategies vs Buy & Hold (B&H Return: {bnh_total_return:.2f}%)")
print("=======================================================================")
print(
    f"{'Pos Size':<10} | {'Stop Loss':<10} | {'Take Profit':<12} | {'Final Value':<12} | {'Alpha':<10}"
)
print("-" * 71)

for r in top_5:
    print(
        f"{r['pos_size']:<10.2f} | {r['sl_pct']:<10.2f} | {r['tp_pct']:<12.2f} | ₹{r['final_value']:<11.2f} | {r['alpha']:>6.2f}%"
    )

plt.figure(figsize=(14, 7))

# Plot Buy & Hold baseline
plt.plot(
    plot_dates,
    bnh_portfolio_values,
    label=f"Buy & Hold (₹{bnh_final_value:.2f})",
    color="black",
    linestyle="--",
    linewidth=2.5,
    zorder=10,
)

# Plot top 5 strategies
colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"]
for i, r in enumerate(top_5):
    label = f"Rank {i+1}: Pos {r['pos_size']}, SL {r['sl_pct']}, TP {r['tp_pct']} (₹{r['final_value']:.2f})"
    plt.plot(
        plot_dates,
        r["portfolio_values"],
        label=label,
        color=colors[i],
        linewidth=2,
        alpha=0.8,
    )

plt.title("Comparison of Portfolio value of AI vs Buy and Hold", fontsize=15, pad=15)
plt.xlabel("Date", fontsize=12)
plt.ylabel("Portfolio Value (₹)", fontsize=12)
plt.grid(True, linestyle="--", alpha=0.6)
plt.xticks(rotation=45)
plt.legend(loc="upper left", fontsize=10, bbox_to_anchor=(1.02, 1), borderaxespad=0.0)
plt.tight_layout()

plt.savefig("grid_search_performance.png", dpi=300)
plt.show()
