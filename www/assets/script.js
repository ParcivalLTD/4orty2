let backendUrl = "https://fourorty2.onrender.com";

function play() {
  window.location.href = "assets/game.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  const authModal = document.getElementById("authDialog");
  if (!username) {
    authModal.showModal();
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

/* function saveUsername() {
  const username = document.getElementById("username-input").value;
  const errorElement = document.getElementById("username-error");
  if (username && username.length <= 10) {
    document.getElementById("usernameModal").close();
    localStorage.setItem("username", username);
    setUsername(newUsername);
    errorElement.textContent = "";
  } else {
    errorElement.textContent = "Username must be 10 characters or less.";
  }
} */

function closeSettingsDialog() {
  const newUsername = document.getElementById("usernameInput").value;
  const errorElement = document.getElementById("settings-error");
  const dialog = document.getElementById("settingsDialog");
  if (newUsername && newUsername.length <= 10) {
    localStorage.setItem("username", newUsername);
    setUsername(newUsername);
    errorElement.textContent = "";
    dialog.close();
  } else if (newUsername && newUsername.length >= 10) {
    errorElement.textContent = "Username must be 10 characters or less.";
  } else {
    dialog.close();
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

function closeAuthDialog() {
  document.getElementById("authDialog").close();
}

async function registerUser() {
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;
  const email = document.getElementById("registerEmail").value;
  const errorElement = document.getElementById("username-error");

  try {
    const response = await fetch(`${backendUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email }),
    });

    if (response.ok) {
      const result = await response.json();
      document.getElementById("usernameModal").close();
      setUsername(result.username);
      errorElement.textContent = "";
    } else {
      const error = await response.json();
      errorElement.textContent = error.message;
    }
  } catch (error) {
    errorElement.textContent = "Registration failed. Please try again.";
  }
}

async function loginUser() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const errorElement = document.getElementById("username-error");

  try {
    const response = await fetch(`${backendUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const result = await response.json();
      document.getElementById("usernameModal").close();
      setUsername(result.username);
      errorElement.textContent = "";
    } else {
      const error = await response.json();
      errorElement.textContent = error.message;
    }
  } catch (error) {
    errorElement.textContent = "Login failed. Please try again.";
  }
}

function setUsername(username) {
  document.querySelector(".username").textContent = username;
}
