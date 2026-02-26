let currentPickerSlot = null;

function showSlotPicker(role, currentPlayer){
  const modal = document.getElementById('slotPickerModal');
  const roleLabel = document.getElementById('pickerRoleLabel');
  const currentDiv = document.getElementById('currentPlayerInPicker');
  const listDiv = document.getElementById('pickerPlayerList');
  
  const roleNames = {P:'Portiere',D:'Difensore',C:'Centrocampista',A:'Attaccante'};
  roleLabel.textContent = roleNames[role] || role;
  
  if(currentPlayer){
    currentDiv.style.display = 'block';
    currentDiv.innerHTML = `<div class="picker-player in-slot">
      <div class="badge" style="background:${roleColors[role]}">${role}</div>
      <div class="player-info">
        <span class="name">${currentPlayer.n}</span>
        <span class="team">${currentPlayer.t || ''}</span>
      </div>
      <span class="picker-remove-btn">✕</span>
    </div>`;
    currentDiv.onclick = () => removeFromPicker();
  } else {
    currentDiv.style.display = 'none';
  }
  
  const team = db[currentManager].players;
  const rolePlayers = team.filter(p => p.r === role && !p.isGkBlock);
  
  listDiv.innerHTML = '';
  rolePlayers.forEach(p => {
    const idx = team.indexOf(p);
    const isSelected = selectedPlayers.includes(idx);
    
    const div = document.createElement('div');
    div.className = 'picker-player' + (isSelected ? ' selected' : '');
    div.innerHTML = `
      <div class="badge" style="background:${roleColors[role]}">${role}</div>
      <div class="player-info">
        <span class="name">${p.n}</span>
        <span class="team">${p.t || ''}</span>
      </div>
      ${isSelected ? '<span style="color:var(--accent)">✓</span>' : ''}
    `;
    div.onclick = () => selectFromPicker(idx);
    listDiv.appendChild(div);
  });
  
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}

function selectFromPicker(playerIndex){
  if(!currentPickerSlot) return;
  const {slotId, role, isStarter, currentPlayer} = currentPickerSlot;
  const team = db[currentManager].players;
  const player = team[playerIndex];
  
  const slotKey = (isStarter ? 'starter-' : 'bench-') + slotId;
  
  if(currentPlayer && currentPlayer.n){
    const teamIdx = team.findIndex(p => p.n === currentPlayer.n && p.r === currentPlayer.r);
    if(teamIdx > -1 && selectedPlayers.includes(teamIdx)){
      selectedPlayers = selectedPlayers.filter(i => i !== teamIdx);
    }
  }
  
  if(selectedPlayers.includes(playerIndex)){
    for(const key in slotAssignments){
      if(slotAssignments[key] === playerIndex){
        delete slotAssignments[key];
        break;
      }
    }
    selectedPlayers = selectedPlayers.filter(i => i !== playerIndex);
  }
  
  selectedPlayers.push(playerIndex);
  slotAssignments[slotKey] = playerIndex;
  
  closeSlotPicker();
  renderMobileSlots();
  if(!isMobile) renderFormation();
}

function removeFromPicker(){
  if(!currentPickerSlot) return;
  const {slotId, role, isStarter, currentPlayer} = currentPickerSlot;
  const slotKey = (isStarter ? 'starter-' : 'bench-') + slotId;
  
  if(currentPlayer && currentPlayer.n){
    const team = db[currentManager].players;
    const currentIdx = team.findIndex(p => p.n === currentPlayer.n && p.r === currentPlayer.r);
    if(currentIdx > -1 && selectedPlayers.includes(currentIdx)){
      selectedPlayers = selectedPlayers.filter(i => i !== currentIdx);
    }
  }
  
  delete slotAssignments[slotKey];
  
  closeSlotPicker();
  renderMobileSlots();
  if(!isMobile) renderFormation();
}

function closeSlotPicker(){
  const modal = document.getElementById('slotPickerModal');
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  currentPickerSlot = null;
}

