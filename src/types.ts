/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// User Role Definition
export type UserRole = 'HANDLING' | 'MANAGER';

// Define Interface for SOPs
export interface SOPDoc {
  id: string;
  title: string;
  category: 'Airport' | 'Hotel' | 'Logistics' | 'Ziarah' | 'Lounge';
  lastUpdated: string;
  important: boolean;
  content: string[];
}

// Define Room Manifest
export interface RoomManifest {
  id: string;
  groupName: string;
  hotelName: 'Makkah' | 'Madinah';
  hotelDetailName: string;
  roomNumber: string;
  roomType: 'Double' | 'Triple' | 'Quad';
  jamaahNames: string[];
  notes?: string;
  colorTag?: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'slate';
}

// Define Package Info
export interface PackageDetail {
  id: string;
  groupName: string;
  
  // Keberangkatan
  departureDate: string;
  departureFlightCode: string;
  departureFlightRoute: string;
  departureTimeRange: string;
  
  // Kepulangan
  returnDate: string;
  returnFlightCode: string;
  returnFlightRoute: string;
  returnTimeRange: string;
  
  // Jamaah & Packages
  totalJamaah: number;
  jamaahPerPackage: string;
  
  // Hotel Details
  hotelDetails: string;
  
  // PIC
  tourLeader: string;
  mutawwifName: string;
  
  // Meals
  arrivalMeals: string;
  returnMeals: string;
  
  // Linked Hotel Infographics
  connectedHotels?: string[];
  
  status: 'Pre-Arrival' | 'In Makkah' | 'In Madinah' | 'Returning' | 'Completed';
}

export interface HotelInfographic {
  id: string;
  hotelName: string;
  city: 'Makkah' | 'Madinah' | 'Jeddah' | 'Lainnya' | string;
  restaurantInfo: string;
  mealTimes: string;
  receptionistInfo: string;
  wifiInfo: string;
  hotelPhoto: string;
  restaurantPhoto: string;
  receptionistPhoto: string;
}

// Define Document Grouped by Flight Group
export interface DocumentItem {
  id: string;
  name: string; // e.g. "Visa_Group_SV816.pdf"
  type: 'visa' | 'passport' | 'ticket' | 'manifest';
  size: string; // e.g. "2.4 MB"
  uploadDate: string;
}

export interface DocumentGroup {
  id: string;
  groupName: string;
  items: DocumentItem[];
}

// Define Field Expense Report
export interface FieldExpenseReport {
  id: string;
  handlingId: string;
  handlingName: string;
  groupName: string;
  category: string;
  amountSAR: number;
  note: string;
  date: string;
  receiptUrl?: string; // local image or placeholder
  status: 'Pending' | 'Selesai' | 'Ditolak';
  walletSourceId: string; // Account/Wallet debited if approved
}

// Define Broadcast Messages
export interface BroadcastMessage {
  id: string;
  sender: string;
  title: string;
  text: string;
  time: string;
  priority: 'High' | 'Medium' | 'Low';
  isRead: boolean;
  timestamp?: number;
}

// Define Duty Schedule
export interface DutyTask {
  id: string;
  handlingName: string;
  roleTag: 'Check In Hotel' | 'Check Out Perpindahan Kota' | 'Check Out Bandara' | 'City Tour' | 'Bandara Kedatangan' | 'Bandara Kepulangan';
  groupName: string;
  date: string;
  timeRange: string; // e.g. "08:00 - 13:00 AST"
  location: string;
  status: 'Belum Selesai' | 'Sedang Berjalan' | 'Selesai';
}

// Define Financial Wallet
export interface WalletAccount {
  id: string;
  name: string;
  balanceSAR: number;
  balanceIDR: number;
  type: 'SNB Bank' | 'Mandiri Rekening' | 'Cash Riyal Lapangan' | 'Brankas Pusat';
  holder: string;
}

