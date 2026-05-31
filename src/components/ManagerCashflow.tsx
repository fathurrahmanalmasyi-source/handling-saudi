import React, { useState } from 'react';
import { 
  CreditCard, 
  Landmark, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  DollarSign, 
  Plus, 
  Eye, 
  Check, 
  X, 
  FileText, 
  BadgeCheck, 
  Coins, 
  Edit2, 
  Trash2, 
  User, 
  Download, 
  Printer, 
  HelpCircle,
  FileSpreadsheet,
  Users,
  MoreVertical
} from 'lucide-react';
import { WalletAccount, CashflowTransaction, FieldExpenseReport } from '../types';

import { TeamMember } from './ManagerStaffTeam';

interface ManagerCashflowProps {
  wallets: WalletAccount[];
  transactions: CashflowTransaction[];
  fieldReports: FieldExpenseReport[];
  onAddTransaction: (newTx: Omit<CashflowTransaction, 'id' | 'status' | 'byUser'>) => void;
  onApproveFieldReport: (reportId: string, walletId: string) => void;
  onRejectFieldReport: (reportId: string) => void;
  onDeleteTransaction?: (id: string) => void;
  onUpdateTransaction?: (id: string, updatedTx: Partial<CashflowTransaction>) => void;
  onTransferFunds?: (fromWalletId: string, toWalletId: string, amountSAR: number) => void;
  currentUser?: string;
  teamMembers: TeamMember[];
}

