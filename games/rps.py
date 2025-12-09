# games/rps.py
import random

class RockPaperScissors:
    CHOICES = ["rock", "paper", "scissors"]

    def __init__(self):
        pass

    def get_computer_choice(self):
        return random.choice(self.CHOICES)

    def get_result(self, player, computer):
        if player == computer:
            return "tie"
        wins = (
            (player == "rock" and computer == "scissors") or
            (player == "paper" and computer == "rock") or
            (player == "scissors" and computer == "paper")
        )
        return "win" if wins else "loss"

    def play_round(self, player_choice, bet, balance):
        computer = self.get_computer_choice()
        result = self.get_result(player_choice, computer)

        if result == "tie":
            message = "It's a tie! Your bet is returned."
        elif result == "win":
            balance += bet
            message = f"You win! You gain {bet}."
        else:
            balance -= bet
            message = f"You lose! You lose {bet}."

        return {
            "game": "rps",
            "player_choice": player_choice,
            "computer_choice": computer,
            "result": result,
            "balance": balance,
            "message": message
        }
