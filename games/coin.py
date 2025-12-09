# games/coin.py
import random

class CoinFlip:
    SIDES = ["heads", "tails"]

    def play_round(self, player_choice, bet, balance):
        computer = random.choice(self.SIDES)
        if player_choice == computer:
            balance += bet
            result = "win"
            message = f"Coin: {computer}. You guessed right and win {bet}!"
        else:
            balance -= bet
            result = "loss"
            message = f"Coin: {computer}. Wrong guess, you lose {bet}."

        return {
            "game": "coin",
            "player_choice": player_choice,
            "computer_choice": computer,
            "result": result,
            "balance": balance,
            "message": message
        }
