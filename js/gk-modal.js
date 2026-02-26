/* STATE */
let pendingGkIndex = null;
let disabledBlocks = new Set(); // Blocchi disabilitati (altro blocco non selezionabile)

/* Funzioni per popup scelta portiere */
function showGkChoiceModal(blockName, selectedGk, clickedIndex){
  const modal = document.getElementById("gkChoiceModal");
  const choicesDiv = document.getElementById("gkChoices");
  document.getElementById("gkBlockName").textContent = blockName;
  
  const team = db[currentManager].players;
  const blockPlayers = team.filter(p => p.gkBlock === blockName);
  
  choicesDiv.innerHTML = "";
  blockPlayers.forEach(p => {
    const btn = document.createElement("button");
    btn.textContent = p.n;
    btn.style.padding = "10px 20px";
    btn.style.borderRadius = "8px";
    btn.style.border = "1px solid #e6e7ea";
    btn.style.background = "var(--card)";
    btn.style.cursor = "pointer";
    btn.style.fontWeight = "bold";
    btn.onclick = () => {
      const idx = team.indexOf(p);
      confirmGkSelection(idx);
    };
    choicesDiv.appendChild(btn);
  });
  
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  pendingGkIndex = clickedIndex;
}

function confirmGkSelection(index){
  closeGkModal();
  const team = db[currentManager].players;
  const player = team[index];
  
  // Aggiungi il portiere scelto
  selectedPlayers.push(index);
  
  // Disabilita gli ALTRI blocchi (non quello selezionato)
  if(player.gkBlock){
    const allBlocks = [...new Set(team.filter(p => p.isGkBlock).map(p => p.gkBlock))];
    allBlocks.forEach(block => {
      if(block !== player.gkBlock){
        disabledBlocks.add(block);
      }
    });
  }
  
  renderRoster();
  renderFormation();
  if(window.innerWidth < 768 && typeof renderMobileSlots === 'function'){
    renderMobileSlots();
  }
}

function closeGkModal(){
  document.activeElement.blur();
  const modal = document.getElementById("gkChoiceModal");
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  pendingGkIndex = null;
}
