const cells = document.querySelectorAll(".cell");
const reset = document.querySelector("#reSet");
const newGame = document.querySelector("#newGame");
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

let playerX = true;
let gameMode;

window.onload = () => {
  gameModeModal.style.display = "block";
  scoreContainer.style.display = "none";
};

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    scoreContainer.style.display = "flex";
    gameModeModal.style.display = "none";
    gameMode = button.innerHTML;
    console.log(gameMode);
    if (gameMode === "Single") {
      oScore.style.display = "none";
      computerScore.style.display = "block";
    } else {
      oScore.style.display = "block";
      computerScore.style.display = "none";
    }
  });
});

const bot = () => {
  let rand = Math.floor(Math.random() * 9);
  const cell = cells[rand].firstElementChild;
  if (!cell.name) {
    cell.name = "O";
    cell.src = "assets/zero.png";
    cell.style.display = "block";
    pop_2Audio.play();
    playerX = !playerX;
    checkWinner();
    if (winner == "O") {
      computerScore.lastElementChild.innerHTML =
        parseInt(computerScore.lastElementChild.innerHTML) + 1;
    }
  } else {
    if (!checkTie()) {
      bot();
    }
  }
};

const clickHandler = (e) => {
  if (playerX) {
    e.target.firstElementChild.src = "assets/cross.png";
    e.target.firstElementChild.name = "X";
    e.target.firstElementChild.style.display = "block";
  } else {
    e.target.firstElementChild.src = "assets/zero.png";
    e.target.firstElementChild.name = "O";
    e.target.firstElementChild.style.display = "block";
  }

  if (playerX) {
    pop_1Audio.play();
  } else {
    pop_2Audio.play();
  }

  playerX = !playerX;
  checkWinner();

  if (gameMode == "Single") {
    setTimeout(() => {
      bot();
    }, 500);
  } else {
    checkTie();
  }
};

cells.forEach((cell) => cell.addEventListener("click", clickHandler));

reset.addEventListener("click", () => {
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
});

changeMode.addEventListener("click", () => {
  gameModeModal.style.display = "block";
});

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

winnerContainer.addEventListener("click", () => {
  winnerContainer.style.display = "none";
});

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

let winner = "tie";

const checkWinner = () => {
  winPatterns.map((winPattern, i) => {
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
    }, 1200);
    tieScore.lastElementChild.innerHTML =
      parseInt(tieScore.lastElementChild.innerHTML) + 1;
    return true;
  } else if (winner == "X" || winner == "O") {
    return true;
  } else {
    return false;
  }
};