// Define Manager Cashflow Ledger
export interface CashflowTransaction {
  id: string;
  title: string;
  category: 'Dana Drop' | 'SOP Setup' | 'Operasional Lapangan' | 'Talangan Darurat' | 'Lain-lain';
  type: 'Masuk' | 'Keluar';
  amountSAR: number;
  walletId: string;
  date: string;
  byUser: string;
  proofUrl?: string;
  status: 'Approved' | 'Review';
}

// Real-Time and default mock data setup
export const INITIAL_SOPS: SOPDoc[] = [
  {
    id: 'sop-1',
    title: 'SOP Penyambutan Jamaah di Bandara King Abdulaziz Jeddah',
    category: 'Airport',
    lastUpdated: '22 Mei 2026',
    important: true,
    content: [
      'Tim Handling standby di terminal kedatangan internasional 2 jam sebelum pesawat mendarat.',
      'Memastikan seluruh banner sambutan Jejak Imani terpasang rapi di area yang diizinkan.',
      'Koordinasi dengan pihak Wukala untuk mempercepat proses imigrasi jamaah.',
      'Membagi air Zam-zam botol kecil (jika tersedia) dan snack box selamat datang.',
      'Mengarahkan jamaah ke bus yang telah ditentukan secara tertib, dahulukan jamaah lansia.'
    ]
  },
  {
    id: 'sop-2',
    title: 'SOP Distribusi Koper Serta Porter Hotel Makkah',
    category: 'Logistics',
    lastUpdated: '15 Mei 2026',
    important: true,
    content: [
      'Segera setelah bus jamaah tiba di hotel, tim handling menghitung ulang jumlah koper di bagasi bus.',
      'Kelompokkan koper berdasarkan label warna kamar yang telah disiapkan sebelum kedatangan.',
      'Koordinasi dengan Bellboy / Porter hotel untuk mempercepat pengantaran koper langsung ke depan kamar.',
      'Pastikan tidak ada koper tertukar. Beri checklist pada manifest porter.'
    ]
  },
  {
    id: 'sop-3',
    title: 'SOP Check-In & Pembagian Kunci Kamar Hotel Madinah',
    category: 'Hotel',
    lastUpdated: '18 Mei 2026',
    important: false,
    content: [
      'Ambil rooming list dari front desk hotel Madinah dan cocokan ulang dengan rooming list Jejak Imani.',
      'Siapkan amplop kunci kamar yang berisi password Wi-Fi, jam makan bento/parasmanan, serta nomor kontak Muthawif.',
      'Gunakan lobi khusus atau lounge transit hotel untuk menghindari keramaian dengan grup umroh lain.'
    ]
  },
  {
    id: 'sop-4',
    title: 'SOP Pendampingan City Tour Jiarah Kota Madinah',
    category: 'Ziarah',
    lastUpdated: '10 Mei 2026',
    important: false,
    content: [
      'Standby di lobi 30 menit sebelum jadwal keberangkatan bus.',
      'Lakukan pengecekan absensi fisik jamaah sebelum pintu bus ditutup.',
      'Pastikan Muthawif telah menyiapkan mic audio bus dan menjelaskan sejarah destinasi (Masjid Quba, Kebun Kurma, Jabal Uhud).',
      'Siapkan kotak P3K darurat dan air mineral cadangan di bagasi bus.'
    ]
  }
];

