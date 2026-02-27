/* SLOTS CONSTANTS - Role colors and helpers */

const roleColors = {P:'#e6b800',D:'#007bff',C:'#28a745',A:'#dc3545'};

function getRoleName(role){
  const names = {P:'Portieri', D:'Difensori', C:'Centrocampisti', A:'Attaccanti'};
  return names[role] || role;
}

function getRoleFromSlotId(id){
  return id.startsWith('GK') ? 'P' : id[0];
}
