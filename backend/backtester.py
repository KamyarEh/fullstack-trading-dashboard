import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("../data/AAPL.csv")

df["MA20"] = df["SP500"].rolling(window=20).mean()
df["MA50"] = df["SP500"].rolling(window=50).mean()

cash = 10000
shares = 0

buy_points_x = []
buy_points_y = []

sell_points_x = []
sell_points_y = []

for index, row in df.iterrows():

    if pd.isna(row["MA20"]) or pd.isna(row["MA50"]):
        continue

    price = row["SP500"]

    if row["MA20"] > row["MA50"] and shares == 0:
        shares = cash / price
        cash = 0

        buy_points_x.append(index)
        buy_points_y.append(price)

        print(f"BUY at {price}")

    elif row["MA20"] < row["MA50"] and shares > 0:
        cash = shares * price
        shares = 0

        sell_points_x.append(index)
        sell_points_y.append(price)

        print(f"SELL at {price}")

final_value = cash

if shares > 0:
    final_value = shares * df.iloc[-1]["SP500"]

print("\nFinal Portfolio Value:", round(final_value, 2))

plt.figure(figsize=(14,7))

plt.plot(df["SP500"], label="SP500")
plt.plot(df["MA20"], label="MA20")
plt.plot(df["MA50"], label="MA50")

plt.scatter(buy_points_x, buy_points_y, marker="^", s=100, label="BUY")
plt.scatter(sell_points_x, sell_points_y, marker="v", s=100, label="SELL")

plt.legend()
plt.title("Moving Average Backtest Strategy")

plt.show()