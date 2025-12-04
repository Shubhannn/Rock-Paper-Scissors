let balance = 0;
let wins = 0;
let losses = 0;
let ties = 0;
let gameActive = false;

document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startGame");
    const startingBalanceInput = document.getElementById("startingBalance");
    const gameArea = document.getElementById("gameArea");
    const balanceSpan = document.getElementById("balance");
    const betInput = document.getElementById("bet");
    const statusP = document.getElementById("status");
    const winsSpan = document.getElementById("wins");
    const lossesSpan = document.getElementById("losses");
    const tiesSpan = document.getElementById("ties");
    const winrateSpan = document.getElementById("winrate");
    const timeP = document.getElementById("time");
    const userImage = document.getElementById("userImage");
    const botImage = document.getElementById("botImage");
    const optionCards = document.querySelectorAll(".option-card");
    const userHand = document.querySelector(".user-hand");
    const botHand = document.querySelector(".bot-hand");
    const exitBtn = document.getElementById("exitGame");

    const choiceToImage = {
        rock: "/static/images/rock.png",
        paper: "/static/images/paper.png",
        scissors: "/static/images/scissors.png"
    };

    function resetStats() {
        wins = 0;
        losses = 0;
        ties = 0;
        winsSpan.textContent = "0";
        lossesSpan.textContent = "0";
        tiesSpan.textContent = "0";
        winrateSpan.textContent = "0";
    }

    startBtn.addEventListener("click", () => {
        const startVal = parseInt(startingBalanceInput.value, 10);
        if (isNaN(startVal) || startVal <= 0) {
            alert("Enter a valid starting balance.");
            return;
        }
        balance = startVal;
        balanceSpan.textContent = balance;
        resetStats();
        statusP.textContent = "Game started! Choose Rock, Paper, or Scissors.";
        userImage.src = choiceToImage["rock"];
        botImage.src = choiceToImage["rock"];
        timeP.textContent = "";
        optionCards.forEach(card => card.classList.remove("active"));
        gameArea.classList.remove("hidden");
        gameActive = true;
    });

    exitBtn.addEventListener("click", () => {
        if (!gameActive) {
            alert("Game is not active. Start a new game first.");
            return;
        }
        alert(`You exited the game with ${balance} chips!`);
        statusP.textContent = `You cashed out with ${balance} chips. Start again if you want to play more.`;
        gameActive = false;
    });

    optionCards.forEach(card => {
        card.addEventListener("click", () => {
            if (!gameActive) {
                alert("Start the game first before playing.");
                return;
            }

            if (balance <= 0) {
                alert("You are out of money! Start a new game with more chips.");
                statusP.textContent = "Balance is zero. Start a new game.";
                gameActive = false;
                return;
            }

            const choice = card.getAttribute("data-choice");
            const betVal = parseInt(betInput.value, 10);
            if (isNaN(betVal) || betVal <= 0) {
                alert("Enter a valid bet.");
                return;
            }
            if (betVal > balance) {
                alert("Bet cannot be more than your balance.");
                return;
            }

            optionCards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");

            userImage.src = choiceToImage[choice];

            userHand.classList.remove("shake");
            botHand.classList.remove("shake");
            void userHand.offsetWidth;
            void botHand.offsetWidth;
            userHand.classList.add("shake");
            botHand.classList.add("shake");

            fetch("/play", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    choice: choice,
                    bet: betVal,
                    balance: balance,
                    wins: wins,
                    losses: losses,
                    ties: ties
                })
            })
            .then(res => res.json())
            .then(data => {
                balance = data.balance;
                wins = data.wins;
                losses = data.losses;
                ties = data.ties;

                balanceSpan.textContent = balance;
                botImage.src = choiceToImage[data.computer_choice];
                winsSpan.textContent = wins;
                lossesSpan.textContent = losses;
                tiesSpan.textContent = ties;
                winrateSpan.textContent = data.winrate;
                statusP.textContent = data.message;
                timeP.textContent = "Last play at: " + data.time;

                if (balance <= 0) {
                    alert("You are out of money! Start a new game to continue.");
                    gameActive = false;
                }
            })
            .catch(() => {
                statusP.textContent = "Error talking to server. Try again.";
            });
        });
    });
});
