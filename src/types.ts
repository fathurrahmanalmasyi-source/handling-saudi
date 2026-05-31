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
export const INITIAL_SOPS: SOPDoc[] = [];

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

export const INITIAL_HOTEL_INFOS: HotelInfographic[] = [];

export const INITIAL_DOCUMENTS: DocumentGroup[] = [];

// --- Tambahan Data Tim ---
export type Sector = 'Handling Jeddah' | 'Handling Madinah' | 'Handling Makkah';
export interface Team {
  id: string;
  name: string;
  sector: Sector;
}

export const TEAMS: Team[] = [];

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
    text: `Satu koper tertukar di bagasi bus B1 dengan bus B2. Tim lapangan ${TEAMS.length > 0 ? TEAMS[0].name : 'Tim'}, tolong koordinasikan pencarian fisik di lobby hotel.`,
    time: 'Kemarin, 14:20 AST',
    priority: 'Medium',
    isRead: true,
    timestamp: Date.now() - 25 * 60 * 60 * 1000 // 25 hours ago -> will be automatically cleared (older than 24h)
  },
  {
    id: 'msg-3',
    sender: 'Sistem Keuangan',
    title: 'Droping Dana Operasional Cabang Saudi Berhasil',
    text: `Dana operasional sebesar 15.000 SAR telah ditransfer ke SNB Bank Wallet atas nama ${TEAMS.length > 0 ? TEAMS[0].name : 'Staff'}. Harap update pengeluaran secara real-time di aplikasi ini.`,
    time: '20 Mei 2026, 11:00 AST',
    priority: 'Medium',
    isRead: true,
    timestamp: Date.now() - 48 * 60 * 60 * 1000 // 48 hours ago -> will be automatically cleared (older than 24h)
  }
];

export const INITIAL_DUTY_TASKS: DutyTask[] = [];

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
