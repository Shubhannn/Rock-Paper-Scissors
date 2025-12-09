let rpsBalance = 100,
  rpsWins = 0,
  rpsLosses = 0,
  rpsTies = 0;
let rpsActive = true;

document.addEventListener("DOMContentLoaded", () => {
  const balanceSpan = document.getElementById("rpsBalance");
  const betInput = document.getElementById("rpsBet");
  const statusP = document.getElementById("rpsStatus");
  const winsSpan = document.getElementById("rpsWins");
  const lossesSpan = document.getElementById("rpsLosses");
  const tiesSpan = document.getElementById("rpsTies");
  const winrateSpan = document.getElementById("rpsWinrate");
  const exitBtn = document.getElementById("rpsExit");

  const userDisplay = document.getElementById("rpsUserDisplay");
  const botDisplay = document.getElementById("rpsBotDisplay");
  const optionButtons = document.querySelectorAll(".option-btn");

  const emojiMap = {
    rock: "✊",
    paper: "✋",
    scissors: "✌️"
  };

  balanceSpan.textContent = rpsBalance;

  exitBtn.addEventListener("click", () => {
    alert(`You exited with ${rpsBalance} chips from RPS!`);
    window.location.href = "/";
  });

  optionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!rpsActive) return;

      if (rpsBalance <= 0) {
        alert("No balance left.");
        rpsActive = false;
        return;
      }

      const choice = btn.dataset.choice;
      const bet = parseInt(betInput.value, 10) || 0;

      if (bet <= 0 || bet > rpsBalance) {
        alert("Enter a valid bet.");
        return;
      }

      userDisplay.textContent = emojiMap[choice];
      botDisplay.textContent = "…";

      fetch("/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game: "rps",
          choice: choice,
          bet: bet,
          balance: rpsBalance,
          wins: rpsWins,
          losses: rpsLosses,
          ties: rpsTies
        })
      })
        .then((res) => res.json())
        .then((data) => {
          rpsBalance = data.balance;
          rpsWins = data.wins;
          rpsLosses = data.losses;
          rpsTies = data.ties;

          balanceSpan.textContent = rpsBalance;
          userDisplay.textContent = emojiMap[choice];
          botDisplay.textContent = emojiMap[data.computer_choice];

          winsSpan.textContent = rpsWins;
          lossesSpan.textContent = rpsLosses;
          tiesSpan.textContent = rpsTies;
          winrateSpan.textContent = data.winrate;
          statusP.textContent = data.message;

          if (rpsBalance <= 0) {
            alert("You are out of chips in RPS!");
            rpsActive = false;
          }
        })
        .catch((err) => {
          console.error("RPS Error:", err);
          statusP.textContent = "Server error.";
        });
    });
  });
});
