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
    id: 'sop-airport-1',
    title: 'SOP Penjemputan di Bandara Jeddah & Madinah',
    category: 'Airport',
    lastUpdated: '15 Mei 2026',
    important: true,
    content: [
      'Gunakan seragam identitas Jejak Imani rapi & ID Card aktif.',
      'Sambut jamaah di pintu terminal internasional dengan membawa banner rombongan besar.',
      'Pastikan seluruh bagasi (koper) ditata rapi oleh porter bandara dan dihitung ulang sesuai manifes.',
      'Bimbing jamaah dengan tertib menuju area parkir bus transit.',
      'Lakukan absensi jamaah fisik sebelum bus meninggalkan bandara.'
    ]
  },
  {
    id: 'sop-hotel-1',
    title: 'SOP Proses Check-In Kamar Hotel (Makkah/Madinah)',
    category: 'Hotel',
    lastUpdated: '20 Mei 2026',
    important: true,
    content: [
      'Tim hotel standby di lobby 1 jam sebelum rombongan bus tiba.',
      'Siapkan kunci kamar (keycard) sesuai dengan plot rooming list.',
      'Sambut tour leader & bagikan kunci kamar secara kolektif di lobby untuk menghindari penumpukan.',
      'Koordinasikan penanganan koper oleh bellboy langsung menuju depan kamar masing-masing.',
      'Pastikan AC, kasur tambahan, dan air panas kamar berfungsi dengan baik.'
    ]
  }
];

export const INITIAL_ROOMLIST: RoomManifest[] = [];

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
    id: 'h-1',
    hotelName: 'Rayhaan Marwa Rotana',
    city: 'Makkah',
    restaurantInfo: 'Lantai 11, masakan buffet Internasional & Selera Asia khas Indonesia',
    mealTimes: 'Breakfast: 06:00 - 09:30, Lunch: 12:30 - 14:30, Dinner: 19:30 - 22:00',
    receptionistInfo: 'Pintu Lobby utama (Tower Marwa), buka 24 jam dengan staf multibahasa',
    wifiInfo: 'Name: "Marwa_Rotana_Guest", Password: "no-password-needed" (Auto Redirect)',
    hotelPhoto: 'https://lh3.googleusercontent.com/d/1ADaHuVjVHr8tP1WuWy1q6f8bLGdFYU9a=w400',
    restaurantPhoto: 'https://lh3.googleusercontent.com/d/1ADaHuVjVHr8tP1WuWy1q6f8bLGdFYU9a=w400',
    receptionistPhoto: 'https://lh3.googleusercontent.com/d/1ADaHuVjVHr8tP1WuWy1q6f8bLGdFYU9a=w400'
  },
  {
    id: 'h-2',
    hotelName: 'Anjum Hotel',
    city: 'Makkah',
    restaurantInfo: 'Restoran utama Lantai M, kapasitas 2500 pax, menu masakan nusantara',
    mealTimes: 'Breakfast: 05:30 - 09:00, Lunch: 13:00 - 15:00, Dinner: 19:00 - 21:30',
    receptionistInfo: 'Lobby utama yang luas di Lantai G, support bahasa Indonesia',
    wifiInfo: 'Name: "Anjum_WiFi", Password: "anjum-makkah-guest"',
    hotelPhoto: 'https://lh3.googleusercontent.com/d/1ADaHuVjVHr8tP1WuWy1q6f8bLGdFYU9a=w400',
    restaurantPhoto: 'https://lh3.googleusercontent.com/d/1ADaHuVjVHr8tP1WuWy1q6f8bLGdFYU9a=w400',
    receptionistPhoto: 'https://lh3.googleusercontent.com/d/1ADaHuVjVHr8tP1WuWy1q6f8bLGdFYU9a=w400'
  }
];

export const INITIAL_DOCUMENTS: DocumentGroup[] = [
  {
    id: 'doc-grp-1',
    groupName: 'Umroh Reguler 11 Juni 2026 (Madinah Awal)',
    items: [
      { id: 'doc-1-1', name: 'Visa_Umroh_Reguler_11Juni.xlsx', type: 'visa', size: '1.2 MB', uploadDate: '25 Mei 2026' },
      { id: 'doc-1-2', name: 'E_Ticket_SaudiAirlines_SV819.xlsx', type: 'ticket', size: '3.4 MB', uploadDate: '26 Mei 2026' },
      { id: 'doc-1-3', name: 'Manifest_Paspor_Keberangkatan.xlsx', type: 'passport', size: '2.1 MB', uploadDate: '27 Mei 2026' }
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
  { id: 'team-ahmad', name: 'Ahmad Syarif', sector: 'Handling Makkah' },
  { id: 'team-faiz', name: 'Muhammad Faiz', sector: 'Handling Madinah' },
  { id: 'team-tariq', name: 'Tariq Al-Fatih', sector: 'Handling Jeddah' },
  { id: 'team-malik', name: 'Malik At-Tijari', sector: 'Handling Makkah' }
];

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
    text: 'Satu koper tertukar di bagasi bus B1 dengan bus B2. Tim lapangan Ahmad Syarif, tolong koordinasikan pencarian fisik di lobby hotel.',
    time: 'Kemarin, 14:20 AST',
    priority: 'Medium',
    isRead: true,
    timestamp: Date.now() - 25 * 60 * 60 * 1000 // 25 hours ago -> will be automatically cleared (older than 24h)
  },
  {
    id: 'msg-3',
    sender: 'Sistem Keuangan',
    title: 'Droping Dana Operasional Cabang Saudi Berhasil',
    text: 'Dana operasional sebesar 15.000 SAR telah ditransfer ke SNB Bank Wallet atas nama Ahmad Syarif. Harap update pengeluaran secara real-time di aplikasi ini.',
    time: '20 Mei 2026, 11:00 AST',
    priority: 'Medium',
    isRead: true,
    timestamp: Date.now() - 48 * 60 * 60 * 1000 // 48 hours ago -> will be automatically cleared (older than 24h)
  }
];

export const INITIAL_DUTY_TASKS: DutyTask[] = [
  {
    id: 'duty-1',
    handlingName: 'Ahmad Syarif',
    roleTag: 'Check In Hotel',
    groupName: 'Umroh Reguler 11 Juni 2026 (Madinah Awal)',
    date: '2026-06-11',
    timeRange: '18:00 - 21:00 AST',
    location: 'Hotel Anjum Makkah',
    status: 'Belum Selesai'
  },
  {
    id: 'duty-2',
    handlingName: 'Muhammad Faiz',
    roleTag: 'Bandara Kedatangan',
    groupName: 'Umroh Reguler 11 Juni 2026 (Madinah Awal)',
    date: '2026-06-11',
    timeRange: '12:00 - 15:00 AST',
    location: 'Bandara Madinah',
    status: 'Sedang Berjalan'
  }
];

export const INITIAL_WALLETS: WalletAccount[] = [
  {
    id: 'wallet-manager',
    name: 'Kas Pusat (Manager - Fathur)',
    balanceSAR: 45000,
    balanceIDR: 180000000,
    type: 'Cash Riyal Lapangan',
    holder: 'Fathur (Manager)'
  },
  ...TEAMS.map(team => ({
    id: `wallet-${team.id.replace('-', '_')}`,
    name: `Dompet ${team.name}`,
    balanceSAR: 5000,
    balanceIDR: 0,
    type: 'Cash Riyal Lapangan' as const,
    holder: team.name
  }))
];

export const INITIAL_EXPENSE_REPORTS: FieldExpenseReport[] = [];

export const INITIAL_CASHFLOW: CashflowTransaction[] = [];
