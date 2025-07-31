document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    if (link.href === window.location.href) {
      link.classList.add("font-bold", "underline", "text-yellow-300");
    }
    link.addEventListener("click", () => {
      console.log(`Navigating to: ${link.textContent.trim()}`);
    });
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const overlay = document.querySelector(".overlay");
  if (overlay) {
    overlay.style.transition = "opacity 1s";
    overlay.style.opacity = 0.5;
    setTimeout(() => {
      overlay.style.opacity = 0;
    }, 1000);
  }
});
