from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

from order_book import add_order
from order_book import buy_orders
from order_book import sell_orders
from order_book import trade_history
from order_book import get_order_book

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

df = pd.read_csv("../data/AAPL.csv")


@app.get("/")
def home():
    return {"message": "Stock Backtester API Running"}


@app.get("/prices")
def prices():

    data = df.copy()

    data["MA20"] = data["SP500"].rolling(window=20).mean()
    data["MA50"] = data["SP500"].rolling(window=50).mean()

    buy_signals = []
    sell_signals = []

    shares = 0

    for index, row in data.iterrows():

        if pd.isna(row["MA20"]) or pd.isna(row["MA50"]):
            continue

        if row["MA20"] > row["MA50"] and shares == 0:

            buy_signals.append({
                "Date": row["Date"],
                "SP500": float(row["SP500"]),
                "signal": "BUY"
            })

            shares = 1

        elif row["MA20"] < row["MA50"] and shares > 0:

            sell_signals.append({
                "Date": row["Date"],
                "SP500": float(row["SP500"]),
                "signal": "SELL"
            })

            shares = 0

    clean_df = data.tail(100)[["Date", "SP500"]]

    clean_df["SP500"] = clean_df["SP500"].astype(float)

    return {
        "prices": clean_df.to_dict(orient="records"),
        "buy_signals": buy_signals,
        "sell_signals": sell_signals
    }


@app.get("/backtest")
def backtest(
    starting_cash: int = 10000,
    short_window: int = 20,
    long_window: int = 50
):

    data = df.copy()

    data["MA_SHORT"] = data["SP500"].rolling(window=short_window).mean()
    data["MA_LONG"] = data["SP500"].rolling(window=long_window).mean()

    cash = starting_cash
    shares = 0
    trades = []

    for index, row in data.iterrows():

        if pd.isna(row["MA_SHORT"]) or pd.isna(row["MA_LONG"]):
            continue

        price = float(row["SP500"])

        if row["MA_SHORT"] > row["MA_LONG"] and shares == 0:

            shares = cash / price
            cash = 0

            trades.append({
                "date": row["Date"],
                "type": "BUY",
                "price": round(price, 2)
            })

        elif row["MA_SHORT"] < row["MA_LONG"] and shares > 0:

            cash = shares * price
            shares = 0

            trades.append({
                "date": row["Date"],
                "type": "SELL",
                "price": round(price, 2)
            })

    if shares > 0:
        final_value = shares * float(data.iloc[-1]["SP500"])
    else:
        final_value = cash

    total_return = ((final_value - starting_cash) / starting_cash) * 100

    return {
        "starting_cash": starting_cash,
        "final_value": round(final_value, 2),
        "total_return_percent": round(total_return, 2),
        "number_of_trades": len(trades),
        "trades": trades
    }


@app.get("/add_order")
def place_order(
    order_type: str,
    price: float,
    quantity: int
):

    add_order(order_type, price, quantity)

    return get_order_book()


@app.get("/order_book")
def order_book():

    return get_order_book()