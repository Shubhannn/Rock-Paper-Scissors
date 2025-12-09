// Example fragment
const gameSelect = document.getElementById("gameSelect"); // <select> with rps/coin/dice

// when playing:
const game = gameSelect.value; // "rps" | "coin" | "dice"

fetch("/play", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    game: game,
    choice: choice,
    bet: betVal,
    balance: balance,
    wins: wins,
    losses: losses,
    ties: ties
  })
})
// ... update UI based on data.game, data.computer_choice, data.extra, etc.