function showGkChoiceModalForMobile(slotId, isStarter, currentPlayer){
  if(!currentManager) return;
  const team = db[currentManager].players;
  const gkBlocks = [...new Set(team.filter(p => p.r === "P" && p.isGkBlock).map(p => p.gkBlock))];
  
  if(gkBlocks.length === 0) return;
  
  currentPickerSlot = {slotId, role:'P', isStarter, currentPlayer};
  
  const modal = document.getElementById('gkChoiceModal');
  const choicesDiv = document.getElementById('gkChoices');
  document.getElementById('gkBlockName').textContent = 'Portiere';
  
  choicesDiv.innerHTML = '';

  if(currentPlayer && !currentPlayer.isTeamName){
    const currentDiv = document.createElement('div');
    currentDiv.className = 'picker-player in-slot';
    currentDiv.style.marginBottom = '8px';
    currentDiv.style.display = 'flex';
    currentDiv.style.alignItems = 'center';
    currentDiv.style.justifyContent = 'space-between';
    currentDiv.style.background = '#fff5f5';
    currentDiv.style.border = '2px solid #dc3545';
    currentDiv.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px">
        <div class="badge" style="background:#e6b800">P</div>
        <div class="player-info">
          <span class="name" style="font-weight:600">${currentPlayer.n}</span>
          <span class="team" style="font-size:0.8rem;color:var(--muted)">${currentPlayer.t || ''}</span>
        </div>
      </div>
      <span style="color:#dc3545;font-weight:bold;font-size:1.2rem;cursor:pointer;padding:4px" onclick="removeCurrentGk()">✕</span>
    `;
    choicesDiv.appendChild(currentDiv);
    
    window.removeCurrentGk = () => {
      const idx = team.findIndex(p => p.n === currentPlayer.n && p.r === 'P');
      if(idx > -1 && selectedPlayers.includes(idx)){
        selectedPlayers = selectedPlayers.filter(i => i !== idx);
      }
      delete slotAssignments['starter-GK1'];
      delete slotAssignments['bench-GK1'];
      delete slotAssignments['bench-GK2'];
      disabledBlocks.clear();
      closeGkModal();
      renderMobileSlots();
      if(!isMobile) renderFormation();
    };
  }

  gkBlocks.forEach(block => {
    const blockPlayer = team.find(p => p.gkBlock === block);
    const blockTeam = blockPlayer ? blockPlayer.t : '';
    const blockLabel = block + (blockTeam ? ` (${blockTeam})` : '');
    
    const btn = document.createElement('button');
    btn.textContent = blockLabel;
    btn.style.padding = "10px 20px";
    btn.style.borderRadius = "8px";
    btn.style.border = "1px solid #e6e7ea";
    btn.style.background = "var(--card)";
    btn.style.cursor = "pointer";
    btn.style.fontWeight = "bold";
    btn.onclick = () => {
      const blockPlayers = team.filter(p => p.gkBlock === block);
      if(blockPlayers.length > 1){
        showGkChoiceModal(block, blockPlayers[0], team.indexOf(blockPlayers[0]));
      } else if(blockPlayers.length === 1){
        confirmGkSelectionMobile(team.indexOf(blockPlayers[0]));
      }
    };
    choicesDiv.appendChild(btn);
  });
  
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}

function confirmGkSelectionMobile(index){
  closeGkModal();
  const team = db[currentManager].players;
  const player = team[index];
  
  selectedPlayers = selectedPlayers.filter(i => team[i].r !== 'P');
  
  selectedPlayers.push(index);
  
  delete slotAssignments['starter-GK1'];
  delete slotAssignments['bench-GK1'];
  delete slotAssignments['bench-GK2'];
  
  if(player.gkBlock){
    const allBlocks = [...new Set(team.filter(p => p.isGkBlock).map(p => p.gkBlock))];
    allBlocks.forEach(block => {
      if(block !== player.gkBlock){
        disabledBlocks.add(block);
      }
    });
  }
  
  renderMobileSlots();
  if(!isMobile) renderFormation();
}
