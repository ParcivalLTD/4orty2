let gameContent = document.querySelector('.game').innerHTML;
let menuContent = document.querySelector('.menu').innerHTML;

document.querySelector('.main').innerHTML = menuContent;


function play() {
    document.querySelector('.main').innerHTML = gameContent;
    initializeGame();
}

function back() {
    document.querySelector('.main').innerHTML = menuContent;
}

