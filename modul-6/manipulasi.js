const judul = document.getElementById("judul");
const info = document.getElementById("info");
const foto = document.getElementById("foto");
const kotak = document.getElementById("kotak");
const btnUbah = document.getElementById("btn-ubah");
const btnToggle = document.getElementById("btn-toggle");

btnUbah.addEventListener("click", () => {
  judul.textContent = "Judul Sudah Diubah!";
  // innerHTML: bisa sisipkan HTML
  info.innerHTML = "Teks <strong>tebal</strong> dan <em>miring</em>.";
  // Ubah atribut src gambar
  foto.setAttribute("src", "https://picsum.photos/100/100?random=2");
  foto.setAttribute("alt", "Foto baru");
  // Ubah style langsung
  kotak.style.backgroundColor = "#FEF9E7";
  kotak.style.padding = "12px";
  kotak.style.borderRadius = "8px";
});

btnToggle.addEventListener("click", () => {
  kotak.classList.toggle("aktif");
  // Cek class ada atau tidak
  const adaAktif = kotak.classList.contains("aktif");
  btnToggle.textContent = adaAktif ? "Nonaktifkan" : "Aktifkan";
});
