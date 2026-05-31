import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const keysToReset = [
  'ji_sops',
  'ji_rooms',
  'ji_rooms_v3',
  'ji_rooms_v10',
  'ji_packages_v1',
  'ji_hotel_infos_v1',
  'ji_documents',
  'ji_documents_v10',
  'ji_broadcasts',
  'ji_duty_tasks',
  'ji_duty_tasks_v10',
  'ji_wallets_v6',
  'ji_wallets_v10',
  'ji_expenses_v6',
  'ji_expenses_v10',
  'ji_task_checklists_v1',
  'ji_transactions_v6',
  'ji_transactions_v10',
  'ji_groups_v10',
  'ji_groups_list_v3',
  'ji_jamaah_list_v5',
  'ji_jamaah_list_v10',
  'ji_itineraries_v3',
  'ji_itineraries_v10',
  'ji_team_members_v3',
  'ji_attendance_logs',
  'ji_attendance_v10',
  'ji_incident_logs',
  'ji_incident_v10'
];

keysToReset.forEach(key => {
  const re = new RegExp(`'${key}_reset1'`, 'g');
  code = code.replace(re, `'${key}_reset2'`);
  const re2 = new RegExp(`"${key}_reset1"`, 'g');
  code = code.replace(re2, `"${key}_reset2"`);
});

fs.writeFileSync('src/App.tsx', code);
console.log('Renamed to reset2');
