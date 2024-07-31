let backendUrl = "https://fourorty2.onrender.com";

function play() {
  window.location.href = "assets/game.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  const usernameModal = document.getElementById("usernameModal");
  if (!username) {
    usernameModal.showModal();
  } else {
    setUsername();
  }
  const highscoreSpan = document.querySelector(".highscore");
  const highscore = localStorage.getItem("highscore") || 0;
  highscoreSpan.textContent = highscore;

  const isDarkMode = localStorage.getItem("darkMode") === "true";
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    document.getElementById("darkModeToggle").checked = true;
  }
});

function setUsername() {
  const username = localStorage.getItem("username");
  document.querySelector(".username").textContent = username;
}

function saveUsername() {
  const username = document.getElementById("username-input").value;
  const errorElement = document.getElementById("username-error");
  if (username && username.length <= 10) {
    document.getElementById("usernameModal").close();
    localStorage.setItem("username", username);
    setUsername();
    errorElement.textContent = "";
  } else {
    errorElement.textContent = "Username must be 10 characters or less.";
  }
}

function closeSettingsDialog() {
  const newUsername = document.getElementById("usernameInput").value;
  const errorElement = document.getElementById("settings-error");
  if (newUsername && newUsername.length <= 10) {
    localStorage.setItem("username", newUsername);
    setUsername();
    errorElement.textContent = "";
    const dialog = document.getElementById("settingsDialog");
    dialog.close();
  } else {
    errorElement.textContent = "Username must be 10 characters or less.";
  }
}

async function fetchTopUsers() {
  const url = "https://fourorty2.onrender.com/topusers";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching top users:", error);
    throw error;
  }
}

function showScoreBoard() {
  const dialog = document.getElementById("topUsersDialog");
  displayTopUsersInModal();
  dialog.showModal();
}

function exitGame() {
  if (confirm("Are you sure you want to exit the game?")) {
    window.close();
  }
}

function displayTopUsersInModal() {
  const topUsersContainer = document.querySelector("#top-users-modal-body");
  topUsersContainer.innerHTML = "";

  fetchTopUsers()
    .then((users) => {
      const topThreeUsers = users.slice(0, 3);
      topThreeUsers.forEach((user, index) => {
        const userElement = document.createElement("div");
        userElement.classList.add("user");
        userElement.innerHTML = `<strong>${index + 1}. ${user.username}</strong>: ${user.highscore}`;
        topUsersContainer.appendChild(userElement);
      });
    })
    .catch((error) => {
      console.error("Error fetching top users:", error);
    });
}

function openSettingsDialog() {
  const dialog = document.getElementById("settingsDialog");
  dialog.showModal();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDarkMode);
}
