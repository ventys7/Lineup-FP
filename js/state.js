/* SHARED STATE - Used across multiple modules */
let currentManager = "";
let selectedPlayers = [];
let lastStarters = [];
let lastBench = [];
let slotAssignments = {};
let draggedPlayerIndex = null;
let draggedPlayerRole = null;
let isModalOpen = false;
let isMobile = window.innerWidth < 768;

/* Modal state management */
function setModalOpen(open){
  isModalOpen = open;
  if(open){
    document.body.classList.add('modal-open');
  } else {
    document.body.classList.remove('modal-open');
  }
}

/* Blocked GK blocks */
let disabledBlocks = new Set();
