
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      console.log(`Navigating to: ${link.textContent.trim()}`);
    });
  });
});