# games/dice.py
import random

class DiceEvenOdd:
    def roll_dice(self):
        return random.randint(1, 6), random.randint(1, 6)

    def play_round(self, player_choice, bet, balance):
        d1, d2 = self.roll_dice()
        total = d1 + d2
        parity = "even" if total % 2 == 0 else "odd"

        if player_choice == parity:
            balance += bet
            result = "win"
            message = f"Dice: {d1} + {d2} = {total} ({parity}). You win {bet}!"
        else:
            balance -= bet
            result = "loss"
            message = f"Dice: {d1} + {d2} = {total} ({parity}). You lose {bet}."

        return {
            "game": "dice",
            "player_choice": player_choice,
            "computer_choice": parity,
            "extra": {"d1": d1, "d2": d2, "total": total},
            "result": result,
            "balance": balance,
            "message": message
        }
