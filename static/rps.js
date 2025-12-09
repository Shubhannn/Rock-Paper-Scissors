let rpsBalance = 100, rpsWins = 0, rpsLosses = 0, rpsTies = 0;
let rpsActive = true;

document.addEventListener("DOMContentLoaded", () => {
  const balanceSpan = document.getElementById("rpsBalance");
  const betInput = document.getElementById("rpsBet");
  const statusP = document.getElementById("rpsStatus");
  const winsSpan = document.getElementById("rpsWins");
  const lossesSpan = document.getElementById("rpsLosses");
  const tiesSpan = document.getElementById("rpsTies");
  const winrateSpan = document.getElementById("rpsWinrate");
  const timeSpan = document.getElementById("rpsTime");
  const userImg = document.getElementById("rpsUserImage");
  const botImg = document.getElementById("rpsBotImage");
  const exitBtn = document.getElementById("rpsExit");
  const optionCards = document.querySelectorAll(".option-card");
  const userHand = document.querySelector(".user-hand");
  const botHand = document.querySelector(".bot-hand");

  const imgMap = {
    rock: "/static/images/rock.png",
    paper: "/static/images/paper.png",
    scissors: "/static/images/scissors.png"
  };

  balanceSpan.textContent = rpsBalance;

  exitBtn.addEventListener("click", () => {
    alert(`You exited with ${rpsBalance} chips from RPS!`);
    rpsActive = false;
  });

  optionCards.forEach(card => {
    card.addEventListener("click", () => {
      if (!rpsActive) {
        alert("Start a new session (refresh) to play again.");
        return;
      }
      if (rpsBalance <= 0) {
        alert("No balance left. Refresh to restart.");
        rpsActive = false;
        return;
      }

      const choice = card.getAttribute("data-choice");
      const bet = parseInt(betInput.value, 10) || 0;
      if (bet <= 0 || bet > rpsBalance) {
        alert("Enter a valid bet (<= balance).");
        return;
      }

      optionCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      userImg.src = imgMap[choice];
      userHand.classList.remove("shake");
      botHand.classList.remove("shake");
      void userHand.offsetWidth; void botHand.offsetWidth;
      userHand.classList.add("shake");
      botHand.classList.add("shake");

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
      .then(res => res.json())
      .then(data => {
        rpsBalance = data.balance;
        rpsWins = data.wins;
        rpsLosses = data.losses;
        rpsTies = data.ties;

        balanceSpan.textContent = rpsBalance;
        botImg.src = imgMap[data.computer_choice];
        winsSpan.textContent = rpsWins;
        lossesSpan.textContent = rpsLosses;
        tiesSpan.textContent = rpsTies;
        winrateSpan.textContent = data.winrate;
        statusP.textContent = data.message;
        timeSpan.textContent = data.time;

        if (rpsBalance <= 0) {
          alert("You are out of chips in RPS!");
          rpsActive = false;
        }
      });
    });
  });
});
