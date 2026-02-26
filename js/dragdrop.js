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
