import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const tablesToReset = [
  'sops',
  'rooms',
  'packages',
  'hotelInfos',
  'documents',
  'dutyTasks',
  'wallets',
  'expenses',
  'transactions',
  'itineraries',
  'jamaahList',
  'teamMembers',
  'attendanceLogs',
  'incidentLogs',
  'broadcasts',
  'groups',
  'taskChecklists'
];

tablesToReset.forEach(table => {
  const re = new RegExp(`useBiSync\\("${table}",`, 'g');
  code = code.replace(re, `useBiSync("${table}_v2",`);
  
  // For special case hooks
  const reCol = new RegExp(`collection\\(db, "${table}"\\)`, 'g');
  code = code.replace(reCol, `collection(db, "${table}_v2")`);
  
  const reDoc = new RegExp(`doc\\(db, "${table}",`, 'g');
  code = code.replace(reDoc, `doc(db, "${table}_v2",`);
});

fs.writeFileSync('src/App.tsx', code);
console.log('Migrated collections');
