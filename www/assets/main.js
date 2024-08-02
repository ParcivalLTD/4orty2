document.addEventListener("deviceready", function () {
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
        const result = JSON.parse(resultText);

        localStorage.removeItem("pendingHighscore");
      } catch (error) {
        console.error("Error saving pending highscore:", error);
      }
    }
  });

  cordova.plugins.smoothScroll.enable();

  function animateButtonShrink(event) {
    const button = event.target;
    button.classList.add("shrink");
    setTimeout(() => {
      button.classList.remove("shrink");
    }, 100);
  }

  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", animateButtonShrink);
  });
});
