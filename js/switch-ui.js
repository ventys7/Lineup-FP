/* SWITCH UI - Rendering functions */

function updateSwitchUI(){
  const starterSlot = document.getElementById('switchStarterSlot');
  const benchSlot = document.getElementById('switchBenchSlot');
  const starterSlotMobile = document.getElementById('switchStarterSlotMobile');
  const benchSlotMobile = document.getElementById('switchBenchSlotMobile');
  
  // Show switch section when manager is selected
  const switchSection = document.getElementById('switchSection');
  const switchSectionMobile = document.getElementById('mobileSwitchSection');
  if(switchSection && currentManager){
    switchSection.style.display = "block";
  }
  if(switchSectionMobile && currentManager){
    switchSectionMobile.style.display = "block";
  }
  
  if(!starterSlot || !benchSlot){
    setTimeout(updateSwitchUI, 100);
    return;
  }
  
  const clearStarterBtn = document.getElementById('clearStarterSwitch');
  const clearBenchBtn = document.getElementById('clearBenchSwitch');
  const clearStarterBtnMobile = document.getElementById('clearStarterSwitchMobile');
  const clearBenchBtnMobile = document.getElementById('clearBenchSwitchMobile');
  
  if(!db || !currentManager || !db[currentManager]) return;
  
  const team = db[currentManager].players;
  if(!team || team.length === 0) return;
  
  function renderSwitchSlot(slotEl, playerIndex, isStarter){
    if(!slotEl) return;
    
    if(playerIndex === null || !team[playerIndex]){
      slotEl.innerHTML = '<div class="switch-slot-content"><span class="switch-slot-placeholder">+</span></div>';
      slotEl.classList.remove('has-player');
    } else {
      const p = team[playerIndex];
      const color = roleColors[p.r] || '#dc3545';
      slotEl.innerHTML = `<div class="switch-slot-content">
        <div class="badge" style="background:${color}">${p.r}</div>
        <span class="player-name">${p.n}</span>
      </div>`;
      slotEl.classList.add('has-player');
    }
  }
  
  renderSwitchSlot(starterSlot, switchStarterIndex, true);
  renderSwitchSlot(benchSlot, switchBenchIndex, false);
  renderSwitchSlot(starterSlotMobile, switchStarterIndex, true);
  renderSwitchSlot(benchSlotMobile, switchBenchIndex, false);
  
  const showClear = (val, btn) => { if(btn) btn.style.display = val !== null ? 'inline-block' : 'none'; };
  showClear(switchStarterIndex, clearStarterBtn);
  showClear(switchBenchIndex, clearBenchBtn);
  showClear(switchStarterIndex, clearStarterBtnMobile);
  showClear(switchBenchIndex, clearBenchBtnMobile);
  
  const plusBtn = document.getElementById('switchPlusBtn');
  const plusBtnMobile = document.getElementById('switchPlusBtnMobile');
  if(plusBtn) plusBtn.classList.toggle('active', switchPlus);
  if(plusBtnMobile) plusBtnMobile.classList.toggle('active', switchPlus);
}
