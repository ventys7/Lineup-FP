/* ROSTER - Roster rendering and player toggle */

function renderRoster(){
  const container = document.getElementById("roster");
  container.innerHTML = "";
  if(!currentManager) return;
  const team = db[currentManager];
  
  const shownBlocks = new Set();
  
  team.players.forEach((p, idx)=>{
    if(p.isGkBlock && shownBlocks.has(p.gkBlock)) return;
    if(p.isGkBlock) shownBlocks.add(p.gkBlock);
    
    const isDisabled = p.isGkBlock && disabledBlocks.has(p.gkBlock);
    
    const card = document.createElement("div");
    card.className = "player-card";
    if(isDisabled) card.classList.add("disabled");
    card.id = `p-${idx}`;
    card.tabIndex = isDisabled ? -1 : 0;
    card.draggable = !isDisabled;
    card.ondragstart = (e) => { draggedPlayerIndex = idx; draggedPlayerRole = p.r; card.classList.add('dragging'); };
    card.ondragend = () => { draggedPlayerIndex = null; draggedPlayerRole = null; card.classList.remove('dragging'); };
    card.onclick = (isDisabled || p.r !== 'P') ? null : ()=> togglePlayer(idx);
    card.onkeydown = (isDisabled || p.r !== 'P') ? null : (e)=> { if(e.key==="Enter") togglePlayer(idx); };
    
    const left = document.createElement("div"); left.className="player-left";
    const badge = document.createElement("div"); badge.className="badge " + (p.r||"U"); badge.textContent = p.r||"?";

    const meta = document.createElement("div");
    const displayName = p.isGkBlock ? p.gkBlock : p.n;
    const nameEl = document.createElement("div"); nameEl.className="player-meta"; nameEl.textContent = displayName;
    const teamEl = document.createElement("div"); teamEl.className="player-sub"; teamEl.textContent = p.t || "";
    meta.appendChild(nameEl); meta.appendChild(teamEl);

    left.appendChild(badge); left.appendChild(meta);

    const right = document.createElement("div"); right.style.fontSize="0.9rem"; right.style.color="var(--muted)";
    if(isDisabled) right.textContent = "🔒";

    card.appendChild(left); card.appendChild(right);
    container.appendChild(card);
  });

  updateRosterUI();
}

function togglePlayer(index){
  if(!currentManager) return;
  const player = db[currentManager].players[index];
  const team = db[currentManager].players;

  if(player.isGkBlock && disabledBlocks.has(player.gkBlock)){
    showToast("Hai già selezionato un altro blocco portieri!", "error");
    return;
  }

  if(selectedPlayers.includes(index)){
    if(player.gkPartner){
      const partnerIndex = team.findIndex(p => p.gkBlock === player.gkBlock && p.gkPartner === player.n);
      if(partnerIndex !== -1){
        selectedPlayers = selectedPlayers.filter(i=>i!==index && i!==partnerIndex);
      }
      disabledBlocks.clear();
    }
    selectedPlayers = selectedPlayers.filter(i=>i!==index);
    renderRoster();
    renderFormation();
    if(isMobile) renderMobileSlots();
    return;
  }

  if(player.r === "P" && player.gkPartner){
    const partnerNotSelected = team.some((p, i) => 
      p.gkBlock === player.gkBlock && 
      p.gkPartner === player.n && 
      !selectedPlayers.includes(i)
    );
    
    if(partnerNotSelected){
      showGkChoiceModal(player.gkBlock, player, index);
      return;
    }
  }

  if(selectedPlayers.length >= MAX_SELECTED){
    showToast(`Puoi selezionare massimo ${MAX_SELECTED} giocatori.`, "error");
    return;
  }

  const module = document.getElementById("moduleSelect").value;
  const defReq = parseInt(module[0], 10);
  const cenReq = parseInt(module[1], 10);
  const attReq = parseInt(module[2], 10);

  const BENCH_LIMITS = {P:2, D:3, C:3, A:3};

  const starterCounts = {P:0, D:0, C:0, A:0};
  const benchCounts = {P:0, D:0, C:0, A:0};

  selectedPlayers.forEach(i => {
    const p = db[currentManager].players[i];
    const role = p.r;
    if(starterCounts[role] !== undefined){
      if(starterCounts[role] < (role === 'P' ? 1 : role === 'D' ? defReq : role === 'C' ? cenReq : attReq)){
        starterCounts[role]++;
      } else {
        benchCounts[role]++;
      }
    }
  });

  const role = player.r;
  const starterMax = role === 'P' ? 1 : role === 'D' ? defReq : role === 'C' ? cenReq : attReq;
  const benchMax = BENCH_LIMITS[role] || 0;

  if(starterCounts[role] >= starterMax && benchCounts[role] >= benchMax){
    const roleName = role === 'P' ? 'portieri' : role === 'D' ? 'difensori' : role === 'C' ? 'centrocampisti' : 'attaccanti';
    showToast(`Hai già raggiunto il massimo per i ${roleName} (${starterMax} titolari + ${benchMax} panchina)`, "error");
    return;
  }

  selectedPlayers.push(index);
  renderRoster();
  renderFormation();
  if(isMobile) renderMobileSlots();
}

function updateRosterUI(){
  document.querySelectorAll('#roster .player-card').forEach(c=>c.classList.remove('selected'));
  selectedPlayers.forEach(i=>{
    const el = document.getElementById(`p-${i}`);
    if(el) el.classList.add('selected');
  });
}

function loadTeam(){
  currentManager = document.getElementById("managerSelect").value;
  selectedPlayers = [];
  lastStarters = [];
  lastBench = [];
  disabledBlocks.clear();
  slotAssignments = {};
  clearSwitch();
  renderRoster();
  renderFormation();
  if(isMobile) renderMobileSlots();
  updateSwitchUI();
}
