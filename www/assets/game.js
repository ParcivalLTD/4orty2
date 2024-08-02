const gridDisplay = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");
const resultDisplay = document.querySelector("#result");
const width = 4;
let squares = [];
let score = 0;

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

let backendUrl = "https://fourorty2.onrender.com";

function saveGameState() {
  const gameState = {
    squares: squares.map((square) => square.innerHTML),
    score: score,
  };
  localStorage.setItem("gameState", JSON.stringify(gameState));
}

function loadGameState() {
  const gameState = JSON.parse(localStorage.getItem("gameState"));
  if (gameState) {
    squares.forEach((square, index) => {
      square.innerHTML = gameState.squares[index];
    });
    score = gameState.score;
  }

  scoreDisplay.innerHTML = score;
}

function resetGame() {
  for (let i = 0; i < squares.length; i++) {
    squares[i].innerHTML = 0;
  }

  score = 0;
  document.getElementById("score").innerHTML = score;

  generate();
  generate();
  document.addEventListener("keydown", control);
  localStorage.removeItem("gameState");
  window.location.reload();
}

window.addEventListener("beforeunload", saveGameState);

function handleGesture() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      keyRight();
    } else {
      keyLeft();
    }
  } else {
    if (deltaY > 0) {
      keyDown();
    } else {
      keyUp();
    }
  }
}

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener("touchmove", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
});

document.addEventListener("touchend", () => {
  handleGesture();
});

function createBoard() {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.innerHTML = 0;
    gridDisplay.appendChild(square);
    squares.push(square);
  }
  generate();
  generate();
}
createBoard();

function generate() {
  const emptySquares = squares.filter((square) => square.innerHTML == 0);
  if (emptySquares.length === 0) {
    checkForGameOver();
    return;
  }

  const probabilities = [
    { value: 2, probability: 0.66 },
    { value: 3, probability: 0.2 },
    { value: 4, probability: 0.1 },
    { value: 5, probability: 0.04 },
  ];

  let cumulativeProbability = 0;
  const cumulativeProbabilities = probabilities.map((item) => {
    cumulativeProbability += item.probability;
    return { value: item.value, cumulativeProbability };
  });

  const random = Math.random();

  const selectedValue = cumulativeProbabilities.find((item) => random <= item.cumulativeProbability).value;

  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  emptySquares[randomIndex].innerHTML = selectedValue;

  checkForGameOver();
}

function moveRight() {
  for (let i = 0; i < 16; i++) {
    if (i % 4 === 0) {
      let totalOne = squares[i].innerHTML;
      let totalTwo = squares[i + 1].innerHTML;
      let totalThree = squares[i + 2].innerHTML;
      let totalFour = squares[i + 3].innerHTML;
      let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

      let filteredRow = row.filter((num) => num);
      let missing = 4 - filteredRow.length;
      let zeros = Array(missing).fill(0);
      let newRow = zeros.concat(filteredRow);

      squares[i].innerHTML = newRow[0];
      squares[i + 1].innerHTML = newRow[1];
      squares[i + 2].innerHTML = newRow[2];
      squares[i + 3].innerHTML = newRow[3];
    }
  }
}

function moveLeft() {
  for (let i = 0; i < 16; i++) {
    if (i % 4 === 0) {
      let totalOne = squares[i].innerHTML;
      let totalTwo = squares[i + 1].innerHTML;
      let totalThree = squares[i + 2].innerHTML;
      let totalFour = squares[i + 3].innerHTML;
      let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

      let filteredRow = row.filter((num) => num);
      let missing = 4 - filteredRow.length;
      let zeros = Array(missing).fill(0);
      let newRow = filteredRow.concat(zeros);

      squares[i].innerHTML = newRow[0];
      squares[i + 1].innerHTML = newRow[1];
      squares[i + 2].innerHTML = newRow[2];
      squares[i + 3].innerHTML = newRow[3];
    }
  }
}

function moveUp() {
  for (let i = 0; i < 4; i++) {
    let totalOne = squares[i].innerHTML;
    let totalTwo = squares[i + width].innerHTML;
    let totalThree = squares[i + width * 2].innerHTML;
    let totalFour = squares[i + width * 3].innerHTML;
    let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

    let filteredColumn = column.filter((num) => num);
    let missing = 4 - filteredColumn.length;
    let zeros = Array(missing).fill(0);
    let newColumn = filteredColumn.concat(zeros);

    squares[i].innerHTML = newColumn[0];
    squares[i + width].innerHTML = newColumn[1];
    squares[i + width * 2].innerHTML = newColumn[2];
    squares[i + width * 3].innerHTML = newColumn[3];
  }
}

