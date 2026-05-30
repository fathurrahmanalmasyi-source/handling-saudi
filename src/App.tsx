import React, { useState, useEffect } from 'react';
import { 
  User, Hotel, LogOut, Bell, Folder, Briefcase, Calendar, BookOpen, 
  Settings, CheckCircle, Smartphone, MapPin, Send, AlertTriangle, 
  Menu, X, Sparkles, ChevronRight, FileText, Compass, Info, Download, Eye, EyeOff, HelpCircle, Edit2,
  Files, Bed, UserCheck, Users, FileSpreadsheet, RotateCw, Wallet, Clock, DollarSign, Camera, ShieldAlert
} from 'lucide-react';

function BedHouseIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} id="bed-house-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        {/* House shape */}
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        {/* Bed frame inside */}
        <path d="M7 14h10" />
        <path d="M7 17h10" />
        <path d="M7 14v3" />
        <path d="M17 14v3" />
        {/* Pillow */}
        <circle cx="9" cy="11" r="0.75" />
      </svg>
    </div>
  );
}

// Types and Defaults
import { 
  UserRole, SOPDoc, RoomManifest, PackageDetail, DocumentGroup, 
  BroadcastMessage, DutyTask, WalletAccount, FieldExpenseReport, 
  CashflowTransaction,
  INITIAL_SOPS, INITIAL_ROOMLIST, INITIAL_PACKAGES, INITIAL_DOCUMENTS, 
  INITIAL_BROADCASTS, INITIAL_DUTY_TASKS, INITIAL_WALLETS, 
  INITIAL_EXPENSE_REPORTS, INITIAL_CASHFLOW, TEAMS 
} from './types';

// Components
import Login from './components/Login';
import SaudiClockWidget from './components/SaudiClockWidget';
import SOPList from './components/SOPList';
import RoomListManager from './components/RoomListManager';
import FieldReport from './components/FieldReport';
import ManagerSchedule from './components/ManagerSchedule';
import ManagerCashflow from './components/ManagerCashflow';

import ManagerManifest, { Jamaah } from './components/ManagerManifest';
import ManagerItinerary, { ItineraryItem } from './components/ManagerItinerary';
import ManagerDocumentEditor from './components/ManagerDocumentEditor';
import ManagerStaffTeam, { TeamMember } from './components/ManagerStaffTeam';
import ManagerAppPanel from './components/ManagerAppPanel';
import { INITIAL_6_GROUPS_ITINERARIES } from './data/initialItineraries';

