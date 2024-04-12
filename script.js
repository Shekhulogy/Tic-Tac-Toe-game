const cells = document.querySelectorAll(".cell");
const reset = document.getElementById("reSet");
const newGame = document.querySelector("#newGame");
const winnerContainer = document.querySelector("#winnerContainer");
const winnerAudio = document.querySelector("#winnerAudio");
const winnerX = document.querySelector("#X");
const winnerO = document.querySelector("#O");

let playerX = true;

console.log(cells);

const bot = () => {
  const rand = 0;
  const cell = cells[rand].firstElementChild.src;
  for (rand; rand <= cells.length - 1; )
    if (cell == "") {
    } else {
      rand = Math.floor(Math.random() * 9);
    }
};

const clickHandler = (e) => {
  console.log(e.target.firstElementChild);
  if (playerX) {
    e.target.firstElementChild.src = "/assets/x.png";
    e.target.firstElementChild.name = "X";
    e.target.firstElementChild.style.display = "block";
  } else {
    e.target.firstElementChild.src = "/assets/o.png";
    e.target.firstElementChild.name = "O";
    e.target.firstElementChild.style.display = "block";
  }
  playerX = !playerX;
  checkWinner();
  bot();
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
    winnerX.src = "/assets/x.png";
    winnerX.style.display = "block";
  } else {
    winnerO.src = "/assets/o.png";
    winnerO.style.display = "block";
  }
};

const checkWinner = () => {
  let winner;
  winPatterns.map((winPattern, i) => {
    const position_1 = cells[winPattern[0]].firstElementChild.name;
    const position_2 = cells[winPattern[1]].firstElementChild.name;
    const position_3 = cells[winPattern[2]].firstElementChild.name;

    if (position_1 != "" && position_2 != "" && position_3 != "") {
      if (position_1 == position_2 && position_2 == position_3) {
        console.log("winner");
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
