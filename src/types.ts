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
  checklist?: Record<string, boolean>;
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
  recipients?: string[];
}

// Define Duty Schedule
export interface DutyTask {
  id: string;
  handlingName: string;
  roleTag: 'Check In Hotel' | 'Check Out Perpindahan Kota' | 'Check Out to Bandara' | 'City Tour' | 'Bandara Kedatangan' | 'Bandara Kepulangan';
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

export const INITIAL_PACKAGES: PackageDetail[] = [];

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

export const INITIAL_BROADCASTS: BroadcastMessage[] = [];

export const INITIAL_DUTY_TASKS: DutyTask[] = [];

export const INITIAL_WALLETS: WalletAccount[] = [];

export const INITIAL_EXPENSE_REPORTS: FieldExpenseReport[] = [];

export const INITIAL_CASHFLOW: CashflowTransaction[] = [];