export default function App() {
  // Authentication states
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('ji_username') || null;
  });
  const [currentRole, setCurrentRole] = useState<UserRole | null>(() => {
    return (localStorage.getItem('ji_role') as UserRole) || null;
  });

  // Database / Interactive State in LocalStorage to persist changes
  const [sops, setSops] = useState<SOPDoc[]>(() => {
    const saved = localStorage.getItem('ji_sops');
    return saved ? JSON.parse(saved) : INITIAL_SOPS;
  });

  const [rooms, setRooms] = useState<RoomManifest[]>(() => {
    const saved = localStorage.getItem('ji_rooms_v3');
    let loadedRooms: RoomManifest[] | null = null;
    if (saved) {
      try {
        loadedRooms = JSON.parse(saved);
      } catch (e) {
        loadedRooms = null;
      }
    }

    if (loadedRooms) {
      // Migrate / enforce that "Umroh Reguler 11 Juni 2026 (Madinah Awal)" group gets the 4 specified hotels:
      // Al Anshor Golden Tulip, Maden Rawdah, Rayhaan Marwa Rotana, dan Anjum
      let migrated = false;
      loadedRooms = loadedRooms.map(room => {
        if (room.groupName === 'Umroh Reguler 11 Juni 2026 (Madinah Awal)') {
          const matchedNo = room.id.split('-').pop() || '1';
          const num = parseInt(matchedNo) || 1;
          
          if (room.hotelName === 'Makkah' && room.hotelDetailName !== 'Rayhaan Marwa Rotana' && room.hotelDetailName !== 'Anjum') {
            room.hotelDetailName = num % 2 === 0 ? 'Rayhaan Marwa Rotana' : 'Anjum';
            migrated = true;
          } else if (room.hotelName === 'Madinah' && room.hotelDetailName !== 'Al Anshor Golden Tulip' && room.hotelDetailName !== 'Maden Rawdah') {
            room.hotelDetailName = num % 2 === 0 ? 'Al Anshor Golden Tulip' : 'Maden Rawdah';
            migrated = true;
          }
        }
        return room;
      });
      if (migrated) {
        localStorage.setItem('ji_rooms_v3', JSON.stringify(loadedRooms));
      }
      return loadedRooms;
    }

    // Fallback: Generate perfectly grouped rooms from default 126 jamaah list
    const firstNames = [
      'Budi', 'Siti', 'Ahmad', 'Dewi', 'Eko', 'Tri', 'Agus', 'Wati', 'Mulyono', 'Sri',
      'Yanto', 'Rina', 'Bambang', 'Ria', 'Hadi', 'Nur', 'Taufik', 'Ina', 'Dedi', 'Ayu',
      'Rudi', 'Mega', 'Heri', 'Lilis', 'Joko', 'Sari', 'Anwar', 'Dini', 'Slamet', 'Ika'
    ];
    const lastNames = [
      'Prasetyo', 'Astuti', 'Wibowo', 'Kusuma', 'Lestari', 'Hidayat', 'Saputra', 'Handayani', 'Nugroho', 'Sari',
      'Setiawan', 'Rahayu', 'Susanto', 'Indah', 'Subagyo', 'Putri', 'Mahendra', 'Kartika', 'Wijaya', 'Fatimah',
      'Siregar', 'Lubis', 'Nasution', 'Ginting', 'Pohan', 'Sitorus', 'Sihombing', 'Panjaitan', 'Tambunan', 'Harahap'
    ];
    const groupNames = [
      'Umroh Reguler 11 Juni 2026 (Madinah Awal)',
      'Umroh Sapphire Ruby 14 Juni 2026 (Makkah Awal)',
      'Umroh Yaqin Banget 15 Juni 2026 (Madinah Awal)',
      'Umroh Plus Turkiye 15 Juni 2026 (Madinah Awal)',
      'Umroh Lapis-Lapis Keberkahan 20 Juni 2026 (Madinah Awal)',
      'Umroh VIP Premium 25 Juni 2026 (Makkah Awal)'
    ];

    const tempJamaahList: Jamaah[] = [];
    groupNames.forEach((gName, gIdx) => {
      for (let i = 1; i <= 21; i++) {
        const firstIdx = (gIdx * 7 + i * 3) % firstNames.length;
        const lastIdx = (gIdx * 11 + i * 5) % lastNames.length;
        const fullName = `${firstNames[firstIdx]} ${lastNames[lastIdx]}`;
        const rNumber = Math.ceil(i / 3);
        tempJamaahList.push({
          id: `jamaah-${gIdx}-${i}`,
          nomorJamaah: String(i),
          namaJamaah: fullName,
          nomorRoomlist: String(rNumber),
          groupName: gName,
          visaStatus: i % 8 === 0 ? 'Proses' : 'Tersedia'
        });
      }
    });

    const combos: { [key: string]: string[] } = {};
    tempJamaahList.forEach(j => {
      const key = `${j.groupName}::${j.nomorRoomlist}`;
      if (!combos[key]) combos[key] = [];
      combos[key].push(j.namaJamaah);
    });

    const initRooms: RoomManifest[] = [];
    Object.keys(combos).forEach(key => {
      const [groupName, nomorRoomlist] = key.split('::');
      const names = combos[key];
      const type = names.length === 2 ? 'Double' : names.length === 4 ? 'Quad' : 'Triple';
      
      let mHotel = groupName.includes('VIP') || groupName.includes('Sapphire') ? 'Fairmont Clock Tower' : 'Pullman ZamZam Makkah';
      let dHotel = groupName.includes('VIP') || groupName.includes('Sapphire') ? 'Oberoi Madinah' : 'Dallah Taibah Madinah';

      if (groupName === 'Umroh Reguler 11 Juni 2026 (Madinah Awal)') {
        const num = parseInt(nomorRoomlist) || 1;
        mHotel = num % 2 === 0 ? 'Rayhaan Marwa Rotana' : 'Anjum';
        dHotel = num % 2 === 0 ? 'Al Anshor Golden Tulip' : 'Maden Rawdah';
      }

      initRooms.push({
        id: `room-${groupName}-Makkah-${nomorRoomlist}`,
        groupName,
        hotelName: 'Makkah',
        hotelDetailName: mHotel,
        roomNumber: `${nomorRoomlist}0${3 + (parseInt(nomorRoomlist) || 1)}`,
        roomType: type as any,
        jamaahNames: names,
        notes: 'Grup Plotting Otomatis'
      });

      initRooms.push({
        id: `room-${groupName}-Madinah-${nomorRoomlist}`,
        groupName,
        hotelName: 'Madinah',
        hotelDetailName: dHotel,
        roomNumber: `${nomorRoomlist}0${1 + (parseInt(nomorRoomlist) || 1)}`,
        roomType: type as any,
        jamaahNames: names,
        notes: 'Grup Plotting Otomatis'
      });
    });

    return initRooms;
  });

  const [packages] = useState<PackageDetail[]>(INITIAL_PACKAGES);

  const [documents, setDocuments] = useState<DocumentGroup[]>(() => {
    const saved = localStorage.getItem('ji_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(() => {
    const saved = localStorage.getItem('ji_broadcasts');
    const parsed: BroadcastMessage[] = saved ? JSON.parse(saved) : INITIAL_BROADCASTS;
    const now = Date.now();
    return parsed.filter(msg => {
      let t = msg.timestamp;
      if (!t) {
        if (msg.id === 'msg-1') t = now - 2 * 60 * 60 * 1000;
        else if (msg.id === 'msg-2') t = now - 25 * 60 * 60 * 1000;
        else if (msg.id === 'msg-3') t = now - 48 * 60 * 60 * 1000;
        else t = now;
        msg.timestamp = t;
      }
      return (now - t) < 24 * 60 * 60 * 1000;
    });
  });

  const [dutyTasks, setDutyTasks] = useState<DutyTask[]>(() => {
    const saved = localStorage.getItem('ji_duty_tasks');
    return saved ? JSON.parse(saved) : INITIAL_DUTY_TASKS;
  });

  const [wallets, setWallets] = useState<WalletAccount[]>(() => {
    const saved = localStorage.getItem('ji_wallets_v6');
    return saved ? JSON.parse(saved) : INITIAL_WALLETS;
  });

  const [expenses, setExpenses] = useState<FieldExpenseReport[]>(() => {
    const saved = localStorage.getItem('ji_expenses_v6');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSE_REPORTS;
  });

  const [taskChecklists, setTaskChecklists] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('ji_task_checklists_v1');
    if (saved) return JSON.parse(saved);
    return {
      'Check In Hotel': [
        'Konfirmasi pembagian kunci kamar (rooming list) dengan resepsionis',
        'Bantu distribusi kunci ke muthawif / pimpinan rombongan',
        'Pastikan semua koper besar (bagasi) sudah tiba di lobby hotel',
        'Koordinasi dengan bellboy untuk pengantaran koper ke kamar jamaah',
        'Pastikan menu makan malam/siang hotel sudah siap untuk jamaah'
      ],
      'Check Out Perpindahan Kota': [
        'Minta jamaah mengeluarkan koper ke depan kamar 3 jam sebelum berangkat',
        'Lakukan pemeriksaan sweeping kamar untuk barang tertinggal',
        'Selesaikan administrasi hotel & pengembalian kunci kamar',
        'Hitung jumlah koper bagasi dan pastikan masuk ke bagasi bus',
        'Pastikan bus bersandar dan snack perjalanan sudah dibagikan'
      ],
      'Check Out Bandara': [
        'Sweeping lobby hotel dari sisa barang bawaan jemaah',
        'Konfirmasi kesiapan bus bandara & truk bagasi',
        'Kandangkan paspor jemaah dan bagikan sebelum bus berangkat',
        'Serahkan lembar manifes jemaah ke sopir bus'
      ],
      'City Tour': [
        'Siapkan muthawif pembimbing & pemeras suara (toa/audio guide)',
        'Briefing jemaah tentang rute ziarah dan waktu kumpul di bus',
        'Pastikan air zam-zam dan snack box siap di dalam bus',
        'Hitung jumlah jemaah saat berangkat dan balik ziarah'
      ],
      'Bandara Kedatangan': [
        'Sambut jemaah di gerbang keluar imigrasi bandara',
        'Mengarahkan jemaah ke bus transit sesuai nomor grup',
        'Koordinasi penanganan bagasi dengan porter bandara',
        'Bagikan simcard lokal KSA bagi jemaah yang memesan'
      ],
      'Bandara Kepulangan': [
        'Bimbing jemaah antri masuk pintu keberangkatan & timbang bagasi',
        'Dampingi proses check-in tiket pesawat & drop bagasi kolektif',
        'Pastikan air zam-zam jatah jemaah terdistribusi di counter bandara',
        'Dampingi jemaah masuk jalur imigrasi sampai boarding gate'
      ]
    };
  });

  const [transactions, setTransactions] = useState<CashflowTransaction[]>(() => {
    const saved = localStorage.getItem('ji_transactions_v6');
    return saved ? JSON.parse(saved) : INITIAL_CASHFLOW;
  });

  // State to track presensi details
  const [presensiDutyId, setPresensiDutyId] = useState('');
  const [presensiStatus, setPresensiStatus] = useState('Masuk Tugas');
  const [checkedPresensiItems, setCheckedPresensiItems] = useState<Record<number, boolean>>({});

  // Dynamic lists states for Manager portal requested features
  const [groups, setGroups] = useState<string[]>(() => {
    const saved = localStorage.getItem('ji_groups_list_v3');
    return saved ? JSON.parse(saved) : [
      'Umroh Reguler 11 Juni 2026 (Madinah Awal)',
      'Umroh Sapphire Ruby 14 Juni 2026 (Makkah Awal)',
      'Umroh Yaqin Banget 15 Juni 2026 (Madinah Awal)',
      'Umroh Plus Turkiye 15 Juni 2026 (Madinah Awal)',
      'Umroh Lapis-Lapis Keberkahan 20 Juni 2026 (Madinah Awal)',
      'Umroh VIP Premium 25 Juni 2026 (Makkah Awal)'
    ];
  });

  const [jamaahList, setJamaahList] = useState<Jamaah[]>(() => {
    const saved = localStorage.getItem('ji_jamaah_list_v5');
    if (saved) return JSON.parse(saved);
    
    const groupNames = [
      'Umroh Reguler 11 Juni 2026 (Madinah Awal)',
      'Umroh Sapphire Ruby 14 Juni 2026 (Makkah Awal)',
      'Umroh Yaqin Banget 15 Juni 2026 (Madinah Awal)',
      'Umroh Plus Turkiye 15 Juni 2026 (Madinah Awal)',
      'Umroh Lapis-Lapis Keberkahan 20 Juni 2026 (Madinah Awal)',
      'Umroh VIP Premium 25 Juni 2026 (Makkah Awal)'
    ];
    
    const firstNames = [
      'Budi', 'Siti', 'Ahmad', 'Dewi', 'Eko', 'Tri', 'Agus', 'Wati', 'Mulyono', 'Sri',
      'Yanto', 'Rina', 'Bambang', 'Ria', 'Hadi', 'Nur', 'Taufik', 'Ina', 'Dedi', 'Ayu',
      'Rudi', 'Mega', 'Heri', 'Lilis', 'Joko', 'Sari', 'Anwar', 'Dini', 'Slamet', 'Ika'
    ];
    
    const lastNames = [
      'Prasetyo', 'Astuti', 'Wibowo', 'Kusuma', 'Lestari', 'Hidayat', 'Saputra', 'Handayani', 'Nugroho', 'Sari',
      'Setiawan', 'Rahayu', 'Susanto', 'Indah', 'Subagyo', 'Putri', 'Mahendra', 'Kartika', 'Wijaya', 'Fatimah',
      'Siregar', 'Lubis', 'Nasution', 'Ginting', 'Pohan', 'Sitorus', 'Sihombing', 'Panjaitan', 'Tambunan', 'Harahap'
    ];

    const initialList: Jamaah[] = [];
    const possibleTags: ('Private' | 'Sapphire' | 'Ruby' | 'Onyx' | 'Yaqin')[] = ['Sapphire', 'Ruby', 'Onyx', 'Yaqin', 'Private'];
    
    groupNames.forEach((gName, gIdx) => {
      const roomCompanions: { [room: string]: string[] } = {};
      const itemsInGroup: any[] = [];
      
      for (let i = 1; i <= 21; i++) {
        // Deterministic but realistic index
        const firstIdx = (gIdx * 7 + i * 3) % firstNames.length;
        const lastIdx = (gIdx * 11 + i * 5) % lastNames.length;
        const fullName = `${firstNames[firstIdx]} ${lastNames[lastIdx]}`;
        
        // triple room grouping (rNumber is 1, 2, 3...)
        const rNumber = Math.ceil(i / 3);
        const pRandom = 10000 + gIdx * 1200 + i * 87;
        const passport = `X${pRandom}`;
        const phone = `+62 811 ${1000 + gIdx * 50 + i * 29}`;
        
        // Mix different packages within the same group
        const tag = possibleTags[(gIdx * 2 + i * 3) % possibleTags.length];
        const age = 22 + ((i * 13 + gIdx * 7) % 55);
        const gender = (firstIdx % 2 === 0) ? 'Laki-laki' : 'Perempuan';
        
        if (!roomCompanions[String(rNumber)]) {
          roomCompanions[String(rNumber)] = [];
        }
        roomCompanions[String(rNumber)].push(fullName);

        itemsInGroup.push({
          id: `jamaah-${gIdx}-${i}`,
          nomorJamaah: String(i),
          namaJamaah: fullName,
          nomorRoomlist: String(rNumber),
          groupName: gName,
          passportNo: passport,
          phone: phone,
          visaStatus: i % 8 === 0 ? 'Proses' : 'Tersedia',
          packageTag: tag,
          age,
          gender,
          companionInfo: ''
        });
      }

      // Fill companion relations
      itemsInGroup.forEach(item => {
        const othersInRoom = (roomCompanions[item.nomorRoomlist] || []).filter(name => name !== item.namaJamaah);
        item.companionInfo = othersInRoom.length > 0 ? `Satu Akun dengan ${othersInRoom.join(', ')}` : 'Pendaftaran Mandiri';
        initialList.push(item);
      });
    });
    
    return initialList;
  });

  const [itineraries, setItineraries] = useState<ItineraryItem[]>(() => {
    const saved = localStorage.getItem('ji_itineraries_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 20) {
          return parsed;
        }
      } catch (e) {
        // silent fallback
      }
    }
    localStorage.setItem('ji_itineraries_v3', JSON.stringify(INITIAL_6_GROUPS_ITINERARIES));
    return INITIAL_6_GROUPS_ITINERARIES;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('ji_team_members_v3');
    if (saved) return JSON.parse(saved);
    return TEAMS.map(team => ({
      id: team.id,
      name: team.name,
      role: team.sector,
      phone: '+966 50 000 0000',
      username: team.id.replace('-', '_'),
      password: 'pass',
      status: 'Aktif'
    }));
  });

  // Navigation states
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editBioName, setEditBioName] = useState('');
  const [editBioPhone, setEditBioPhone] = useState('');
  const [editBioUsername, setEditBioUsername] = useState('');
  const [editBioPassword, setEditBioPassword] = useState('');
  const [showBioPassword, setShowBioPassword] = useState(false);
  const [editBioStatus, setEditBioStatus] = useState<'Aktif' | 'Standby' | 'Cuti'>('Aktif');
  const [bioSuccessMsg, setBioSuccessMsg] = useState('');

  // States for general refresh action
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState('');

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('Umroh Reguler 11 Juni 2026 (Madinah Awal)');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [docGroupFilter, setDocGroupFilter] = useState('All');
  const [isMessagesPopupOpen, setIsMessagesPopupOpen] = useState(false);

  // Inner Subtabs & Custom state for Attendance / Incident
  const [activeResourceTab, setActiveResourceTab] = useState<'sop' | 'packages' | 'documents'>('sop');
  const [handlingReportSubTab, setHandlingReportSubTab] = useState<'expenses' | 'attendance' | 'incident'>('expenses');
  const [managerReportSubTab, setManagerReportSubTab] = useState<'cashflow' | 'schedule'>('cashflow');

  const [attendanceLogs, setAttendanceLogs] = useState(() => {
    const saved = localStorage.getItem('ji_attendance_logs');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'att-1', name: teamMembers[0]?.name || 'Tim Lapangan', date: '2026-05-27', time: '08:00', location: 'Hotel Al-Shohada Makkah', type: 'Masuk Tugas', coordinate: '21.4192° N, 39.8257° E' },
      { id: 'att-2', name: teamMembers[1]?.name || 'Tim Lapangan 2', date: '2026-05-27', time: '17:30', location: 'Bandara King Abdulaziz Jeddah', type: 'Selesai Tugas', coordinate: '21.6796° N, 39.1565° E' }
    ];
  });

  const [incidentLogs, setIncidentLogs] = useState(() => {
    const saved = localStorage.getItem('ji_incident_logs');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'inc-1', name: teamMembers[0]?.name || 'Tim Lapangan', title: 'Antrian Imigrasi Jeddah Menumpuk', text: 'Rombongan SV 816 sempat tertahan 40 menit di pintu 4 karena pemeriksaan acak berkas manifes visa tambahan.', severity: '⚠️ Warning', date: '2026-05-27', time: '14:20', isResolved: true },
      { id: 'inc-2', name: teamMembers[1]?.name || 'Tim Lapangan', title: 'Selesai Distribusi Paspor Madinah', text: 'Seluruh paspor rombongan Haji Furoda SV 820 telah dikoordinasikan aman dengan Muassasah setempat.', severity: 'ℹ️ Info', date: '2026-05-27', time: '19:15', isResolved: true }
    ];
  });

  // Broadcaster message input (Manager View)
  const [msgTitle, setMsgTitle] = useState('');
  const [msgText, setMsgText] = useState('');
  const [msgPriority, setMsgPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem('ji_rooms', JSON.stringify(rooms));
    localStorage.setItem('ji_documents', JSON.stringify(documents));
    localStorage.setItem('ji_broadcasts', JSON.stringify(broadcasts));
    localStorage.setItem('ji_duty_tasks', JSON.stringify(dutyTasks));
    localStorage.setItem('ji_wallets_v6', JSON.stringify(wallets));
    localStorage.setItem('ji_expenses_v6', JSON.stringify(expenses));
    localStorage.setItem('ji_transactions_v6', JSON.stringify(transactions));
    localStorage.setItem('ji_sops', JSON.stringify(sops));
    localStorage.setItem('ji_attendance_logs', JSON.stringify(attendanceLogs));
    localStorage.setItem('ji_incident_logs', JSON.stringify(incidentLogs));
    localStorage.setItem('ji_groups_list_v3', JSON.stringify(groups));
    localStorage.setItem('ji_jamaah_list_v5', JSON.stringify(jamaahList));
    localStorage.setItem('ji_itineraries_v3', JSON.stringify(itineraries));
    localStorage.setItem('ji_team_members_v3', JSON.stringify(teamMembers));
    localStorage.setItem('ji_task_checklists_v1', JSON.stringify(taskChecklists));
  }, [rooms, documents, broadcasts, dutyTasks, wallets, expenses, transactions, sops, attendanceLogs, incidentLogs, groups, jamaahList, itineraries, teamMembers, taskChecklists]);

  // Dynamically Sync Rooms on JamaahList updates to maintain 100% manifest integration
  useEffect(() => {
    // Group jamaahList by groupName and nomorRoomlist
    const combos: { [key: string]: string[] } = {};
    jamaahList.forEach(j => {
      if (!j.groupName || !j.nomorRoomlist || j.nomorRoomlist === '-') return;
      const key = `${j.groupName}::${j.nomorRoomlist}`;
      if (!combos[key]) combos[key] = [];
      combos[key].push(j.namaJamaah);
    });

    let hasChanged = false;
    const nextRooms = rooms.map(room => {
      const rNum = room.id.split('-').pop(); // extract nomorRoomlist from id
      const key = `${room.groupName}::${rNum}`;
      const expectedNames = combos[key] || [];
      
      // Compare arrays
      const isDifferent = room.jamaahNames.length !== expectedNames.length ||
                          room.jamaahNames.some((n, i) => n !== expectedNames[i]);
      if (isDifferent) {
        hasChanged = true;
        return {
          ...room,
          jamaahNames: expectedNames,
          roomType: (expectedNames.length === 2 ? 'Double' : expectedNames.length === 4 ? 'Quad' : 'Triple') as any
        };
      }
      return room;
    });

    // Also look for combinations in combos that don't have a room in nextRooms yet
    Object.keys(combos).forEach(key => {
      const [gName, rNum] = key.split('::');
      const expectedNames = combos[key];
      const hasMStyleRoom = nextRooms.some(r => r.groupName === gName && r.hotelName === 'Makkah' && r.id.endsWith(`-${rNum}`));
      if (!hasMStyleRoom) {
        hasChanged = true;
        const type = expectedNames.length === 2 ? 'Double' : expectedNames.length === 4 ? 'Quad' : 'Triple';
        const mHotel = gName.includes('VIP') || gName.includes('Sapphire') ? 'Fairmont Clock Tower' : 'Pullman ZamZam Makkah';
        const dHotel = gName.includes('VIP') || gName.includes('Sapphire') ? 'Oberoi Madinah' : 'Dallah Taibah Madinah';

        nextRooms.push({
          id: `room-${gName}-Makkah-${rNum}`,
          groupName: gName,
          hotelName: 'Makkah',
          hotelDetailName: mHotel,
          roomNumber: `${rNum}03`,
          roomType: type as any,
          jamaahNames: expectedNames,
          notes: 'Manifest Plotted'
        });
        nextRooms.push({
          id: `room-${gName}-Madinah-${rNum}`,
          groupName: gName,
          hotelName: 'Madinah',
          hotelDetailName: dHotel,
          roomNumber: `${rNum}01`,
          roomType: type as any,
          jamaahNames: expectedNames,
          notes: 'Manifest Plotted'
        });
      }
    });

    // Filter out nextRooms which don't have any matching combos (which means their combo was completely deleted)
    const filteredRooms = nextRooms.filter(r => {
      const rNum = r.id.split('-').pop();
      const exists = combos[`${r.groupName}::${rNum}`];
      if (!exists) {
        hasChanged = true;
        return false;
      }
      return true;
    });

    if (hasChanged) {
      setRooms(filteredRooms);
      localStorage.setItem('ji_rooms_v3', JSON.stringify(filteredRooms));
    }
  }, [jamaahList]);

  // Handle Log-in
  const handleLoginSuccess = (username: string, role: UserRole) => {
    setCurrentUser(username);
    setCurrentRole(role);
    localStorage.setItem('ji_username', username);
    localStorage.setItem('ji_role', role);
    // Reset defaults tab depending on role
    setActiveTab('dashboard');
  };

  // Handle Log-out
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    localStorage.removeItem('ji_username');
    localStorage.removeItem('ji_role');
  };

  // Update own handling biodata and sync automatically with team list
  const handleUpdateSelfBiodata = (updatedFields: { name: string; phone: string; username: string; password?: string; status: 'Aktif' | 'Standby' | 'Cuti' }) => {
    const userLower = (currentUser || '').toLowerCase();
    const idx = teamMembers.findIndex(t => 
      t.name.toLowerCase() === userLower || t.username.toLowerCase() === userLower
    );
    if (idx !== -1) {
      const updatedList = [...teamMembers];
      updatedList[idx] = {
        ...updatedList[idx],
        name: updatedFields.name,
        phone: updatedFields.phone,
        username: updatedFields.username,
        status: updatedFields.status,
        ...(updatedFields.password !== undefined ? { password: updatedFields.password } : {})
      };
      setTeamMembers(updatedList);
      localStorage.setItem('ji_team_members_v3', JSON.stringify(updatedList));
      
      // Update logged in user state so their session is updated
      setCurrentUser(updatedFields.name);
      localStorage.setItem('ji_username', updatedFields.name);
      
      setBioSuccessMsg('✓ Biodata berhasil diperbarui dan tersinkronisasi ke database tim!');
      setTimeout(() => setBioSuccessMsg(''), 4000);
    }
  };

  // Pull fresh database updates & reload states from LocalStorage for seamless integration
  const handleRefreshAll = () => {
    setIsRefreshing(true);
    setRefreshMsg('Sinkronisasi...');
    
    setTimeout(() => {
      // 1. Re-read rooms
      const savedRooms = localStorage.getItem('ji_rooms_v3');
      if (savedRooms) {
        try { setRooms(JSON.parse(savedRooms)); } catch(e) {}
      }
      
      // 2. Re-read team members
      const savedTeam = localStorage.getItem('ji_team_members_v3');
      if (savedTeam) {
        try { setTeamMembers(JSON.parse(savedTeam)); } catch(e) {}
      }
      
      // 3. Re-read duty tasks
      const savedTasks = localStorage.getItem('ji_duty_tasks');
      if (savedTasks) {
        try { setDutyTasks(JSON.parse(savedTasks)); } catch(e) {}
      }
      
      // 4. Re-read broadcasts
      const savedBroadcasts = localStorage.getItem('ji_broadcasts');
      if (savedBroadcasts) {
        try { setBroadcasts(JSON.parse(savedBroadcasts)); } catch(e) {}
      }
      
      // 5. Re-read SOPs
      const savedSops = localStorage.getItem('ji_sops');
      if (savedSops) {
        try { setSops(JSON.parse(savedSops)); } catch(e) {}
      }
      
      // 6. Re-read wallets / expenses
      const savedWallets = localStorage.getItem('ji_wallets_v6');
      if (savedWallets) {
        try { setWallets(JSON.parse(savedWallets)); } catch(e) {}
      }
      const savedExpenses = localStorage.getItem('ji_expenses_v6');
      if (savedExpenses) {
        try { setExpenses(JSON.parse(savedExpenses)); } catch(e) {}
      }

      // 7. Re-read itineraries
      const savedItin = localStorage.getItem('ji_itineraries_v3');
      if (savedItin) {
        try { setItineraries(JSON.parse(savedItin)); } catch(e) {}
      }

      // 8. Re-read checklists
      const savedChecklists = localStorage.getItem('ji_task_checklists_v1');
      if (savedChecklists) {
        try { setTaskChecklists(JSON.parse(savedChecklists)); } catch(e) {}
      }

      // 9. Re-read documents
      const savedDocs = localStorage.getItem('ji_documents');
      if (savedDocs) {
        try { setDocuments(JSON.parse(savedDocs)); } catch(e) {}
      }

      // 10. Re-read attendance logs
      const savedAttendance = localStorage.getItem('ji_attendance_logs');
      if (savedAttendance) {
        try { setAttendanceLogs(JSON.parse(savedAttendance)); } catch(e) {}
      }

      // 11. Re-read incident logs
      const savedIncidents = localStorage.getItem('ji_incident_logs');
      if (savedIncidents) {
        try { setIncidentLogs(JSON.parse(savedIncidents)); } catch(e) {}
      }

      setIsRefreshing(false);
      setRefreshMsg('Data Terkini Terintegrasi!');
      setTimeout(() => setRefreshMsg(''), 2000);
    }, 700);
  };

  // Add Room implementation
  const handleAddRoom = (newRoom: Omit<RoomManifest, 'id'>) => {
    const added: RoomManifest = {
      ...newRoom,
      id: `room-${Date.now()}`
    };
    setRooms(prev => [added, ...prev]);
  };

  // Turn field expense report submission on
  const handleAddExpense = (newExpense: Omit<FieldExpenseReport, 'id' | 'status' | 'handlingName' | 'handlingId'>) => {
    const userLower = (currentUser || '').toLowerCase();
    const activeTeam = teamMembers.find(t => t.name.toLowerCase() === userLower);
    
    let computedWalletId = 'wallet-ahmad';
    let handlingId = 'wallet-ahmad';
    
    if (activeTeam) {
        computedWalletId = `wallet-${activeTeam.username}`;
        handlingId = computedWalletId;
    } else {
        if (userLower.includes('fathur') || userLower.includes('yusuf') || userLower.includes('manager')) {
            computedWalletId = 'wallet-manager';
            handlingId = 'wallet-manager';
        }
    }

    const added: FieldExpenseReport = {
      ...newExpense,
      id: `exp-${Date.now()}`,
      status: 'Pending',
      handlingName: currentUser || teamMembers[0]?.name || 'Tim Lapangan',
      handlingId: handlingId,
      walletSourceId: computedWalletId
    };
    setExpenses(prev => [added, ...prev]);
  };

  // Add Task implementation (Manager)
  const handleAddTask = (newTask: Omit<DutyTask, 'id'>) => {
    const added: DutyTask = {
      ...newTask,
      id: `task-${Date.now()}`
    };
    setDutyTasks(prev => [added, ...prev]);
  };

  // Toggle Task Status (Manager or User)
  const handleToggleTaskStatus = (id: string) => {
    setDutyTasks(prev => prev.map(task => {
      if (task.id === id) {
        let nextStatus: 'Belum Selesai' | 'Sedang Berjalan' | 'Selesai' = 'Selesai';
        if (task.status === 'Belum Selesai') nextStatus = 'Sedang Berjalan';
        else if (task.status === 'Sedang Berjalan') nextStatus = 'Selesai';
        else nextStatus = 'Belum Selesai';
        return { ...task, status: nextStatus };
      }
      return task;
    }));
  };

  // Add General Transaction (Manager)
  const handleAddTransaction = (newTx: Omit<CashflowTransaction, 'id' | 'status' | 'byUser'>) => {
    const added: CashflowTransaction = {
      ...newTx,
      id: `tx-${Date.now()}`,
      status: 'Approved',
      byUser: currentUser || 'Manager'
    };

    setTransactions(prev => [added, ...prev]);

    // Update wallet balance automatically
    setWallets(prev => prev.map(w => {
      if (w.id === newTx.walletId) {
        const factor = newTx.type === 'Masuk' ? 1 : -1;
        const nextBal = w.balanceSAR + (newTx.amountSAR * factor);
        return {
          ...w,
          balanceSAR: nextBal,
          balanceIDR: nextBal * 4350 // recalculate conversion
        };
      }
      return w;
    }));
  };

  // Delete Task implementation (Manager)
  const handleDeleteTask = (id: string) => {
    setDutyTasks(prev => prev.filter(task => task.id !== id));
  };

  // Update Task implementation (Manager)
  const handleUpdateTask = (id: string, updatedTask: Partial<DutyTask>) => {
    setDutyTasks(prev => prev.map(task => task.id === id ? { ...task, ...updatedTask } : task));
  };

  // Delete Transaction implementation (Manager)
  const handleDeleteTransaction = (id: string) => {
    const targetTx = transactions.find(t => t.id === id);
    if (targetTx) {
      // Revert wallet balance impact
      setWallets(prev => prev.map(w => {
        if (w.id === targetTx.walletId) {
          const factor = targetTx.type === 'Masuk' ? -1 : 1;
          const nextBal = w.balanceSAR + (targetTx.amountSAR * factor);
          return {
            ...w,
            balanceSAR: Math.max(0, nextBal),
            balanceIDR: Math.max(0, nextBal) * 4350
          };
        }
        return w;
      }));
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Update Transaction implementation (Manager)
  const handleUpdateTransaction = (id: string, updatedTx: Partial<CashflowTransaction>) => {
    const originalTx = transactions.find(t => t.id === id);
    if (!originalTx) return;

    // Apply change to wallets: first revert original, then apply updated
    setWallets(prev => prev.map(w => {
      let currentBalance = w.balanceSAR;
      
      // Revert original tx for this wallet if matching
      if (w.id === originalTx.walletId) {
        const revertFactor = originalTx.type === 'Masuk' ? -1 : 1;
        currentBalance += (originalTx.amountSAR * revertFactor);
      }
      
      // Apply updated tx for this wallet
      const nextWalletId = updatedTx.walletId || originalTx.walletId;
      const nextType = updatedTx.type || originalTx.type;
      const nextAmount = updatedTx.amountSAR !== undefined ? updatedTx.amountSAR : originalTx.amountSAR;
      
      if (w.id === nextWalletId) {
        const applyFactor = nextType === 'Masuk' ? 1 : -1;
        currentBalance += (nextAmount * applyFactor);
      }

      const safeBalance = Math.max(0, currentBalance);
      return {
        ...w,
        balanceSAR: safeBalance,
        balanceIDR: safeBalance * 4350
      };
    }));

    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, ...updatedTx };
      }
      return t;
    }));
  };

  // TRANSFER FUNDS FROM MANAGER WALLET TO TIM LAPANGAN WALLET
  const handleTransferFunds = (fromWalletId: string, toWalletId: string, amountSAR: number) => {
    // 1. Double check and updates balances
    setWallets(prev => prev.map(w => {
      if (w.id === fromWalletId) {
        const nextBal = Math.max(0, w.balanceSAR - amountSAR);
        return { ...w, balanceSAR: nextBal, balanceIDR: nextBal * 4350 };
      }
      if (w.id === toWalletId) {
        const nextBal = w.balanceSAR + amountSAR;
        return { ...w, balanceSAR: nextBal, balanceIDR: nextBal * 4350 };
      }
      return w;
    }));

    // Find custom names
    const fromName = fromWalletId === 'wallet-manager' ? 'Kas Pusat (Manager)' : fromWalletId;
    let toName = toWalletId;
    const matchedWallet = wallets.find(w => w.id === toWalletId);
    if (matchedWallet) {
       toName = matchedWallet.holder;
    }

    // 2. Log two entries (outflow from source, inflow to destination)
    const newTxOut: CashflowTransaction = {
      id: `tx-tf-out-${Date.now()}`,
      title: `Bagi Dana: Transfer dari Kas Pusat ke ${toName}`,
      category: 'Dana Drop',
      type: 'Keluar',
      amountSAR: amountSAR,
      walletId: fromWalletId,
      date: new Date().toISOString().split('T')[0],
      byUser: currentUser || 'Manager Fathur',
      status: 'Approved'
    };

    const newTxIn: CashflowTransaction = {
      id: `tx-tf-in-${Date.now()}`,
      title: `Terima Drop Dana: Dari Kas Pusat`,
      category: 'Dana Drop',
      type: 'Masuk',
      amountSAR: amountSAR,
      walletId: toWalletId,
      date: new Date().toISOString().split('T')[0],
      byUser: toName,
      status: 'Approved'
    };

    setTransactions(prev => [newTxOut, newTxIn, ...prev]);
  };

  // APPROVE FIELD EXPENSE REPORT (PULLING SYNCED IN MANAGER CASHFLOW)
  const handleApproveFieldReport = (reportId: string, walletId: string) => {
    // 1. Find report details
    const reportIndex = expenses.findIndex(r => r.id === reportId);
    if (reportIndex === -1) return;

    const report = expenses[reportIndex];

    // 2. Mark report as approved (Selesai)
    setExpenses(prev => prev.map(r => r.id === reportId ? { ...r, status: 'Selesai' } : r));

    // 3. Subtract from wallet used by field agent
    const actualWalletId = report.walletSourceId || 'wallet-ahmad';
    setWallets(prev => prev.map(w => {
      if (w.id === actualWalletId) {
        const nextBal = w.balanceSAR - report.amountSAR;
        return {
          ...w,
          balanceSAR: Math.max(0, nextBal),
          balanceIDR: Math.max(0, nextBal) * 4350
        };
      }
      return w;
    }));

    // 4. Record entry in master transaction list
    const addedTx: CashflowTransaction = {
      id: `tx-sync-${Date.now()}`,
      title: `Disetujui: ${report.note} (${report.handlingName})`,
      category: 'Operasional Lapangan',
      type: 'Keluar',
      amountSAR: report.amountSAR,
      walletId: actualWalletId,
      date: new Date().toISOString().split('T')[0],
      byUser: `Verifikator: ${currentUser || 'Manager Fathur'}`,
      status: 'Approved'
    };
    setTransactions(prev => [addedTx, ...prev]);
  };

  // REJECT FIELD EXPENSE REPORT
  const handleRejectFieldReport = (reportId: string) => {
    setExpenses(prev => prev.map(r => r.id === reportId ? { ...r, status: 'Ditolak' } : r));
  };

  // Broadcast Message to Field Tim (Manager ops)
  const handleBroadcastMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgTitle.trim() || !msgText.trim()) {
      alert('Harap masukkan judul berita dan isi pesan instruksi.');
      return;
    }

    const newMessage: BroadcastMessage = {
      id: `msg-${Date.now()}`,
      sender: `Manager (Pak Fathur)`,
      title: msgTitle.trim(),
      text: msgText.trim(),
      time: 'Baru Saja (AST)',
      priority: msgPriority,
      isRead: false,
      timestamp: Date.now()
    };

    setBroadcasts(prev => [newMessage, ...prev]);
    setMsgTitle('');
    setMsgText('');
    alert('Pesan instruksi disiarkan secara instant ke seluruh perangkat Handling!');
  };

  const handleMarkMessageRead = (id: string) => {
    setBroadcasts(prev => prev.map(msg => msg.id === id ? { ...msg, isRead: true } : msg));
  };

  // Quick Stats calculations for Active Handling Team Dashboard
  const activeDutiesCount = dutyTasks.filter(t => t.handlingName.toLowerCase() === (currentUser || '').toLowerCase() && t.status !== 'Selesai').length;
  const unreadMessagesCount = broadcasts.filter(b => !b.isRead).length;

  // Render Login state first
  if (!currentUser || !currentRole) {
    const mappedTeamList = teamMembers.map(tm => ({
      id: tm.id,
      name: tm.name,
      sector: tm.role as any
    }));
    return <Login onLoginSuccess={handleLoginSuccess} teamList={mappedTeamList} />;
  }

  // --- RENDERING OPERATIONS MANAGER ROLE (FULLSCREEN SIDEBAR LAYOUT) ---
  if (currentRole === 'MANAGER') {
    return (
      <ManagerAppPanel
        currentUser={currentUser}
        onLogout={handleLogout}
        dutyTasks={dutyTasks}
        onAddTask={handleAddTask}
        onToggleTaskStatus={handleToggleTaskStatus}
        wallets={wallets}
        expenses={expenses}
        transactions={transactions}
        onAddTransaction={handleAddTransaction}
        onApproveFieldReport={handleApproveFieldReport}
        onRejectFieldReport={handleRejectFieldReport}
        onTransferFunds={handleTransferFunds}
        rooms={rooms}
        setRooms={setRooms}
        groups={groups}
        onAddGroup={(g) => {
          setGroups(prev => [...prev, g]);
        }}
        onRemoveGroup={(gName) => {
          setGroups(prev => prev.filter(g => g !== gName));
          setItineraries(prev => prev.filter(it => it.groupName !== gName));
          setRooms(prev => prev.filter(rm => rm.groupName !== gName));
        }}
        jamaahList={jamaahList}
        onUpdateJamaahList={setJamaahList}
        itineraries={itineraries}
        onUpdateItineraryList={setItineraries}
        documents={documents}
        onUpdateDocuments={setDocuments}
        teamMembers={teamMembers}
        onUpdateTeamMembers={setTeamMembers}
        broadcasts={broadcasts}
        onAddBroadcast={(b) => setBroadcasts(prev => [b, ...prev])}
        sops={sops}
        onUpdateSops={setSops}
        attendanceLogs={attendanceLogs}
        incidentLogs={incidentLogs}
        onUpdateIncidentLogs={setIncidentLogs}
        onDeleteTask={handleDeleteTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTransaction={handleDeleteTransaction}
        onUpdateTransaction={handleUpdateTransaction}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 sm:p-4 font-sans relative" id="applet-viewport">
      
      {/* Mobile-centric frame mockup centering container */}
      <div className="w-full max-w-md h-screen sm:h-[840px] bg-slate-50 flex flex-col relative overflow-hidden sm:rounded-2xl sm:shadow-2xl border-x border-slate-200 pb-16" id="mobile-only-viewport">

        {/* GLOBAL TOP NAV HEADER BAR (SIMPLIFIED ROW + DYNAMIC DATE BENEATH) */}
        <header className="bg-white border-b border-slate-200 shadow-xs px-4 py-3 shrink-0 z-30 flex flex-col" id="global-header-bar">
          {/* Row 1: Title and Bell in 1 row */}
          <div className="flex items-center justify-between w-full h-8">
            <div className="flex items-center gap-2">
              <img 
                src="https://lh3.googleusercontent.com/d/1Q4xeukjms6dHqKLUqCdsTcpXQyzw7n6d" 
                alt="Logo" 
                className="h-6 w-auto object-contain rounded-xs"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h1 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight uppercase">Handling Saudi Arabia</h1>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Dynamic Refresh Button next to Bell notification */}
              <button
                onClick={handleRefreshAll}
                disabled={isRefreshing}
                className={`p-2 rounded-full border transition-all cursor-pointer relative ${
                  isRefreshing 
                    ? 'bg-amber-500/10 border-amber-400 text-amber-700' 
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                }`}
                title="Refresh Integrasi Data"
              >
                <RotateCw className={`w-4 h-4 shrink-0 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>

              {/* Icon Bel (Bell) button */}
              <button
                onClick={() => setIsMessagesPopupOpen(true)}
                className={`relative p-2 rounded-full border transition-all cursor-pointer ${
                  isMessagesPopupOpen 
                    ? 'bg-amber-500/10 border-amber-400 text-amber-900' 
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                }`}
                title="Notifikasi"
              >
                <Bell className="w-4 h-4 shrink-0" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[9px] font-black leading-none animate-bounce shadow-sm">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Row 2: Gregorian and Hijri date walking update small */}
          <div className="mt-1.5 flex items-center justify-start border-t border-slate-100 pt-1.5">
            <SaudiClockWidget compact={true} />
          </div>
        </header>

        {/* Floating refresh success/loading notification inside viewport boundaries */}
        {refreshMsg && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-amber-400 text-[10px] uppercase tracking-wide px-3 py-1.5 rounded-full font-black flex items-center gap-1.5 shadow-lg border border-amber-500/20 animate-in fade-in slide-in-from-top-3 duration-250">
            <span className={`w-1.5 h-1.5 rounded-full bg-amber-400 ${isRefreshing ? 'animate-ping' : 'animate-pulse'}`}></span>
            <span>{refreshMsg}</span>
          </div>
        )}

        {/* Removed Desktop Sidebar entirely in favor of murni Mobile view */}

        {/* APP BODY BLOCK (SCROLLABLE AREA) */}
        <div className="flex flex-col flex-1 overflow-hidden" id="applet-main-canvas">

          {/* MOBILE SIDEBAR PANEL (DRAWER) */}
          {mobileMenuOpen && (
            <div className="absolute inset-0 z-50 bg-slate-900/60 flex">
              <div className="w-64 bg-white text-zinc-800 flex flex-col p-4 space-y-4 animate-in slide-in-from-left duration-200 border-r border-[#D4AF37]/20 shadow-xl">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="font-serif font-black text-[#D4AF37] tracking-tight uppercase text-xs">JEJAK IMANI</span>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 bg-slate-100 rounded font-bold text-slate-605 text-xs"
                  >
                    <X className="w-4 h-4 text-slate-800" />
                  </button>
                </div>

                {/* Navigation list */}
                <nav className="flex-1 space-y-1.5 font-semibold" id="nav-mobile">
                  <button
                    onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                    className={`w-full py-2 px-3 rounded text-xs font-bold text-left flex items-center gap-2.5 transition-all ${
                      activeTab === 'dashboard' ? 'bg-[#D4AF37]/15 border-l-2 border-[#D4AF37] text-slate-900 font-extrabold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Compass className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                    <span>Dashboard</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('roomlist'); setMobileMenuOpen(false); }}
                    className={`w-full py-2 px-3 rounded text-xs font-bold text-left flex items-center gap-2.5 transition-all ${
                      activeTab === 'roomlist' ? 'bg-[#D4AF37]/15 border-l-2 border-[#D4AF37] text-slate-900 font-extrabold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Hotel className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                    <span>Room List</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('resources'); setActiveResourceTab('sop'); setMobileMenuOpen(false); }}
                    className={`w-full py-2 px-3 rounded text-xs font-bold text-left flex items-center gap-2.5 transition-all ${
                      activeTab === 'resources' ? 'bg-[#D4AF37]/15 border-l-2 border-[#D4AF37] text-slate-900 font-extrabold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Folder className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                    <span>Dokumen</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('reports'); setMobileMenuOpen(false); }}
                    className={`w-full py-2 px-3 rounded text-xs font-bold text-left flex items-center gap-2.5 transition-all ${
                      activeTab === 'reports' ? 'bg-[#D4AF37]/15 border-l-2 border-[#D4AF37] text-slate-900 font-extrabold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                    <span>Laporan</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('account'); setMobileMenuOpen(false); }}
                    className={`w-full py-2 px-3 rounded text-xs font-bold text-left flex items-center gap-2.5 transition-all ${
                      activeTab === 'account' ? 'bg-[#D4AF37]/15 border-l-2 border-[#D4AF37] text-slate-900 font-extrabold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <User className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                    <span>Akun</span>
                  </button>
                </nav>


              </div>
            </div>
          )}

        {/* TOP STATUS NAVIGATION BAR WITH QUICK REPAIR AND DIRECT ROLE TESTING */}
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 hidden items-center justify-between z-10 shrink-0" id="top-desktop-app-tabs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">AKSES PORTAL QUICK SWITCH :</span>
            <div className="flex gap-1">
              <button
                onClick={() => { setCurrentRole('HANDLING'); handleLoginSuccess(teamMembers[0]?.name || 'Tim Lapangan', 'HANDLING'); }}
                className={`px-3 py-1 text-[11px] font-extrabold rounded-full border transition-all cursor-pointer ${
                  currentRole === 'HANDLING'
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Lapangan (Tim 1)
              </button>
              <button
                onClick={() => { setCurrentRole('MANAGER'); handleLoginSuccess('Pak Fathur', 'MANAGER'); }}
                className={`px-3 py-1 text-[11px] font-extrabold rounded-full border transition-all cursor-pointer ${
                  currentRole === 'MANAGER'
                    ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37] shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Manager (Fathur Central)
              </button>
            </div>
          </div>

          <div className="hidden xl:flex flex-1 justify-center px-4">
            <SaudiClockWidget />
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
            <div className="xl:hidden">
              <SaudiClockWidget compact={true} />
            </div>
            <span>Riyal Convert: <strong className="text-emerald-700">1 SAR = Rp 4.350</strong></span>
            <span className="px-2 py-0.5 bg-[#1A1A1A] text-[#D4AF37] text-[10px] rounded border border-[#D4AF37]/35 font-bold select-none uppercase shadow-xs">
              PT. JEJAK IMANI BERKAH BERSAMA
            </span>
          </div>
        </div>

        {/* CONTENT CHASSIS & VIEW SCROLLER */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-3 md:p-6 lg:p-8 pb-20 lg:pb-8 space-y-6" id="applet-content-scroller">
          
          {/* GROUP FILTER SELECTOR BANNER FOR JAMAAH RELATED MENUS */}
          {['packages', 'documents'].includes(activeTab) && (
            <div className="bg-white p-4 rounded-xl border border-slate-250 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200" id="global-group-selector">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg select-none shrink-0">
                  👥
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">FILTER DATA KOORDINASI GRUP</span>
                  <h3 className="text-slate-900 text-sm font-bold">Memantau data khusus untuk pilihan rombongan grup berikut:</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-700 font-semibold whitespace-nowrap">PILIH GRUP AKTIF:</span>
                <select
                  value={selectedGroupFilter}
                  onChange={(e) => setSelectedGroupFilter(e.target.value)}
                  className="bg-white text-slate-950 border border-slate-200 hover:border-slate-350 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer shadow-3xs transition-colors"
                >
                  <option value="Umroh Syawal Gold 2026">Umroh Syawal Gold 2026 (SV 816)</option>
                  <option value="Haji Furoda Premium 2026">Haji Furoda Premium 2026 (SV 820)</option>
                  <option value="Umroh Hemat Berkah Juni">Umroh Hemat Berkah Juni (GA 980)</option>
                </select>
              </div>
            </div>
          )}

          {/* DYNAMIC TAB SWITCH RENDERER */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              <div className="space-y-4">
                
                {/* TODAY PENUGASAN (ROLE DEPENDENT SUMMARY) */}
                {currentRole === 'HANDLING' ? (
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs" id="handling-dashboard-summary">
                    <div className="border-b border-slate-100 pb-2 mb-3 flex justify-between items-center">
                      <h3 className="font-extrabold text-[#111] text-xs uppercase flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-[#D4AF37]" />
                        <span>Jadwal Tugas</span>
                      </h3>
                      <span className="text-[10px] text-slate-500 font-bold">
                        {dutyTasks.filter(t => t.handlingName.toLowerCase() === (currentUser || '').toLowerCase()).length} Aktif
                      </span>
                    </div>

                    <div className="space-y-2">
                      {dutyTasks.filter(t => t.handlingName.toLowerCase() === (currentUser || '').toLowerCase()).slice(0, 2).map((task) => (
                        <div key={task.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-1 transition-all text-xs">
                          <div className="flex justify-between items-center">
                            <span className="px-1.5 py-0.5 bg-[#1a1a1a] text-[#D4AF37] text-[8px] font-black rounded tracking-wide uppercase">
                              {task.roleTag}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold font-mono">📅 {task.date}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 leading-tight">{task.groupName}</h4>
                          <span className="text-[11px] text-slate-500 font-semibold mt-0.5">📍 {task.location} ({task.timeRange})</span>
                          <div className="flex justify-between items-center pt-1.5 mt-1 border-t border-slate-100 gap-2">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                              task.status === 'Selesai' 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-250 border' 
                                : task.status === 'Sedang Berjalan'
                                ? 'bg-blue-50 text-blue-800 border border-blue-250'
                                : 'bg-amber-50 text-amber-800 border border-amber-250'
                            }`}>
                              {task.status === 'Sedang Berjalan' ? 'Sedang Berjalan' : task.status}
                            </span>
                            
                            {task.status === 'Selesai' ? (
                              <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5 animate-pulse">
                                <span>✓</span> Selesai
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  setActiveTab('reports');
                                  setHandlingReportSubTab('attendance');
                                  setPresensiDutyId(task.id);
                                  setPresensiStatus(task.status === 'Belum Selesai' ? 'Masuk Tugas' : 'Selesai Tugas');
                                }}
                                className="px-2 py-0.5 bg-slate-900 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-slate-950 font-extrabold text-[9px] rounded border border-slate-800 transition-all cursor-pointer shadow-2xs flex items-center gap-1 uppercase"
                              >
                                {task.status === 'Belum Selesai' ? (
                                  <>
                                    <Clock className="w-2.5 h-2.5 shrink-0" />
                                    <span>Presensi Masuk</span>
                                  </>
                                ) : (
                                  <>
                                    <LogOut className="w-2.5 h-2.5 shrink-0" />
                                    <span>Presensi Selesai</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // MANAGER MAIN DASHBOARD SUMMARY CARDS
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs" id="manager-dashboard-summary">
                    <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                          <Settings className="w-5 h-5 text-[#D4AF37]" />
                          <span>Rangkuman Operasional Aktif</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Pantau kepatuhan penugasan tim di 3 kota utama Arab Saudi</p>
                      </div>
                      <span className="px-2.5 py-1 bg-[#0F172A] text-[#D4AF37] text-[10px] font-bold rounded border border-[#D4AF37]/20">LIVE MANAGER DECK</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                       <button
                        onClick={() => setActiveTab('m-schedule')}
                        className="p-3.5 bg-indigo-50/50 hover:bg-slate-50 border border-slate-200 text-left rounded-lg transition-all cursor-pointer"
                      >
                        <span className="text-[10px] font-black text-indigo-700 block uppercase">Jadwal Aktif</span>
                        <span className="text-xl font-bold text-indigo-950 font-mono tracking-tight">{dutyTasks.length} Tugas</span>
                        <span className="text-[10px] text-slate-450 block mt-0.5 font-bold">Atur Schedulers →</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('m-cashflow')}
                        className="p-3.5 bg-emerald-50/50 hover:bg-slate-50 border border-slate-200 text-left rounded-lg transition-all cursor-pointer"
                      >
                        <span className="text-[10px] font-black text-emerald-700 block uppercase">Review Pengeluaran</span>
                        <span className="text-xl font-bold text-[#0F172A] font-mono tracking-tight">{expenses.filter(e => e.status === 'Pending').length} Pending</span>
                        <span className="text-[10px] text-slate-450 block mt-0.5 font-bold">Audit Real-time →</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('roomlist')}
                        className="p-3.5 bg-amber-50/50 hover:bg-slate-50 border border-[#D4AF37]/35 text-left rounded-lg transition-all cursor-pointer"
                      >
                        <span className="text-[10px] font-black text-amber-800 block uppercase">Total Kamar</span>
                        <span className="text-xl font-bold text-amber-950 font-mono tracking-tight">{rooms.length} Terdistribusi</span>
                        <span className="text-[10px] text-slate-450 block mt-0.5 font-bold">Periksa Manifes →</span>
                      </button>
                    </div>

                    {/* Quick overview of latest Field Expenses needing approval */}
                    <div className="mt-5 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">PENGAJUAN KEUANGAN DAHSBOARD SENTRAL (LATEST)</span>
                      {expenses.slice(0, 2).map((expense) => (
                        <div key={expense.id} className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[9px] font-black font-mono">
                              {expense.handlingName}
                            </span>
                            <span className="text-slate-800">{expense.note}</span>
                          </div>
                          <span className="text-slate-900 font-mono font-bold">{expense.amountSAR} SAR</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side: Quick Notifications & Latest SOP Preview */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* PREVIEW CEPAT SOP TERBARU */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="border-b border-slate-100 pb-2 mb-3 flex justify-between items-center">
                    <span className="font-extrabold text-[#111] text-xs uppercase flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                      <span>Standar Operasional Prosedur</span>
                    </span>
                  </div>

                  <div className="space-y-4">
                    {sops.slice(0, 2).map((sop) => (
                      <div key={sop.id} className="space-y-1">
                        <span className="text-[9px] bg-red-50 text-red-700 font-bold border border-red-200 rounded px-1.5 py-0.5 inline-block">
                          {sop.category}
                        </span>
                        <h4 className="font-extrabold text-slate-800 text-xs tracking-tight line-clamp-1">
                          {sop.title}
                        </h4>
                        <p className="text-[11px] text-slate-505 line-clamp-2">
                          {sop.content[0]}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setActiveTab(currentRole === 'HANDLING' ? 'sop' : 'dashboard')}
                    className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition-all cursor-pointer text-center"
                  >
                    Buka Seluruh Dokumen SOP 
                  </button>
                </div>

                {/* BROADCAST ALERTS HUB */}
                <div className="bg-[#0F172A] text-white p-5 rounded-xl border border-slate-800 shadow-md">
                  <div className="border-b border-slate-800 pb-2.5 mb-3.5 flex justify-between items-center">
                    <span className="text-white font-bold text-xs sm:text-sm flex items-center gap-1.5">
                      <Bell className="w-4.5 h-4.5 text-[#D4AF37]" />
                      <span>Notifikasi</span>
                    </span>
                    <span className="w-2.5 h-2.5 bg-rose-555 rounded-full animate-ping"></span>
                  </div>

                  <div className="space-y-3.5" id="dashboard-alerts-hub">
                    {broadcasts.slice(0, 2).map((msg) => (
                      <div key={msg.id} className="p-3 bg-black/40 rounded-lg border border-slate-800 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-widest ${
                            msg.priority === 'High' ? 'bg-rose-500 text-white' : 'bg-[#D4AF37] text-[#0F172A]'
                          }`}>
                            {msg.priority} ALERTS
                          </span>
                          <span className="text-[9px] text-slate-450 font-mono">{msg.time}</span>
                        </div>
                        <h4 className="font-bold text-slate-200 text-xs leading-snug">{msg.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setIsMessagesPopupOpen(true)}
                    className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 text-[#D4AF37] rounded-lg text-xs font-extrabold transition-all border border-[#D4AF37]/10 cursor-pointer text-center"
                  >
                    Buka Papan Pengumuman Hub →
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ROOMLIST TAB */}
          {activeTab === 'roomlist' && (
            <div className="animate-in fade-in duration-200" id="roomlist-tab">
              <RoomListManager 
                rooms={rooms} 
                onAddRoom={handleAddRoom} 
                selectedGroupFilter={selectedGroupFilter}
                groups={groups}
                onUpdateRooms={setRooms}
                onUpdateJamaahList={setJamaahList}
                jamaahList={jamaahList}
                currentRole="HANDLING"
              />
            </div>
          )}

          {/* CONSOLIDATED RESOURCES HUB (SOP, PAKET, DOKUMEN) */}
          {activeTab === 'resources' && (
            <div className="space-y-6 animate-in fade-in duration-200" id="resources-hub-tab">
              {/* Tabs nav bar for Resources */}
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex justify-center items-center">
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 max-w-md w-full select-none font-bold text-[10px]">
                  <button
                    onClick={() => setActiveResourceTab('sop')}
                    className={`flex-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                      activeResourceTab === 'sop' ? 'bg-white text-slate-900 font-extrabold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>SOP Handling</span>
                  </button>
                  <button
                    onClick={() => setActiveResourceTab('packages')}
                    className={`flex-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                      activeResourceTab === 'packages' ? 'bg-white text-slate-900 font-extrabold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Paket Info</span>
                  </button>
                  <button
                    onClick={() => setActiveResourceTab('documents')}
                    className={`flex-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                      activeResourceTab === 'documents' ? 'bg-white text-slate-900 font-extrabold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Arsip Berkas</span>
                  </button>
                </div>
              </div>

              {/* Resources render container */}
              {activeResourceTab === 'sop' && (
                <div className="animate-in fade-in duration-150">
                  <SOPList sops={sops} />
                </div>
              )}

              {activeResourceTab === 'packages' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="resource-packages-grid">
                    {packages.filter(p => p.groupName === selectedGroupFilter).map((pkg) => (
                      <div key={pkg.id} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
                        <div>
                          <div className="p-4 bg-emerald-50/50 border-b border-slate-150 flex justify-between items-center">
                            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">{pkg.groupName}</h3>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                              🛡️ {pkg.status}
                            </span>
                          </div>

                          <div className="p-5 space-y-4 text-xs font-semibold">
                            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                              <div>
                                <span className="text-[10px] text-slate-400 block uppercase font-bold">Rute Penerbangan</span>
                                <span className="text-slate-800 font-bold">{pkg.flightRoute}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 block uppercase font-bold">Kode Flight</span>
                                <span className="text-slate-800 font-mono text-xs">{pkg.flightCode}</span>
                              </div>
                            </div>

                            <div className="space-y-3 pb-3 border-b border-slate-100">
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-bold">🕋 Hotel Makkah:</span>
                                <span className="font-bold text-slate-800 text-right">{pkg.hotelMakkah}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-bold">🕌 Hotel Madinah:</span>
                                <span className="font-bold text-slate-800 text-right">{pkg.hotelMadinah}</span>
                              </div>
                            </div>

                            <div className="pb-3 border-b border-slate-100 grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-[10px] text-slate-400 block uppercase font-bold">Muthawif Pembimbing</span>
                                <span className="text-indigo-900 font-bold">{pkg.mutawwifName}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 block uppercase font-bold">Jumlah Jamaah</span>
                                <span className="text-indigo-950 font-black font-mono text-sm">{pkg.totalJamaah} Pax</span>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                                <span>Modul Bus Transporter :</span>
                                <span className="text-slate-800 font-mono">{pkg.busCompany}</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-1">
                                <strong className="text-slate-500 mr-1.5 font-bold animate-pulse">Team Bertugas:</strong>
                                {pkg.handlingTeam.map((team, tIdx) => (
                                  <span key={tIdx} className="px-2 py-0.5 bg-slate-100 rounded text-slate-850 font-black border border-slate-200">
                                    👨‍✈️ {team}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-slate-50 border-t border-slate-150 flex justify-end">
                            <button
                              onClick={() => { alert(`Menghubungi Muthawif ${pkg.mutawwifName} via WhatsApp...`); }} 
                              className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-[#D4AF37] font-bold rounded-lg text-[10px] cursor-pointer border border-[#D4AF37]/30"
                            >
                              📞 Kontak Koordinator Grup
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeResourceTab === 'documents' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4 animate-in fade-in duration-150">
                  {/* Local Group Selector Dropdown */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-250">
                    <div className="space-y-1">
                      <label className="text-[10px] sm:text-xs font-black text-slate-700 uppercase tracking-wider block">
                        Pilih Grup Jamaah
                      </label>
                      <select
                        value={docGroupFilter}
                        onChange={(e) => setDocGroupFilter(e.target.value)}
                        className="w-full sm:w-80 bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-[#D4AF37] shadow-2xs"
                      >
                        <option value="All">⚠️ Tampilkan Semua Grup Jamaah</option>
                        {groups.map((grp, idx) => (
                          <option key={idx} value={grp}>{grp}</option>
                        ))}
                      </select>
                    </div>
                    <div className="text-right text-[10px] text-slate-500 font-bold hidden sm:block">
                      * Seluruh berkas digital tersinkronisasi aman dengan imigrasi Saudi
                    </div>
                  </div>

                  {/* Simple Table with Group column */}
                  <div className="overflow-x-auto border border-slate-250 rounded-lg">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 font-bold">
                          <th className="p-3">Grup Jamaah</th>
                          <th className="p-3">Nama Dokumen</th>
                          <th className="p-3">Tipe</th>
                          <th className="p-3">Ukuran</th>
                          <th className="p-3 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {documents
                          .filter(docGroup => docGroupFilter === 'All' || docGroup.groupName === docGroupFilter)
                          .flatMap((docGroup) => 
                            docGroup.items.map((file) => ({
                              ...file,
                              groupName: docGroup.groupName
                            }))
                          ).map((file, idx) => (
                            <tr key={idx} className="hover:bg-slate-55/75 transition-colors font-medium text-slate-800">
                              <td className="p-3 font-bold text-[#A47F17]">{file.groupName}</td>
                              <td className="p-3 font-semibold text-slate-900">{file.name}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                                  file.type === 'visa' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                  file.type === 'passport' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                  file.type === 'ticket' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                  'bg-slate-100 text-slate-700 border-slate-200'
                                }`}>
                                  {file.type}
                                </span>
                              </td>
                              <td className="p-3 font-mono text-[11px] text-slate-500">{file.size}</td>
                              <td className="p-3">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => alert(`Simulasi pratinjau dokumen ${file.name} : berkas aman dan terverifikasi di imigrasi Riyadh.`)}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-905 rounded border border-slate-200 cursor-pointer shadow-3xs active:scale-95 transition-all"
                                    title="Buka Preview"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => alert(`Mengunduh file ${file.name} ke galeri handphone Anda.`)}
                                    className="p-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-[#D4AF37] rounded border border-[#D4AF37]/20 cursor-pointer shadow-3xs active:scale-95 transition-all"
                                    title="Tersedia Offline"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* JOINT REPORTS HUB (FLEXIBLE ROLE-BASED DASHBOARD) */}
          {activeTab === 'reports' && (
            <div className="space-y-6 animate-in fade-in duration-200" id="reports-hub-tab">
              {/* Header section with role indicators (Fit and compact as requested) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 w-full justify-between">
                  {currentRole === 'MANAGER' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-800">MANAGER PORTAL REPORTS</span>
                    </div>
                  ) : null}

                  {/* Subtabs lists - Made fit & simple widget buttons directly */}
                  <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 w-full md:w-auto overflow-x-auto font-bold text-xs select-none shadow-xs">
                    {currentRole === 'HANDLING' ? (
                      <>
                        <button
                          onClick={() => setHandlingReportSubTab('expenses')}
                          className={`flex-1 px-4 py-1.5 rounded transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                            handlingReportSubTab === 'expenses' ? 'bg-[#0F172A] text-[#D4AF37] font-extrabold' : 'text-slate-600 hover:text-slate-905'
                          }`}
                        >
                          <Wallet className="w-3.5 h-3.5 shrink-0" />
                          <span>Lapor Kas</span>
                        </button>
                        <button
                          onClick={() => setHandlingReportSubTab('attendance')}
                          className={`flex-1 px-4 py-1.5 rounded transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                            handlingReportSubTab === 'attendance' ? 'bg-[#0F172A] text-[#D4AF37] font-extrabold' : 'text-slate-600 hover:text-slate-905'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>Presensi</span>
                        </button>
                        <button
                          onClick={() => setHandlingReportSubTab('incident')}
                          className={`flex-1 px-4 py-1.5 rounded transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                            handlingReportSubTab === 'incident' ? 'bg-[#0F172A] text-[#D4AF37] font-extrabold' : 'text-slate-600 hover:text-slate-905'
                          }`}
                        >
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Lapor Kejadian</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setManagerReportSubTab('cashflow')}
                          className={`flex-1 px-4 py-1.5 rounded transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                            managerReportSubTab === 'cashflow' ? 'bg-[#D4AF37] text-slate-950 font-extrabold' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <DollarSign className="w-3.5 h-3.5 shrink-0" />
                          <span>Cashflow & Approval Riyadh</span>
                        </button>
                        <button
                          onClick={() => setManagerReportSubTab('schedule')}
                          className={`flex-1 px-4 py-1.5 rounded transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                            managerReportSubTab === 'schedule' ? 'bg-[#D4AF37] text-slate-950 font-extrabold' : 'text-slate-600 hover:text-slate-905'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>Jadwal Tugas Squad</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* RENDER HANDLING SUB-REPORTS */}
              {currentRole === 'HANDLING' && (
                <div className="space-y-6">
                  {handlingReportSubTab === 'expenses' && (
                    <div className="animate-in fade-in duration-150">
                      <FieldReport 
                        expenses={expenses} 
                        onSubmitExpense={handleAddExpense} 
                        walletBalance={(() => {
                          const userLower = (currentUser || '').toLowerCase();
                          // First try exact match from teamMembers where name matches currentUser
                          const activeTeam = teamMembers.find(t => t.name.toLowerCase() === userLower);
                          if (activeTeam) {
                            const wId = `wallet-${activeTeam.username}`;
                            return wallets.find(w => w.id === wId)?.balanceSAR || 0;
                          }
                          // Fallback to legacy
                          let computedWalletId = 'wallet-ahmad';
                          if (userLower.includes('fathur') || userLower.includes('yusuf') || userLower.includes('manager')) computedWalletId = 'wallet-manager';
                          return wallets.find(w => w.id === computedWalletId)?.balanceSAR || 0;
                        })()}
                        currentUser={currentUser || ''}
                        groups={groups}
                      />
                    </div>
                  )}

                  {handlingReportSubTab === 'attendance' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
                      {/* Attendance form linked directly to assigned duty tasks */}
                      {(() => {
                        const userLower = (currentUser || '').toLowerCase();
                        const userDuties = dutyTasks.filter(item => item.handlingName.toLowerCase() === userLower && item.status !== 'Selesai');
                        const hasDuties = userDuties.length > 0;

                        if (!hasDuties) {
                          return (
                            <div className="lg:col-span-12 bg-amber-50 border border-amber-200 p-5 rounded-xl text-center space-y-2">
                              <span className="text-2xl">⚠️</span>
                              <h4 className="font-extrabold text-amber-900 text-xs uppercase">Tidak Ada Penugasan Aktif</h4>
                              <p className="text-[11px] text-slate-650 max-w-md mx-auto">Anda tidak memiliki jadwal penugasan aktif saat ini, sehingga tidak dapat melakukan presensi.</p>
                            </div>
                          );
                        }

                        return (
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              const formData = new FormData(e.currentTarget);
                              const selectedDutyId = formData.get('selected_duty') as string;
                              const currentDuty = userDuties.find(d => d.id === selectedDutyId);
                              const currentCategory = currentDuty ? currentDuty.roleTag : '';
                              const currentSop = taskChecklists[currentCategory] || [];
                              
                              // Build list of completed checklists
                              const completedSopItems = currentSop.map((item, idx) => ({
                                task: item,
                                completed: !!checkedPresensiItems[idx]
                              }));

                              const newLog = {
                                id: `att-${Date.now()}`,
                                name: currentUser || teamMembers[0]?.name || 'Tim Lapangan',
                                date: new Date().toISOString().split('T')[0],
                                time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                                location: formData.get('location') as string,
                                type: formData.get('type') as string,
                                coordinate: `${(21.41 + Math.random() * 0.05).toFixed(4)}° N, ${(39.82 + Math.random() * 0.05).toFixed(4)}° E`,
                                sopItems: formData.get('type') === 'Masuk Tugas' ? completedSopItems : []
                              };

                              setAttendanceLogs([newLog, ...attendanceLogs]);
                              
                              // Mark task status as "Sedang Berjalan" if Masuk Tugas, or "Selesai" if Selesai Tugas!
                              if (currentDuty) {
                                let newStatus = currentDuty.status;
                                if (formData.get('type') === 'Masuk Tugas') {
                                  newStatus = 'Sedang Berjalan';
                                } else {
                                  newStatus = 'Selesai';
                                }
                                handleUpdateTask(currentDuty.id, { status: newStatus });
                              }

                              e.currentTarget.reset();
                              setCheckedPresensiItems({});
                              alert('Presensi berhasil dikirim dan diverifikasi!');
                            }}
                            className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4"
                          >
                            <h3 className="font-extrabold text-slate-900 text-xs uppercase border-b pb-2 tracking-tight">INPUT PRESENSI PENUGASAN</h3>
                            
                            {/* Schedule info task linkage */}
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider">JADWAL TUGAS ANDA</label>
                              <select 
                                name="selected_duty" 
                                required 
                                value={presensiDutyId || userDuties[0]?.id || ''}
                                onChange={(e) => {
                                  setPresensiDutyId(e.target.value);
                                  setCheckedPresensiItems({});
                                }}
                                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 cursor-pointer"
                              >
                                {userDuties.map(task => (
                                  <option key={task.id} value={task.id}>
                                    [{task.roleTag}] {task.groupName}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider font-sans">LOKASI LINGKUP PENUGASAN</label>
                              <select name="location" required className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 cursor-pointer">
                                <option value="Hotel Makkah">Hotel Makkah</option>
                                <option value="Hotel Madinah">Hotel Madinah</option>
                                <option value="Bandara Jeddah">Bandara Jeddah</option>
                                <option value="Bandara Madinah">Bandara Madinah</option>
                                <option value="City Tour">City Tour</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider font-sans">STATUS PRESENSI</label>
                              <select 
                                name="type" 
                                required 
                                value={presensiStatus}
                                onChange={(e) => {
                                  setPresensiStatus(e.target.value);
                                  setCheckedPresensiItems({});
                                }}
                                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-805 cursor-pointer"
                              >
                                <option value="Masuk Tugas">Masuk Tugas (Check In)</option>
                                <option value="Selesai Tugas">Selesai Tugas (Check Out)</option>
                              </select>
                            </div>

                            {/* Dynamically display checklist if Masuk Tugas */}
                            {(() => {
                              const selectedId = presensiDutyId || userDuties[0]?.id;
                              const activeDuty = userDuties.find(d => d.id === selectedId);
                              const activeCategory = activeDuty ? activeDuty.roleTag : '';
                              const activeSopItems = taskChecklists[activeCategory] || [];
                              
                              if (presensiStatus === 'Masuk Tugas' && activeSopItems.length > 0) {
                                return (
                                  <div className="p-3.5 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-lg space-y-2.5">
                                    <div className="flex items-center gap-1.5 border-b border-[#D4AF37]/10 pb-1.5">
                                      <FileSpreadsheet className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                                      <span className="text-[10px] text-[#A47F17] uppercase font-black block tracking-wide">
                                        Checklist Verifikasi: {activeCategory}
                                      </span>
                                    </div>
                                    <div className="space-y-2">
                                      {activeSopItems.map((item, idx) => (
                                        <label key={idx} className="flex items-start gap-2 text-[11px] text-slate-700 font-bold cursor-pointer hover:text-slate-900">
                                          <input 
                                            type="checkbox"
                                            checked={!!checkedPresensiItems[idx]}
                                            onChange={(e) => {
                                              setCheckedPresensiItems(prev => ({
                                                ...prev,
                                                [idx]: e.target.checked
                                              }));
                                            }}
                                            className="mt-0.5 accent-[#D4AF37]"
                                          />
                                          <span>{item}</span>
                                        </label>
                                      ))}
                                    </div>
                                    <p className="text-[9px] text-slate-400 italic">Harap periksa dan centang kegiatan yang telah Anda laksanakan.</p>
                                  </div>
                                );
                              }
                              return null;
                            })()}

                            {/* Camera Snap Simulation Section */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Absensi Foto</label>
                              <div className="border border-dashed border-slate-250 rounded-lg p-3.5 bg-slate-50/50 flex flex-col items-center justify-center text-center">
                                <Camera className="w-5 h-5 text-[#D4AF37] shrink-0" />
                                <span className="text-[10px] text-slate-500 font-extrabold mt-1 uppercase">Kamera Selfie Aktif</span>
                                <span className="text-[9px] text-slate-400 mt-0.5">Sertifikasi Wajah & Latar Penugasan</span>
                              </div>
                            </div>

                            <button 
                              type="submit" 
                              className="w-full py-2.5 bg-[#1A1A1A] hover:bg-black border border-[#D4AF37]/35 text-[#D4AF37] font-black text-xs rounded-lg transition-all cursor-pointer shadow-xs uppercase tracking-tight"
                            >
                              Kirim Absen Saya
                            </button>
                          </form>
                        );
                      })()}

                      {/* Attendance logs lists - Private history for the currently logged-in user */}
                      <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                        <h3 className="font-extrabold text-slate-900 text-xs uppercase border-b pb-2 tracking-tight">Riwayat Presensi</h3>
                        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-2" id="attendance-feed">
                          {(() => {
                            const myLogs = attendanceLogs.filter((log: any) => log.name.toLowerCase() === (currentUser || '').toLowerCase());
                            if (myLogs.length === 0) {
                              return <p className="py-8 text-center text-slate-405 italic text-xs">Belum ada riwayat presensi tercatat untuk Anda.</p>;
                            }
                            return myLogs.map((log: any) => (
                              <div key={log.id} className="py-3 flex flex-col gap-2.5 text-xs font-semibold">
                                <div className="flex justify-between items-center gap-3">
                                  <div className="flex items-start gap-2">
                                    <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    <div>
                                      <strong className="text-slate-850 font-extrabold">{log.name}</strong>
                                      <span className="text-[10px] text-slate-400 block mt-0.5 font-bold">
                                        📍 {log.location}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase border ${
                                      log.type === 'Masuk Tugas' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                                    }`}>
                                      {log.type}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">{log.date} @ {log.time}</span>
                                  </div>
                                </div>

                                {log.sopItems && log.sopItems.length > 0 && (
                                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] space-y-1 text-slate-600 block pl-3.5">
                                    <p className="font-extrabold text-[#A47F17] flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                                      <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                                      <span>SOP Checklist Realisasi Kegiatan:</span>
                                    </p>
                                    <ul className="space-y-1 font-bold">
                                      {log.sopItems.map((sop: any, sIdx: number) => (
                                        <li key={sIdx} className="flex items-start gap-1.5">
                                          <span className={`shrink-0 mt-0.5 text-xs font-black ${sop.completed ? 'text-emerald-600' : 'text-rose-500'}`}>
                                            {sop.completed ? '✓' : '✗'}
                                          </span>
                                          <span className={sop.completed ? 'text-slate-800 font-semibold' : 'text-slate-400 font-normal line-through'}>
                                            {sop.task}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  )}

                  {handlingReportSubTab === 'incident' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
                      {/* Incident form */}
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const newLog = {
                            id: `inc-${Date.now()}`,
                            name: currentUser || teamMembers[0]?.name || 'Tim Lapangan',
                            title: formData.get('title') as string,
                            text: formData.get('text') as string,
                            severity: formData.get('severity') as string,
                            groupName: formData.get('groupName') as string,
                            date: new Date().toISOString().split('T')[0],
                            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                            isResolved: false
                          };
                          setIncidentLogs([newLog, ...incidentLogs]);
                          e.currentTarget.reset();
                          alert('Laporan Kejadian sukses dikirim!');
                        }}
                        className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs font-semibold"
                      >
                        <h3 className="font-extrabold text-slate-900 text-xs uppercase border-b pb-2 tracking-tight">Laporan Lapangan</h3>
                        <p className="text-[10.5px] text-slate-400 font-medium leading-normal -mt-2">Isian kalimat pendek (Contoh: Waktu Kedatangan Bandara)</p>
                        
                        {/* Group Selector */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Grup Jamaah</label>
                          <select name="groupName" required className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 cursor-pointer">
                            {groups.map((g) => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider">JUDUL KEJADIAN</label>
                          <input 
                            required 
                            name="title" 
                            type="text" 
                            placeholder="Contoh: Waktu Kedatangan Bandara" 
                            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 placeholder-slate-400" 
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Tipe Laporan</label>
                          <select name="severity" required className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-805 cursor-pointer">
                            <option value="Informasi">Informasi</option>
                            <option value="Masukan">Masukan</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Keterangan</label>
                          <textarea 
                            required 
                            name="text" 
                            rows={3} 
                            placeholder="Jelaskan keterangan kejadian lapangan secara jelas..." 
                            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-805 placeholder-slate-400" 
                          />
                        </div>

                        <button 
                          type="submit" 
                          className="w-full py-2.5 bg-[#1A1A1A] hover:bg-black border border-[#D4AF37]/35 text-[#D4AF37] font-black text-xs rounded-lg transition-all cursor-pointer shadow-xs uppercase tracking-tight"
                        >
                          Kirim Laporan
                        </button>
                      </form>

                      {/* Incident history logs list */}
                      <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                        <h3 className="font-extrabold text-slate-900 text-xs uppercase border-b pb-2 tracking-tight">Riwayat Laporan Kejadian</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2" id="incident-feed">
                          {incidentLogs.map((inc: any) => (
                            <div key={inc.id} className="p-3 bg-slate-50/70 border border-slate-150 rounded-lg space-y-2 text-xs font-semibold">
                              <div className="flex justify-between items-start flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                    inc.severity === 'Masukan' ? 'bg-amber-50 text-amber-805 border border-amber-200' :
                                    inc.severity === 'Informasi' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                                    'bg-indigo-50 text-indigo-805 border border-indigo-200'
                                  }`}>
                                    {inc.severity || 'Laporan'}
                                  </span>
                                  <strong className="text-slate-850 font-extrabold">{inc.title}</strong>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">{inc.date} @ {inc.time}</span>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed">{inc.text}</p>
                              
                              {inc.groupName && (
                                <div className="text-[10px] text-indigo-700 font-bold flex items-center gap-1">
                                  <Folder className="w-3 h-3 text-indigo-700 shrink-0" />
                                  <span>Grup: {inc.groupName}</span>
                                </div>
                              )}

                              <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-slate-200/40">
                                <span className="font-bold text-slate-450 flex items-center gap-1">
                                  <span>Oleh:</span>
                                  <User className="w-3 h-3 text-slate-450 shrink-0" />
                                  <span>{inc.name}</span>
                                </span>
                                <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                                  <span>✓</span>
                                  <span>Terkirim ke Manager</span>
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* RENDER MANAGER SUB-REPORTS */}
              {currentRole === 'MANAGER' && (
                <div className="space-y-6">
                  {managerReportSubTab === 'cashflow' && (
                    <div className="animate-in fade-in duration-150">
                      <ManagerCashflow 
                        wallets={wallets} 
                        transactions={transactions} 
                        fieldReports={expenses} 
                        teamMembers={teamMembers}
                        onAddTransaction={handleAddTransaction} 
                        onApproveFieldReport={handleApproveFieldReport} 
                        onRejectFieldReport={handleRejectFieldReport} 
                      />
                    </div>
                  )}

                  {managerReportSubTab === 'schedule' && (
                    <div className="animate-in fade-in duration-150">
                      <ManagerSchedule 
                        tasks={dutyTasks} 
                        onAddTask={handleAddTask} 
                        onToggleTaskStatus={handleToggleTaskStatus} 
                        groups={groups}
                        teamMembers={teamMembers}
                        taskChecklists={taskChecklists}
                        onUpdateTaskChecklists={setTaskChecklists}
                        onDeleteTask={handleDeleteTask}
                        onUpdateTask={handleUpdateTask}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MESSAGES & NOTIFICATIONS HUB TAB (DISABLED IN FAVOR OF SLEEK POPUP OVERLAY) */}
          {activeTab === 'messages_disabled' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200" id="messages-tab-section">
              
              {/* Left Column: Messages displays */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#0F172A]" />
                    <span>Instruksi Pusat & Komunikasi</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Daftar siaran berita urgent dan koordinasi tim dari kordinator di Indonesia</p>
                </div>

                <div className="space-y-4.5" id="messages-feed">
                  {broadcasts.map((msg) => (
                    <div 
                      key={msg.id} 
                      onClick={() => handleMarkMessageRead(msg.id)}
                      className={`p-5 rounded-xl border transition-all cursor-pointer ${
                        !msg.isRead 
                          ? 'bg-amber-50/40 border-amber-300 shadow-sm ring-1 ring-amber-300/10' 
                          : 'bg-white border-slate-200 hover:border-slate-350'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] text-slate-400 font-bold">
                              Pengirim: <strong className="text-slate-600">{msg.sender}</strong>
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              msg.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {msg.priority} Priority
                            </span>
                            {!msg.isRead && (
                              <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded text-[9.5s] font-extrabold uppercase">
                                Baru
                              </span>
                            )}
                          </div>
                          
                          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                            {msg.title}
                          </h3>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0 pt-0.5">
                          {msg.time}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-705 leading-relaxed mt-3 font-normal">
                        {msg.text}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400">
                        * Klik pesan ini untuk menandai sudah dibaca di database pusat
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Broadcast Form ONLY FOR MANAGER OR ADMIN FOR HIGH-FIDELITY TESTING */}
              <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Send className="w-5 h-5 text-indigo-900" />
                    <span>Diseminasi / Siarkan Pengumuman (Manager)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Gunakan modul ini untuk mensimulasikan pengرسalan instruksi dadakan dari Jakarta langsung ke handphone Ahmad/Faiz di tanah suci.
                  </p>
                </div>

                <form onSubmit={handleBroadcastMessage} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">JUDUL ALERTS / PEMBERITAHUAN</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Kunci Kamar Hotel Makkah Siap Diambil"
                      value={msgTitle}
                      onChange={(e) => setMsgTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-900/10 focus:border-indigo-900 font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">PRIORITAS INSTRUKSI</label>
                    <select
                      value={msgPriority}
                      onChange={(e) => setMsgPriority(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
                    >
                      <option value="High">🚨 High Priority (Instant push popup)</option>
                      <option value="Medium">⚠️ Medium Priority (Standard Newsfeed)</option>
                      <option value="Low">ℹ️ Low Priority (Informational logs)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">ISI PESAN DETAIL / ALUR INSTALALASI</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Masukkan detail instruksi, nomor telp penanggung jawab, serta alur penanganan darurat di lapangan..."
                      value={msgText}
                      onChange={(e) => setMsgText(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-900/10 focus:border-indigo-900 text-slate-750"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-[#0F172A] hover:bg-[#1E293B] text-[#D4AF37] font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow border border-[#D4AF37]/35 active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Siarkan Siaran Instant</span>
                  </button>
                </form>

                <div className="mt-4 p-3 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900 leading-normal flex items-start gap-1.5 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Simulasi: Setelah mengklik tombol kirim, silakan ganti role ke Lapangan (Ahmad) menggunakan toggler di atas halaman untuk menguji unread notification counter.
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* AKUN / ACCOUNT TAB SECTION */}
          {activeTab === 'account' && (() => {
            const userLower = (currentUser || '').toLowerCase();
            const matchingMemberIndex = teamMembers.findIndex(t => 
              t.name.toLowerCase() === userLower || t.username.toLowerCase() === userLower
            );
            const matchingMember = matchingMemberIndex !== -1 ? teamMembers[matchingMemberIndex] : null;

            return (
              <div className="space-y-4 animate-in fade-in duration-200" id="account-tab-section">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <h2 className="text-xs font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                    <User className="w-4 h-4 text-[#D4AF37]" />
                    <span>Profil Akun</span>
                  </h2>
                </div>

                {bioSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-250 text-xs text-emerald-800 font-extrabold rounded-xl animate-bounce flex items-center gap-2">
                    <span className="text-sm">✓</span>
                    <span>{bioSuccessMsg}</span>
                  </div>
                )}

                {/* Biodata Tim Card */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  
                  {isEditingBio && matchingMember ? (
                    /* EDIT BIODATA FORM (Direct state update synchronizing to team list) */
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                        <User className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-xs font-black text-slate-700 uppercase tracking-wide">Edit Biodata Akun Terintegrasi</span>
                      </div>
                      
                      <div className="space-y-2.5 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Nama Lengkap</label>
                          <input 
                            type="text" 
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                            value={editBioName}
                            onChange={(e) => setEditBioName(e.target.value)}
                            placeholder="Contoh: Ahmad Syarif"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">WhatsApp / No. Telepon</label>
                          <input 
                            type="text" 
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                            value={editBioPhone}
                            onChange={(e) => setEditBioPhone(e.target.value)}
                            placeholder="Contoh: +966 50 123 4567"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1">Username Login</label>
                          <input 
                            type="text" 
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                            value={editBioUsername}
                            onChange={(e) => setEditBioUsername(e.target.value)}
                            placeholder="Contoh: ahmad_syarif"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1">Status Lapangan</label>
                          <select
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                            value={editBioStatus}
                            onChange={(e) => setEditBioStatus(e.target.value as any)}
                          >
                            <option value="Aktif">Aktif di Lapangan</option>
                            <option value="Standby">Standby / Cadangan</option>
                            <option value="Cuti">Sedang Cuti Kerja</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1">Password Baru</label>
                          <div className="relative">
                            <input 
                              type={showBioPassword ? "text" : "password"} 
                              className="w-full p-2 pr-9 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                              value={editBioPassword}
                              onChange={(e) => setEditBioPassword(e.target.value)}
                              placeholder="Ketik password baru jika ingin mengubah"
                            />
                            <button
                              type="button"
                              onClick={() => setShowBioPassword(!showBioPassword)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                              title={showBioPassword ? "Sembunyikan Password" : "Tampilkan Password"}
                            >
                              {showBioPassword ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleUpdateSelfBiodata({
                              name: editBioName,
                              phone: editBioPhone,
                              username: editBioUsername,
                              password: editBioPassword,
                              status: editBioStatus
                            });
                            setIsEditingBio(false);
                          }}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg cursor-pointer transition-colors shadow-xs"
                        >
                          Simpan Perubahan
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingBio(false)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-705 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* VIEW PROFILE MODE */
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center border border-[#D4AF37]/40 shadow-inner text-xl font-black">
                            {matchingMember ? matchingMember.name.charAt(0) : currentUser?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm">{matchingMember ? matchingMember.name : currentUser}</h3>
                            <p className="text-[10px] font-bold text-[#D4AF37] uppercase">
                              {matchingMember ? matchingMember.role : (currentRole === 'HANDLING' ? 'Handling Executive' : 'Operations Manager')}
                            </p>
                            <p className="text-[10px] text-emerald-700 font-bold mt-0.5 uppercase">
                              STATUS: {matchingMember ? matchingMember.status : 'AKTIF'} DI TANAH SUCI
                            </p>
                          </div>
                        </div>

                        {matchingMember && (
                          <button
                            onClick={() => {
                              setEditBioName(matchingMember.name);
                              setEditBioPhone(matchingMember.phone);
                              setEditBioUsername(matchingMember.username);
                              setEditBioStatus(matchingMember.status);
                              setEditBioPassword(matchingMember.password || 'pass');
                              setIsEditingBio(true);
                            }}
                            className="bg-amber-50 hover:bg-amber-100 text-[#A47F17] hover:text-[#8e6b10] p-1.5 px-3 rounded-lg border border-amber-200/55 text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer transition-all active:scale-95 duration-100"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit Bio</span>
                          </button>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-3.5 space-y-2.5 text-xs">
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-400 font-medium">Divisi Kerja</span>
                          <span className="font-bold text-slate-800">
                            {matchingMember ? matchingMember.role : 'Ground Handling Saudi'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-400 font-medium">Username Login</span>
                          <span className="font-mono font-bold text-slate-700">
                            {matchingMember ? matchingMember.username : 'manager_fathur'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-400 font-medium">Wilayah Kerja</span>
                          <span className="font-bold text-[#D4AF37]">
                            {matchingMember 
                              ? (matchingMember.role.toLowerCase().includes('jeddah') ? 'Bandara King Abdulaziz Jeddah' 
                                 : matchingMember.role.toLowerCase().includes('makkah') ? 'Haram Makkah Sector' 
                                 : 'Makkah - Madinah - Jeddah') 
                              : (currentRole === 'HANDLING' ? 'Makkah - Madinah - Jeddah' : 'Sentral HQ Jakarta & KSA')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-400 font-medium">WhatsApp / No. Telepon</span>
                          <span className="font-bold text-slate-800">
                            {matchingMember ? matchingMember.phone : '+966 50 123 4567'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-400 font-medium">Password</span>
                          <span className="font-mono font-bold text-slate-700">
                            ••••••••
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Log Out Button */}
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-lg text-xs tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95 border border-rose-500"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      <span>KELUAR APLIKASI (LOG OUT)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-40 flex justify-around items-center px-1 shadow-lg shrink-0" id="mobile-bottom-nav">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-all active:scale-95 duration-100 ${
            activeTab === 'dashboard' ? 'text-[#D4AF37]' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Compass className="w-4.5 h-4.5 stroke-2" />
          <span className="text-[9px] font-black mt-1 uppercase tracking-tight">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('roomlist')}
          className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-all active:scale-95 duration-100 ${
            activeTab === 'roomlist' ? 'text-[#D4AF37]' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Hotel className="w-4.5 h-4.5 stroke-2" />
          <span className="text-[9px] font-black mt-1 uppercase tracking-tight">Room List</span>
        </button>

        <button
          onClick={() => { setActiveTab('resources'); setActiveResourceTab('sop'); }}
          className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-all active:scale-95 duration-100 ${
            activeTab === 'resources' ? 'text-[#D4AF37]' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Folder className="w-4.5 h-4.5 stroke-2" />
          <span className="text-[9px] font-black mt-1 uppercase tracking-tight">Dokumen</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-all active:scale-95 duration-100 ${
            activeTab === 'reports' ? 'text-[#D4AF37]' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4.5 h-4.5 stroke-2" />
          <span className="text-[9px] font-black mt-1 uppercase tracking-tight">Laporan</span>
        </button>

        <button
          onClick={() => setActiveTab('account')}
          className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-all active:scale-95 duration-100 ${
            activeTab === 'account' ? 'text-[#D4AF37]' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-4.5 h-4.5 stroke-2" />
          <span className="text-[9px] font-black mt-1 uppercase tracking-tight">Akun</span>
        </button>
      </div>

      {/* MESSAGES & NOTIFICATIONS POPUP MODAL (Fit, compact modal) */}
      {isMessagesPopupOpen && (
        <div className="absolute inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl border border-slate-200 flex flex-col max-h-[75%] overflow-hidden animate-in zoom-in-95 duration-150" id="messages-popup-dialog">
            
            {/* Header */}
            <div className="p-3 bg-slate-900 text-white border-b border-[#D4AF37]/20 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#D4AF37] stroke-2" />
                <span className="text-xs font-black tracking-wide uppercase text-white">Notifikasi</span>
              </div>
              <button 
                onClick={() => setIsMessagesPopupOpen(false)}
                className="p-1 hover:bg-slate-850 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-slate-50">
              {broadcasts.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-bold">
                  Belum ada notifikasi baru untuk Anda.
                </div>
              ) : (
                broadcasts.map((msg) => (
                  <div 
                    key={msg.id}
                    onClick={() => handleMarkMessageRead(msg.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer bg-white ${
                      !msg.isRead 
                        ? 'border-amber-400 ring-1 ring-amber-400/20 shadow-xs' 
                        : 'border-slate-200 hover:border-slate-350'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                        msg.priority === 'High' ? 'bg-rose-105 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {msg.priority} Priority
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">{msg.time}</span>
                    </div>
                    <h4 className="font-extrabold text-slate-905 text-xs leading-snug mt-1">{msg.title}</h4>
                    <p className="text-[11px] text-slate-650 leading-relaxed mt-1.5">{msg.text}</p>
                    {!msg.isRead && (
                      <div className="text-right mt-2 text-[8px] text-amber-600 font-black uppercase tracking-wider animate-pulse">
                        ● Ketuk untuk menandai dibaca
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-white border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setIsMessagesPopupOpen(false)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-850 text-white font-extrabold rounded-md text-[10px] uppercase cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  </div>
  );
}
