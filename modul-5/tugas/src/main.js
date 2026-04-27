import './style.css'

const themeToggle = document.getElementById("themeToggle");
const menuBtn     = document.getElementById("menuBtn");
const mobileNav   = document.getElementById("mobileNav");

// Default = light (tidak ada class dark)
// Hanya tambah dark kalau user pernah pilih dark
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
  themeToggle.textContent = "◐";
} else {
  document.documentElement.classList.remove("dark");
  themeToggle.textContent = "◑";
} 

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  themeToggle.textContent = isDark ? "◐" : "◑";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

menuBtn.addEventListener("click", () => {
  mobileNav.classList.toggle("hidden");
});

mobileNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => mobileNav.classList.add("hidden"));
});