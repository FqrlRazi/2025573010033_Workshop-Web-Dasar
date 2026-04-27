import "./style.css";

const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  html.classList.add('dark');
}

function updateThemeIcon() {
  if (!themeToggle) return;
  themeToggle.textContent = html.classList.contains('dark') ? '☀️' : '🌙';
}
updateThemeIcon();

themeToggle?.addEventListener('click', () => {
  html.classList.toggle('dark');
  const isDark = html.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon();
});

menuToggle?.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
  });
});
