let coinBalance = 100, coinWins = 0, coinLosses = 0;
let coinActive = true;

document.addEventListener("DOMContentLoaded", () => {
  const balanceSpan = document.getElementById("coinBalance");
  const betInput = document.getElementById("coinBet");
  const statusP = document.getElementById("coinStatus");
  const winsSpan = document.getElementById("coinWins");
  const lossesSpan = document.getElementById("coinLosses");
  const timeSpan = document.getElementById("coinTime");
  const display = document.getElementById("coinDisplay");
  const exitBtn = document.getElementById("coinExit");
  const optionButtons = document.querySelectorAll(".option-btn");

  balanceSpan.textContent = coinBalance;

  exitBtn.addEventListener("click", () => {
    alert(`You exited Coin Flip with ${coinBalance} chips.`);
    window.location.href = "/";
  });

  optionButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (!coinActive) {
        alert("Session ended. Refresh to play again.");
        return;
      }
      if (coinBalance <= 0) {
        alert("No balance left.");
        coinActive = false;
        return;
      }

      const choice = btn.getAttribute("data-choice");
      const bet = parseInt(betInput.value, 10) || 0;
      if (bet <= 0 || bet > coinBalance) {
        alert("Enter valid bet ≤ balance.");
        return;
      }

      fetch("/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game: "coin",
          choice: choice,
          bet: bet,
          balance: coinBalance,
          wins: coinWins,
          losses: coinLosses,
          ties: 0
        })
      })
      .then(res => res.json())
      .then(data => {
        coinBalance = data.balance;
        if (data.result === "win") coinWins++; else coinLosses++;

        balanceSpan.textContent = coinBalance;
        display.textContent = data.computer_choice.toUpperCase();
        winsSpan.textContent = coinWins;
        lossesSpan.textContent = coinLosses;
        statusP.textContent = data.message;
        timeSpan.textContent = data.time;

        if (coinBalance <= 0) {
          alert("You are out of chips in Coin Flip.");
          coinActive = false;
        }
      });
    });
  });
});
