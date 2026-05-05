// querySelector — satu elemen
const judul = document.querySelector(".judul");
const btn = document.querySelector("#btn-klik");

// querySelectorAll — semua elemen
const paragraf = document.querySelectorAll(".deskripsi");
const semuaLi = document.querySelectorAll("li");

// getElementById
const list = document.getElementById("list-buah");

// Cetak ke konsol
console.log("Judul:", judul);
console.log("Jumlah paragraf:", paragraf.length);
console.log("List node:", list);

// Navigasi dari elemen
const favorit = document.querySelector(".favorit");
console.log("Parent:", favorit.parentElement.id);
console.log("Sibling sebelum:", favorit.previousElementSibling?.textContent);
