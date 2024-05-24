const cells = document.querySelectorAll(".cell");
const resetBtn = document.querySelector("#reSet");
const newGameBtns = document.querySelectorAll("#newGame");
const winnerContainer = document.querySelector("#winnerContainer");
const winnerAudio = document.querySelector("#winnerAudio");
const winnerX = document.querySelector("#X");
const winnerO = document.querySelector("#O");
const pop_1Audio = document.querySelector("#pop-1");
const pop_2Audio = document.querySelector("#pop-2");
const gameModeModal = document.querySelector("#game-mode-modal");
const modeButtons = document.querySelectorAll(".mode-btn");
const xScore = document.querySelector("#player-X");
const oScore = document.querySelector("#player-O");
const computerScore = document.querySelector("#computer");
const tieScore = document.querySelector("#tie");
const changeMode = document.querySelector("#change-mode");
const scoreContainer = document.querySelector(".score-container");
const playerModal = document.querySelector("#player-modal");
const playerButtons = document.querySelectorAll(".player-btn");

let playerX = true;
let winner = "tie";
let gameMode;

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

window.onload = () => {
  gameModeModal.style.display = "block";
  scoreContainer.style.display = "none";
};

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    scoreContainer.style.display = "flex";
    gameModeModal.style.display = "none";
    gameMode = button.innerHTML;
    resetGame();
    console.log(gameMode);
    if (gameMode === "Single") {
      oScore.style.display = "none";
      computerScore.style.display = "block";
    } else {
      oScore.style.display = "block";
      computerScore.style.display = "none";
      playerModal.style.display = "block";
    }
  });
});

playerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    playerModal.style.display = "none";
    playerX = button.innerHTML === "Player X" ? true : false;
    console.log(playerX);
  });
});

const evaluateBoard = () => {
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      cells[a].firstElementChild.name &&
      cells[a].firstElementChild.name === cells[b].firstElementChild.name &&
      cells[a].firstElementChild.name === cells[c].firstElementChild.name
    ) {
      if (cells[a].firstElementChild.name === "X") {
        return -10; // X is the player, so it's a negative score for the bot
      } else if (cells[a].firstElementChild.name === "O") {
        return 10; // O is the bot, so it's a positive score
      }
    }
  }

  // Check for tie
  let isTie = true;
  cells.forEach((cell) => {
    if (!cell.firstElementChild.name) {
      isTie = false;
    }
  });

  if (isTie) {
    return 0;
  }

  return null; // Game is still going on
};

