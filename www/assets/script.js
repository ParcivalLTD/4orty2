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

    const users = await response.json();
    displayTopUsers(users);
  } catch (error) {
    console.error("Error fetching top users:", error);
  }
}

function displayTopUsers(users) {
  const topUsersContainer = document.querySelector("#top-users");
  topUsersContainer.innerHTML = ""; // Clear any existing content

  users.forEach((user, index) => {
    const userElement = document.createElement("div");
    userElement.classList.add("user");
    userElement.innerHTML = `<strong>${index + 1}. ${user.username}</strong>: ${user.highscore}`;
    topUsersContainer.appendChild(userElement);
  });
}

// Call the function to fetch and display top users
fetchTopUsers();
