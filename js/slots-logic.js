/* SLOTS LOGIC - Business logic for slots */

function clearStarterGoalkeeper(){
  if(!currentManager || !db[currentManager]) return;
  const team = db[currentManager].players;
  
  // Find GK in starters
  const gkStarterIdx = slotAssignments['starter-GK1'];
  if(gkStarterIdx !== undefined){
    // Remove from selectedPlayers
    selectedPlayers = selectedPlayers.filter(i => i !== gkStarterIdx);
    // Clear GK assignments
    delete slotAssignments['starter-GK1'];
    delete slotAssignments['bench-GK1'];
    delete slotAssignments['bench-GK2'];
    disabledBlocks.clear();
  }
  
  renderFormation();
  renderRoster();
  if(isMobile) renderMobileSlots();
  updateSwitchUI();
}

function openSlotPicker(slotType, slotId){
  if(!currentManager) return;
  
  const role = slotId.startsWith('GK') ? 'P' : slotId[0];
  
  if(role === 'P'){
    let currentPlayer = null;
    const starterGkIdx = slotAssignments['starter-GK1'];
    if(starterGkIdx !== undefined){
      currentPlayer = db[currentManager].players[starterGkIdx];
    } else {
      // Find GK in starters (auto-assigned)
      const starters = getStarters();
      const gk = starters.find(p => p.r === 'P');
      if(gk) currentPlayer = gk;
    }
    showGkChoiceModalForMobile(slotId, slotType === 'starter', currentPlayer);
    return;
  }
  
  const slotKey = slotType + '-' + slotId;
  const assignedIdx = slotAssignments[slotKey];
  const team = db[currentManager].players;
  const currentPlayer = assignedIdx !== undefined ? team[assignedIdx] : null;
  
  currentPickerSlot = {slotId, role, isStarter: slotType === 'starter', currentPlayer};
  showSlotPicker(role, currentPlayer);
}
