 let board = [];
 const size = 6;
 let score = 0;

 function initializeBoard() {
     for (let i = 0; i < size; i++) {
         board[i] = [];
         for (let j = 0; j < size; j++) {
             board[i][j] = 0;
         }
     }
 }

 function addRandomTile() {
    const emptySpots = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === 0) {
                emptySpots.push({ x: i, y: j });
            }
        }
    }
    if (emptySpots.length > 0) {
        const spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
        board[spot.x][spot.y] = 1; // Always add a 1
    }
}

 function move(direction) {
     const copyBoard = JSON.parse(JSON.stringify(board));
     switch (direction) {
         case 'left':
             for (let i = 0; i < size; i++) {
                 let stack = [];
                 for (let j = 0; j < size; j++) {
                     if (board[i][j] !== 0) {
                         stack.push(board[i][j]);
                     }
                 }
                 stack = merge(stack);
                 for (let j = 0; j < size; j++) {
                     if (stack.length) {
                         board[i][j] = stack.shift();
                     } else {
                         board[i][j] = 0;
                     }
                 }
             }
             break;
         case 'right':
    for (let i = 0; i < size; i++) {
        let stack = [];
        for (let j = size - 1; j >= 0; j--) {
            if (board[i][j] !== 0) {
                stack.push(board[i][j]);
            }
        }
        stack = merge(stack);
        for (let j = size - 1; j >= 0; j--) {
            if (stack.length) {
                board[i][j] = stack.pop();
            } else {
                board[i][j] = 0;
            }
        }
    }
    break;
         case 'up':
             for (let j = 0; j < size; j++) {
                 let stack = [];
                 for (let i = 0; i < size; i++) {
                     if (board[i][j] !== 0) {
                         stack.push(board[i][j]);
                     }
                 }
                 stack = merge(stack);
                 for (let i = 0; i < size; i++) {
                     if (stack.length) {
                         board[i][j] = stack.shift();
                     } else {
                         board[i][j] = 0;
                     }
                 }
             }
             break;
         case 'down':
             for (let j = 0; j < size; j++) {
                 let stack = [];
                 for (let i = size - 1; i >= 0; i--) {
                     if (board[i][j] !== 0) {
                         stack.push(board[i][j]);
                     }
                 }
                 stack = merge(stack);
                 for (let i = size - 1; i >= 0; i--) {
                     if (stack.length) {
                         board[i][j] = stack.pop();
                     } else {
                         board[i][j] = 0;
                     }
                 }
             }
             break;
     }
     if (!arraysEqual(board, copyBoard)) {
         addRandomTile();
         updateBoard();
     }
 }

 function merge(stack) {
    for (let i = 0; i < stack.length - 1; i++) {
        if (stack[i] === stack[i + 1]) {
            stack[i] += 1; // Increase by 1 instead of adding
            score += stack[i];
            stack.splice(i + 1, 1);
        }
    }
    return stack;
}
function updateScoreDisplay() {
    let scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

 function arraysEqual(arr1, arr2) {
     return JSON.stringify(arr1) === JSON.stringify(arr2);
 }

 function updateBoard() {
    updateScoreDisplay();
     const boardContainer = document.getElementById('board');
     boardContainer.innerHTML = '';
     for (let i = 0; i < size; i++) {
         for (let j = 0; j < size; j++) {
             const tileValue = board[i][j];
             const tileDiv = document.createElement('div');
             updateTile(tileDiv, tileValue);

             tileDiv.className = 'tile';
             tileDiv.textContent = tileValue === 0 ? '' : tileValue;
             boardContainer.appendChild(tileDiv);
         }
         boardContainer.appendChild(document.createElement('br'));
     }
 }

 let xDown = null;
 let yDown = null;

 function handleTouchStart(evt) {
     xDown = evt.touches[0].clientX;
     yDown = evt.touches[0].clientY;
 };

 function handleTouchMove(evt) {
     if (!xDown || !yDown) {
         return;
     }

     let xUp = evt.touches[0].clientX;
     let yUp = evt.touches[0].clientY;

     let xDiff = xDown - xUp;
     let yDiff = yDown - yUp;

     if (Math.abs(xDiff) > Math.abs(yDiff)) {
         if (xDiff > 0) {
             move('left');
         } else {
             move('right');
         }
     } else {
         if (yDiff > 0) {
             move('up');
         } else {
             move('down');
         }
     }

     xDown = null;
     yDown = null;
 };

 document.addEventListener('touchstart', handleTouchStart, false);
 document.addEventListener('touchmove', handleTouchMove, false);

 function initializeGame() {
     initializeBoard();
     addRandomTile();
     addRandomTile();
     updateBoard();
 }

 function getTileColor(number) {
    switch (number) {
        case 1:
            return '#eee4da';
        case 2:
            return '#ede0c8';
        case 3:
            return '#f2b179';
        case 4:
            return '#f59563';
        case 5:
            return '#f67c5f';
        case 6:
            return '#f65e3b';
        case 7:
            return '#edcf72';
        case 8:
            return '#edcc61';
        case 9:
            return '#edc850';
        case 10:
            return '#edc53f';
        case 11:
            return '#edc22e';
        case 12:
            return '#3c3a32';
            
        default:
            return '';
    }
}

function updateTile(tileDiv, number) {
    tileDiv.textContent = number;
    tileDiv.style.backgroundColor = getTileColor(number);
}
