let diceBalance = 100, diceWins = 0, diceLosses = 0;
let diceActive = true;

document.addEventListener("DOMContentLoaded", () => {
  const balanceSpan = document.getElementById("diceBalance");
  const betInput = document.getElementById("diceBet");
  const statusP = document.getElementById("diceStatus");
  const winsSpan = document.getElementById("diceWins");
  const lossesSpan = document.getElementById("diceLosses");
  const timeSpan = document.getElementById("diceTime");
  const display = document.getElementById("diceDisplay");
  const exitBtn = document.getElementById("diceExit");
  const optionButtons = document.querySelectorAll(".option-btn");

  balanceSpan.textContent = diceBalance;

  exitBtn.addEventListener("click", () => {
    alert(`You exited Dice with ${diceBalance} chips.`);
    window.location.href = "/";
  });

  optionButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (!diceActive) {
        alert("Session ended. Refresh to play again.");
        return;
      }
      if (diceBalance <= 0) {
        alert("No balance left.");
        diceActive = false;
        return;
      }

      const choice = btn.getAttribute("data-choice");  // "even" or "odd"
      const bet = parseInt(betInput.value, 10) || 0;
      if (bet <= 0 || bet > diceBalance) {
        alert("Enter valid bet ≤ balance.");
        return;
      }

      fetch("/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game: "dice",
          choice: choice,
          bet: bet,
          balance: diceBalance,
          wins: diceWins,
          losses: diceLosses,
          ties: 0
        })
      })
      .then(res => res.json())
      .then(data => {
        diceBalance = data.balance;
        if (data.result === "win") diceWins++; else diceLosses++;

        balanceSpan.textContent = diceBalance;

        const extra = data.extra || {};
        const d1 = extra.d1 ?? "–";
        const d2 = extra.d2 ?? "–";
        const total = extra.total ?? "–";
        const parity = data.computer_choice ? data.computer_choice.toUpperCase() : "";
        display.textContent = `${d1} + ${d2} = ${total} (${parity})`;

        winsSpan.textContent = diceWins;
        lossesSpan.textContent = diceLosses;
        statusP.textContent = data.message;
        timeSpan.textContent = data.time;

        if (diceBalance <= 0) {
          alert("You are out of chips in Dice.");
          diceActive = false;
        }
      });
    });
  });
});
