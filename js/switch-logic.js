/* SWITCH LOGIC - Pure functions for getting starters/bench */

function clearSwitch(){
  switchStarterIndex = null;
  switchBenchIndex = null;
  if(typeof updateSwitchUI === 'function') updateSwitchUI();
}

function getStarters(){
  const module = document.getElementById("moduleSelect").value;
  const defReq = parseInt(module[0],10);
  const cenReq = parseInt(module[1],10);
  const attReq = parseInt(module[2],10);
  
  const team = db[currentManager]?.players || [];
  const assignedPlayers = {};
  const assignedIndices = new Set();
  
  for(const slotKey in slotAssignments){
    const playerIdx = slotAssignments[slotKey];
    if(selectedPlayers.includes(playerIdx) && slotKey.startsWith('starter-')){
      assignedPlayers[slotKey] = team[playerIdx];
      assignedIndices.add(playerIdx);
    }
  }
  
  const unassignedPlayers = selectedPlayers.filter(i => !assignedIndices.has(i) && i >= 0 && i < team.length).map(i => team[i]);
  
  let counts = {P:0,D:0,C:0,A:0};
  let starters = [];

  const gks = unassignedPlayers.filter(p=>p.r==="P");
  gks.forEach(p=>{ if(counts.P < 1){ starters.push(p); counts.P++; } });

  const defs = unassignedPlayers.filter(p=>p.r==="D");
  defs.forEach(p=>{ if(counts.D < defReq){ starters.push(p); counts.D++; } });

  const cents = unassignedPlayers.filter(p=>p.r==="C");
  cents.forEach(p=>{ if(counts.C < cenReq){ starters.push(p); counts.C++; } });

  const atts = unassignedPlayers.filter(p=>p.r==="A");
  atts.forEach(p=>{ if(counts.A < attReq){ starters.push(p); counts.A++; } });

  Object.values(assignedPlayers).forEach(p => {
    if(!starters.includes(p)) starters.push(p);
  });

  return starters;
}

function getBench(){
  const module = document.getElementById("moduleSelect").value;
  const defReq = parseInt(module[0],10);
  const cenReq = parseInt(module[1],10);
  const attReq = parseInt(module[2],10);
  
  const team = db[currentManager]?.players || [];
  const assignedBenchPlayers = {};
  const assignedIndices = new Set();
  
  for(const slotKey in slotAssignments){
    const playerIdx = slotAssignments[slotKey];
    if(selectedPlayers.includes(playerIdx) && slotKey.startsWith('bench-')){
      assignedBenchPlayers[slotKey] = team[playerIdx];
      assignedIndices.add(playerIdx);
    }
  }
  
  const unassignedPlayers = selectedPlayers.filter(i => !assignedIndices.has(i) && i >= 0 && i < team.length).map(i => team[i]);
  
  let counts = {P:0,D:0,C:0,A:0};
  let bench = [];

  const gks = unassignedPlayers.filter(p=>p.r==="P");
  gks.forEach(p=>{ bench.push(p); });

  const defs = unassignedPlayers.filter(p=>p.r==="D");
  defs.forEach(p=>{ if(counts.D < 3){ bench.push(p); counts.D++; } });

  const cents = unassignedPlayers.filter(p=>p.r==="C");
  cents.forEach(p=>{ if(counts.C < 3){ bench.push(p); counts.C++; } });

  const atts = unassignedPlayers.filter(p=>p.r==="A");
  atts.forEach(p=>{ if(counts.A < 3){ bench.push(p); counts.A++; } });

  Object.values(assignedBenchPlayers).forEach(p => {
    if(!bench.includes(p)) bench.push(p);
  });

  return bench;
}

function getSwitchStarters(){
  if(!currentManager || !db[currentManager]) return [];
  const team = db[currentManager].players;
  
  const starterIndices = new Set();
  for(const slotKey in slotAssignments){
    if(slotKey.startsWith('starter-')){
      starterIndices.add(slotAssignments[slotKey]);
    }
  }
  
  if(starterIndices.size === 0){
    return getStarters();
  }
  
  return Array.from(starterIndices).map(i => team[i]).filter(p => p);
}

function getSwitchBench(){
  if(!currentManager || !db[currentManager]) return [];
  const team = db[currentManager].players;
  
  const benchIndices = new Set();
  for(const slotKey in slotAssignments){
    if(slotKey.startsWith('bench-')){
      benchIndices.add(slotAssignments[slotKey]);
    }
  }
  
  const starterIndices = new Set();
  for(const slotKey in slotAssignments){
    if(slotKey.startsWith('starter-')){
      starterIndices.add(slotAssignments[slotKey]);
    }
  }
  
  const unassigned = selectedPlayers.filter(i => !starterIndices.has(i) && !benchIndices.has(i)).map(i => team[i]);
  
  if(benchIndices.size === 0 && unassigned.length === 0){
    return getBench();
  }
  
  const result = Array.from(benchIndices).map(i => team[i]).filter(p => p);
  unassigned.forEach(p => { if(!result.includes(p)) result.push(p); });
  return result;
}

function getStarterIndexFromSwitch(){
  return switchStarterIndex;
}

function getBenchIndexFromSwitch(){
  return switchBenchIndex;
}
