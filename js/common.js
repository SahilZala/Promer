// ---------- Mobile menu (shared across all pages) ----------
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const closeBtn = document.getElementById('close-btn');
  const overlay = document.getElementById('overlay');

  if (!hamburger || !navLinks || !closeBtn || !overlay) return;

  function toggleMenu(show) {
    navLinks.classList.toggle('active', show);
    overlay.classList.toggle('active', show);
  }

  hamburger.addEventListener('click', () => toggleMenu(true));
  closeBtn.addEventListener('click', () => toggleMenu(false));
  overlay.addEventListener('click', () => toggleMenu(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
  });
});
