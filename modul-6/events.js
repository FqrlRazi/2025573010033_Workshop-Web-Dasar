// ── Event Delegation: tangani click semua .btn-warna dari satu listener ──
const kontainerWarna = document.getElementById("kontainer-warna");
const preview = document.getElementById("preview-warna");
kontainerWarna.addEventListener("click", (e) => {
// e.target adalah elemen yang diklik (bisa tombol atau ikon di dalamnya)
  const tombol = e.target.closest(".btn-warna");
  if (!tombol) return; // klik di area bukan tombol, abaikan
  const warna = tombol.dataset.warna; // ambil data-warna attribute
  preview.style.backgroundColor = warna;
  preview.textContent = `Warna: ${warna}`;

// Tandai tombol yang aktif
  document
    .querySelectorAll(".btn-warna")
    .forEach((b) => b.classList.remove("aktif"));
  tombol.classList.add("aktif");
});

// ── Input event: real-time character count ──────────────────────────────
const textarea = document.getElementById("teks-area");
const hitungChar = document.getElementById("hitung-char");
const MAKS = 150;
textarea.addEventListener("input", (e) => {
  const panjang = e.target.value.length;
  hitungChar.textContent = `${panjang} / ${MAKS}`;
  hitungChar.style.color = panjang > MAKS * 0.9 ? "#E74C3C" : "#888";
  if (panjang > MAKS) e.target.value = e.target.value.slice(0, MAKS);
});

// ── Keyboard event: shortcut ─────────────────────────────────────────────
document.addEventListener("keydown", (e) => {
  const log = document.getElementById("log-keyboard");
  // Ctrl+S: cegah save browser, tampilkan notifikasi
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    log.textContent = "Dokumen disimpan! (Ctrl+S dicegah)";
    setTimeout(() => (log.textContent = ""), 2000);
    return;
  }
  log.textContent = `Tombol ditekan: ${e.key} | Ctrl: ${e.ctrlKey} | Shift: ${e.shiftKey}`;
});

// ── Focus & Blur: highlight field aktif ─────────────────────────────────
document.querySelectorAll(".field-fokus").forEach((input) => {
  input.addEventListener("focus", (e) => {
    e.target.parentElement.classList.add("field-aktif");
  });
  input.addEventListener("blur", (e) => {
    e.target.parentElement.classList.remove("field-aktif");
  });
});

// ── Scroll event: progress bar ──────────────────────────────────────────
const progressBar = document.getElementById("scroll-progress");
window.addEventListener("scroll", () => {
  const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
  const persen = (window.scrollY / scrollMax) * 100;
  progressBar.style.width = `${persen}%`;
});