function moveDown() {
  for (let i = 0; i < 4; i++) {
    let totalOne = squares[i].innerHTML;
    let totalTwo = squares[i + width].innerHTML;
    let totalThree = squares[i + width * 2].innerHTML;
    let totalFour = squares[i + width * 3].innerHTML;
    let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

    let filteredColumn = column.filter((num) => num);
    let missing = 4 - filteredColumn.length;
    let zeros = Array(missing).fill(0);
    let newColumn = zeros.concat(filteredColumn);

    squares[i].innerHTML = newColumn[0];
    squares[i + width].innerHTML = newColumn[1];
    squares[i + width * 2].innerHTML = newColumn[2];
    squares[i + width * 3].innerHTML = newColumn[3];
  }
}

function combineRow() {
  for (let i = 0; i < 15; i++) {
    if (squares[i].innerHTML === squares[i + 1].innerHTML && squares[i].innerHTML != 0) {
      let combinedTotal = parseInt(squares[i].innerHTML) + 1;
      squares[i].innerHTML = combinedTotal;
      squares[i + 1].innerHTML = 0;
      score += combinedTotal;
      scoreDisplay.innerHTML = score;
    }
  }
}

function combineColumn() {
  for (let i = 0; i < 12; i++) {
    if (squares[i].innerHTML === squares[i + width].innerHTML && squares[i].innerHTML != 0) {
      let combinedTotal = parseInt(squares[i].innerHTML) + 1;
      squares[i].innerHTML = combinedTotal;
      squares[i + width].innerHTML = 0;
      score += combinedTotal;
      scoreDisplay.innerHTML = score;
    }
  }
}

function control(e) {
  if (e.key === "ArrowLeft") {
    keyLeft();
  } else if (e.key === "ArrowRight") {
    keyRight();
  } else if (e.key === "ArrowUp") {
    keyUp();
  } else if (e.key === "ArrowDown") {
    keyDown();
  }
}
document.addEventListener("keydown", control);

function keyLeft() {
  moveLeft();
  combineRow();
  moveLeft();
  generate();
}

function keyRight() {
  moveRight();
  combineRow();
  moveRight();
  generate();
}

function keyUp() {
  moveUp();
  combineColumn();
  moveUp();
  generate();
}

function keyDown() {
  moveDown();
  combineColumn();
  moveDown();
  generate();
}

function checkForGameOver() {
  let zeros = 0;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i].innerHTML == 0) {
      zeros++;
    }
  }

  let noValidMoves = true;
  for (let i = 0; i < 16; i++) {
    if (i % 4 < 3 && squares[i].innerHTML == squares[i + 1].innerHTML) {
      noValidMoves = false;
      break;
    }
    if (i < 12 && squares[i].innerHTML == squares[i + 4].innerHTML) {
      noValidMoves = false;
      break;
    }
  }

  if (zeros === 0 && noValidMoves) {
    resultDisplay.innerHTML = "<t id='gameOver'> Game Over! </t>  <i class='fas fa-star'></i> <t id='score'>" + score + "</t>";
    document.removeEventListener("keydown", control);
    setTimeout(resetGame, 5000);

    window.addEventListener("beforeunload", (event) => {
      resetGame();
    });

    let username = localStorage.getItem("username");
    saveHighscore(username, score);
    if (score > localStorage.getItem("highscore")) {
      document.querySelector(".highscore").textContent = score;
    }
  }
}

function back() {
  window.location.href = "../index.html";
}

async function saveHighscore(username, highscore) {
  const url = backendUrl + "/savehighscores";
  const data = { username: username, highscore: highscore };

  const currentHighscore = localStorage.getItem("highscore");

  if (!currentHighscore || highscore > currentHighscore) {
    localStorage.setItem("highscore", highscore);

    if (navigator.onLine) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const resultText = await response.text();

        const result = JSON.parse(resultText);
      } catch (error) {
        console.error("Error saving highscore:", error);
      }
    } else {
      localStorage.setItem("pendingHighscore", JSON.stringify(data));
    }
  }
}

function clear() {
  clearInterval(myTimer);
}

function getColor(value) {
  if (value === 0) return "#add8e6";

  const hue = (Math.log2(value) * 30) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

function addColours() {
  for (let i = 0; i < squares.length; i++) {
    let value = parseInt(squares[i].innerHTML);
    squares[i].style.backgroundColor = getColor(value);

    if (value === 0) {
      squares[i].style.color = "#add8e6";
    } else {
      squares[i].style.color = "white";
    }
  }
}

addColours();

let myTimer = setInterval(addColours, 50);

document.addEventListener("DOMContentLoaded", () => {
  loadGameState();

  const username = localStorage.getItem("username");
  if (!username) {
    window.location.href = "../index.html";
  } else {
    setUsername();
  }
  const highscoreSpan = document.querySelector(".highscore");
  const highscore = localStorage.getItem("highscore") || 0;
  highscoreSpan.textContent = highscore;

  const isDarkMode = localStorage.getItem("darkMode") === "true";
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }
});

function setUsername() {
  const username = localStorage.getItem("username");
  document.querySelector(".username").textContent = username;
}
