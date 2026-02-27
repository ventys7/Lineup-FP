function buildOutputText(){
  try {
    if(!currentManager) return "";
    const module = document.getElementById("moduleSelect").value;
    const formattedModule = module[0]+"-"+module[1]+"-"+module[2];
    const roleOrder = {P:0,D:1,C:2,A:3};

    const team = db[currentManager].players;
    
    const starters = [];
    const bench = [];
    
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
      }
    }
    
    const assignedIndices = new Set(Object.values(slotAssignments));
    const unassignedPlayers = selectedPlayers
      .filter(i => !assignedIndices.has(i) && i >= 0 && i < team.length)
      .map(i => team[i]);
    
    const gkAssigned = assignedPlayers['starter-GK1'];
    if(gkAssigned){
      starters.push(gkAssigned);
    } else {
      const gks = unassignedPlayers.filter(p=>p.r==="P");
      if(gks.length > 0) starters.push(gks[0]);
    }
    
    const defReq = parseInt(module[0],10);
    const cenReq = parseInt(module[1],10);
    const attReq = parseInt(module[2],10);
    
    for(let i=1; i<=defReq; i++){
      const p = assignedPlayers['starter-D'+i];
      if(p) starters.push(p);
    }
    const defs = unassignedPlayers.filter(p=>p.r==="D");
    const defStartersCount = starters.filter(p=>p.r==="D").length;
    for(let i=defStartersCount; i<defReq && i<defs.length; i++){
      starters.push(defs[i]);
    }
    
    for(let i=1; i<=cenReq; i++){
      const p = assignedPlayers['starter-C'+i];
      if(p) starters.push(p);
    }
    const cents = unassignedPlayers.filter(p=>p.r==="C");
    const cenStartersCount = starters.filter(p=>p.r==="C").length;
    for(let i=cenStartersCount; i<cenReq && i<cents.length; i++){
      starters.push(cents[i]);
    }
    
    for(let i=1; i<=attReq; i++){
      const p = assignedPlayers['starter-A'+i];
      if(p) starters.push(p);
    }
    const atts = unassignedPlayers.filter(p=>p.r==="A");
    const attStartersCount = starters.filter(p=>p.r==="A").length;
    for(let i=attStartersCount; i<attReq && i<atts.length; i++){
      starters.push(atts[i]);
    }
    
    for(const slotKey in assignedBenchPlayers){
      bench.push(assignedBenchPlayers[slotKey]);
    }
    const benchPlayers = unassignedPlayers.filter(p => !starters.includes(p));
    benchPlayers.forEach(p => bench.push(p));
    bench.sort((a,b)=> (roleOrder[a.r] - roleOrder[b.r]));

    function getSwitchSuffix(player){
      const idx = team.indexOf(player);
      if(switchStarterIndex === idx && switchBenchIndex !== null) return switchPlus ? ' (s+)' : ' (s)';
      if(switchBenchIndex === idx && switchStarterIndex !== null) return switchPlus ? ' (s+)' : ' (s)';
      return '';
    }

    let text = `⚽ **${currentManager.toUpperCase()}**\n`;
    text += `Mod: ${formattedModule}\n\n`;

    text += `TITOLARI:\n`;
    starters.forEach(p => text += `▪️ ${p.n}${getSwitchSuffix(p)}\n`);

    text += `\nPANCHINA:\n`;
    
    const gkStarter = starters.find(p => p.r === "P");
    if(gkStarter){
      text += `- ${gkStarter.t || "Portiere"}\n`;
    }
    
    const starterGkBlock = gkStarter ? gkStarter.gkBlock : null;
    if(gkStarter && starterGkBlock){
      const otherBlock = team.find(p => 
        p.r === "P" && 
        p.isGkBlock && 
        p.gkBlock !== starterGkBlock &&
        !selectedPlayers.includes(team.indexOf(p))
      );
      if(otherBlock){
        text += `- ${otherBlock.t || "Portiere"}\n`;
      }
    }
    
    bench.filter(p => p.r !== "P").forEach(p => {
      text += `- ${p.n}${getSwitchSuffix(p)}\n`;
    });

    return text;
  } catch(e) {
    console.error("buildOutputText error:", e);
    return "Errore nella generazione del testo";
  }
}

function openModal(){
  if(!currentManager){ showToast("Seleziona una squadra prima", "error"); return; }
  document.getElementById("outputText").value = buildOutputText();
  const modal = document.getElementById("outputModal");
  modal.classList.add("show"); modal.setAttribute("aria-hidden","false");
  setModalOpen(true);
}
function closeModal(){
  const modal = document.getElementById("outputModal");
  modal.classList.remove("show"); modal.setAttribute("aria-hidden","true");
  setModalOpen(false);
}
document.getElementById("openModalBtn").addEventListener("click", openModal);
document.getElementById("closeModalBtn").addEventListener("click", closeModal);
document.getElementById("copyModalBtn").addEventListener("click", ()=>{
  const txt = document.getElementById("outputText").value;
  
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(()=> {
      showToast("Formazione copiata negli appunti", "success");
    }).catch(() => {
      fallbackCopy(txt);
    });
  } else {
    fallbackCopy(txt);
  }
});

function fallbackCopy(text){
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.width = '2em';
  textarea.style.height = '2em';
  textarea.style.padding = '0';
  textarea.style.border = 'none';
  textarea.style.outline = 'none';
  textarea.style.boxShadow = 'none';
  textarea.style.background = 'transparent';
  document.body.appendChild(textarea);
  
  try {
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    if(success){
      showToast("Formazione copiata negli appunti", "success");
    } else {
      copyViaSelection(text);
    }
  } catch(err) {
    document.body.removeChild(textarea);
    copyViaSelection(text);
  }
}

function copyViaSelection(text){
  const temp = document.createElement('div');
  temp.style.position = 'fixed';
  temp.style.opacity = '0';
  temp.style.top = '0';
  temp.style.left = '0';
  temp.textContent = text;
  document.body.appendChild(temp);
  
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(temp);
  selection.removeAllRanges();
  selection.addRange(range);
  
  try {
    const success = document.execCommand('copy');
    selection.removeAllRanges();
    document.body.removeChild(temp);
    if(success){
      showToast("Formazione copiata negli appunti", "success");
    } else {
      showToast("Copia non supportata su questo browser", "error");
    }
  } catch(err) {
    selection.removeAllRanges();
    document.body.removeChild(temp);
    showToast("Copia fallita", "error");
  }
}
document.getElementById("fabCopy").addEventListener("click", openModal);