export default function ManagerCashflow({
  wallets,
  transactions,
  fieldReports,
  onAddTransaction,
  onApproveFieldReport,
  onRejectFieldReport,
  onDeleteTransaction,
  onUpdateTransaction,
  onTransferFunds,
  currentUser,
  teamMembers
}: ManagerCashflowProps) {
  // Transfer Form States
  const [transferTarget, setTransferTarget] = useState(wallets[0]?.id || 'wallet-manager');
  const [transferAmount, setTransferAmount] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('ALL'); // ALL, or specific wallet id
  
  // Custom states
  const [feedback, setFeedback] = useState('');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // New Search and Custom drop states
  const [customDropAmount, setCustomDropAmount] = useState('100000');
  const [walletSearchQuery, setWalletSearchQuery] = useState('');
  const [printFilterType, setPrintFilterType] = useState<'all' | 'specific'>('all');
  const [printSelectedGroup, setPrintSelectedGroup] = useState('Umroh Reguler 11 Juni 2026 (Madinah Awal)');

  // Dynamic budget states based on Group names
  const [groupBudgets, setGroupBudgets] = useState<Record<string, number>>({
    'Umroh Reguler 11 Juni 2026 (Madinah Awal)': 6000,
    'Umroh Syawal Garuda VIP 2026': 15000,
    'Umroh Akhir Syawal 14 Hari': 4550,
  });

  // Load jamaah list from storage for accurate count of pax 
  const [jamaahListForBudget] = useState(() => {
    const saved = localStorage.getItem('ji_jamaah_list_v3');
    return saved ? JSON.parse(saved) : [];
  });

  // Unique groups compiled dynamically
  const uniqueGroups = Array.from(
    new Set([
      ...fieldReports.map(r => r.groupName),
      'Umroh Reguler 11 Juni 2026 (Madinah Awal)',
      'Umroh Syawal Garuda VIP 2026',
      'Umroh Akhir Syawal 14 Hari'
    ].filter(Boolean))
  );

  const getGroupStats = (groupName: string) => {
    // Calculate total pax in this group
    const pax = (jamaahListForBudget || []).filter((j: any) => j.groupName === groupName).length || 45;
    
    // Calculate approved costs for this group name
    const approvedCost = (fieldReports || [])
      .filter(r => r.status === 'Selesai' && r.groupName === groupName)
      .reduce((sum, r) => sum + r.amountSAR, 0);

    return { pax, approvedCost };
  };

  // Quick Stats
  const managerWallet = wallets.find(w => w.id === 'wallet-manager') || { balanceSAR: 0 };
  const ahmadWallet = wallets.find(w => w.id === 'wallet-ahmad') || { balanceSAR: 0 };
  const faizWallet = wallets.find(w => w.id === 'wallet-faiz') || { balanceSAR: 0 };
  const tariqWallet = wallets.find(w => w.id === 'wallet-tariq') || { balanceSAR: 0 };
  const malikWallet = wallets.find(w => w.id === 'wallet-malik') || { balanceSAR: 0 };

  const totalCentralBalance = wallets.reduce((sum, w) => sum + w.balanceSAR, 0);
  
  // Filtered reports for Team view
  const getFilteredReports = () => {
    if (selectedTeamFilter === 'ALL') return fieldReports;
    return fieldReports.filter(r => r.walletSourceId === selectedTeamFilter);
  };

  const getFilteredTransactions = () => {
    if (selectedTeamFilter === 'ALL') return transactions;
    return transactions.filter(t => t.walletId === selectedTeamFilter);
  };

  const currentFilteredReports = getFilteredReports();
  const currentFilteredTransactions = getFilteredTransactions();

  const approvedExpenses = fieldReports.filter(r => r.status === 'Selesai');
  const pendingExpenses = fieldReports.filter(r => r.status === 'Pending');

  const totalSpentApproved = approvedExpenses.reduce((sum, r) => sum + r.amountSAR, 0);
  const totalSpentPending = pendingExpenses.reduce((sum, r) => sum + r.amountSAR, 0);

  // Alur 1: Terima drop dari pusat (jumlah fleksibel)
  const handleDropFromPusat = () => {
    const amt = Number(customDropAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Harap masukkan jumlah nominal droping yang sah.');
      return;
    }
    onAddTransaction({
      title: 'DROPING KAPASITAS PUSAT: Kas Operasional Besar Cabang KSA',
      category: 'Dana Drop',
      type: 'Masuk',
      amountSAR: amt,
      walletId: 'wallet-manager',
      date: new Date().toISOString().split('T')[0]
    });
    setFeedback(`Sukses mendarat! Dana modal ${amt.toLocaleString('id-ID')} SAR ditambahkan ke Brankas Kas Pusat Manager.`);
    setTimeout(() => setFeedback(''), 5000);
  };

  // Alur 2: Kirim saldo ke dompet tim 1.000 SAR
  const handleTransferToTim = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Harap masukkan jumlah nominal Riyal (SAR) yang sah.');
      return;
    }

    if (amount > managerWallet.balanceSAR) {
      alert('Gagal transfer: Saldo Kas Pusat Manager tidak mencukupi. Harap klik "Terima Droping Kantor Pusat" terlebih dahulu.');
      return;
    }

    if (onTransferFunds) {
      onTransferFunds('wallet-manager', transferTarget, amount);
      const recipient = wallets.find(w => w.id === transferTarget)?.holder || transferTarget;
      setFeedback(`Sukses menyalurkan ${amount} SAR dari Kas Pusat ke ${recipient}!`);
      setTransferAmount('');
      setTimeout(() => setFeedback(''), 5000);
    }
  };

  // Quick Bagi Rata ke semua tim
  const handleBagiRataKilat = () => {
    const totalTim = teamMembers.length;
    const amountPerTim = 1000;
    const totalNeeded = totalTim * amountPerTim; 
    
    if (managerWallet.balanceSAR < totalNeeded) {
      alert(`Peringatan: Saldo Kas Pusat Manager (Fathur) kurang untuk membagi rata ${amountPerTim} SAR ke ${totalTim} tim (Butuh ${totalNeeded} SAR).\n\nSilakan isi saldo pusat terlebih dahulu.`);
      return;
    }

    if (onTransferFunds) {
      teamMembers.forEach(tm => {
        onTransferFunds('wallet-manager', `wallet-${tm.username}`, amountPerTim);
      });

      setFeedback(`ZAP! Dana operasional @${amountPerTim} SAR dibagikan serentak ke ${totalTim} tim!`);
      setTimeout(() => setFeedback(''), 5000);
    }
  };

  return (
    <div className="space-y-4 text-xs font-semibold" id="manager-cashflow-view">
      
      {/* Toast Feedback */}
      {feedback && (
        <div className="p-3.5 bg-slate-900 border border-[#D4AF37] text-[#D4AF37] font-black rounded-lg flex items-center justify-between gap-3 animate-pulse duration-1000">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback('')} className="text-white">✕</button>
        </div>
      )}      {/* 1. Header Metrics Row (Sisa, Belanja, Review, Drop) - Compacted for mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3" id="cf-stats-row">
        
        {/* Stat A: Total Brankas Kas Pusat */}
        <div className="bg-slate-900 text-[#D4AF37] p-3 sm:p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[8px] sm:text-[9px] font-black text-slate-400 block uppercase tracking-wider">KAS PUSAT MANAGER</span>
            <div className="text-sm sm:text-xl font-bold font-mono text-white mt-0.5 sm:mt-1">
              {managerWallet.balanceSAR.toLocaleString('id-ID')} <span className="text-[10px] text-[#D4AF37]">SAR</span>
            </div>
            <p className="text-[8px] text-slate-400 font-medium mt-0.5 hidden sm:block">Likuiditas dititipkan ke Manager Fathur</p>
          </div>
          <div className="pt-1.5 sm:pt-2 border-t border-slate-850 flex items-center justify-between mt-1.5 sm:mt-3 text-[8px] sm:text-[10px] text-slate-400">
            <span>Rp {(managerWallet.balanceSAR * 4350).toLocaleString('id-ID')}</span>
            <Landmark className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-500 shrink-0" />
          </div>
        </div>

        {/* Stat B: Total Belanja Lapangan (Selesai) */}
        <div className="bg-white text-slate-800 p-3 sm:p-4 rounded-xl border border-slate-200 shadow-3xs flex flex-col justify-between">
          <div>
            <span className="text-[8px] sm:text-[9px] font-black text-slate-400 block uppercase tracking-wider">BELANJA DISETUJUI (REAL)</span>
            <div className="text-sm sm:text-xl font-bold font-mono text-emerald-700 mt-0.5 sm:mt-1">
              {totalSpentApproved.toLocaleString('id-ID')} <span className="text-[10px] text-slate-500">SAR</span>
            </div>
            <p className="text-[8px] text-slate-400 font-medium mt-0.5 hidden sm:block">Kuitansi riil disetujui audit lapangan</p>
          </div>
          <div className="pt-1.5 sm:pt-2 border-t border-slate-100 flex items-center justify-between mt-1.5 sm:mt-3 text-[8px] sm:text-[10px] text-slate-550">
            <span>Rp {(totalSpentApproved * 4350).toLocaleString('id-ID')}</span>
            <Check className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-600 shrink-0" />
          </div>
        </div>

        {/* Stat C: Total Review Biaya (Pending) */}
        <div className="bg-amber-505/5 text-amber-800 p-3 sm:p-4 rounded-xl border border-amber-500/10 shadow-3xs flex flex-col justify-between bg-amber-50/50">
          <div>
            <span className="text-[8px] sm:text-[9px] font-black text-amber-700 block uppercase tracking-wider">MENUNGGU REVIEW</span>
            <div className="text-sm sm:text-xl font-bold font-mono text-amber-700 mt-0.5 sm:mt-1">
              {totalSpentPending.toLocaleString('id-ID')} <span className="text-[10px] text-amber-600">SAR</span>
            </div>
            <p className="text-[8px] text-amber-655 font-medium mt-0.5 hidden sm:block">Laporan pengeluaran mengantri</p>
          </div>
          <div className="pt-1.5 sm:pt-2 border-t border-amber-200/40 flex items-center justify-between mt-1.5 sm:mt-3 text-[8px] sm:text-[10px]">
            <span>Rp {(totalSpentPending * 4350).toLocaleString('id-ID')}</span>
            <BadgeCheck className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-500 animate-pulse shrink-0" />
          </div>
        </div>

        {/* Stat D: Total Gabungan Cash di Seluruh Sektor */}
        <div className="bg-[#D4AF37]/5 text-amber-950 p-3 sm:p-4 rounded-xl border border-[#D4AF37]/20 shadow-3xs flex flex-col justify-between">
          <div>
            <span className="text-[8px] sm:text-[9px] font-black text-[#D4AF37] block uppercase tracking-wider">TOTAL KAS SEKTOR</span>
            <div className="text-sm sm:text-xl font-bold font-mono text-slate-905 mt-0.5 sm:mt-1">
              {totalCentralBalance.toLocaleString('id-ID')} <span className="text-[10px] text-slate-500">SAR</span>
            </div>
            <p className="text-[8px] text-slate-500 font-medium mt-0.5 hidden sm:block">Gabungan Kas Manager + Kas Sektor</p>
          </div>
          <div className="pt-1.5 sm:pt-2 border-t border-slate-100 flex items-center justify-between mt-1.5 sm:mt-3 text-[8px] sm:text-[10px] text-slate-450">
            <span>Rp {(totalCentralBalance * 4350).toLocaleString('id-ID')}</span>
            <Coins className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#D4AF37] shrink-0" />
          </div>
        </div>

      </div>

      {/* 📊 AUDIT & SIMULASI ANGGARAN OPERASIONAL PER NAMA GRUP */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs space-y-4" id="package-budget-simulator">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase flex items-center gap-1.5">
              <FileSpreadsheet className="w-4.5 h-4.5 text-[#D4AF37]" />
              <span>📊 Rangkuman Realisasi Anggaran Per Nama Grup</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Analisis realisasi pengeluran tim berdasarkan nama grup umroh aktif di lapangan tanah suci.</p>
          </div>
          <div className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            Nilai Kurs: <span className="font-mono text-emerald-700 font-extrabold">1 SAR = Rp 4.350</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* Main Table Breakdown */}
          <div className="xl:col-span-8 overflow-x-auto border border-slate-150 rounded-xl">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600">
                  <th className="py-2.5 px-3">NAMA GRUP</th>
                  <th className="py-2.5 px-2 text-center">TOTAL PAX</th>
                  <th className="py-2.5 px-2 text-right">TARGET BUDGET/PAX</th>
                  <th className="py-2.5 px-2 text-right font-bold text-emerald-700">REALISASI HPP/PAX</th>
                  <th className="py-2.5 px-2 text-right font-bold text-slate-800">REAL BIAYA SQUAD</th>
                  <th className="py-2.5 px-3 text-center">STATUS AUDIT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {uniqueGroups.map((groupName) => {
                  const { pax, approvedCost } = getGroupStats(groupName);
                  const targetPreset = groupBudgets[groupName] || 5000;
                  const costPerPax = Math.round(approvedCost / pax);
                  const isOver = costPerPax > targetPreset;
                  const pct = Math.min(100, Math.round((costPerPax / (targetPreset || 1)) * 100));

                  return (
                    <tr key={groupName} className="hover:bg-slate-50/50 font-semibold text-slate-700">
                      <td className="py-3 px-3">
                        <span className="font-extrabold text-slate-900 block truncate max-w-[190px]" title={groupName}>{groupName}</span>
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isOver ? 'bg-rose-500' : 'bg-emerald-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-slate-800">
                        {pax} Pax
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-end gap-1 text-right">
                          <input 
                            type="number"
                            value={targetPreset}
                            onChange={(e) => setGroupBudgets(prev => ({ ...prev, [groupName]: Number(e.target.value) || 0 }))}
                            className="w-14 px-1 py-0.5 border border-slate-200 rounded font-mono font-bold text-right text-[10px] bg-slate-50 focus:bg-white text-slate-900"
                          />
                          <span className="text-[9px] text-slate-400 font-bold">SAR</span>
                        </div>
                        <span className="block text-[8.5px] text-slate-400 text-right font-medium">~Rp {(targetPreset * 4350).toLocaleString('id-ID')}</span>
                      </td>
                      <td className="py-3 px-2 text-right font-mono font-bold text-slate-800">
                        <span className={isOver ? 'text-rose-600 font-extrabold' : 'text-emerald-700 font-extrabold'}>
                          {costPerPax.toLocaleString('id-ID')} SAR
                        </span>
                        <span className="block text-[8.5px] text-slate-400 font-normal">~Rp {(costPerPax * 4350).toLocaleString('id-ID')}</span>
                      </td>
                      <td className="py-3 px-2 text-right font-mono font-black text-slate-950">
                        {approvedCost.toLocaleString('id-ID')} SAR
                        <span className="block text-[8.5px] text-slate-400 font-normal">~Rp {(approvedCost * 4350).toLocaleString('id-ID')}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-black border uppercase ${
                            isOver ? 'bg-rose-50 text-rose-850 border-rose-200 animate-pulse' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}>
                            {isOver ? '⚠️ OVER' : '✅ AMAN'}
                          </span>
                          <span className="block text-[8px] text-slate-400 mt-1 font-bold">
                            {(targetPreset - costPerPax).toLocaleString('id-ID')} SAR
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Side explanatory / analytical notes panel */}
          <div className="xl:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-black text-[#A67C1E] uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Analisis Realisasi Anggaran</span>
            </h4>
            <div className="text-[10px] font-medium text-slate-600 leading-relaxed space-y-2">
              <p>
                Rangkuman ini mengagregasikan pengeluaran riil berstatus <strong className="text-emerald-700">Selesai (Diotorisasi)</strong> dari tim yang bertugas di lapangan.
              </p>
              <p>
                Nilai HPP per-pax otomatis terhitung berdasarkan pembagian akumulasi biaya disetujui dengan jumlah total pax jamaah yang terdaftar dalam manifest nama grup bersangkutan.
              </p>
              <div className="p-2.5 bg-[#D4AF37]/5 rounded-lg border border-[#D4AF37]/20 text-[#8C6B1B] font-bold">
                💡 <strong>Target Anggaran:</strong> Manager dapat menyesuaikan pagu target per-pax untuk mensimulasikan efisiensi biaya secara langsung di lapangan Arab Saudi.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Flow Action Hub Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-3xs overflow-hidden p-4" id="cf-actions-hub">
        
        <div className="border-b border-slate-150 pb-2.5 mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase">Konektor Finansial Jejak Imani (KSA)</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Simulasikan drop dana dari pusat dan bagikan ke rombongan petugas.</p>
          </div>
          
          <button
            onClick={() => setIsInvoiceModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-slate-950 hover:bg-black text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
          >
            <Printer className="w-4 h-4 text-[#D4AF37]" />
            <span>Cetak Invoice</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Card A: Drop Pusat Trigger */}
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-amber-50/50 rounded-xl border border-indigo-200/50 flex flex-col justify-between">
            <div className="space-y-1.5 text-xs">
              <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 text-[8px] font-black uppercase rounded w-fit">
                Pusat Jakarta ➔ Cabang Saudi
              </span>
              <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">📥 Dana Droping Kantor Pusat</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Sesuai pengajuan anggaran Cabang Arab Saudi, Kantor Pusat Jejak Imani Jakarta mendrop uang kas dengan jumlah fleksibel (bebas diatur) ke Brankas Manager Fathur harian.
              </p>
              
              <div className="mt-3">
                <label className="block text-[8.5px] font-black text-indigo-700 uppercase mb-0.5">NOMINAL DROP DARI JAKARTA (SAR)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={customDropAmount}
                    onChange={(e) => setCustomDropAmount(e.target.value)}
                    className="w-full p-2 pl-9 bg-white border border-indigo-200 text-slate-900 rounded-lg text-xs font-mono font-bold focus:ring-1 focus:ring-indigo-500"
                    placeholder="Contoh: 100000"
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-[#5c5c5c] font-mono">SAR</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleDropFromPusat}
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-black text-[#D4AF37] border border-[#D4AF37]/30 font-black rounded-lg transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-3xs active:scale-95 duration-100"
              >
                <ArrowUpRight className="w-4 h-4 text-[#D4AF37]" />
                <span>Terima Drop {Number(customDropAmount || 0).toLocaleString('id-ID')} SAR</span>
              </button>
            </div>
          </div>

          {/* Card B: Distribusi Dana ke Roster Tim */}
          <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200">
            <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-2">
              <Coins className="w-4 h-4 text-slate-600" />
              <span>Bagi / Kirim Dana Operasional Tim Lapangan</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 max-w-md leading-normal">
              Manager memindahkan kas besar dari Brankas Manager ke akun Riyal personil harian di lapangan harian.
            </p>

            <form onSubmit={handleTransferToTim} className="mt-3.5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase mb-0.5">PILIH PETUGAS LAPANGAN</label>
                  <select
                    value={transferTarget}
                    onChange={(e) => setTransferTarget(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-250 text-slate-800 rounded-lg text-xs font-bold focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    {wallets.filter(w => w.id !== 'wallet-manager').map(w => (
                      <option key={w.id} value={w.id}>
                        👤 {w.name} (Saldo: {w.balanceSAR} SAR)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase mb-0.5">JUMLAH TRANSFER (SAR)</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="10"
                      placeholder="Contoh: 1000"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full p-2 pl-9 bg-white border border-slate-250 text-slate-900 rounded-lg text-xs font-mono font-bold focus:ring-1 focus:ring-amber-500"
                    />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 font-mono">SAR</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-slate-950 hover:bg-black border border-slate-850 text-white font-bold rounded-lg transition-colors text-xs text-center cursor-pointer"
                >
                  Kirim Drop Kas
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

      {/* 3. Real-Time Wallets Balance Tracker Cards based on actual names */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs">
        <div className="border-b border-slate-100 pb-2 mb-3">
          <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-tight">DAFTAR DOMPET DEPOSIT (CASH RIYAL)</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" id="wallets-overview-layout">
          {/* Manager Wallet Always Emphasized */}
          {wallets.filter(w => w.id === 'wallet-manager').map((wallet) => (
            <div 
              key={wallet.id} 
              className="col-span-1 p-4 rounded-xl border flex flex-col justify-between space-y-3 shadow-md bg-slate-900 text-white border-slate-800"
            >
              <div className="space-y-1">
                <span className="px-1.5 py-0.5 text-[8px] font-black uppercase rounded bg-[#D4AF37] text-slate-950 w-fit">Kas Pusat</span>
                <h4 className="font-black text-sm truncate mt-1">{wallet.name}</h4>
                <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">Pemegang: {wallet.holder}</p>
              </div>
              <div className="pt-3 border-t border-slate-800">
                <span className="text-[9px] tracking-wider block font-black uppercase text-slate-400">SALDO RIYAL</span>
                <span className="text-xl tracking-tight font-mono font-black text-[#D4AF37]">
                  {wallet.balanceSAR.toLocaleString('id-ID')} <span className="text-xs font-bold text-slate-400">SAR</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-medium mt-0.5 truncate">
                  ~ Rp {(wallet.balanceSAR * 4350).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          ))}

          {/* Scrolling Grid for Team Wallets */}
          <div className="col-span-1 lg:col-span-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 px-1 gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">Kas Tim Lapangan ({wallets.length - 1} Dompet)</span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Cari dompet..."
                  value={walletSearchQuery}
                  onChange={(e) => setWalletSearchQuery(e.target.value)}
                  className="px-2 py-1 bg-white border border-slate-250 text-slate-800 rounded text-[10px] w-40 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
              {wallets
                .filter(w => w.id !== 'wallet-manager')
                .filter(w => !walletSearchQuery || w.name.toLowerCase().includes(walletSearchQuery.toLowerCase()) || w.holder.toLowerCase().includes(walletSearchQuery.toLowerCase()))
                .map((wallet) => (
                  <div 
                    key={wallet.id} 
                    className="p-3 bg-white rounded-lg border border-slate-200"
                  >
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-[10px] text-slate-800 truncate" title={wallet.name}>{wallet.name}</h4>
                      <p className="text-[9px] text-slate-400 font-medium truncate" title={wallet.holder}>PIC: {wallet.holder}</p>
                    </div>
                    <div className="pt-2 mt-2 border-t border-slate-100 flex flex-col">
                      <span className="text-xs font-mono font-black text-slate-900">{wallet.balanceSAR.toLocaleString('id-ID')} <span className="text-[9px] text-slate-400">SAR</span></span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Filter and View Section: ALL Team and Individual Members */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-3xs overflow-hidden" id="sync-approvals">
        
        {/* Sync Controls Banner with Active Filter tabs */}
        <div className="p-4 bg-slate-50 border-b border-slate-150 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-tight flex items-center gap-1.5">
              <Users className="w-4.5 h-4.5 text-[#D4AF37]" />
              <span>Verifikasi Pengeluaran & Audit Sektor harian</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">Laporan pengeluaran yang diunggah oleh petugas lapangan secara real-time</p>
          </div>

          {/* Dropdown Filter for Team Member */}
          <div className="flex items-center gap-2" id="team-tabs-row">
            <label className="text-[10px] font-black uppercase text-slate-500 whitespace-nowrap">Filter Tim:</label>
            <select
              value={selectedTeamFilter}
              onChange={(e) => setSelectedTeamFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] font-black text-slate-700 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] cursor-pointer max-w-[200px]"
            >
              <option value="ALL">✅ Keseluruhan Tim</option>
              {teamMembers.map(tm => (
                <option key={tm.id} value={`wallet-${tm.username}`}>
                  {tm.name} ({tm.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* List pending approvals for current filter */}
        <div className="p-4 bg-amber-500/5 border-b border-amber-500/10" id="pending-list-section">
          <div className="mb-2.5 flex items-center justify-between text-amber-900">
            <span className="text-[10px] font-black block uppercase tracking-wider">Menunggu Persetujuan Manager</span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-950 rounded text-[9.5px] font-black">
              {currentFilteredReports.filter(r => r.status === 'Pending').length} Request
            </span>
          </div>

          {currentFilteredReports.filter(r => r.status === 'Pending').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentFilteredReports.filter(r => r.status === 'Pending').map((report) => (
                <div key={report.id} className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-3xs flex flex-col justify-between gap-3 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-black">
                      <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[8px] uppercase">
                        📁 {report.groupName.split('(')[0].trim()}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-950 rounded border border-amber-200 text-[8px] uppercase">
                        🏷️ {report.category}
                      </span>
                      <span className="text-slate-400 font-mono font-medium">📅 {report.date}</span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">{report.note}</h4>
                    <p className="text-[10px] text-slate-400">
                      Diajukan Oleh: <strong className="text-slate-600">👤 {report.handlingName}</strong>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                    <div className="font-mono text-left">
                      <span className="block text-[8px] text-slate-400 font-black leading-none">AJUAN NOMINAL</span>
                      <span className="text-xs font-black text-slate-950">{report.amountSAR.toLocaleString('id-ID')} SAR</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedReceipt(`Nota Ajuan ${report.handlingName}: "${report.note}" senilai ${report.amountSAR} SAR`)}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-205 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        Pratinjau Kuitansi
                      </button>

                      <button
                        type="button"
                        onClick={() => onRejectFieldReport(report.id)}
                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        Tolak
                      </button>

                      <button
                        type="button"
                        onClick={() => onApproveFieldReport(report.id, report.walletSourceId)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black cursor-pointer shadow-3xs"
                      >
                        Setuju
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic text-[10px] py-1.5 text-center">Tidak ada laporan dana belanja pending untuk filter/petugas ini.</p>
          )}
        </div>

        {/* Table of all matching history as a clean ledger */}
        <div className="p-4 space-y-3" id="ledger-history">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Histori Laporan & Ledger Audit (Filter Terpilih)</span>
            <span className="text-[10px] font-black text-slate-500">
              Total Data: {currentFilteredTransactions.length + currentFilteredReports.filter(r => r.status !== 'Pending').length} Transaksi
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-150 rounded-xl">
            <table className="w-full text-left text-[11px] border-collapse bg-white">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-slate-400 font-bold uppercase text-[9.5px]">
                  <th className="py-2.5 px-3">Tanggal / Oleh</th>
                  <th className="py-2.5 px-3">Keperluan / Kategori</th>
                  <th className="py-2.5 px-3">Akun Dompet Debet</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">SAR Riyal</th>
                  <th className="py-2.5 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                
                {/* 1. Show matching ledger transactions (drops/transfers) */}
                {currentFilteredTransactions.length === 0 && currentFilteredReports.filter(r => r.status !== 'Pending').length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400 italic">
                      Tidak ada mutasi belanja yang terdaftar untuk filter ini.
                    </td>
                  </tr>
                ) : (
                  <>
                    {/* Render raw ledger events */}
                    {currentFilteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/20">
                        <td className="py-2 px-3 font-mono">
                          <div className="text-slate-400">{tx.date}</div>
                          <div className="text-[9.5px] text-slate-500 font-bold">👤 {tx.byUser}</div>
                        </td>
                        <td className="py-2 px-3">
                          <div className="font-extrabold text-slate-900">{tx.title}</div>
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[8.5px] uppercase font-black">
                            {tx.category}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="font-bold text-slate-650">
                            💼 {wallets.find(w => w.id === tx.walletId)?.name || tx.walletId}
                          </span>
                        </td>
                        <td className="py-2 px-3 uppercase">
                          <span className={`px-2 py-0.5 rounded text-[8.5px] font-black border ${
                            tx.type === 'Masuk' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-900 border-slate-200'
                          }`}>
                            {tx.type === 'Masuk' ? '📥 MASUK' : '📤 KELUAR'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-black text-slate-900">
                          <span className={tx.type === 'Masuk' ? 'text-emerald-700' : 'text-slate-900'}>
                            {tx.type === 'Masuk' ? '+' : '-'} {tx.amountSAR.toLocaleString('id-ID')} SAR
                          </span>
                          <span className="block text-[8.5px] text-slate-400 font-normal">
                            ~Rp {(tx.amountSAR * 4350).toLocaleString('id-ID')}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center overflow-visible relative">
                          <div className="inline-block text-left">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdownId(activeDropdownId === tx.id ? null : tx.id);
                              }}
                              className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-md transition-all cursor-pointer inline-flex items-center justify-center bg-white border border-slate-200"
                              title="Pilihan Aksi"
                            >
                              <MoreVertical className="w-3.5 h-3.5 text-slate-500" />
                            </button>

                            {activeDropdownId === tx.id && (
                              <>
                                <button
                                  type="button"
                                  className="fixed inset-0 z-30 cursor-default bg-transparent"
                                  onClick={() => setActiveDropdownId(null)}
                                />
                                <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-40 text-left animate-in fade-in slide-in-from-top-1 duration-105">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveDropdownId(null);
                                      if (onDeleteTransaction) {
                                        onDeleteTransaction(tx.id);
                                      } else {
                                        alert('Aksi hapus transaksi tidak diizinkan oleh sistem.');
                                      }
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center gap-1.5 font-sans"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                    <span>Hapus Mutasi</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* Render actual approved or rejected field reports */}
                    {currentFilteredReports.filter(r => r.status !== 'Pending').map((report) => (
                      <tr key={report.id} className="hover:bg-slate-50/20 bg-emerald-50/10">
                        <td className="py-2 px-3 font-mono">
                          <div className="text-slate-400">{report.date}</div>
                          <div className="text-[9.5px] text-slate-550 font-bold">👤 {report.handlingName}</div>
                        </td>
                        <td className="py-2 px-3">
                          <div className="font-extrabold text-slate-900">{report.note}</div>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="px-1.5 py-0.5 bg-sky-50 text-sky-800 rounded border border-sky-200 text-[8.5px] uppercase">
                              ⚙️ {report.category}
                            </span>
                            <span className="font-semibold text-slate-400 text-[8.5px]">
                              {report.groupName.split('(')[0]}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <span className="font-bold text-slate-650">
                            💼 {wallets.find(w => w.id === report.walletSourceId)?.name || 'Dompet Petugas'}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded text-[8.5px] font-black border ${
                            report.status === 'Selesai' ? 'bg-emerald-50 text-emerald-800 border-emerald-250' : 'bg-rose-50 text-rose-800 border-rose-250'
                          }`}>
                            {report.status === 'Selesai' ? '✓ APPROVED' : '✗ REJECTED'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-black text-slate-900">
                          <span>{report.amountSAR.toLocaleString('id-ID')} SAR</span>
                          <span className="block text-[8.5px] text-slate-400 font-normal">
                            ~Rp {(report.amountSAR * 4350).toLocaleString('id-ID')}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center overflow-visible relative">
                          <div className="inline-block text-left font-sans">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdownId(activeDropdownId === report.id ? null : report.id);
                              }}
                              className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-md transition-all cursor-pointer inline-flex items-center justify-center bg-white border border-slate-200"
                              title="Pilihan Aksi"
                            >
                              <MoreVertical className="w-3.5 h-3.5 text-slate-500" />
                            </button>

                            {activeDropdownId === report.id && (
                              <>
                                <button
                                  type="button"
                                  className="fixed inset-0 z-30 cursor-default bg-transparent"
                                  onClick={() => setActiveDropdownId(null)}
                                />
                                <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-40 text-left animate-in fade-in slide-in-from-top-1 duration-105">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveDropdownId(null);
                                      setSelectedReceipt(`Laporan Dana Belanja Tim ${report.handlingName}: "${report.note}" senilai ${report.amountSAR} SAR pada ${report.date}`);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-1.5 font-sans"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                                    <span>Lihat Kuitansi</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}

              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 5. PRATINJAU BUKTI PELAPORAN INVOICE / PDF DIALOG */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#D4AF37]/50 overflow-hidden text-left flex flex-col uppercase-labels">
            
            <style>{`
              @media print {
                .no-print { display: none !important; }
                #print-area { max-height: none !important; overflow: visible !important; padding: 0 !important; }
              }
            `}</style>

            {/* Action Bar (Print / Close) */}
            <div className="px-4 py-3 bg-slate-950 text-white flex items-center justify-between border-b border-[#D4AF37]/40 no-print">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D4AF37]" />
                <span className="font-black text-xs text-[#D4AF37] uppercase tracking-wide">Pratinjau Cetak Invoice</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-[#D4AF37] text-slate-950 font-black rounded text-[10px] flex items-center gap-1 hover:bg-white cursor-pointer active:scale-95 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / PDF</span>
                </button>
                
                <button 
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-md cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Interactive Filters (No print) */}
            <div className="p-4 bg-slate-100 border-b border-slate-205 space-y-2.5 no-print">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">⚙️ FILTER INVOICE SEBELUM DICETAK</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[9px] font-black text-slate-455 uppercase mb-1">PILIH METODE FILTER</label>
                  <select
                    value={printFilterType}
                    onChange={(e) => setPrintFilterType(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-250 text-xs font-bold text-slate-800 rounded-lg outline-none focus:border-amber-500"
                  >
                    <option value="all">📁 KESELURUHAN GRUP (NAMA GRUP & TOTAL PENGELUARAN)</option>
                    <option value="specific">🔍 SATU GRUP SPESIFIK (DETAIL RINCIAN PENGELUARANNYA)</option>
                  </select>
                </div>

                {printFilterType === 'specific' && (
                  <div>
                    <label className="block text-[9px] font-black text-indigo-700 uppercase mb-1">PILIH NAMA GRUP AKTIF</label>
                    <select
                      value={printSelectedGroup}
                      onChange={(e) => setPrintSelectedGroup(e.target.value)}
                      className="w-full p-2 bg-white border border-indigo-200 text-xs font-bold text-indigo-855 rounded-lg outline-none focus:border-indigo-500"
                    >
                      {uniqueGroups.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Document body (Styling resembles high craft physical invoice) */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto font-sans text-slate-800" id="print-area">
              
              {/* Document Header Letterhead */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 border-slate-250 gap-4">
                <div className="space-y-1">
                  <div className="text-xl font-black tracking-tighter text-slate-950 flex items-center gap-1.5 uppercase-headings text-[#1A1A1A]">
                    <span className="font-serif italic text-amber-500 font-extrabold text-2xl">JI</span>
                    <span>JEJAK IMANI</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Kantor Cabang Ops Saudi Arabia • Madinah - Makkah • KSA
                  </p>
                </div>
                
                <div className="text-left sm:text-right font-mono text-[10px] text-slate-500 space-y-0.5">
                  <div className="font-black text-slate-900 text-[11px] tracking-wider uppercase">INVOICE LAPANGAN KSA</div>
                  <div>No: JI/INV-OPS-SAUDI/{new Date().getFullYear()}/{Math.floor(1000 + Math.random() * 9000)}</div>
                  <div>Tanggal Cetak: {new Date().toISOString().split('T')[0]} • AST</div>
                  <div>Metode: <span className="text-amber-850 font-bold uppercase text-[9px] bg-amber-50 px-2 py-0.5 border border-amber-200 rounded">{printFilterType === 'all' ? 'KESELURUHAN GRUP' : 'SPESIFIK GRUP'}</span></div>
                </div>
              </div>

              {/* Scope & Overview Meta row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-150">
                  <span className="text-[8px] text-slate-400 block font-black uppercase">Pihak Penanggung Jawab</span>
                  <span className="text-[11px] font-bold text-slate-800">Fathur (Operations Manager)</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-150">
                  <span className="text-[8px] text-slate-400 block font-black uppercase">Tingkat Penyaluran Sektor</span>
                  <span className="text-[11px] font-bold text-slate-800">4 Rombongan Tim Aktif</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-150">
                  <span className="text-[8px] text-slate-400 block font-black uppercase">Mata Uang Acuan</span>
                  <span className="text-[11px] font-bold text-slate-800">SAR Riyal (Riyal Arab Saudi)</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-150">
                  <span className="text-[8px] text-slate-400 block font-black uppercase">Kurs IDR Konversi</span>
                  <span className="text-[11px] font-bold text-slate-800">1 SAR = Rp 4.350 (Tetap)</span>
                </div>
              </div>

              {/* Conditional Table Area of print filter */}
              {printFilterType === 'all' ? (
                /* Method A: Keseluruhan Grup (Nama grup & total pengeluarannya saja, tidak perlu rincian) */
                <div className="space-y-3.5">
                  <div className="p-3 bg-slate-900 text-[#D4AF37] rounded-lg font-black uppercase tracking-wider text-[10px] flex justify-between items-center">
                    <span>NERACA RINGKASAN REALISASI BIAYA KESELURUHAN GRUP</span>
                    <span className="text-white font-mono">{uniqueGroups.length} GRUP TERDATA</span>
                  </div>
                  
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px]">
                          <th className="py-2.5 px-3">NAMA GRUP OPERASIONAL</th>
                          <th className="py-2.5 px-3 text-center">ESTIMASI PAX</th>
                          <th className="py-2.5 px-3 text-right">TOTAL REALISASI BELANJA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 text-slate-800 font-semibold text-xs">
                        {uniqueGroups.map((gName) => {
                          const { pax, approvedCost } = getGroupStats(gName);
                          return (
                            <tr key={gName} className="align-middle hover:bg-slate-50/50">
                              <td className="py-3 px-3 font-extrabold text-slate-950 uppercase">
                                {gName}
                              </td>
                              <td className="py-3 px-3 text-center font-mono text-slate-600 font-bold">
                                {pax} Pax
                              </td>
                              <td className="py-3 px-3 text-right font-mono font-black text-emerald-800 text-xs text-right">
                                {approvedCost.toLocaleString('id-ID')} SAR
                                <span className="block text-[8.5px] text-slate-400 font-normal">~Rp {(approvedCost * 4350).toLocaleString('id-ID')}</span>
                              </td>
                            </tr>
                          );
                        })}
                        {/* Summary Total Row */}
                        <tr className="bg-slate-100 font-black">
                          <td colSpan={2} className="py-3 px-3 text-slate-950 text-right uppercase tracking-wider text-[9px]">TOTAL KESELURUHAN BELANJA GRUP:</td>
                          <td className="py-3 px-3 text-right font-mono text-xs text-slate-950 border-t-2 border-slate-400">
                            {uniqueGroups.reduce((acc, g) => acc + getGroupStats(g).approvedCost, 0).toLocaleString('id-ID')} SAR
                            <span className="block text-[8.5px] text-slate-500 font-bold">~Rp {(uniqueGroups.reduce((acc, g) => acc + getGroupStats(g).approvedCost, 0) * 4350).toLocaleString('id-ID')}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Method B: Satu Grup Spesifik (Dengan rincian isian pengeluaran lengkap) */
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="p-3 bg-slate-900 text-white rounded-lg font-black uppercase tracking-wider text-[10px] flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <span className="text-slate-400 block text-[8px] font-mono leading-none font-black leading-normal">GRUP TARGET SPESIFIK:</span>
                      <span className="text-[#D4AF37] font-black">{printSelectedGroup}</span>
                    </div>
                    <div className="font-mono text-right text-[#D4AF37]">
                      {fieldReports.filter(r => r.groupName === printSelectedGroup && r.status === 'Selesai').length} LAPORAN DISETUJUI
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-left text-[11px] border-collapse mx-auto">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px]">
                          <th className="py-2.5 px-2.5">Tanggal</th>
                          <th className="py-2.5 px-2.5">Oleh Petugas</th>
                          <th className="py-2.5 px-2.5">Kategori / Deskripsi</th>
                          <th className="py-2.5 px-2.5 text-right font-mono">Nominal SAR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 text-slate-800">
                        {fieldReports.filter(r => r.groupName === printSelectedGroup).length > 0 ? (
                          fieldReports
                            .filter(r => r.groupName === printSelectedGroup)
                            .map((report) => (
                              <tr key={report.id} className="align-middle">
                                <td className="py-3 px-2.5 font-mono text-slate-400 text-[9.5px]">{report.date}</td>
                                <td className="py-3 px-2.5 font-bold text-slate-900">
                                  {report.handlingName}
                                  <span className="block text-[8px] text-slate-450 uppercase">Dompet: @{report.walletSourceId.replace('wallet-', '')}</span>
                                </td>
                                <td className="py-3 px-2.5">
                                  <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[8px] font-bold border block w-fit uppercase">{report.category}</span>
                                  <span className="font-black text-slate-800 mt-1 block leading-normal">{report.note}</span>
                                  <span className="text-[8px] text-slate-400 mt-0.5 block">Audit: {report.status === 'Selesai' ? '✔️ DISETUJUI' : report.status === 'Ditolak' ? '❌ DITOLAK' : '⚙️ PENDING'}</span>
                                </td>
                                <td className="py-3 px-2.5 text-right font-mono font-black text-slate-950">
                                  {report.amountSAR.toLocaleString('id-ID')} SAR
                                  <span className="block text-[8.5px] text-slate-400 font-normal">~Rp {(report.amountSAR * 4350).toLocaleString('id-ID')}</span>
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-slate-450 italic">
                              Rombongan ini belum mencatatkan laporan belanja harian yang diajukan oleh personil tim.
                            </td>
                          </tr>
                        )}
                        {/* Subtotal of matches */}
                        <tr className="bg-slate-50 font-black">
                          <td colSpan={3} className="py-2.5 px-2.5 text-right uppercase text-[8.5px] text-slate-450">TOTAL TRANSAKSI DISETUJUI GRUP INI:</td>
                          <td className="py-2.5 px-2.5 text-right font-mono text-emerald-800 text-xs text-right">
                            {fieldReports.filter(r => r.groupName === printSelectedGroup && r.status === 'Selesai').reduce((sum, r) => sum + r.amountSAR, 0).toLocaleString('id-ID')} SAR
                            <span className="block text-[8.5px] text-slate-450 font-normal">~Rp {(fieldReports.filter(r => r.groupName === printSelectedGroup && r.status === 'Selesai').reduce((sum, r) => sum + r.amountSAR, 0) * 4350).toLocaleString('id-ID')}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Digital sign stamps */}
              <div className="pt-6 border-t border-dashed border-slate-200 flex justify-between items-center flex-wrap gap-4 text-[10px] sm:text-[11px] font-black">
                <div className="text-left space-y-1">
                  <span className="text-slate-400 block uppercase text-[8px] font-black">DIVISI KEUANGAN PUSAT</span>
                  <div className="w-24 h-11 border border-dashed border-slate-350 bg-slate-50 flex items-center justify-center font-serif text-[9px] italic font-bold text-[#A67C1E] uppercase rounded p-1 text-center font-sans">
                    E-Stamp Verified Jakarta
                  </div>
                  <p className="font-bold text-slate-800 text-[10px]">H. Rahmad Santoni</p>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-slate-400 block uppercase text-[8px] font-black">PENYERAH LAPANGAN (KSA)</span>
                  <div className="w-24 h-11 bg-slate-50 border border-[#D4AF37]/30 flex items-center justify-center font-bold text-[8.5px] text-[#A67C1E] uppercase rounded p-1 text-center font-mono">
                    MANAGER OK
                  </div>
                  <p className="font-bold text-slate-800 text-[10px]">Fathur (Manager Saudi)</p>
                </div>
              </div>

            </div>

            {/* Modal Controls footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-150 flex gap-2 justify-end">
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-205 text-slate-600 rounded-lg font-bold"
              >
                Tutup Pratinjau
              </button>
              
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-slate-950 hover:bg-black text-[#D4AF37] border border-[#D4AF37]/35 rounded-lg font-black"
              >
                Cetak LPJ / Simpan PDF
              </button>
            </div>

          </div>

        </div>
      )}

      {/* 6. RECEIPT IMAGE LIGHTBOX PREVIEW */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/80">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 border border-slate-200 text-center animate-in zoom-in-95">
            <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-2">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Pratinjau Kuitansi Rombongan</h4>
            <p className="text-xs text-slate-500 mt-1">{selectedReceipt}</p>
            
            <div className="my-3.5 p-3.5 border border-dashed border-slate-200 rounded-xl bg-slate-50 font-mono text-left text-[10px] text-slate-500 space-y-1">
              <div className="text-center font-black text-slate-800 mb-1.5 pb-1 border-b border-slate-150 text-[11px] tracking-tight">JEJAK IMANI KUITANSI</div>
              <div className="flex justify-between"><span>NO RESI :</span> <span className="font-bold text-slate-800">RESI-{Math.floor(10000 + Math.random() * 90000)}</span></div>
              <div className="flex justify-between"><span>KATEGORI :</span> <span className="font-bold text-slate-850">OPERASIONAL SAUDI</span></div>
              <div className="flex justify-between"><span>TANGGAL :</span> <span className="font-bold text-slate-800">2026-05-28 AST</span></div>
              <div className="flex justify-between"><span>STATUS :</span> <span className="text-emerald-600 font-bold">VERIFIED SAUDI ARABIA</span></div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="mt-2 w-full py-2 bg-slate-950 text-[#D4AF37] font-black rounded-lg hover:bg-black border border-[#D4AF37]/30"
            >
              Tutup Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
