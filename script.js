const cells = document.querySelectorAll(".cell");
const reset = document.getElementById("reSet");
const newGame = document.querySelector("#newGame");
const winnerContainer = document.querySelector("#winnerContainer");
const winnerAudio = document.querySelector("#winnerAudio");
const winnerX = document.querySelector("#X");
const winnerO = document.querySelector("#O");

let playerX = true;

console.log(cells);

const bot = async () => {
  let rand = Math.floor(Math.random() * 9);
  const cell = cells[rand].firstElementChild;
  console.log(rand);
  console.log(cell);
  if (!cell.name) {
    cell.name = "O";
    cell.src = "assets/zero.png";
    cell.style.display = "block";
    playerX = !playerX;
    checkWinner();
  } else {
    (await !checkTie()) ? bot() : console.log("draw");
  }
};

const clickHandler = async (e) => {
  console.log(e.target.firstElementChild);
  if (playerX) {
    e.target.firstElementChild.src = "assets/cross.png";
    e.target.firstElementChild.name = "X";
    e.target.firstElementChild.style.display = "block";
  } else {
    e.target.firstElementChild.src = "assets/zero.png";
    e.target.firstElementChild.name = "O";
    e.target.firstElementChild.style.display = "block";
  }
  playerX = !playerX;
  await checkWinner();
  await checkTie();
  setTimeout(() => {
    bot();
  }, 500);
};

cells.forEach((cell) => cell.addEventListener("click", clickHandler));

reset.addEventListener("click", (e) => {
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
});

newGame.addEventListener("click", (e) => {
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
        console.log("winner ", winner);
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
  console.log(winner);
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

    return true;
  } else {
    return false;
  }
};
