// form-validasi.js
// ── Referensi elemen ──────────────────────────────────────────
const form = document.getElementById("form-registrasi");
const inputNama = document.getElementById("nama");
const inputEmail = document.getElementById("email");
const inputPass = document.getElementById("password");
const inputKonf = document.getElementById("konfirmasi");
const inputTelp = document.getElementById("telp");
const inputSetuju = document.getElementById("setuju");
const sukses = document.getElementById("sukses");

// ── Helper: tampilkan / sembunyikan error ────────────────────
function setError(inputEl, errorId, pesan) {
  const errorEl = document.getElementById(errorId);
  errorEl.textContent = pesan;
  inputEl.classList.toggle("invalid", pesan !== "");
  inputEl.classList.toggle("valid", pesan === "");
  return pesan === ""; // true jika valid
}

// ── Aturan validasi ──────────────────────────────────────────function validasiNama(nilai) {
if (!nilai.trim()) return "Nama tidak boleh kosong";
if (nilai.trim().length < 3) return "Nama minimal 3 karakter";
if (nilai.trim().length > 50) return "Nama maksimal 50 karakter";
return ""; // kosong = valid

function validasiEmail(nilai) {
  if (!nilai) return "Email tidak boleh kosong";
  const pola = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pola.test(nilai)) return "Format email tidak valid";
  return "";
}

function validasiPassword(nilai) {
  if (!nilai) return "Password tidak boleh kosong";
  if (nilai.length < 8) return "Password minimal 8 karakter";
  if (!/[A-Z]/.test(nilai)) return "Harus ada minimal 1 huruf kapital";
  if (!/[0-9]/.test(nilai)) return "Harus ada minimal 1 angka";
  return "";
}

function hitungKekuatan(nilai) {
  let skor = 0;
  if (nilai.length >= 8) skor++;
  if (nilai.length >= 12) skor++;
  if (/[A-Z]/.test(nilai)) skor++;
  if (/[0-9]/.test(nilai)) skor++;
  if (/[^A-Za-z0-9]/.test(nilai)) skor++; // karakter spesial
  return skor;
}

function validasiKonfirmasi(nilai) {
  if (!nilai) return "Konfirmasi password tidak boleh kosong";
  if (nilai !== inputPass.value) return "Password tidak cocok";
  return "";
}

function validasiTelp(nilai) {
  if (!nilai) return "Nomor telepon tidak boleh kosong";
  const pola = /^(\+62|0)[0-9]{9,12}$/;
  if (!pola.test(nilai.replace(/\s|-/g, "")))
    return "Format: 08xxxxxxxxxx (10-13 digit)";
  return "";
}

// ── Event: validasi real-time saat blur ──────────────────────
inputNama.addEventListener("blur", () =>
  setError(inputNama, "error-nama", validasiNama(inputNama.value)),
);

inputEmail.addEventListener("blur", () =>
  setError(inputEmail, "error-email", validasiEmail(inputEmail.value)),
);

inputPass.addEventListener("blur", () =>
  setError(inputPass, "error-password", validasiPassword(inputPass.value)),
);

inputKonf.addEventListener("blur", () =>
  setError(inputKonf, "error-konfirmasi", validasiKonfirmasi(inputKonf.value)),
);

inputTelp.addEventListener("blur", () =>
  setError(inputTelp, "error-telp", validasiTelp(inputTelp.value)),
);

// ── Password strength indicator ──────────────────────────────
inputPass.addEventListener("input", () => {
  const skor = hitungKekuatan(inputPass.value);
  const bar = document.getElementById("bar-kekuatan");
  const teks = document.getElementById("teks-kekuatan");
  const level = ["", "Sangat Lemah", "Lemah", "Sedang", "Kuat", "Sangat Kuat"];
  const warna = ["", "#EF4444", "#F97316", "#EAB308", "#22C55E", "#16A34A"];
  bar.style.width = `${(skor / 5) * 100}%`;
  bar.style.background = warna[skor] || "";
  teks.textContent = inputPass.value ? level[skor] || "" : "";
});

// ── Submit: validasi semua field ─────────────────────────────
form.addEventListener("submit", (e) => {
  e.preventDefault(); // cegah reload halaman!
  const valid = [
    setError(inputNama, "error-nama", validasiNama(inputNama.value)),
    setError(inputEmail, "error-email", validasiEmail(inputEmail.value)),
    setError(inputPass, "error-password", validasiPassword(inputPass.value)),
    setError(
      inputKonf,
      "error-konfirmasi",
      validasiKonfirmasi(inputKonf.value),
    ),
    setError(inputTelp, "error-telp", validasiTelp(inputTelp.value)),
  ];
  if (!inputSetuju.checked) {
    document.getElementById("error-setuju").textContent =
      "Kamu harus menyetujui syarat & ketentuan";
    valid.push(false);
  } else {
    document.getElementById("error-setuju").textContent = "";
  }
  if (valid.every((v) => v)) {
    // Semua valid — kirim data
    sukses.classList.remove("tersembunyi");
    form.reset();
    // Reset semua class valid/invalid
    form.querySelectorAll("input").forEach((i) => {
      i.classList.remove("valid", "invalid");
    });
  } else {
    // Fokus ke field pertama yang error
    const firstInvalid = form.querySelector(".invalid");
    firstInvalid?.focus();
    firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});
