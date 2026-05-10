buy_orders = []

sell_orders = []

trade_history = []


def get_order_book():

    return {
        "buy_orders": buy_orders,
        "sell_orders": sell_orders,
        "trades": trade_history
    }


def add_order(order_type, price, quantity):

    order = {
        "type": order_type,
        "price": price,
        "quantity": quantity
    }

    if order_type == "BUY":
        buy_orders.append(order)

    else:
        sell_orders.append(order)

    match_orders()


def match_orders():

    global buy_orders
    global sell_orders

    buy_orders = sorted(
        buy_orders,
        key=lambda x: x["price"],
        reverse=True
    )

    sell_orders = sorted(
        sell_orders,
        key=lambda x: x["price"]
    )

    while buy_orders and sell_orders:

        highest_buy = buy_orders[0]
        lowest_sell = sell_orders[0]

        if highest_buy["price"] >= lowest_sell["price"]:

            trade_price = lowest_sell["price"]

            trade_quantity = min(
                highest_buy["quantity"],
                lowest_sell["quantity"]
            )

            trade_history.append({
                "price": trade_price,
                "quantity": trade_quantity
            })

            highest_buy["quantity"] -= trade_quantity
            lowest_sell["quantity"] -= trade_quantity

            if highest_buy["quantity"] == 0:
                buy_orders.pop(0)

            if lowest_sell["quantity"] == 0:
                sell_orders.pop(0)

        else:
            break