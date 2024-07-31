document.addEventListener("DOMContentLoaded", function () {
  const statusDot = document.querySelector(".status-dot");

  function updateStatusDot() {
    if (navigator.onLine) {
      statusDot.classList.remove("offline");
      statusDot.classList.add("online");
    } else {
      statusDot.classList.remove("online");
      statusDot.classList.add("offline");
    }
  }

  window.addEventListener("online", updateStatusDot);
  window.addEventListener("offline", updateStatusDot);

  updateStatusDot();
});

window.addEventListener("online", async function () {
  const pendingHighscore = localStorage.getItem("pendingHighscore");
  if (pendingHighscore) {
    const data = JSON.parse(pendingHighscore);
    try {
      const response = await fetch(backendUrl + "/savehighscores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resultText = await response.text();
      console.log("Server response:", resultText);

      const result = JSON.parse(resultText);
      console.log("Highscore saved:", result);

      localStorage.removeItem("pendingHighscore");
    } catch (error) {
      console.error("Error saving pending highscore:", error);
    }
  }
});
