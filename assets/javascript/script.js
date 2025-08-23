// ===== Toast Function =====
const toastContainer = document.createElement("div");
toastContainer.className = "toast-container";
document.body.appendChild(toastContainer);

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Hapus setelah animasi
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// ===== Form Switching =====
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const formTitle = document.getElementById("formTitle");

showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.remove("active");
  registerForm.classList.add("active");
  formTitle.textContent = "Ayo Menabung!!";
});

showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerForm.classList.remove("active");
  loginForm.classList.add("active");
  formTitle.textContent = "Ayo Menabung!!";
});

// ===== Register =====
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if (localStorage.getItem(username)) {
    showToast("⚠️ Akun sudah terdaftar!", "error");
  } else {
    localStorage.setItem(username, password);
    showToast("✅ Berhasil Daftar!.", "success");
    registerForm.reset();
    showLogin.click();
  }
});

// ===== Login =====
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const storedPassword = localStorage.getItem(username);

  if (storedPassword && storedPassword === password) {
    localStorage.setItem("loggedInUser", username);
    showToast("🎉 Berhasil Masuk!", "success");
    setTimeout(() => {
      window.location.href = "app.html";
    }, 800);
  } else {
    showToast("❌ Gagal, Ulangi Lagi!", "error");
  }
});

let deferredPrompt;
const installModal = document.getElementById("installModal");
const installBtn = document.getElementById("installBtn");
const closeInstall = document.getElementById("closeInstall");

// Tangkap event beforeinstallprompt
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Tampilkan modal
  installModal.style.display = "flex";
});

// Klik tombol Install
installBtn.addEventListener("click", async () => {
  installModal.style.display = "none";
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted install");
    } else {
      console.log("User dismissed install");
    }
    deferredPrompt = null;
  }
});

// Klik Nanti Saja
closeInstall.addEventListener("click", () => {
  installModal.style.display = "none";
});
