const roleColors = {P:'#e6b800',D:'#007bff',C:'#28a745',A:'#dc3545'};

function getRoleName(role){
  const names = {P:'Portieri', D:'Difensori', C:'Centrocampisti', A:'Attaccanti'};
  return names[role] || role;
}

function getRoleFromSlotId(id){
  return id.startsWith('GK') ? 'P' : id[0];
}

function openSlotPicker(slotType, slotId){
  if(!currentManager) return;
  
  const role = slotId.startsWith('GK') ? 'P' : slotId[0];
  
  if(role === 'P'){
    showGkChoiceModalForMobile(slotId, slotType === 'starter');
    return;
  }
  
  const slotKey = slotType + '-' + slotId;
  const assignedIdx = slotAssignments[slotKey];
  const team = db[currentManager].players;
  const currentPlayer = assignedIdx !== undefined ? team[assignedIdx] : null;
  
  currentPickerSlot = {slotId, role, isStarter: slotType === 'starter', currentPlayer};
  showSlotPicker(role, currentPlayer);
}

function renderFormation(){
  const module = document.getElementById("moduleSelect").value;
  const defReq = parseInt(module[0],10);
  const cenReq = parseInt(module[1],10);
  const attReq = parseInt(module[2],10);

  const startersContainer = document.getElementById("startersSlots");
  startersContainer.innerHTML = "";
  const starterSlots = {};
  
  starterSlots["GK1"] = document.createElement("div");
  starterSlots["GK1"].className = "slot empty";
  starterSlots["GK1"].id = "starter-GK1";
  starterSlots["GK1"].style.cursor = "pointer";
  starterSlots["GK1"].onclick = () => openSlotPicker('starter', 'GK1');
  starterSlots["GK1"].ondragover = (e) => { e.preventDefault(); starterSlots["GK1"].classList.add('drag-over'); };
  starterSlots["GK1"].ondragleave = () => { starterSlots["GK1"].classList.remove('drag-over'); };
  starterSlots["GK1"].ondrop = (e) => handleDrop(e, 'starter', 'GK1');
  startersContainer.appendChild(starterSlots["GK1"]);
  
  for(let i=1; i<=defReq; i++){
    starterSlots["D"+i] = document.createElement("div");
    starterSlots["D"+i].className = "slot empty";
    starterSlots["D"+i].id = "starter-D"+i;
    starterSlots["D"+i].style.cursor = "pointer";
    starterSlots["D"+i].onclick = () => openSlotPicker('starter', 'D'+i);
    starterSlots["D"+i].ondragover = (e) => { e.preventDefault(); starterSlots["D"+i].classList.add('drag-over'); };
    starterSlots["D"+i].ondragleave = () => { starterSlots["D"+i].classList.remove('drag-over'); };
    starterSlots["D"+i].ondrop = (e) => handleDrop(e, 'starter', 'D'+i);
    startersContainer.appendChild(starterSlots["D"+i]);
  }
  
  for(let i=1; i<=cenReq; i++){
    starterSlots["C"+i] = document.createElement("div");
    starterSlots["C"+i].className = "slot empty";
    starterSlots["C"+i].id = "starter-C"+i;
    starterSlots["C"+i].style.cursor = "pointer";
    starterSlots["C"+i].onclick = () => openSlotPicker('starter', 'C'+i);
    starterSlots["C"+i].ondragover = (e) => { e.preventDefault(); starterSlots["C"+i].classList.add('drag-over'); };
    starterSlots["C"+i].ondragleave = () => { starterSlots["C"+i].classList.remove('drag-over'); };
    starterSlots["C"+i].ondrop = (e) => handleDrop(e, 'starter', 'C'+i);
    startersContainer.appendChild(starterSlots["C"+i]);
  }
  
  for(let i=1; i<=attReq; i++){
    starterSlots["A"+i] = document.createElement("div");
    starterSlots["A"+i].className = "slot empty";
    starterSlots["A"+i].id = "starter-A"+i;
    starterSlots["A"+i].style.cursor = "pointer";
    starterSlots["A"+i].onclick = () => openSlotPicker('starter', 'A'+i);
    starterSlots["A"+i].ondragover = (e) => { e.preventDefault(); starterSlots["A"+i].classList.add('drag-over'); };
    starterSlots["A"+i].ondragleave = () => { starterSlots["A"+i].classList.remove('drag-over'); };
    starterSlots["A"+i].ondrop = (e) => handleDrop(e, 'starter', 'A'+i);
    startersContainer.appendChild(starterSlots["A"+i]);
  }

  Object.keys(starterSlots).forEach(id=>{
    const role = getRoleFromSlotId(id);
    const color = roleColors[role] || '#dc3545';
    starterSlots[id].innerHTML = `<div class="slot-content">
      <div class="badge" style="background:${color}">${role}</div>
      <div class="player-meta" style="color:var(--muted)">vuoto</div>
    </div>`;
    starterSlots[id].classList.add("empty");
  });

  if(!currentManager || !db[currentManager]) return;

  const benchSlots = {
    GK1: document.getElementById("slot-GK1"),
    GK2: document.getElementById("slot-GK2"),
    D1: document.getElementById("slot-D1"),
    D2: document.getElementById("slot-D2"),
    D3: document.getElementById("slot-D3"),
    C1: document.getElementById("slot-C1"),
    C2: document.getElementById("slot-C2"),
    C3: document.getElementById("slot-C3"),
    A1: document.getElementById("slot-A1"),
    A2: document.getElementById("slot-A2"),
    A3: document.getElementById("slot-A3")
  };
  
  Object.keys(benchSlots).forEach(id => {
    const slotKey = 'bench-' + id;
    benchSlots[id].style.cursor = "pointer";
    benchSlots[id].onclick = () => openSlotPicker('bench', id);
    benchSlots[id].ondragover = (e) => { e.preventDefault(); benchSlots[id].classList.add('drag-over'); };
    benchSlots[id].ondragleave = () => { benchSlots[id].classList.remove('drag-over'); };
    benchSlots[id].ondrop = (e) => handleDrop(e, 'bench', id);
  });
          
  Object.keys(benchSlots).forEach(id=>{
    const role = getRoleFromSlotId(id);
    const color = roleColors[role] || '#dc3545';
    benchSlots[id].innerHTML = `<div class="slot-content">
      <div class="badge" style="background:${color}">${role}</div>
      <div class="player-meta" style="color:var(--muted)">vuoto</div>
    </div>`;
    benchSlots[id].classList.add("empty");
  });
         
  const team = db[currentManager].players;
  
  const assignedPlayers = {};
  const assignedBenchPlayers = {};
  
  for(const slotKey in slotAssignments){
    const playerIdx = slotAssignments[slotKey];
    if(selectedPlayers.includes(playerIdx)){
      if(slotKey.startsWith('starter-')){
        assignedPlayers[slotKey] = team[playerIdx];
      } else if(slotKey.startsWith('bench-')){
        assignedBenchPlayers[slotKey] = team[playerIdx];
      }
    } else {
      delete slotAssignments[slotKey];
    }
  }
  
  const assignedIndices = new Set();
  for(const key in slotAssignments){
    assignedIndices.add(slotAssignments[key]);
  }
  
  const unassignedPlayers = selectedPlayers.filter(i => !assignedIndices.has(i) && i >= 0 && i < team.length).map(i => team[i]);
  
  let counts = {P:0,D:0,C:0,A:0};
  let starters = [];
  let bench = [];

  const gks = unassignedPlayers.filter(p=>p.r==="P");
  gks.forEach(p=>{
    if(counts.P < 1){ starters.push(p); counts.P++; }
    else bench.push(p);
  });

  const defs = unassignedPlayers.filter(p=>p.r==="D");
  defs.forEach(p=>{
    if(counts.D<defReq){ starters.push(p); counts.D++; }
    else bench.push(p);
  });

  const cents = unassignedPlayers.filter(p=>p.r==="C");
  cents.forEach(p=>{
    if(counts.C<cenReq){ starters.push(p); counts.C++; }
    else bench.push(p);
  });

  const atts = unassignedPlayers.filter(p=>p.r==="A");
  atts.forEach(p=>{
    if(counts.A<attReq){ starters.push(p); counts.A++; }
    else bench.push(p);
  });

  lastStarters = starters.slice();
  lastBench = bench.slice();

  let starterRoleCounts = {P:0,D:0,C:0,A:0};
  
  for(const slotKey in assignedPlayers){
    if(slotKey.startsWith('starter-')){
      const slotId = slotKey.replace('starter-', '');
      const p = assignedPlayers[slotKey];
      const playerIdx = team.indexOf(p);
      if(starterSlots[slotId]){
        starterSlots[slotId].innerHTML = `<div class="slot-content">
          <div class="badge" style="background:${roleColors[p.r]}">${p.r}</div>
          <div class="player-meta">${p.n}</div></div>`;
        starterSlots[slotId].classList.remove("empty");
        starterSlots[slotId].draggable = true;
        starterSlots[slotId].ondragstart = (e) => { 
          draggedPlayerIndex = playerIdx; 
          draggedPlayerRole = p.r; 
          starterSlots[slotId].classList.add('dragging'); 
        };
        starterSlots[slotId].ondragend = () => { 
          draggedPlayerIndex = null; 
          draggedPlayerRole = null; 
          starterSlots[slotId].classList.remove('dragging'); 
        };
      }
    }
  }
  
  starters.forEach(p=>{
    const role = p.r;
    let slotId;
    if(role === 'P'){
      slotId = "GK1";
    } else {
      starterRoleCounts[role]++;
      slotId = role + starterRoleCounts[role];
    }
    if(assignedPlayers['starter-' + slotId]) return;
    if(starterSlots[slotId]){
      starterSlots[slotId].innerHTML = `<div class="slot-content">
        <div class="badge" style="background:${roleColors[role]}">${role}</div>
        <div class="player-meta">${p.n}</div></div>`;
      starterSlots[slotId].classList.remove("empty");
    }
  });

  const benchRoleSlots = { P:["GK1","GK2"], D:["D1","D2","D3"], C:["C1","C2","C3"], A:["A1","A2","A3"] };
  let benchRoleCounts = {P:0,D:0,C:0,A:0};
  
  for(const slotKey in assignedBenchPlayers){
    const slotId = slotKey.replace('bench-', '');
    const p = assignedBenchPlayers[slotKey];
    const playerIdx = team.indexOf(p);
    if(benchSlots[slotId]){
      benchSlots[slotId].innerHTML = `<div class="slot-content">
        <div class="badge" style="background:${roleColors[p.r]}">${p.r}</div>
        <div class="player-meta">${p.n}</div></div>`;
      benchSlots[slotId].classList.remove("empty");
      benchSlots[slotId].draggable = true;
      benchSlots[slotId].ondragstart = (e) => { 
        draggedPlayerIndex = playerIdx; 
        draggedPlayerRole = p.r; 
        benchSlots[slotId].classList.add('dragging'); 
      };
      benchSlots[slotId].ondragend = () => { 
        draggedPlayerIndex = null; 
        draggedPlayerRole = null; 
        benchSlots[slotId].classList.remove('dragging'); 
      };
      benchRoleCounts[p.r] = (benchRoleCounts[p.r] || 0) + 1;
    }
  }
  
  const gkStarter = starters.find(p=>p.r==="P");
  
  if(assignedBenchPlayers['bench-GK1']){
  } else {
    if(gkStarter && benchSlots["GK1"]){
      const gkDisplay = gkStarter.t || "Portiere";
      benchSlots["GK1"].innerHTML = `<div class="slot-content">
        <div class="badge P">P</div>
        <div class="player-meta">${gkDisplay}</div></div>`;
      benchSlots["GK1"].classList.remove("empty");
      benchRoleCounts.P = 1;
    }
  }
  
  const starterGkBlock = gkStarter ? gkStarter.gkBlock : null;
  
  if(assignedBenchPlayers['bench-GK2']){
  } else if(gkStarter && starterGkBlock && benchSlots["GK2"]){
    const otherBlock = team.find(p => 
      p.r === "P" && 
      p.isGkBlock && 
      p.gkBlock !== starterGkBlock &&
      !selectedPlayers.includes(team.indexOf(p))
    );
    
    if(otherBlock){
      const gk2Display = otherBlock.t || "Portiere";
      benchSlots["GK2"].innerHTML = `<div class="slot-content">
        <div class="badge P">P</div>
        <div class="player-meta">${gk2Display}</div></div>`;
      benchSlots["GK2"].classList.remove("empty");
      benchRoleCounts.P = 2;
    }
  }
  
  bench.filter(p => p.r !== "P").forEach(p=>{
    const role = p.r;
    const slotId = benchRoleSlots[role][benchRoleCounts[role]];
    const playerIdx = team.indexOf(p);
    if(assignedBenchPlayers['bench-' + slotId]) return;
    if(slotId && benchSlots[slotId]){
      benchSlots[slotId].innerHTML = `<div class="slot-content">
        <div class="badge ${role}">${role}</div>
        <div class="player-meta">${p.n}</div></div>`;
      benchSlots[slotId].classList.remove("empty");
      benchSlots[slotId].draggable = true;
      benchSlots[slotId].ondragstart = (e) => { 
        draggedPlayerIndex = playerIdx; 
        draggedPlayerRole = p.r; 
        benchSlots[slotId].classList.add('dragging'); 
      };
      benchSlots[slotId].ondragend = () => { 
        draggedPlayerIndex = null; 
        draggedPlayerRole = null; 
        benchSlots[slotId].classList.remove('dragging'); 
      };
      benchRoleCounts[role]++;
    }
  });

  const starterCount = starters.length + Object.keys(assignedPlayers).filter(k => k.startsWith('starter-')).length;
  
  let gkBenchFilled = 0;
  if(gkStarter) gkBenchFilled = 1;
  if(gkStarter && starterGkBlock){
    const otherBlock = team.find(p => p.r === "P" && p.isGkBlock && p.gkBlock !== starterGkBlock && !selectedPlayers.includes(team.indexOf(p)));
    if(otherBlock) gkBenchFilled = 2;
  }
  
  const benchCount = bench.length + Object.keys(assignedBenchPlayers).length + gkBenchFilled;
  document.getElementById("starterCount").textContent = `(${starterCount}/11)`;
  document.getElementById("benchCount").textContent = `(${benchCount}/11)`;
  
  if(document.getElementById("mobileStarterCount")){
    document.getElementById("mobileStarterCount").textContent = `(${starterCount}/11)`;
  }
  if(document.getElementById("mobileBenchCount")){
    document.getElementById("mobileBenchCount").textContent = `(${benchCount}/11)`;
  }
}
