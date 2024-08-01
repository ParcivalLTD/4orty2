let backendUrl = "https://fourorty2.onrender.com";

function play() {
  window.location.href = "assets/game.html";
}

document.addEventListener("DOMContentLoaded", () => {
  showLoginForm();

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

async function closeSettingsDialog() {
  const newUsername = document.getElementById("usernameInput").value;
  const errorElement = document.getElementById("settings-error");
  const dialog = document.getElementById("settingsDialog");

  if (newUsername && newUsername.length <= 10) {
    try {
      const response = await fetch(`${backendUrl}/check-username`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: newUsername }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.exists) {
          errorElement.textContent = "Username already exists.";
        } else {
          localStorage.setItem("username", newUsername);
          setUsername(newUsername);
          errorElement.textContent = "";
          dialog.close();
        }
      } else {
        const error = await response.json();
        errorElement.textContent = error.error;
      }
    } catch (error) {
      errorElement.textContent = error.message;
    }
  } else if (newUsername && newUsername.length > 10) {
    errorElement.textContent = "Username must be 10 characters or less.";
  } else {
    dialog.close();
  }
}

async function fetchTopUsers() {
  const url = backendUrl + "/topusers";

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
  const currentUsername = localStorage.getItem("username");
  document.getElementById("usernameInput").value = currentUsername;
  document.getElementById("settingsDialog").showModal();
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
  const errorElement = document.getElementById("auth-error");

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
      document.getElementById("authDialog").close();
      setUsername(result.username);
      errorElement.textContent = "";
    } else {
      const error = await response.json();
      errorElement.textContent = error.error;
    }
  } catch (error) {
    errorElement.textContent = error.message;
  }
}

function loginUser() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const errorElement = document.getElementById("auth-error");

  fetch(backendUrl + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          errorElement.textContent = data.error;
        });
      }
      return response.json();
    })
    .then((data) => {
      errorElement.textContent = data;
      /* document.getElementById("auth-error").textContent = "";

      localStorage.setItem("username", username);
      localStorage.setItem("isLoggedIn", true);

      setUsername(username);
      document.getElementById("authDialog").close(); */
    })
    .catch((error) => {
      document.getElementById("auth-error").textContent = error.message;
    });
}

function logoutUser() {
  // Clear user data from localStorage
  localStorage.removeItem("username");
  localStorage.removeItem("isLoggedIn");

  // Optionally, redirect to the login page or refresh the current page
  window.location.reload();
}

function setUsername(username) {
  document.querySelector(".username").textContent = username;
}

function showLoginForm() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";

  document.querySelector("button[onclick='showLoginForm()']").classList.add("active-button");
  document.querySelector("button[onclick='showRegisterForm()']").classList.remove("active-button");
}

function showRegisterForm() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";

  document.querySelector("button[onclick='showRegisterForm()']").classList.add("active-button");
  document.querySelector("button[onclick='showLoginForm()']").classList.remove("active-button");
}
