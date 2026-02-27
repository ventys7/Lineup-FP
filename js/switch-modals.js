/* SWITCH MODALS - Modal open/close functions */

function openSwitchStarterModal(){
  if(!currentManager || !db[currentManager]) return;
  
  const team = db[currentManager].players;
  const starters = getSwitchStarters();
  
  let filteredStarters = starters;
  
  if(!switchPlus && switchBenchIndex !== null){
    const benchPlayer = team[switchBenchIndex];
    if(benchPlayer){
      filteredStarters = filteredStarters.filter(p => p.r === benchPlayer.r);
    }
  }
  
  if(switchPlus){
    filteredStarters = filteredStarters.filter(p => p.r !== 'P');
  }
  
  const listEl = document.getElementById('switchStarterList');
  listEl.innerHTML = '';
  
  if(filteredStarters.length === 0){
    listEl.innerHTML = '<div style="padding:20px;text-align:center;color:var(--muted)">Nessun titolare disponibile</div>';
  }
  
  filteredStarters.forEach(p => {
    const idx = team.indexOf(p);
    if(switchBenchIndex !== null && idx === switchBenchIndex) return;
    
    const div = document.createElement('div');
    div.className = 'picker-player' + (switchStarterIndex === idx ? ' selected' : '');
    div.innerHTML = `
      <div class="badge" style="background:${roleColors[p.r]}">${p.r}</div>
      <div class="player-info">
        <span class="name">${p.n}</span>
        <span class="team">${p.t || ''}</span>
      </div>
      ${switchStarterIndex === idx ? '<span style="color:var(--accent)">✓</span>' : ''}
    `;
    div.onclick = () => {
      if(!switchPlus && switchBenchIndex !== null){
        const benchPlayer = team[switchBenchIndex];
        if(benchPlayer && p.r !== benchPlayer.r){
          showToast("In modalità base i ruoli devono coincidere", "error");
          return;
        }
      }
      switchStarterIndex = idx;
      closeSwitchStarterModal();
      updateSwitchUI();
    };
    listEl.appendChild(div);
  });
  
  const modal = document.getElementById('switchStarterModal');
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  setModalOpen(true);
}

function closeSwitchStarterModal(){
  const modal = document.getElementById('switchStarterModal');
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  setModalOpen(false);
}

function openSwitchBenchModal(){
  if(!currentManager || !db[currentManager]) return;
  
  const team = db[currentManager].players;
  const bench = getSwitchBench();
  
  let filteredBench = bench;
  
  if(!switchPlus && switchStarterIndex !== null){
    const starterPlayer = team[switchStarterIndex];
    if(starterPlayer){
      filteredBench = filteredBench.filter(p => p.r === starterPlayer.r);
    }
  }
  
  if(switchPlus){
    filteredBench = filteredBench.filter(p => p.r !== 'P');
  }
  
  const listEl = document.getElementById('switchBenchList');
  listEl.innerHTML = '';
  
  if(filteredBench.length === 0){
    listEl.innerHTML = '<div style="padding:20px;text-align:center;color:var(--muted)">Nessun panchinario disponibile</div>';
  }
  
  filteredBench.forEach(p => {
    const idx = team.indexOf(p);
    if(switchStarterIndex !== null && idx === switchStarterIndex) return;
    
    const div = document.createElement('div');
    div.className = 'picker-player' + (switchBenchIndex === idx ? ' selected' : '');
    div.innerHTML = `
      <div class="badge" style="background:${roleColors[p.r]}">${p.r}</div>
      <div class="player-info">
        <span class="name">${p.n}</span>
        <span class="team">${p.t || ''}</span>
      </div>
      ${switchBenchIndex === idx ? '<span style="color:var(--accent)">✓</span>' : ''}
    `;
    div.onclick = () => {
      if(!switchPlus && switchStarterIndex !== null){
        const starterPlayer = team[switchStarterIndex];
        if(starterPlayer && p.r !== starterPlayer.r){
          showToast("In modalità base i ruoli devono coincidere", "error");
          return;
        }
      }
      switchBenchIndex = idx;
      closeSwitchBenchModal();
      updateSwitchUI();
    };
    listEl.appendChild(div);
  });
  
  const modal = document.getElementById('switchBenchModal');
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  setModalOpen(true);
}

function closeSwitchBenchModal(){
  const modal = document.getElementById('switchBenchModal');
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  setModalOpen(false);
}
