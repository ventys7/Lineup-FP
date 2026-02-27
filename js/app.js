/* APP - Toast and init */

function showToast(message, type="error"){
  if(isMobile && type === "success") return;
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = "toast " + (type === "success" ? "success" : "error");
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(()=>{ toast.style.animation = "toastOut 0.28s forwards"; setTimeout(()=> toast.remove(), 300); }, 2500);
}

/* INIT */
setupSwitchListeners();
setupModalClickOutside();
loadCSV();
