let backendUrl = "https://fourorty2.onrender.com";

function play() {
  document.body.classList.add("slide-out");
  setTimeout(() => {
    window.location.href = "assets/game.html";
  }, 200);
}

document.addEventListener("DOMContentLoaded", () => {
  showLoginForm();

  const username = localStorage.getItem("username");
  const authModal = document.getElementById("authDialog");
  if (!username) {
    authModal.showModal();
  } else {
    setUsername(username);
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
  const oldUsername = localStorage.getItem("username");

  if (newUsername === oldUsername) {
    dialog.close();
    return;
  }

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
          const updateResponse = await fetch(`${backendUrl}/update-username`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ oldUsername, newUsername }),
          });

          if (updateResponse.ok) {
            localStorage.setItem("username", newUsername);
            setUsername(newUsername);
            errorElement.textContent = "";
            dialog.close();
          } else {
            const updateError = await updateResponse.json();
            errorElement.textContent = updateError.error;
          }
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

async function saveHighscore(username, highscore) {
  if (!username || highscore === undefined || highscore === null) {
    console.error("Username and highscore are required");
    return;
  }

  const data = { username, highscore };

  try {
    const response = await fetch(backendUrl + "/savehighscores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      document.getElementById("auth-error").textContent = response.statusText;
    }

    const resultText = await response.text();

    const result = JSON.parse(resultText);
  } catch (error) {
    console.error("Error saving highscore:", error);
    localStorage.setItem("pendingHighscore", JSON.stringify(data));
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

function displayTopUsersInModal() {
  const topUsersContainer = document.querySelector("#top-users-modal-body");

  const spinner = document.createElement("div");
  spinner.classList.add("spinner");
  spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  topUsersContainer.innerHTML = spinner.outerHTML;

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
    .then(() => {
      document.querySelector(".spinner").remove();
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
  const registerButton = document.querySelector("#registerForm button[type='submit']");
  const spinner = document.createElement("i");
  spinner.className = "fas fa-spinner fa-spin";
  registerButton.innerHTML = spinner.outerHTML;

  if (username.length > 10) {
    errorElement.textContent = "Username must be at most 10 characters long";
    registerButton.innerHTML = "Register";
    return;
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    errorElement.textContent = "Password must contain at least 8 characters, one letter, and one number";
    registerButton.innerHTML = "Register";
    return;
  }

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
      errorElement.textContent = "";
      saveHighscore(username, 0);
      showLoginForm();
      document.getElementById("loginUsername").value = username;
    } else {
      const error = await response.json();
      errorElement.textContent = error.error;
    }
  } catch (error) {
    errorElement.textContent = error.message;
  } finally {
    registerButton.innerHTML = "Register";
  }
}
async function loginUser() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const errorElement = document.getElementById("auth-error");
  const loginButton = document.querySelector("#loginForm button[type='submit']");
  const spinner = document.createElement("i");
  spinner.className = "fas fa-spinner fa-spin";
  loginButton.innerHTML = spinner.outerHTML;

  let highscore = (await getHighscore(username)) || 0;

  fetch(backendUrl + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json().then((data) => ({ status: response.status, data })))
    .then(({ status, data }) => {
      if (status !== 200) {
        errorElement.textContent = data.error;
      } else {
        errorElement.textContent = "";
        if (data.message == "Login successful") {
          errorElement.style.color = "green";
          errorElement.textContent = data.message;
          localStorage.setItem("username", username);
          localStorage.setItem("isLoggedIn", true);

          localStorage.setItem("highscore", highscore);
          const highscoreSpan = document.querySelector(".highscore");
          highscoreSpan.textContent = highscore;

          setUsername(username);
          document.getElementById("authDialog").close();
        }
      }
    })
    .catch((error) => {
      errorElement.textContent = error.message;
    })
    .finally(() => {
      loginButton.innerHTML = "Login";
    });
}

async function getHighscore(username) {
  if (!username) {
    console.error("Username is required");
    return null;
  }

  try {
    const response = await fetch(`${backendUrl}/gethighscore`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (response.ok) {
      const result = await response.json();
      return result.highscore;
    } else {
      const error = await response.json();
      console.error("Error fetching highscore:", error.error);
      return null;
    }
  } catch (error) {
    console.error("Error fetching highscore:", error);
    return null;
  }
}

function logoutUser() {
  localStorage.removeItem("username");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("highscore");
  localStorage.removeItem("gameState");

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

function openContactDialog() {
  document.getElementById("contactDialog").showModal();
}

function openImpressumDialog() {
  document.getElementById("impressumDialog").showModal();
}