export const INITIAL_ROOMLIST: RoomManifest[] = [
  {
    id: 'room-1',
    groupName: 'Umroh Syawal Gold 2026',
    hotelName: 'Makkah',
    hotelDetailName: 'Pullman ZamZam Makkah',
    roomNumber: '1405',
    roomType: 'Triple',
    jamaahNames: ['Bpk. Ahmad Subarjo', 'Ibu Aminah Subarjo', 'Sdr. Rahmat Subarjo'],
    notes: 'Dekat dengan lift, butuh kursi roda untuk Ibu.'
  },
  {
    id: 'room-2',
    groupName: 'Umroh Syawal Gold 2026',
    hotelName: 'Makkah',
    hotelDetailName: 'Pullman ZamZam Makkah',
    roomNumber: '1410',
    roomType: 'Double',
    jamaahNames: ['Bpk. Harry Prasetyo', 'Ibu Ratih Prasetyo'],
    notes: 'Kamar Honeymoon Couple.'
  },
  {
    id: 'room-3',
    groupName: 'Umroh Syawal Gold 2026',
    hotelName: 'Madinah',
    hotelDetailName: 'Dallah Taibah Madinah',
    roomNumber: '702',
    roomType: 'Quad',
    jamaahNames: ['Bpk. Ridwan Hakim', 'Bpk. Hendra Wijaya', 'Bpk. Yusuf Mansur', 'Bpk. Farhan Ali'],
    notes: 'Kamar khusus bapak-bapak.'
  },
  {
    id: 'room-4',
    groupName: 'Haji Furoda Premium 2026',
    hotelName: 'Makkah',
    hotelDetailName: 'Fairmont Clock Tower',
    roomNumber: '2911',
    roomType: 'Double',
    jamaahNames: ['Bpk. Dr. Irfan Kamil', 'Ibu Dr. Sandra Kamil'],
    notes: 'Kamar dengan view langsung Ka`bah.'
  }
];

export const INITIAL_PACKAGES: PackageDetail[] = [
  {
    id: 'pkg-1',
    groupName: 'Umroh Reguler 11 Juni 2026 (Madinah Awal)',
    departureDate: '11 Juni 2026',
    departureFlightCode: 'SV 819',
    departureFlightRoute: 'CGK - JED',
    departureTimeRange: '17:30 - 23:00',
    returnDate: '19 Juni 2026',
    returnFlightCode: 'SV 818',
    returnFlightRoute: 'JED - CGK',
    returnTimeRange: '01:55 - 16:00',
    totalJamaah: 45,
    jamaahPerPackage: 'Reguler: 45 Jamaah',
    hotelDetails: 'Hotel Makkah: Rayhaan Marwa Rotana, Anjum\nHotel Madinah: Al Anshor Golden Tulip, Maden Rawdah',
    tourLeader: 'Ust. Fulan',
    mutawwifName: 'Ust. Abdul Malik, Lc',
    arrivalMeals: 'Breakfast: Albaik + Nasi, Lunch at Hotel: Mealbox',
    returnMeals: 'Dinner: Mealbox, Breakfast: Mealbox',
    status: 'In Makkah'
  },
  {
    id: 'pkg-2',
    groupName: 'Umroh Sapphire Ruby 14 Juni 2026 (Makkah Awal)',
    departureDate: '14 Juni 2026',
    departureFlightCode: 'GA 980',
    departureFlightRoute: 'CGK - JED',
    departureTimeRange: '08:00 - 13:30',
    returnDate: '22 Juni 2026',
    returnFlightCode: 'GA 981',
    returnFlightRoute: 'JED - CGK',
    returnTimeRange: '15:00 - 05:00',
    totalJamaah: 30,
    jamaahPerPackage: 'Sapphire: 15 Jamaah, Ruby: 15 Jamaah',
    hotelDetails: 'Hotel Sapphire: Fairmont Clock Tower (Makkah), Oberoi (Madinah)\nHotel Ruby: Pullman ZamZam (Makkah), Dallah Taibah (Madinah)',
    tourLeader: 'Ust. Tariq',
    mutawwifName: 'Ust. Dr. Muhammad Al-Baqir',
    arrivalMeals: 'Lunch: Prasmanan Hotel',
    returnMeals: 'Dinner: Mealbox Bandara',
    status: 'Pre-Arrival'
  }
];

