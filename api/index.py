from flask import Flask, render_template, request, jsonify
from datetime import datetime
import os
import json
import sys

# make parent directory visible so "games" package can be imported
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from games.rps import RockPaperScissors
from games.coin import CoinFlip
from games.dice import DiceEvenOdd



app = Flask(__name__, static_folder="../static", template_folder="../templates")


LOG_DIR = os.path.join(os.path.dirname(__file__), "..", "logs")
LOG_FILE = os.path.join(LOG_DIR, "game_history.json")


def current_time_str():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
@app.route("/")
def home():
    return render_template("home.html")

@app.route("/game/<game_name>")
def game_page(game_name):
    if game_name == "rps":
        return render_template("rps.html")
    if game_name == "coin":
        return render_template("coin.html")
    if game_name == "dice":
        return render_template("dice.html")
    return "Unknown game", 404


def ensure_log_file():
    os.makedirs(LOG_DIR, exist_ok=True)
    if not os.path.exists(LOG_FILE):
        with open(LOG_FILE, "w", encoding="utf-8") as f:
            json.dump([], f)


def append_log(entry: dict):
    ensure_log_file()
    with open(LOG_FILE, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            data = []
    data.append(entry)
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def calculate_winrate(wins, losses, ties):
    total = wins + losses + ties
    if total == 0:
        return 0.0
    return round((wins / total) * 100, 1)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/play", methods=["POST"])
def play():
    data = request.get_json() or {}
    game_name = data.get("game")

    choice = data.get("choice")
    bet = int(data.get("bet") or 0)
    balance = int(data.get("balance") or 0)
    wins = int(data.get("wins") or 0)
    losses = int(data.get("losses") or 0)
    ties = int(data.get("ties") or 0)

    if bet <= 0 or balance < 0:
        return jsonify({"error": "Invalid bet or balance"}), 400

    if game_name == "rps":
        game = RockPaperScissors()
    elif game_name == "coin":
        game = CoinFlip()
    elif game_name == "dice":
        game = DiceEvenOdd()
    else:
        return jsonify({"error": "Unknown game"}), 400

    result_data = game.play_round(choice, bet, balance)
    balance = result_data["balance"]
    result = result_data["result"]

    if result == "win":
        wins += 1
    elif result == "loss":
        losses += 1
    else:
        ties += 1

    log_entry = {
        "time": current_time_str(),
        "game": result_data["game"],
        "choice": result_data.get("player_choice"),
        "computer": result_data.get("computer_choice"),
        "result": result,
        "balance_after": balance,
        "message": result_data["message"]
    }
    append_log(log_entry)

    winrate = calculate_winrate(wins, losses, ties)

    response = {
        "result": result,
        "game": result_data["game"],
        "computer_choice": result_data.get("computer_choice"),
        "extra": result_data.get("extra"),
        "balance": balance,
        "wins": wins,
        "losses": losses,
        "ties": ties,
        "winrate": winrate,
        "message": result_data["message"],
        "time": current_time_str()
    }
    return jsonify(response)
if __name__ == "__main__":
    app.run(debug=True)
