let menuContent = document.querySelector(".menu").innerHTML;

document.querySelector(".main").innerHTML = menuContent;

function play() {
  window.location.href = "assets/game.html";
}

function back() {
  document.querySelector(".main").innerHTML = menuContent;
}

document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  if (!username) {
    document.getElementById("username-modal").style.display = "block";
  } else {
    document.querySelector(".username").textContent = username;
  }
});

function saveUsername() {
  const usernameInput = document.getElementById("username-input").value;
  if (usernameInput) {
    localStorage.setItem("username", usernameInput);
    document.querySelector(".username").textContent = usernameInput;
    document.getElementById("username-modal").style.display = "none";
  }
}
