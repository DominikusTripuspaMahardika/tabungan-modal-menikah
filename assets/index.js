document.addEventListener("DOMContentLoaded", () => {
    // ===== ELEMENT DOM =====
    const form = document.getElementById("tabunganForm");
    const tanggalInput = document.getElementById("tanggal");
    const priaInput = document.getElementById("tabunganPria");
    const wanitaInput = document.getElementById("tabunganWanita");
    const tableBody = document.querySelector("#tabunganTable tbody");

    const filterBulan = document.getElementById("filterBulan");
    const filterTahun = document.getElementById("filterTahun");
    const searchTanggal = document.getElementById("searchTanggal");

    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");
    const estimasiWaktu = document.getElementById("estimasiWaktu");

    // ===== KONFIG =====
    const STORAGE_KEY = "tabungan";
    const TARGET_TABUNGAN = 50_000_000; // target total tabungan (bisa ubah sesuai kebutuhan)

    // ===== FUNGSI UTILITAS =====
    const getData = () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const saveData = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // ===== RENDER DATA =====
    const renderTable = () => {
        const data = getData();

        // Filter data
        const bulan = filterBulan.value;
        const tahun = filterTahun.value.trim();
        const tanggalCari = searchTanggal.value;

        const filtered = data.filter(item => {
            const [th, bl] = item.tanggal.split("-");
            let cocok = true;
            if (bulan && bl !== bulan) cocok = false;
            if (tahun && th !== tahun) cocok = false;
            if (tanggalCari && item.tanggal !== tanggalCari) cocok = false;
            return cocok;
        });

        // Render ke tabel
        tableBody.innerHTML = "";
        filtered.forEach((item, index) => {
            const total = item.tabunganPria + item.tabunganWanita;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.tanggal}</td>
                <td>${item.tabunganPria.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
                <td>${item.tabunganWanita.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
                <td>${total.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
                <td><button class="delete" data-index="${index}">Delete</button></td>
            `;
            tableBody.appendChild(row);
        });

        updateProgress(data);
    };

    // ===== UPDATE PROGRESS =====
    const updateProgress = (data) => {
        const total = data.reduce((sum, item) => sum + item.tabunganPria + item.tabunganWanita, 0);
        const persen = Math.min((total / TARGET_TABUNGAN) * 100, 100);

        progressFill.style.width = `${persen}%`;
        progressText.textContent = `${persen.toFixed(1)}%`;

        if (data.length > 1) {
            const hari = (new Date(data[data.length - 1].tanggal) - new Date(data[0].tanggal)) / (1000 * 60 * 60 * 24);
            const rataHarian = total / hari;
            const sisa = TARGET_TABUNGAN - total;
            const estimasiHari = sisa / rataHarian;
            estimasiWaktu.textContent = estimasiHari > 0
                ? `Estimasi tercapai: ${Math.ceil(estimasiHari)} hari lagi`
                : "Target tercapai!";
        } else {
            estimasiWaktu.textContent = "Belum cukup UANG untuk MENIKAH!!.";
        }
    };

    // ===== EVENT FORM =====
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const tanggal = tanggalInput.value;
        const pria = parseFloat(priaInput.value);
        const wanita = parseFloat(wanitaInput.value);

        if (!tanggal || isNaN(pria) || isNaN(wanita) || pria < 0 || wanita < 0) return;

        const data = getData();
        const idx = data.findIndex(d => d.tanggal === tanggal);

        if (idx !== -1) {
            data[idx] = { tanggal, tabunganPria: pria, tabunganWanita: wanita };
        } else {
            data.push({ tanggal, tabunganPria: pria, tabunganWanita: wanita });
        }

        saveData(data);

        tanggalInput.value = "";
        priaInput.value = "";
        wanitaInput.value = "";

        renderTable();
    });

    // ===== EVENT HAPUS =====
    tableBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete")) {
            const index = e.target.dataset.index;
            const data = getData();
            data.splice(index, 1);
            saveData(data);
            renderTable();
        }
    });

    // ===== EVENT FILTER =====
    [filterBulan, filterTahun, searchTanggal].forEach(el => {
        el.addEventListener("input", renderTable);
    });

    // ===== INIT =====
    renderTable();

    // ===== SERVICE WORKER =====
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("data/service-worker.js")
            .then(reg => console.log("Service Worker terdaftar:", reg.scope))
            .catch(err => console.error("SW gagal:", err));
    }

    // ===== MODAL PWA =====
    const installModal = document.getElementById("installModal");
    const installBtn = document.getElementById("installBtn");
    const laterBtn = document.getElementById("laterBtn");
    const dontShowAgainBtn = document.getElementById("dontShowAgainBtn");
    let deferredPrompt;

    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (!localStorage.getItem("dontShowInstallModal")) {
            installModal.style.display = "flex";
        }
    });

    installBtn.addEventListener("click", () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.finally(() => deferredPrompt = null);
        }
        installModal.style.display = "none";
    });

    laterBtn.addEventListener("click", () => installModal.style.display = "none");

    dontShowAgainBtn.addEventListener("click", () => {
        localStorage.setItem("dontShowInstallModal", "true");
        installModal.style.display = "none";
    });
});