// Minimax function to determine the best move for the bot
const minimax = (isMaximizing) => {
  const score = evaluateBoard();
  if (score !== null) {
    return score;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    cells.forEach((cell, index) => {
      if (!cell.firstElementChild.name) {
        cell.firstElementChild.name = "O";
        let currentScore = minimax(false);
        cell.firstElementChild.name = "";
        bestScore = Math.max(currentScore, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    cells.forEach((cell, index) => {
      if (!cell.firstElementChild.name) {
        cell.firstElementChild.name = "X";
        let currentScore = minimax(true);
        cell.firstElementChild.name = "";
        bestScore = Math.min(currentScore, bestScore);
      }
    });
    return bestScore;
  }
};

// Bot move function to determine and make the best move using the Minimax algorithm
const bot = () => {
  // Check if bot can win
  for (let i = 0; i < cells.length; i++) {
    if (!cells[i].firstElementChild.name) {
      cells[i].firstElementChild.name = "O";
      if (evaluateBoard() === 10) {
        cells[i].firstElementChild.src = "assets/zero.png";
        cells[i].firstElementChild.style.display = "block";
        pop_2Audio.play();
        playerX = !playerX;
        checkWinner();
        if (winner == "O") {
          computerScore.lastElementChild.innerHTML =
            parseInt(computerScore.lastElementChild.innerHTML) + 1;
        }
        return;
      }
      cells[i].firstElementChild.name = "";
    }
  }

  // Block opponent's win
  for (let i = 0; i < cells.length; i++) {
    if (!cells[i].firstElementChild.name) {
      cells[i].firstElementChild.name = "X";
      if (evaluateBoard() === -10) {
        cells[i].firstElementChild.name = "O";
        cells[i].firstElementChild.src = "assets/zero.png";
        cells[i].firstElementChild.style.display = "block";
        pop_2Audio.play();
        playerX = !playerX;
        checkWinner();
        return;
      }
      cells[i].firstElementChild.name = "";
    }
  }

  // Choose center if available
  // if (!cells[4].firstElementChild.name) {
  //   cells[4].firstElementChild.name = "O";
  //   cells[4].firstElementChild.src = "assets/zero.png";
  //   cells[4].firstElementChild.style.display = "block";
  //   pop_2Audio.play();
  //   playerX = !playerX;
  //   checkWinner();
  //   return;
  // }

  // Choose a corner if available
  // const corners = [0, 2, 6, 8];
  // for (let i of corners) {
  //   if (!cells[i].firstElementChild.name) {
  //     cells[i].firstElementChild.name = "O";
  //     cells[i].firstElementChild.src = "assets/zero.png";
  //     cells[i].firstElementChild.style.display = "block";
  //     pop_2Audio.play();
  //     playerX = !playerX;
  //     checkWinner();
  //     return;
  //   }
  // }

  // Choose a random move
  let availableCells = [];
  cells.forEach((cell, index) => {
    if (!cell.firstElementChild.name) {
      availableCells.push(index);
    }
  });
  if (availableCells.length > 0) {
    const rand = Math.floor(Math.random() * availableCells.length);
    const cell = cells[availableCells[rand]].firstElementChild;
    cell.name = "O";
    cell.src = "assets/zero.png";
    cell.style.display = "block";
    pop_2Audio.play();
    playerX = !playerX;
    checkWinner();
  }
};

const clickHandler = (e) => {
  if (playerX) {
    e.target.firstElementChild.src = "assets/cross.png";
    e.target.firstElementChild.name = "X";
    e.target.firstElementChild.style.display = "block";
    pop_1Audio.play();
  } else {
    e.target.firstElementChild.src = "assets/zero.png";
    e.target.firstElementChild.name = "O";
    e.target.firstElementChild.style.display = "block";
    pop_2Audio.play();
  }

  playerX = !playerX;

  if (gameMode == "Single") {
    setTimeout(() => {
      bot();
    }, 500);
    checkTie();
  } else {
    checkWinner();
    checkTie();
  }
};

cells.forEach((cell) => cell.addEventListener("click", clickHandler));

const resetGame = () => {
  cells.forEach((cell) => {
    cell.firstElementChild.src = "";
    cell.firstElementChild.name = "";
    cell.firstElementChild.style.display = "none";
    cell.firstElementChild.classList.remove("winnerImg");
  });
  playerX = true;
  winnerX.style.display = "none";
  winnerO.style.display = "none";
  cells.forEach((cell) => cell.addEventListener("click", clickHandler));
  winner = "tie";
  xScore.lastElementChild.innerHTML = "0";
  oScore.lastElementChild.innerHTML = "0";
  computerScore.lastElementChild.innerHTML = "0";
  tieScore.lastElementChild.innerHTML = "0";
};

resetBtn.addEventListener("click", resetGame);

changeMode.addEventListener("click", () => {
  gameModeModal.style.display = "block";
});

newGameBtns.forEach((newGame) => {
  newGame.addEventListener("click", () => {
    cells.forEach((cell) => {
      cell.firstElementChild.src = "";
      cell.firstElementChild.name = "";
      cell.firstElementChild.style.display = "none";
      cell.firstElementChild.classList.remove("winnerImg");
    });
    winnerContainer.style.display = "none";
    winnerX.style.display = "none";
    winnerO.style.display = "none";
    playerX = true;
    cells.forEach((cell) => cell.addEventListener("click", clickHandler));
    winner = "tie";
  });
});

winnerContainer.addEventListener("click", () => {
  winnerContainer.style.display = "none";
});

const disableCells = () => {
  cells.forEach((cell) => cell.removeEventListener("click", clickHandler));
};

const displayWinner = (winner) => {
  winnerContainer.style.display = "block";
  document.querySelector(".result").innerHTML = "Wins";
  if (winner == "X") {
    winnerX.src = "assets/cross.png";
    winnerX.style.display = "block";
  } else {
    winnerO.src = "assets/zero.png";
    winnerO.style.display = "block";
  }
};

const checkWinner = () => {
  winPatterns.map((winPattern) => {
    const position_1 = cells[winPattern[0]].firstElementChild.name;
    const position_2 = cells[winPattern[1]].firstElementChild.name;
    const position_3 = cells[winPattern[2]].firstElementChild.name;

    if (position_1 != "" && position_2 != "" && position_3 != "") {
      if (position_1 == position_2 && position_2 == position_3) {
        winPattern.map((winElement) => {
          cells[winElement].firstElementChild.classList.add("winnerImg");
        });
        disableCells();
        winner = position_1;
        winnerAudio.play();
        setTimeout(() => {
          displayWinner(winner);
        }, 1200);
        if (winner == "X") {
          xScore.lastElementChild.innerHTML =
            parseInt(xScore.lastElementChild.innerHTML) + 1;
          console.log(xScore.lastElementChild.innerHTML);
        } else if (winner == "O") {
          oScore.lastElementChild.innerHTML =
            parseInt(oScore.lastElementChild.innerHTML) + 1;
        }
      }
    }
  });
};

const displayTie = () => {
  winnerContainer.style.display = "block";
  winnerX.src = "assets/cross.png";
  winnerO.src = "assets/zero.png";
  winnerX.style.display = "block";
  winnerO.style.display = "block";
  document.querySelector(".result").innerHTML = "Game Tie";
};

const checkTie = () => {
  let count = 0;
  cells.forEach((cell) => {
    if (cell.firstElementChild.name) {
      count++;
    }
  });

  if (count == 9 && winner == "tie") {
    navigator.vibrate(200);
    setTimeout(() => {
      displayTie();
    }, 500);
    tieScore.lastElementChild.innerHTML =
      parseInt(tieScore.lastElementChild.innerHTML) + 1;
    return true;
  } else if (winner == "X" || winner == "O") {
    return true;
  } else {
    return false;
  }
};
