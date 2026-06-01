import React, { useState } from 'react';
import { 
  Compass, FileSpreadsheet, Calendar, Clock, Hotel, Files, Users, DollarSign, LogOut, Send,
  AlertTriangle, Smartphone, ChevronRight, Menu, X, ClipboardList, Bed, Trash2, UserCheck, FileText
} from 'lucide-react';

// Subcomponents import
import ManagerManifest, { Jamaah } from './ManagerManifest';
import ManagerItinerary, { ItineraryItem } from './ManagerItinerary';
import ManagerSchedule from './ManagerSchedule';
import RoomListManager from './RoomListManager';
import ManagerDocumentEditor from './ManagerDocumentEditor';
import ManagerHotelInfo from './ManagerHotelInfo';
import ManagerStaffTeam, { TeamMember } from './ManagerStaffTeam';
import ManagerCashflow from './ManagerCashflow';
import SaudiClockWidget from './SaudiClockWidget';

import { RoomManifest, DocumentGroup, BroadcastMessage, DutyTask, WalletAccount, FieldExpenseReport, CashflowTransaction, SOPDoc, PackageDetail, HotelInfographic } from '../types';

interface ManagerAppPanelProps {
  currentUser: string;
  onLogout: () => void;
  dutyTasks: DutyTask[];
  onAddTask: (newTask: Omit<DutyTask, 'id'>) => void;
  onToggleTaskStatus: (id: string) => void;
  wallets: WalletAccount[];
  expenses: FieldExpenseReport[];
  transactions: CashflowTransaction[];
  onAddTransaction: (newTx: Omit<CashflowTransaction, 'id' | 'status' | 'byUser'>) => void;
  onApproveFieldReport: (reportId: string, walletId: string) => void;
  onRejectFieldReport: (reportId: string) => void;
  rooms: RoomManifest[];
  setRooms: React.Dispatch<React.SetStateAction<RoomManifest[]>>;
  groups: string[];
  onAddGroup: (newGroup: string) => void;
  onRemoveGroup?: (removedGroupName: string) => void;
  jamaahList: Jamaah[];
  onUpdateJamaahList: (newList: Jamaah[]) => void;
  itineraries: ItineraryItem[];
  onUpdateItineraryList: (newList: ItineraryItem[]) => void;
  packages: PackageDetail[];
  onUpdatePackages: (newPackages: PackageDetail[]) => void;
  hotelInfos: HotelInfographic[];
  onUpdateHotelInfos: (newHotelInfos: HotelInfographic[]) => void;
  documents: DocumentGroup[];
  onUpdateDocuments: (newList: DocumentGroup[]) => void;
  teamMembers: TeamMember[];
  onUpdateTeamMembers: (newList: TeamMember[]) => void;
  broadcasts: BroadcastMessage[];
  onAddBroadcast: (newBroadcast: BroadcastMessage) => void;
  onDeleteBroadcast: (id: string) => void;
  sops: SOPDoc[];
  onUpdateSops: (newSops: SOPDoc[]) => void;
  attendanceLogs: any[];
  incidentLogs: any[];
  onUpdateIncidentLogs: (newList: any[]) => void;
  onDeleteTask?: (id: string) => void;
  onUpdateTask?: (id: string, updatedTask: Partial<DutyTask>) => void;
  onDeleteTransaction?: (id: string) => void;
  onUpdateTransaction?: (id: string, updatedTx: Partial<CashflowTransaction>) => void;
  onTransferFunds?: (fromWalletId: string, toWalletId: string, amountSAR: number) => void;
}

