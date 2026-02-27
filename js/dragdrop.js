function handleDrop(e, targetType, targetSlot){
  e.preventDefault();
  e.stopPropagation();
  
  document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
  
  const playerIndex = draggedPlayerIndex;
  const playerRole = draggedPlayerRole;
  
  if(playerIndex === null || playerRole === null){
    return;
  }
  
  const targetRole = targetSlot.startsWith('GK') ? 'P' : targetSlot[0];
  
  if(playerRole === 'P' && targetRole !== 'P'){
    showToast("I portieri vanno solo nello slot GK", "error");
    return;
  }
  
  if(playerRole !== 'P' && targetRole === 'P'){
    showToast("Solo i portieri vanno nello slot GK", "error");
    return;
  }
  
  if(playerRole !== targetRole){
    showToast(`Questo slot è per ${getRoleName(targetRole)}`, "error");
    return;
  }
  
  const team = db[currentManager].players;
  const player = team[playerIndex];
  
  // Check if GK has block - show picker with block logic
  if(playerRole === 'P' && player.isGkBlock){
    const slotKey = targetType + '-' + targetSlot;
    let currentPlayer = null;
    if(slotAssignments[slotKey] !== undefined){
      currentPlayer = team[slotAssignments[slotKey]];
    }
    currentPickerSlot = {slotId: targetSlot, role:'P', isStarter: targetType === 'starter', currentPlayer};
    showGkChoiceModalForMobile(targetSlot, targetType === 'starter', currentPlayer);
    return;
  }
  
  const slotKey = targetType + '-' + targetSlot;
  
  for(const key in slotAssignments){
    if(slotAssignments[key] === playerIndex){
      delete slotAssignments[key];
    }
  }
  
  if(!selectedPlayers.includes(playerIndex)){
    selectedPlayers.push(playerIndex);
  }
  
  slotAssignments[slotKey] = playerIndex;
  
  renderRoster();
  renderFormation();
  if(isMobile) renderMobileSlots();
}
