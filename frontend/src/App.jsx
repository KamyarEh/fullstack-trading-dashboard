import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {

  const [prices, setPrices] = useState([
    { Date: "2024", SP500: 100},
    { Date: "2025", SP500: 120},
    { Date: "2026", SP500: 140},
  ]);
  const [backtest, setBacktest] = useState(null);

  const [startingCash, setStartingCash] = useState(10000);
  const [shortWindow, setShortWindow] = useState(20);
  const [longWindow, setLongWindow] = useState(50);

  const [orderType, setOrderType] = useState("BUY");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [orderBook, setOrderBook] = useState(null);

  useEffect(() => {


    runBacktest();

    loadOrderBook();

  }, []);

  function runBacktest() {

    fetch(
      `https://fullstack-trading-dashboard.onrender.com/backtest?starting_cash=${startingCash}&short_window=${shortWindow}&long_window=${longWindow}`
    )
      .then((response) => response.json())
      .then((data) => {

        setBacktest(data);

      });

  }

  function loadOrderBook() {

    fetch("https://fullstack-trading-dashboard.onrender.com/order_book")
      .then((response) => response.json())
      .then((data) => {

        setOrderBook(data);

      });

  }

  function submitOrder() {

    fetch(
      `https://fullstack-trading-dashboard.onrender.com/add_order?order_type=${orderType}&price=${price}&quantity=${quantity}`
    )
      .then((response) => response.json())
      .then((data) => {

        setOrderBook(data);

      });

  }

  return (

    <div className="min-h-screen bg-gray-950 text-white p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-8 text-cyan-400">
          Stock Backtester Dashboard
        </h1>

        <div className="flex gap-4 mb-8 flex-wrap">

          <input
            className="bg-gray-900 p-3 rounded-xl border border-gray-800"
            type="number"
            value={startingCash}
            onChange={(e) => setStartingCash(e.target.value)}
            placeholder="Starting Cash"
          />

          <input
            className="bg-gray-900 p-3 rounded-xl border border-gray-800"
            type="number"
            value={shortWindow}
            onChange={(e) => setShortWindow(e.target.value)}
            placeholder="Short MA"
          />

          <input
            className="bg-gray-900 p-3 rounded-xl border border-gray-800"
            type="number"
            value={longWindow}
            onChange={(e) => setLongWindow(e.target.value)}
            placeholder="Long MA"
          />

          <button
            className="bg-cyan-500 hover:bg-cyan-400 px-6 rounded-xl text-black font-bold transition"
            onClick={runBacktest}
          >
            Run Backtest
          </button>

        </div>

        {backtest && (

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

            <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800">
              <h3 className="text-gray-400 mb-2">Starting Cash</h3>
              <p className="text-2xl font-bold text-cyan-400">
                ${backtest.starting_cash}
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800">
              <h3 className="text-gray-400 mb-2">Final Value</h3>
              <p className="text-2xl font-bold text-green-400">
                ${backtest.final_value}
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800">
              <h3 className="text-gray-400 mb-2">Total Return</h3>
              <p className="text-2xl font-bold text-yellow-400">
                {backtest.total_return_percent}%
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800">
              <h3 className="text-gray-400 mb-2">Trades</h3>
              <p className="text-2xl font-bold text-pink-400">
                {backtest.number_of_trades}
              </p>
            </div>

          </div>

        )}

        <div className="bg-gray-900 p-6 rounded-2xl mb-10 border border-gray-800">

          <h2 className="text-2xl font-bold mb-4 text-cyan-400">
            Place Order
          </h2>

          <div className="flex gap-4 flex-wrap">

            <select
              className="bg-gray-800 p-3 rounded-xl border border-gray-700"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
            >

              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>

            </select>

            <input
              className="bg-gray-800 p-3 rounded-xl border border-gray-700"
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              className="bg-gray-800 p-3 rounded-xl border border-gray-700"
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            

            <button
              className="bg-green-500 hover:bg-green-400 px-6 rounded-xl text-black font-bold transition"
              onClick={submitOrder}
            >
              Submit Order
            </button>

          </div>

        </div>

        {orderBook && (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">

              <h2 className="text-2xl font-bold mb-4 text-green-400">
                Buy Orders
              </h2>

              {orderBook.buy_orders.map((order, index) => (

                <div
                  key={index}
                  className="bg-green-500/10 p-3 rounded-xl mb-2"
                >
                  {order.quantity} @ ${order.price}
                </div>

              ))}

            </div>

            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">

              <h2 className="text-2xl font-bold mb-4 text-red-400">
                Sell Orders
              </h2>

              {orderBook.sell_orders.map((order, index) => (

                <div
                  key={index}
                  className="bg-red-500/10 p-3 rounded-xl mb-2"
                >
                  {order.quantity} @ ${order.price}
                </div>

              ))}

            </div>

            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">

              <h2 className="text-2xl font-bold mb-4 text-yellow-400">
                Trades
              </h2>

              {orderBook.trades.map((trade, index) => (

                <div
                  key={index}
                  className="bg-yellow-500/10 p-3 rounded-xl mb-2"
                >
                  {trade.quantity} @ ${trade.price}
                </div>

              ))}

            </div>

          </div>

        )}

        <div className="bg-gray-900 p-6 rounded-2xl mb-10 border border-gray-800">

          <h2 className="text-2xl font-bold mb-4 text-cyan-400">
            Trade History
          </h2>

          <div className="overflow-hidden rounded-2xl border border-gray-800">

            <table className="w-full text-sm">

              <thead className="bg-gray-800 text-gray-300">

                <tr>

                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Price</th>

                </tr>

              </thead>

              <tbody>

                {backtest && backtest.trades.map((trade, index) => (

                  <tr
                    key={index}
                    className="border-t border-gray-800 hover:bg-gray-800/50"
                  >

                    <td className="p-4">{trade.date}</td>

                    <td className="p-4">

                      <span
                        className={
                          trade.type === "BUY"
                            ? "bg-green-500/20 text-green-400 px-3 py-1 rounded-full"
                            : "bg-red-500/20 text-red-400 px-3 py-1 rounded-full"
                        }
                      >
                        {trade.type}
                      </span>

                    </td>

                    <td className="p-4">${trade.price}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

        <div className="bg-gray-900 p-6 rounded-2xl h-[500px] border border-gray-800">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={prices}>

              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

              <XAxis dataKey="Date" stroke="#9CA3AF" />

              <YAxis stroke="#9CA3AF" />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="SP500"
                stroke="#22d3ee"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );
}

export default App;