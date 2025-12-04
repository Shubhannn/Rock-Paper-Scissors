from flask import Flask, render_template, request, jsonify
import random
from datetime import datetime

app = Flask(__name__)


def current_time():
    now = datetime.now()
    return now.strftime("%Y-%m-%d %H:%M:%S")


def calculate_winrate(wins, losses, ties):
    total = wins + losses + ties
    if total == 0:
        return 0.0
    winrate = (wins / total) * 100
    return round(winrate, 1)


def get_result(choice, comp):
    if choice == comp:
        return "tie"
    if (
        (choice == "rock" and comp == "scissors") or
        (choice == "paper" and comp == "rock") or
        (choice == "scissors" and comp == "paper")
    ):
        return "win"
    return "loss"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/play", methods=["POST"])
def play():
    data = request.get_json()
    choice = data.get("choice")
    bet = int(data.get("bet", 0))
    balance = int(data.get("balance", 0))
    wins = int(data.get("wins", 0))
    losses = int(data.get("losses", 0))
    ties = int(data.get("ties", 0))

    choices = ["rock", "paper", "scissors"]
    comp = random.choice(choices)
    result = get_result(choice, comp)

    message = ""
    if result == "tie":
        ties += 1
        message = "It's a tie! Your bet is returned."
    elif result == "win":
        wins += 1
        balance += bet
        message = f"You win! You gain {bet}."
    else:
        losses += 1
        balance -= bet
        message = f"You lose! You lose {bet}."

    winrate = calculate_winrate(wins, losses, ties)

    return jsonify({
        "result": result,
        "computer_choice": comp,
        "balance": balance,
        "wins": wins,
        "losses": losses,
        "ties": ties,
        "winrate": winrate,
        "message": message,
        "time": current_time()
    })


if __name__ == "__main__":
    app.run(debug=True)
