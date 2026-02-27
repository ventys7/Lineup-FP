/* APP EVENTS - Event listeners */

document.body.addEventListener('touchmove', function(e) {
  if(isModalOpen) {
    e.preventDefault();
  }
}, {passive: false});

document.getElementById("moduleSelect").addEventListener("change", () => {
  renderFormation();
  if(isMobile) renderMobileSlots();
});
document.getElementById("resetBtn").addEventListener("click", ()=>{
  selectedPlayers = []; lastStarters=[]; lastBench=[]; disabledBlocks.clear(); slotAssignments = {};
  clearSwitch();
  renderRoster(); renderFormation();
  if(isMobile) renderMobileSlots();
});
document.getElementById("resetBtnMobile")?.addEventListener("click", ()=>{
  selectedPlayers = []; lastStarters=[]; lastBench=[]; disabledBlocks.clear(); slotAssignments = {};
  clearSwitch();
  renderRoster(); renderFormation();
  renderMobileSlots();
});

// Roster drawer toggle
function toggleRoster(){
  const drawer = document.getElementById('rosterDrawer');
  drawer.classList.toggle('open');
}

document.getElementById("toggleRosterBtn")?.addEventListener("click", toggleRoster);
document.getElementById("closeRosterBtn")?.addEventListener("click", toggleRoster);
window.addEventListener("keydown", e => { 
  if(e.key === "Escape"){
    closeModal();
    closeSwitchStarterModal();
    closeSwitchBenchModal();
  }
});

// Mobile-specific setup
if(isMobile){
  const resetBtn = document.getElementById("resetBtn");
  if(resetBtn) resetBtn.textContent = "Reset";
  
  const selectAllBtn = document.getElementById("selectAllBtn");
  if(selectAllBtn){
    selectAllBtn.style.display = "inline-block";
    selectAllBtn.onclick = () => {
      const textarea = document.getElementById("outputText");
      textarea.select();
      textarea.setSelectionRange(0, 99999);
    };
  }
}