export const INITIAL_HOTEL_INFOS: HotelInfographic[] = [
  {
    id: 'hotel-1',
    hotelName: 'Pullman ZamZam',
    city: 'Makkah',
    restaurantInfo: 'Al Zahra Restaurant (Lantai 3)',
    mealTimes: 'Breakfast: 06:00-10:00, Dinner: 18:00-22:00',
    receptionistInfo: 'Lantai Ground (G), Hubungi Ext 0',
    wifiInfo: 'Nama WiFi: Pullman_Guest, Password: (sesuai nomor kamar)',
    hotelPhoto: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
    restaurantPhoto: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    receptionistPhoto: 'https://images.unsplash.com/photo-1582719478250-c89af14eb250?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_DOCUMENTS: DocumentGroup[] = [
  {
    id: 'docg-1',
    groupName: 'Umroh Syawal Gold 2026',
    items: [
      { id: 'item-1', name: 'E-Visa_Group_45_People.pdf', type: 'visa', size: '4.8 MB', uploadDate: '20 Mei 2026' },
      { id: 'item-2', name: 'Flight_Tickets_JED-CGK_SV816.pdf', type: 'ticket', size: '2.1 MB', uploadDate: '19 Mei 2026' },
      { id: 'item-3', name: 'Passport_Scans_Compiled.pdf', type: 'passport', size: '18.4 MB', uploadDate: '18 Mei 2026' },
      { id: 'item-4', name: 'Kamar_Makkah_Zamzam.pdf', type: 'manifest', size: '890 KB', uploadDate: '21 Mei 2026' }
    ]
  },
  {
    id: 'docg-2',
    groupName: 'Haji Furoda Premium 2026',
    items: [
      { id: 'item-5', name: 'Furoda_Visa_RoyalKingdom.pdf', type: 'visa', size: '5.2 MB', uploadDate: '21 Mei 2026' },
      { id: 'item-6', name: 'Saudi_Airlines_FirstClass_Group.pdf', type: 'ticket', size: '1.4 MB', uploadDate: '20 Mei 2026' },
      { id: 'item-7', name: 'Passport_VIP_JejakImani.pdf', type: 'passport', size: '12.1 MB', uploadDate: '20 Mei 2026' }
    ]
  }
];

// --- Tambahan Data Tim ---
export type Sector = 'Handling Jeddah' | 'Handling Madinah' | 'Handling Makkah';
export interface Team {
  id: string;
  name: string;
  sector: Sector;
}

export const TEAMS: Team[] = [
  "Ahmad Fauzi", "Budi Santoso", "Hasan Basri", "Zayd Siregar", "Umar Said", "Ali Hidayat",
  "Rasyid Rahman", "Karim Abdullah", "Farhan Idris", "Anwar Hakim", "Rizal Pratama", "Taufik Hidayat",
  "Fauzi Rahman", "Ilham Saputra", "Arief Rahman", "Syukur Hidayat", "Malik Ibrahim", "Salman Al Farisi", 
  "Suharto", "Joko Anwar", "Fikri Haikal", "Irfan Hakim", "Ghazali", "Rafi Ahmad", "Zulkifli", 
  "Hafizuddin", "Saifullah", "Fadhil", "Hamzah", "Thariq", "Iskandar", "Wahid", "Imran", "Mahmud", 
  "Hakim", "Ridwan", "Syamil", "Tantowi", "Zaki", "Mustafa"
].map((name, i) => {
  let sector: Sector;
  if (i < 14) sector = 'Handling Jeddah';
  else if (i < 27) sector = 'Handling Madinah';
  else sector = 'Handling Makkah';
  
  const idPrefix = sector === 'Handling Jeddah' ? 'jed' : sector === 'Handling Madinah' ? 'med' : 'mak';
  
  return {
    id: `${idPrefix}-${i + 1}`,
    name: name,
    sector: sector
  };
});

export const INITIAL_BROADCASTS: BroadcastMessage[] = [
  {
    id: 'msg-1',
    sender: 'Sistem Pusat (H. Fathur)',
    title: 'Pemberitahuan Delay Penerbangan SV-816',
    text: 'Mohon info kepada jamaah Umroh Syawal Gold 2026 bahwa pesawat Saudi Airline SV-816 rute JED-CGK mengalami keterlambatan 2 jam. Jadwal take off baru pukul 21:30 AST. Tim lapangan harap membagikan kupon makan malam di airport.',
    time: 'Hari ini, 08:30 AST',
    priority: 'High',
    isRead: false,
    timestamp: Date.now() - 2 * 60 * 60 * 1000 // 2 hours ago
  },
  {
    id: 'msg-2',
    sender: 'Manager Operasional (Pak Fathur)',
    title: 'Laporan Koper Tertukar JT-Makkah',
    text: `Satu koper tertukar di bagasi bus B1 dengan bus B2. Tim lapangan ${TEAMS[0].name}, tolong koordinasikan pencarian fisik di lobby hotel.`,
    time: 'Kemarin, 14:20 AST',
    priority: 'Medium',
    isRead: true,
    timestamp: Date.now() - 25 * 60 * 60 * 1000 // 25 hours ago -> will be automatically cleared (older than 24h)
  },
  {
    id: 'msg-3',
    sender: 'Sistem Keuangan',
    title: 'Droping Dana Operasional Cabang Saudi Berhasil',
    text: `Dana operasional sebesar 15.000 SAR telah ditransfer ke SNB Bank Wallet atas nama ${TEAMS[0].name}. Harap update pengeluaran secara real-time di aplikasi ini.`,
    time: '20 Mei 2026, 11:00 AST',
    priority: 'Medium',
    isRead: true,
    timestamp: Date.now() - 48 * 60 * 60 * 1000 // 48 hours ago -> will be automatically cleared (older than 24h)
  }
];

export const INITIAL_DUTY_TASKS: DutyTask[] = [
  {
    id: 'task-1',
    handlingName: TEAMS[0].name,
    roleTag: 'Bandara Kedatangan',
    groupName: 'Umroh Syawal Gold 2026',
    date: '2026-05-24',
    timeRange: '13:00 - 18:00 AST',
    location: 'Bandara Jeddah Terminal 1',
    status: 'Belum Selesai'
  },
  {
    id: 'task-2',
    handlingName: TEAMS[14].name,
    roleTag: 'Check In Hotel',
    groupName: 'Umroh Syawal Gold 2026',
    date: '2026-05-24',
    timeRange: '18:00 - 21:00 AST',
    location: 'Lobby Pullman Zamzam Makkah',
    status: 'Belum Selesai'
  },
  {
    id: 'task-3',
    handlingName: TEAMS[0].name,
    roleTag: 'City Tour',
    groupName: 'Umroh Syawal Gold 2026',
    date: '2026-05-22',
    timeRange: '08:00 - 11:30 AST',
    location: 'Ziarah Jabaal Uhud & Kramen',
    status: 'Selesai'
  },
  {
    id: 'task-4',
    handlingName: TEAMS[27].name,
    roleTag: 'Bandara Kepulangan',
    groupName: 'Haji Furoda Premium 2026',
    date: '2026-05-22',
    timeRange: '10:00 - 14:00 AST',
    location: 'Lounge VIP Bandara CGK',
    status: 'Sedang Berjalan'
  }
];

export const INITIAL_WALLETS: WalletAccount[] = [
  {
    id: 'wallet-manager',
    name: 'Kas Pusat (Manager - Fathur)',
    balanceSAR: 0,
    balanceIDR: 0,
    type: 'Cash Riyal Lapangan',
    holder: 'Fathur (Manager)'
  },
  ...TEAMS.map(team => ({
    id: `wallet-${team.id.replace('-', '_')}`,
    name: `Dompet ${team.name}`,
    balanceSAR: 0,
    balanceIDR: 0,
    type: 'Cash Riyal Lapangan' as const,
    holder: team.name
  }))
];

export const INITIAL_EXPENSE_REPORTS: FieldExpenseReport[] = [];

export const INITIAL_CASHFLOW: CashflowTransaction[] = [];