export default function ManagerAppPanel({
  currentUser,
  onLogout,
  dutyTasks,
  onAddTask,
  onToggleTaskStatus,
  wallets,
  expenses,
  transactions,
  onAddTransaction,
  onApproveFieldReport,
  onRejectFieldReport,
  rooms,
  setRooms,
  groups,
  onAddGroup,
  onRemoveGroup,
  jamaahList,
  onUpdateJamaahList,
  itineraries,
  onUpdateItineraryList,
  packages,
  onUpdatePackages,
  hotelInfos,
  onUpdateHotelInfos,
  documents,
  onUpdateDocuments,
  teamMembers,
  onUpdateTeamMembers,
  broadcasts,
  onAddBroadcast,
  onDeleteBroadcast,
  sops,
  onUpdateSops,
  attendanceLogs,
  incidentLogs,
  onUpdateIncidentLogs,
  onDeleteTask,
  onUpdateTask,
  onDeleteTransaction,
  onUpdateTransaction,
  onTransferFunds
}: ManagerAppPanelProps) {
  // Navigation for Sidebar
  const [managerTab, setManagerTab] = useState<string>('m-dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [reportsSubTab, setReportsSubTab] = useState<'attendance' | 'incidents'>('attendance');
  const [reportSearchText, setReportSearchText] = useState('');
  
  const [manifestInitialSelectedGroup, setManifestInitialSelectedGroup] = useState<string | null>(null);
  const [manifestInitialSubTab, setManifestInitialSubTab] = useState<'jamaah' | 'paketInfo'>('jamaah');

  // Input states for quick broadcast
  const [recipientSearchTerm, setRecipientSearchTerm] = useState('');
  const [bTitle, setBTitle] = useState('');
  const [bText, setBText] = useState('');
  const [bPriority, setBPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bTitle.trim() || !bText.trim()) return;

    const newBroadcast: BroadcastMessage = {
      id: `m-bc-${Date.now()}`,
      sender: `Manager (${currentUser})`,
      title: bTitle.trim(),
      text: bText.trim(),
      time: 'Baru saja disiarkan (AST)',
      priority: bPriority,
      isRead: false,
      recipients: selectedRecipients.length === 0 ? ['Semua'] : selectedRecipients // Added recipients
    } as any; // Cast to any to bypass strict type check for now if missing in definition

    onAddBroadcast(newBroadcast);
    setBTitle('');
    setBText('');
    setSelectedRecipients([]);
    alert('Pesan pengumuman penting berhasil disiarkan ke seluruh tim lapangan!');
  };

  const handleUpdateRoomlistFromManager = (newRooms: RoomManifest[]) => {
    setRooms(newRooms);
  };

  const handleAddRoomSimulated = (newRoom: Omit<RoomManifest, 'id'>) => {
    const r: RoomManifest = { ...newRoom, id: `room-${Date.now()}` };
    setRooms([r, ...rooms]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex" id="manager-applet-root">
      {/* 1. LEFT SIDEBAR PANEL (TOGGLEABLE, NOT DARK) */}
      <aside 
        className={`bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 text-slate-800 z-30 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden border-r-0'
        }`}
        id="manager-sidebar"
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo Brand Header */}
          <div className="p-5 border-b border-slate-100 bg-slate-50 text-center flex flex-col items-center shrink-0">
            <img 
              src="https://lh3.googleusercontent.com/d/1ADaHuVjVHr8tP1WuWy1q6f8bLGdFYU9a=w400" 
              alt="Logo" 
              className="h-10 w-auto object-contain rounded"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Sidebar Menu items */}
          <nav className="p-2.5 space-y-4 font-semibold text-xs text-slate-600 flex-1">
            {/* New Group */}
            <div>
              <p className="px-3 pb-2 text-[10px] uppercase font-black text-slate-400">Menu Baru</p>
              <div className="space-y-1">
                <button
                  onClick={() => setManagerTab('m-dashboard')}
                  className={`w-full py-2.5 px-3 rounded-lg text-left flex items-center gap-3 transition-all ${
                    managerTab === 'm-dashboard' 
                      ? 'bg-slate-900 text-white font-bold shadow-xs' 
                      : 'hover:bg-slate-100 hover:text-slate-900 text-slate-650'
                  }`}
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setManagerTab('m-itinerary')}
                  className={`w-full py-2.5 px-3 rounded-lg text-left flex items-center gap-3 transition-all ${
                    managerTab === 'm-itinerary' 
                      ? 'bg-slate-900 text-white font-bold shadow-xs' 
                      : 'hover:bg-slate-100 hover:text-slate-900 text-slate-650'
                  }`}
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Itinerary</span>
                </button>
                <button
                  onClick={() => setManagerTab('m-schedule')}
                  className={`w-full py-2.5 px-3 rounded-lg text-left flex items-center gap-3 transition-all ${
                    managerTab === 'm-schedule' 
                      ? 'bg-slate-900 text-white font-bold shadow-xs' 
                      : 'hover:bg-slate-100 hover:text-slate-900 text-slate-650'
                  }`}
                >
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Penjadwalan Tim</span>
                </button>
                <button
                  onClick={() => setManagerTab('m-team')}
                  className={`w-full py-2.5 px-3 rounded-lg text-left flex items-center gap-3 transition-all ${
                    managerTab === 'm-team' 
                      ? 'bg-slate-900 text-white font-bold shadow-xs' 
                      : 'hover:bg-slate-100 hover:text-slate-900 text-slate-650'
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Tim Handling</span>
                </button>
                <button
                  onClick={() => setManagerTab('m-cashflow')}
                  className={`w-full py-2.5 px-3 rounded-lg text-left flex items-center gap-3 transition-all ${
                    managerTab === 'm-cashflow' 
                      ? 'bg-slate-900 text-white font-bold shadow-xs' 
                      : 'hover:bg-slate-100 hover:text-slate-900 text-slate-650'
                  }`}
                >
                  <DollarSign className="w-4 h-4 shrink-0" />
                  <span>Deposit Keuangan</span>
                </button>
                <button
                  onClick={() => setManagerTab('m-reports')}
                  className={`w-full py-2.5 px-3 rounded-lg text-left flex items-center gap-3 transition-all ${
                    managerTab === 'm-reports' 
                      ? 'bg-slate-900 text-white font-bold shadow-xs' 
                      : 'hover:bg-slate-100 hover:text-slate-900 text-slate-650'
                  }`}
                >
                  <ClipboardList className="w-4 h-4 shrink-0" />
                  <span>Laporan</span>
                </button>
              </div>
            </div>

            {/* Existing Group */}
            <div>
              <p className="px-3 pb-2 text-[10px] uppercase font-black text-slate-400">Menu yang Sudah Ada</p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setManifestInitialSelectedGroup(null);
                    setManifestInitialSubTab('jamaah');
                    setManagerTab('m-manifest');
                  }}
                  className={`w-full py-2.5 px-3 rounded-lg text-left flex items-center gap-3 transition-all ${
                    managerTab === 'm-manifest' 
                      ? 'bg-slate-900 text-white font-bold shadow-xs' 
                      : 'hover:bg-slate-100 hover:text-slate-900 text-slate-650'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 shrink-0" />
                  <span>Data Manifest</span>
                </button>
                <button
                  onClick={() => setManagerTab('m-roomlist')}
                  className={`w-full py-2.5 px-3 rounded-lg text-left flex items-center gap-3 transition-all ${
                    managerTab === 'm-roomlist' 
                      ? 'bg-slate-900 text-white font-bold shadow-xs' 
                      : 'hover:bg-slate-100 hover:text-slate-900 text-slate-650'
                  }`}
                >
                  <Bed className="w-4 h-4 shrink-0" />
                  <span>Roomlist</span>
                </button>
                <button
                  onClick={() => setManagerTab('m-hotel')}
                  className={`w-full py-2.5 px-3 rounded-lg text-left flex items-center gap-3 transition-all ${
                    managerTab === 'm-hotel' 
                      ? 'bg-slate-900 text-white font-bold shadow-xs' 
                      : 'hover:bg-slate-100 hover:text-slate-900 text-slate-650'
                  }`}
                >
                  <Hotel className="w-4 h-4 shrink-0" />
                  <span>Infografis Hotel</span>
                </button>
                <button
                  onClick={() => setManagerTab('m-documents')}
                  className={`w-full py-2.5 px-3 rounded-lg text-left flex items-center gap-3 transition-all ${
                    managerTab === 'm-documents' 
                      ? 'bg-slate-900 text-white font-bold shadow-xs' 
                      : 'hover:bg-slate-100 hover:text-slate-900 text-slate-650'
                  }`}
                >
                  <Files className="w-4 h-4 shrink-0" />
                  <span>Dokumen</span>
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* LOGOUT BUTTON AREA (NOT DARK, blend nicely with light sidebar) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
          <button
            onClick={onLogout}
            className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-700 font-extrabold rounded-lg flex items-center justify-center gap-2 tracking-wide cursor-pointer text-xs border border-red-200 transition-all shadow-3xs active:scale-95 duration-150"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN SPACIOUS GRID AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50" id="manager-main-canvas">
        {/* UPPER TOP NAVIGATION HEADER WITH TOGGLE BUTTON */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 shrink-0 flex items-center justify-between" id="manager-top-header">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg text-slate-700 transition-all duration-150 shadow-3xs flex items-center justify-center cursor-pointer active:scale-95"
              title={isSidebarOpen ? "Sembunyikan Menu" : "Tampilkan Menu"}
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-6">
            {/* Real KSA Clock widget inside center header */}
            <SaudiClockWidget />
          </div>
        </header>

        {/* INNER SCROLL CONTENT CONTAINER */}
        <div className="flex-1 overflow-y-auto p-6" id="manager-scroll-area">
          {/* TAB m-dashboard VIEW STATEMENT */}
          {managerTab === 'm-dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Operation stats card headers */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5">
                <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 text-xs font-bold shadow-3xs">
                  <span className="text-slate-400 block uppercase font-black text-[9px] truncate">Grup Bulan Ini</span>
                  <p className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5 font-serif">{groups.length} Grup</p>
                  <span className="text-[10px] text-emerald-600 block mt-1 leading-none truncate">Terjadwal Berangkat</span>
                </div>

                <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 text-xs font-bold shadow-3xs">
                  <span className="text-slate-400 block uppercase font-black text-[9px] truncate">Grup Aktif</span>
                  <p className="text-lg sm:text-2xl font-black text-indigo-950 mt-0.5 font-serif">{groups.length} Grup</p>
                  <span className="text-[10px] text-indigo-600 block mt-1 leading-none truncate">Sedang di KSA</span>
                </div>

                <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 text-xs font-bold shadow-3xs">
                  <span className="text-slate-400 block uppercase font-black text-[9px] truncate">Total Jamaah Aktif</span>
                  <p className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5 font-mono">{jamaahList.length} Pax</p>
                  <span className="text-[10px] text-slate-450 block mt-1 leading-none truncate font-semibold">Total Rombongan</span>
                </div>

                <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 text-xs font-bold shadow-3xs">
                  <span className="text-slate-400 block uppercase font-black text-[9px] truncate">Penugasan Tim</span>
                  <p className="text-lg sm:text-2xl font-black text-amber-900 mt-0.5 font-mono">{dutyTasks.length} Agenda</p>
                  <span className="text-[10px] text-indigo-700 block mt-1 leading-none cursor-pointer hover:underline truncate font-semibold" onClick={() => setManagerTab('m-schedule')}>Atur Jadwal →</span>
                </div>

                <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 text-xs font-bold shadow-3xs col-span-2 lg:col-span-1">
                  <span className="text-slate-400 block uppercase font-black text-[9px] truncate">Pending Audit</span>
                  <p className="text-lg sm:text-2xl font-black text-rose-800 mt-0.5 font-mono">{expenses.filter(e => e.status === 'Pending').length} Laporan</p>
                  <span className="text-[10px] text-slate-450 block mt-1 leading-none cursor-pointer hover:underline truncate font-semibold" onClick={() => setManagerTab('m-cashflow')}>Audit Kas Transaksi →</span>
                </div>
              </div>

              {/* Lower split container: 2-column detail */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left column info lists */}
                <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />
                      <span>Grup Aktif</span>
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1">Grup yang sedang aktif schedule-nya di KSA. Klik nama grup untuk melihat Info Paket.</p>
                  </div>

                  <div className="space-y-3">
                    {groups.slice(0, 3).map((grp, idx) => {
                       const count = jamaahList.filter(j => j.groupName === grp).length;
                       return (
                        <div key={idx} 
                          onClick={() => { 
                            setManifestInitialSelectedGroup(grp);
                            setManifestInitialSubTab('paketInfo');
                            setManagerTab('m-manifest');
                          }}
                          className="p-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-150 rounded-lg flex items-center justify-between text-xs font-semibold gap-3 transition-all cursor-pointer">
                          <div>
                            <h4 className="font-black text-slate-900">{grp}</h4>
                            <p className="text-[10px] text-slate-500 mt-1">👥 {count} Jamaah • Aktif: 24 Mei - 05 Juni</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase flex items-center gap-1.55">
                      <Calendar className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.5} />
                      <span>Grup Yang Akan Datang</span>
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1">Grup yang dijadwalkan akan berangkat. Klik nama grup untuk melihat Info Paket.</p>
                  </div>

                  <div className="space-y-3">
                    {groups.slice(3).map((grp, idx) => {
                      const count = jamaahList.filter(j => j.groupName === grp).length;
                      return (
                        <div key={idx} 
                          onClick={() => { 
                            setManifestInitialSelectedGroup(grp);
                            setManifestInitialSubTab('paketInfo');
                            setManagerTab('m-manifest');
                          }}
                          className="p-3 bg-sky-50 hover:bg-sky-100/50 border border-sky-150 rounded-lg flex items-center justify-between text-xs font-semibold gap-3 transition-all cursor-pointer">
                          <div>
                            <h4 className="font-black text-sky-900">{grp}</h4>
                            <p className="text-[10px] text-sky-600 mt-1">👥 {count} Jamaah • Berangkat: 15 Juni</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-sky-400 shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right column: broadcast center panel */}
                <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-6">
                  <div className="border-b border-slate-105 pb-3">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm uppercase flex items-center gap-1.5">
                      <Send className="w-4.5 h-4.5 text-[#D4AF37]" strokeWidth={1.5} />
                      <span>Buat Pengumuman / Broadcast</span>
                    </h3>
                  </div>

                  <form onSubmit={handleSendBroadcast} className="space-y-3.5 text-xs text-left">
                    <div>
                      <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1">Kirim Ke</label>
                      
                      {/* Selected Chips */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRecipients([])}
                          className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 ${selectedRecipients.length === 0 ? 'bg-slate-900 text-[#D4AF37]' : 'bg-slate-200 text-slate-700'}`}
                        >
                          Semua
                        </button>
                        {selectedRecipients.map(name => (
                          <span key={name} className="px-2 py-1 rounded bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center gap-1 border border-indigo-200">
                            {name}
                            <button type="button" onClick={() => setSelectedRecipients(selectedRecipients.filter(n => n !== name))} className="hover:text-indigo-900">×</button>
                          </span>
                        ))}
                      </div>

                      {/* Search & Suggestions */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Cari & pilih tim..."
                          value={recipientSearchTerm}
                          onChange={(e) => setRecipientSearchTerm(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold"
                        />
                        {recipientSearchTerm && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded shadow-lg max-h-40 overflow-y-auto">
                            {teamMembers
                              .filter(t => t.name.toLowerCase().includes(recipientSearchTerm.toLowerCase()) && !selectedRecipients.includes(t.name))
                              .map(t => (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedRecipients([...selectedRecipients, t.name]);
                                    setRecipientSearchTerm('');
                                  }}
                                  className="w-full text-left p-2 text-xs hover:bg-slate-100 font-semibold"
                                >
                                  {t.name}
                                </button>
                              ))
                            }
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1">Judul Pengumuman</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Info Penting Bandara..."
                        value={bTitle}
                        onChange={(e) => setBTitle(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1">Prioritas</label>
                        <select
                          value={bPriority}
                          onChange={(e) => setBPriority(e.target.value as any)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-bold"
                        >
                          <option value="High">🚨 High</option>
                          <option value="Medium">⚠️ Medium</option>
                          <option value="Low">ℹ️ Low</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-1">Pesan Pengumuman</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Masukkan pesan pengumuman..."
                        value={bText}
                        onChange={(e) => setBText(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-slate-900 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-black font-extrabold rounded-md text-xs transition-all tracking-wider shadow"
                    >
                      KIRIM BROADCAST
                    </button>
                  </form>

                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <h4 className="font-bold text-xs uppercase text-slate-400">Riwayat Terkirim:</h4>
                    {broadcasts.map(msg => {
                      const isAll = !msg.recipients || msg.recipients.length === 0 || msg.recipients.some(r => r.toLowerCase().trim() === 'semua');
                      return (
                        <div key={msg.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start justify-between gap-2 text-left">
                          <div className="text-xs space-y-1">
                            <p className="font-bold text-slate-900">{msg.title}</p>
                            <p className="text-[10px] text-slate-500 leading-normal">{msg.text}</p>
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className={`text-[9px] font-black border px-1.5 py-0.5 rounded uppercase ${
                                isAll ? 'text-teal-800 bg-teal-50 border-teal-200' : 'text-indigo-800 bg-indigo-50 border-indigo-200'
                              }`}>
                                {isAll ? '📢 Terkirim ke Semua Akun' : `👥 Terkirim ke Beberapa Akun: ${msg.recipients?.join(', ')}`}
                              </span>
                              <span className="text-[9px] text-slate-400 font-medium font-mono">{msg.time}</span>
                            </div>
                          </div>
                          <button onClick={() => onDeleteBroadcast(msg.id)} className="text-rose-500 hover:text-rose-705 cursor-pointer p-0.5 shrink-0" title="Hapus Pengumuman">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB m-manifest VIEW */}
          {managerTab === 'm-manifest' && (
            <ManagerManifest 
              jamaahList={jamaahList} 
              onUpdateJamaahList={onUpdateJamaahList}
              groups={groups} 
              onAddGroup={onAddGroup} 
              onRemoveGroup={onRemoveGroup}
              itineraries={itineraries}
              packages={packages}
              onUpdatePackages={onUpdatePackages}
              hotelInfos={hotelInfos}
              initialSelectedGroup={manifestInitialSelectedGroup}
              initialSubTab={manifestInitialSubTab}
            />
          )}

          {/* TAB m-itinerary VIEW */}
          {managerTab === 'm-itinerary' && (
            <ManagerItinerary 
              itineraries={itineraries} 
              onUpdateItineraryList={onUpdateItineraryList} 
              groups={groups} 
            />
          )}

          {/* TAB m-schedule VIEW */}
          {managerTab === 'm-schedule' && (
            <ManagerSchedule 
              tasks={dutyTasks} 
              onAddTask={onAddTask} 
              onToggleTaskStatus={onToggleTaskStatus} 
              groups={groups}
              teamMembers={teamMembers}
              onDeleteTask={onDeleteTask}
              onUpdateTask={onUpdateTask}
            />
          )}

          {/* TAB m-roomlist VIEW */}
          {managerTab === 'm-roomlist' && (
            <div className="space-y-4">
              <RoomListManager 
                rooms={rooms} 
                onAddRoom={handleAddRoomSimulated} 
                selectedGroupFilter="All" 
                groups={groups}
                onUpdateRooms={handleUpdateRoomlistFromManager}
                jamaahList={jamaahList}
                onUpdateJamaahList={onUpdateJamaahList}
                currentRole="MANAGER"
              />
            </div>
          )}

          {/* TAB m-hotel VIEW */}
          {managerTab === 'm-hotel' && (
            <ManagerHotelInfo 
              hotelInfos={hotelInfos}
              onUpdateHotelInfos={onUpdateHotelInfos}
            />
          )}

          {/* TAB m-documents VIEW */}
          {managerTab === 'm-documents' && (
            <ManagerDocumentEditor 
              documents={documents} 
              onUpdateDocuments={onUpdateDocuments} 
              groups={groups} 
              sops={sops}
              onUpdateSops={onUpdateSops}
            />
          )}

          {/* TAB m-team VIEW */}
          {managerTab === 'm-team' && (
            <ManagerStaffTeam 
              teamMembers={teamMembers} 
              onUpdateTeamMembers={onUpdateTeamMembers} 
            />
          )}

          {/* TAB m-cashflow VIEW */}
          {managerTab === 'm-cashflow' && (
            <ManagerCashflow 
              wallets={wallets} 
              transactions={transactions} 
              fieldReports={expenses} 
              teamMembers={teamMembers}
              onAddTransaction={onAddTransaction}
              onApproveFieldReport={onApproveFieldReport}
              onRejectFieldReport={onRejectFieldReport}
              onDeleteTransaction={onDeleteTransaction}
              onUpdateTransaction={onUpdateTransaction}
              onTransferFunds={onTransferFunds}
              currentUser={currentUser}
            />
          )}

          {/* TAB m-reports VIEW */}
          {managerTab === 'm-reports' && (
            <div className="space-y-4 animate-in fade-in duration-200 text-slate-800" id="manager-reports-page">
              
              {/* Sub-tabs for Reports selection */}
              <div className="flex border-b border-slate-200 bg-white rounded-xl overflow-hidden shadow-3xs">
                <button
                  onClick={() => { setReportsSubTab('attendance'); setReportSearchText(''); }}
                  className={`flex-1 sm:flex-initial px-6 py-3.5 text-xs font-black tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    reportsSubTab === 'attendance' 
                      ? 'border-[#D4AF37] text-slate-950 bg-amber-500/5 font-black' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <UserCheck className="w-4.5 h-4.5 text-[#D4AF37]" strokeWidth={1.5} />
                  <span>Absensi Penugasan ({attendanceLogs ? attendanceLogs.length : 0})</span>
                </button>
                <button
                  onClick={() => { setReportsSubTab('incidents'); setReportSearchText(''); }}
                  className={`flex-1 sm:flex-initial px-6 py-3.5 text-xs font-black tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    reportsSubTab === 'incidents' 
                      ? 'border-[#D4AF37] text-slate-950 bg-amber-500/5 font-black' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-4.5 h-4.5 text-[#D4AF37]" strokeWidth={1.5} />
                  <span>Laporan Lapangan ({incidentLogs ? incidentLogs.length : 0})</span>
                </button>
              </div>

              {/* Controls Section: Search & Simulation actions */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs shadow-3xs">
                <div className="relative w-full sm:max-w-xs">
                  <Compass className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Saring nama petugas atau detail..."
                    value={reportSearchText}
                    onChange={(e) => setReportSearchText(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => {
                    alert('Hasil laporan berhasil diproses dan dikompilasi! Dokumen PDF siap diunduh oleh Kemenag / Manajemen Pusat Jejak Imani.');
                  }}
                  className="w-full sm:w-auto px-4 py-1.5 bg-[#1A1A1A] hover:bg-black text-[#D4AF37] border border-[#D4AF37]/25 rounded-md font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs transition-transform active:scale-95 duration-100"
                >
                  <span>📥 Cetak & Ekspor Dokumen Laporan</span>
                </button>
              </div>

              {/* Table rendering panel */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                {reportsSubTab === 'attendance' ? (
                  <div className="overflow-x-auto" id="attendance-report-table">
                    <table className="w-full text-left border-collapse table-auto text-xs min-w-[750px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-550 uppercase font-black text-[10px] tracking-wider">
                          <th className="py-3 px-4">Nama Personel</th>
                          <th className="py-3 px-4">Tanggal Tugas</th>
                          <th className="py-3 px-4">Jam Log AST</th>
                          <th className="py-3 px-4">Tipe Absensi</th>
                          <th className="py-3 px-4">Lokasi Melapor</th>
                          <th className="py-3 px-4">Koordinat GPS SAT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 text-slate-800">
                        {attendanceLogs
                          .filter(log => {
                            if (!reportSearchText) return true;
                            return log.name.toLowerCase().includes(reportSearchText.toLowerCase()) || 
                                   log.location.toLowerCase().includes(reportSearchText.toLowerCase());
                          })
                          .map((log: any) => (
                            <tr key={log.id} className="hover:bg-slate-50/45 font-semibold transition-colors">
                              <td className="py-3 px-4 text-slate-900 font-extrabold flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                                {log.name}
                              </td>
                              <td className="py-3 px-4 font-mono font-bold text-slate-500">📅 {log.date}</td>
                              <td className="py-3 px-4 font-mono font-bold text-slate-800">⏱️ {log.time}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-black border ${
                                  log.type === 'Masuk Tugas' 
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                    : 'bg-rose-50 text-rose-800 border-rose-200'
                                }`}>
                                  {log.type}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-750 leading-normal font-sans">🏨 {log.location}</td>
                              <td className="py-3 px-4">
                                <span className="font-mono text-[10px] text-indigo-700 bg-indigo-50/50 border border-indigo-100 rounded px-1.5 py-0.5" title="Koordinat GPS Terverifikasi Satelit">
                                  🛰️ {log.coordinate || 'GPS Locked'}
                                </span>
                              </td>
                            </tr>
                        ))}
                        {attendanceLogs.length === 0 && (
                          <tr>
                            <td colSpan={6} className="py-10 text-center text-slate-400 italic">Belum ada catatan absensi petugas terdaftar.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  // INCIDENTS LOG REPORTS
                  <div className="p-4 space-y-3" id="incident-report-list">
                    {incidentLogs
                      .filter(log => {
                        if (!reportSearchText) return true;
                        return log.name.toLowerCase().includes(reportSearchText.toLowerCase()) || 
                               log.title.toLowerCase().includes(reportSearchText.toLowerCase()) ||
                               log.text.toLowerCase().includes(reportSearchText.toLowerCase());
                      })
                      .map((log: any) => (
                        <div key={log.id} className={`bg-white p-4 rounded-xl border font-semibold flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                          log.isResolved ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200 bg-white hover:border-slate-350 shadow-3xs'
                        }`}>
                          <div className="space-y-1.5 flex-1 text-left">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`px-2 py-0.5 text-[9px] uppercase font-black rounded border ${
                                log.severity.includes('Warning') 
                                  ? 'bg-red-50 text-red-700 border-red-200' 
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                {log.severity}
                              </span>

                              {log.isResolved ? (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-[9px] font-black">
                                  ✅ Selesai Ditangani / Selesai
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-50 border border-amber-200 rounded text-amber-800 text-[9px] font-black">
                                  ⏳ Menunggu Tindakan / Aktif
                                </span>
                              )}

                              <span className="text-[10px] text-slate-400 font-mono">
                                {log.date} @ {log.time} KSA
                              </span>
                            </div>

                            <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">{log.title}</h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-sans">{log.text}</p>
                            
                            <div className="text-[10px] text-slate-400 uppercase font-black">
                              Dilaporkan Oleh: <strong className="text-[#1A1A1A] font-bold">👤 {log.name} (Team Handling)</strong>
                            </div>
                          </div>

                          {/* Quick Toggle Action for Resolve */}
                          <div className="shrink-0 flex items-center justify-end bg-slate-50 hover:bg-slate-100/60 p-2 border border-slate-200 rounded-lg">
                            <input
                              type="checkbox"
                              id={`resolve-${log.id}`}
                              checked={!!log.isResolved}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const updated = incidentLogs.map((item: any) => {
                                  if (item.id === log.id) {
                                    return { ...item, isResolved: checked };
                                  }
                                  return item;
                                });
                                onUpdateIncidentLogs(updated);
                              }}
                              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer mr-2"
                            />
                            <label htmlFor={`resolve-${log.id}`} className="text-[10px] font-extrabold text-slate-700 cursor-pointer select-none leading-none">
                              {log.isResolved ? 'Sudah Audit' : 'Selesai ditangani'}
                            </label>
                          </div>
                        </div>
                    ))}
                    {incidentLogs.length === 0 && (
                      <div className="p-10 text-center text-slate-400 font-bold text-xs">Belum ada berkas laporan insiden terdaftar.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
