function getMobileSlotContainer(slotId, isStarter){
  if(isStarter){
    return document.getElementById('mobileStartersSlots');
  }
  return document.getElementById('mobileBenchSlots');
}

function renderMobileSlots(){
  if(!currentManager || !db[currentManager]) return;
  
  const module = document.getElementById("moduleSelect").value;
  const defReq = parseInt(module[0],10);
  const cenReq = parseInt(module[1],10);
  const attReq = parseInt(module[2],10);
  
  const team = db[currentManager].players;
  
  const assignedPlayers = {};
  const assignedIndices = new Set();
  
  for(const slotKey in slotAssignments){
    const playerIdx = slotAssignments[slotKey];
    if(selectedPlayers.includes(playerIdx)){
      assignedPlayers[slotKey] = team[playerIdx];
      assignedIndices.add(playerIdx);
    } else {
      delete slotAssignments[slotKey];
    }
  }
  
  const unassignedPlayers = selectedPlayers.filter(i => !assignedIndices.has(i)).map(i => team[i]);
  
  let counts = {P:0,D:0,C:0,A:0};
  let starters = [];
  let bench = [];

  const gks = unassignedPlayers.filter(p=>p.r==="P");
  gks.forEach(p=>{ if(counts.P < 1){ starters.push(p); counts.P++; } else bench.push(p); });

  const defs = unassignedPlayers.filter(p=>p.r==="D");
  defs.forEach(p=>{ if(counts.D < defReq){ starters.push(p); counts.D++; } else bench.push(p); });

  const cents = unassignedPlayers.filter(p=>p.r==="C");
  cents.forEach(p=>{ if(counts.C < cenReq){ starters.push(p); counts.C++; } else bench.push(p); });

  const atts = unassignedPlayers.filter(p=>p.r==="A");
  atts.forEach(p=>{ if(counts.A < attReq){ starters.push(p); counts.A++; } else bench.push(p); });

  lastStarters = starters.slice();
  lastBench = bench.slice();

  const startersContainer = document.getElementById('mobileStartersSlots');
  startersContainer.innerHTML = '';
  
  const benchContainer = document.getElementById('mobileBenchSlots');
  benchContainer.innerHTML = '';

  const gkAssigned = assignedPlayers['starter-GK1'];
  const gkStarter = gkAssigned || starters.find(p=>p.r==="P");
  startersContainer.appendChild(createMobileSlot('GK1', gkStarter, true));
  
  for(let i=1; i<=defReq; i++){
    const slotKey = 'starter-D'+i;
    const p = assignedPlayers[slotKey] || starters.find(p => p.r === 'D' && starters.filter(s => s.r === 'D').indexOf(p) === i-1);
    startersContainer.appendChild(createMobileSlot('D'+i, p, true));
  }
  
  for(let i=1; i<=cenReq; i++){
    const slotKey = 'starter-C'+i;
    const p = assignedPlayers[slotKey] || starters.find(p => p.r === 'C' && starters.filter(s => s.r === 'C').indexOf(p) === i-1);
    startersContainer.appendChild(createMobileSlot('C'+i, p, true));
  }
  
  for(let i=1; i<=attReq; i++){
    const slotKey = 'starter-A'+i;
    const p = assignedPlayers[slotKey] || starters.find(p => p.r === 'A' && starters.filter(s => s.r === 'A').indexOf(p) === i-1);
    startersContainer.appendChild(createMobileSlot('A'+i, p, true));
  }

  if(gkStarter){
    benchContainer.appendChild(createMobileSlot('GK1', {n:gkStarter.t,r:'P',isTeamName:true}, false));
  } else {
    benchContainer.appendChild(createMobileSlot('GK1', null, false));
  }
  
  const starterGkBlock = gkStarter ? gkStarter.gkBlock : null;
  if(gkStarter && starterGkBlock){
    const otherBlock = team.find(p => p.r === "P" && p.isGkBlock && p.gkBlock !== starterGkBlock && !selectedPlayers.includes(team.indexOf(p)));
    if(otherBlock){
      benchContainer.appendChild(createMobileSlot('GK2', {n:otherBlock.t,r:'P',isTeamName:true}, false));
    } else {
      benchContainer.appendChild(createMobileSlot('GK2', null, false));
    }
  } else {
    benchContainer.appendChild(createMobileSlot('GK2', null, false));
  }

  for(let i=1; i<=3; i++){
    const slotKey = 'bench-D'+i;
    const p = assignedPlayers[slotKey] || bench.find(p => p.r === 'D' && bench.filter(b => b.r === 'D').indexOf(p) === i-1);
    benchContainer.appendChild(createMobileSlot('D'+i, p, false));
  }
  
  for(let i=1; i<=3; i++){
    const slotKey = 'bench-C'+i;
    const p = assignedPlayers[slotKey] || bench.find(p => p.r === 'C' && bench.filter(b => b.r === 'C').indexOf(p) === i-1);
    benchContainer.appendChild(createMobileSlot('C'+i, p, false));
  }
  
  for(let i=1; i<=3; i++){
    const slotKey = 'bench-A'+i;
    const p = assignedPlayers[slotKey] || bench.find(p => p.r === 'A' && bench.filter(b => b.r === 'A').indexOf(p) === i-1);
    benchContainer.appendChild(createMobileSlot('A'+i, p, false));
  }

  let gkBenchFilled = 0;
  const mobileGkStarter = starters.find(p=>p.r==="P");
  if(mobileGkStarter) gkBenchFilled = 1;
  const mobileStarterGkBlock = mobileGkStarter ? mobileGkStarter.gkBlock : null;
  if(mobileGkStarter && mobileStarterGkBlock){
    const otherBlock = team.find(p => p.r === "P" && p.isGkBlock && p.gkBlock !== mobileStarterGkBlock && !selectedPlayers.includes(team.indexOf(p)));
    if(otherBlock) gkBenchFilled = 2;
  }
  
  document.getElementById("starterCount").textContent = `(${starters.length}/11)`;
  document.getElementById("benchCount").textContent = `(${bench.length + gkBenchFilled}/11)`;
  
  if(document.getElementById("mobileStarterCount")){
    document.getElementById("mobileStarterCount").textContent = `(${starters.length}/11)`;
  }
  if(document.getElementById("mobileBenchCount")){
    document.getElementById("mobileBenchCount").textContent = `(${bench.length + gkBenchFilled}/11)`;
  }
}

