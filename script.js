document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const messageDisplay = document.getElementById("message-display");

  setTimeout(() => {
    showMessage("Welcome to University Portal", "info");
  }, 1000);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Simple validation
    if (username.trim() === "" || password.trim() === "") {
      showMessage("Please fill in all fields", "error");
      return;
    }

    // Simulate login process
    showMessage("Authenticating...", "info");

    setTimeout(() => {
      if (username === "admin" && password === "admin") {
        showMessage("Login successful! Redirecting...", "success");

        // Simulate redirect
        setTimeout(() => {
          form.reset();
          window.location.href = "./component/home/home.html";

          showMessage("Redirected to dashboard", "success");
        }, 1500);
      } else {
        showMessage("Invalid username or password", "error");
      }
    }, 1500);
  });

  function showMessage(message, type) {
    messageDisplay.textContent = message;
    messageDisplay.className = "show";
    messageDisplay.classList.add(type);

    // Auto-hide messages after 3 seconds
    setTimeout(() => {
      messageDisplay.className = "";
      messageDisplay.classList.remove(type);
    }, 3000);
  }
});
