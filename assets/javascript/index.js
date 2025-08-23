const form = document.getElementById("tabungan-modal-menikah-form");
const tbody = document.getElementById("tabungan-modal-menikah-tbody");

let data = JSON.parse(localStorage.getItem("tabunganModalMenikah")) || [];

// Format ke Rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
    }).format(angka);
}

// Render Data ke Tabel
function renderTable() {
    tbody.innerHTML = "";
    data.forEach((item, index) => {
        const row = document.createElement("tr");

        // Hitung Sisahnya
        const sisah = item.pemasukan - (item.pengeluaran + item.tabungan + item.lainnya);

        row.innerHTML = `
      <td>${item.tanggal}</td>
      <td class="tabungan-modal-menikah-blur">${formatRupiah(item.pemasukan)}</td>
      <td class="tabungan-modal-menikah-blur">${formatRupiah(item.pengeluaran)}</td>
      <td class="tabungan-modal-menikah-blur">${formatRupiah(item.tabungan)}</td>
      <td class="tabungan-modal-menikah-blur">${formatRupiah(item.lainnya)}</td>
      <td class="tabungan-modal-menikah-blur">${formatRupiah(sisah)}</td>
      <td>${item.catatan}</td>
      <td class="tabungan-modal-menikah-actions">
        <button onclick="toggleBlur(this)"><i class="fa-solid fa-eye view"></i></button>
        <button onclick="editData(${index})"><i class="fa-solid fa-pen-to-square edit"></i></button>
        <button onclick="deleteData(${index})"><i class="fa-solid fa-trash delete"></i></button>
      </td>
    `;
        tbody.appendChild(row);
    });
}

// Tambah Data
form.addEventListener("submit", e => {
    e.preventDefault();

    const tanggal = document.getElementById("tabungan-modal-menikah-tanggal").value;
    const pemasukan = parseInt(document.getElementById("tabungan-modal-menikah-pemasukan").value) || 0;
    const pengeluaran = parseInt(document.getElementById("tabungan-modal-menikah-pengeluaran").value) || 0;
    const tabungan = parseInt(document.getElementById("tabungan-modal-menikah-tabungan").value) || 0;
    const lainnya = parseInt(document.getElementById("tabungan-modal-menikah-lainnya").value) || 0;
    const catatan = document.getElementById("tabungan-modal-menikah-catatan").value;

    data.push({ tanggal, pemasukan, pengeluaran, tabungan, lainnya, catatan });
    localStorage.setItem("tabunganModalMenikah", JSON.stringify(data));
    renderTable();
    form.reset();
});

// Toggle Blur + Toggle Icon
function toggleBlur(btn) {
    const row = btn.parentElement.parentElement.parentElement;
    const icon = btn.querySelector("i");

    const firstCell = row.querySelector("td:nth-child(2)"); // ambil cell Pemasukan
    const isBlurred = firstCell.classList.contains("tabungan-modal-menikah-blur");

    // Toggle semua cell uang
    row.querySelectorAll("td:nth-child(2), td:nth-child(3), td:nth-child(4), td:nth-child(5), td:nth-child(6)").forEach(cell => {
        cell.classList.toggle("tabungan-modal-menikah-blur");
    });

    // Ganti ikon sesuai state
    if (isBlurred) {
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

// Edit Data (tanpa modal hapus)
function editData(index) {
    const item = data[index];

    // isi form dengan data yang mau diedit
    document.getElementById("tabungan-modal-menikah-tanggal").value = item.tanggal;
    document.getElementById("tabungan-modal-menikah-pemasukan").value = item.pemasukan;
    document.getElementById("tabungan-modal-menikah-pengeluaran").value = item.pengeluaran;
    document.getElementById("tabungan-modal-menikah-tabungan").value = item.tabungan;
    document.getElementById("tabungan-modal-menikah-lainnya").value = item.lainnya;
    document.getElementById("tabungan-modal-menikah-catatan").value = item.catatan;

    // hapus dulu data lama supaya nanti disimpan ulang
    data.splice(index, 1);
    localStorage.setItem("tabunganModalMenikah", JSON.stringify(data));
    renderTable();
}

// ====== Modal Konfirmasi Hapus ======
let deleteIndex = null; // simpan index sementara

// Hapus Data (munculkan modal konfirmasi)
function deleteData(index) {
    deleteIndex = index;
    document.getElementById("tabungan-modal-menikah-confirm").style.display = "flex";
}

// Tombol modal
const confirmModal = document.getElementById("tabungan-modal-menikah-confirm");
const yesBtn = document.getElementById("tabungan-modal-menikah-yes");
const noBtn = document.getElementById("tabungan-modal-menikah-no");

// Jika klik "Ya"
yesBtn.addEventListener("click", () => {
    if (deleteIndex !== null) {
        data.splice(deleteIndex, 1);
        localStorage.setItem("tabunganModalMenikah", JSON.stringify(data));
        renderTable();
        deleteIndex = null;
    }
    confirmModal.style.display = "none";
});

// Jika klik "Batal"
noBtn.addEventListener("click", () => {
    deleteIndex = null;
    confirmModal.style.display = "none";
});

// Tutup modal kalau klik luar box
window.addEventListener("click", (e) => {
    if (e.target === confirmModal) {
        confirmModal.style.display = "none";
        deleteIndex = null;
    }
});

// Load saat pertama
renderTable();