function createMobileSlot(slotId, player, isStarter){
  const div = document.createElement('div');
  div.className = 'slot mobile-slot ' + (player ? '' : 'empty');
  div.id = 'mobile-' + slotId;
  
  const role = slotId.startsWith('GK') ? 'P' : slotId[0];
  const color = roleColors[role];
  
  if(player){
    div.innerHTML = `<div class="slot-content">
      <div class="badge" style="background:${color}">${role}</div>
      <div class="player-meta">${player.isTeamName ? player.n : player.n}</div>
    </div>`;
  } else {
    div.innerHTML = `<div class="slot-content">
      <div class="badge" style="background:${color}">${role}</div>
      <div class="player-meta" style="color:var(--muted)">+</div>
    </div>`;
  }
  
  div.onclick = () => handleMobileSlotClick(slotId, role, isStarter, player);
  return div;
}

function handleMobileSlotClick(slotId, role, isStarter, currentPlayer){
  if(!currentManager) return;
  
  if(role === 'P'){
    currentPickerSlot = {slotId, role, isStarter, currentPlayer};
    showGkChoiceModalForMobile(slotId, isStarter, currentPlayer);
    return;
  }
  
  if(currentPlayer && currentPlayer.isTeamName){
    showSlotPicker(role, null);
    return;
  }
  
  currentPickerSlot = {slotId, role, isStarter, currentPlayer};
  showSlotPicker(role, currentPlayer);
}
