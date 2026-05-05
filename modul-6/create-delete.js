// ── Cara 1: createElement (lebih aman, bisa set properti satu per satu) ──
function tambahTugasManual(teks) {
  const li = document.createElement("li");
  li.textContent = teks; // AMAN — tidak di-parse sebagai HTML
  li.className = "item-tugas";
  // Tombol hapus di dalam li
  const btnHapus = document.createElement("button");
  btnHapus.textContent = "✕";
  btnHapus.className = "btn-hapus";
  btnHapus.addEventListener("click", () => li.remove());
  li.appendChild(btnHapus);
  document.getElementById("list-tugas").appendChild(li);
}

// ── Cara 2: insertAdjacentHTML (lebih ringkas untuk HTML yang sudah aman) ──
function tambahTugasHTML(teks) {
  // Sanitasi teks dari user sebelum masuk innerHTML!
  const teksAman = teks.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  document.getElementById("list-tugas").insertAdjacentHTML(
    "beforeend",
    `
<li class="item-tugas">
${teksAman}
<button class="btn-hapus" onclick="this.parentElement.remove()">✕</button>
</li>
`,
  );
}

// ── Event: tombol tambah ─
const inputTugas = document.getElementById("input-tugas");
const btnTambah = document.getElementById("btn-tambah");
const btnHapusSemua = document.getElementById("btn-hapus-semua");
btnTambah.addEventListener("click", () => {
  const teks = inputTugas.value.trim();
  if (!teks) {
    inputTugas.focus();
    return;
  }
  tambahTugasManual(teks);
  inputTugas.value = ""; // kosongkan input
  inputTugas.focus(); // fokus kembali untuk input berikutnya
});

// Enter key juga bisa tambah tugas
inputTugas.addEventListener("keydown", (e) => {
  if (e.key === "Enter") btnTambah.click();
});

// Hapus semua sekaligus
btnHapusSemua.addEventListener("click", () => {
  const list = document.getElementById("list-tugas");
  list.innerHTML = ""; // kosongkan seluruh isi
});
