/* SWITCH SETUP - Event listeners */

function setupSwitchListeners(){
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', setupSwitchListeners);
    return;
  }
  
  const starterSlot = document.getElementById('switchStarterSlot');
  const benchSlot = document.getElementById('switchBenchSlot');
  const starterSlotMobile = document.getElementById('switchStarterSlotMobile');
  const benchSlotMobile = document.getElementById('switchBenchSlotMobile');
  const clearStarterBtn = document.getElementById('clearStarterSwitch');
  const clearBenchBtn = document.getElementById('clearBenchSwitch');
  const clearStarterBtnMobile = document.getElementById('clearStarterSwitchMobile');
  const clearBenchBtnMobile = document.getElementById('clearBenchSwitchMobile');
  const plusBtn = document.getElementById('switchPlusBtn');
  const plusBtnMobile = document.getElementById('switchPlusBtnMobile');

  starterSlot?.addEventListener('click', openSwitchStarterModal);
  benchSlot?.addEventListener('click', openSwitchBenchModal);
  starterSlotMobile?.addEventListener('click', openSwitchStarterModal);
  benchSlotMobile?.addEventListener('click', openSwitchBenchModal);

  clearStarterBtn?.addEventListener('click', (e) => { e.stopPropagation(); switchStarterIndex = null; updateSwitchUI(); });
  clearBenchBtn?.addEventListener('click', (e) => { e.stopPropagation(); switchBenchIndex = null; updateSwitchUI(); });
  clearStarterBtnMobile?.addEventListener('click', (e) => { e.stopPropagation(); switchStarterIndex = null; updateSwitchUI(); });
  clearBenchBtnMobile?.addEventListener('click', (e) => { e.stopPropagation(); switchBenchIndex = null; updateSwitchUI(); });

  plusBtn?.addEventListener('click', () => { 
    switchPlus = !switchPlus; 
    updateSwitchUI(); 
  });
  plusBtnMobile?.addEventListener('click', () => { 
    switchPlus = !switchPlus; 
    updateSwitchUI(); 
  });
}
