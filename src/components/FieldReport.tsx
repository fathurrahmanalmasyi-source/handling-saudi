import React, { useState } from 'react';
import { 
  Landmark, 
  ArrowUpRight, 
  DollarSign, 
  Plus, 
  Receipt, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileSpreadsheet, 
  X, 
  ChevronRight, 
  Image as ImageIcon,
  Folder,
  Tag
} from 'lucide-react';
import { FieldExpenseReport } from '../types';

interface FieldReportProps {
  expenses: FieldExpenseReport[];
  onSubmitExpense: (newExpense: Omit<FieldExpenseReport, 'id' | 'status' | 'handlingName' | 'handlingId'>) => void;
  walletBalance: number;
  currentUser?: string;
  groups: string[];
}

export default function FieldReport({ 
  expenses, 
  onSubmitExpense, 
  walletBalance, 
  currentUser = '', 
  groups 
}: FieldReportProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Custom states for searchable/suggestible Group input
  const [groupInput, setGroupInput] = useState(groups[0] || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Kategori is now a custom text input and fits blank at startup
  const [category, setCategory] = useState('');
  const [amountSAR, setAmountSAR] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(() => {
    try {
      return new Date().toISOString().split('T')[0];
    } catch {
      return '2026-05-28';
    }
  });
  const [feedback, setFeedback] = useState('');
  const [invoiceUploaded, setInvoiceUploaded] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountSAR || isNaN(Number(amountSAR)) || Number(amountSAR) <= 0) {
      alert('Mohon masukkan jumlah Riyal (SAR) yang valid.');
      return;
    }
    if (!note.trim()) {
      alert('Mohon isi uraian keperluan pembelian/pengeluaran.');
      return;
    }
    if (!groupInput.trim()) {
      alert('Mohon masukkan atau pilih grup jamaah.');
      return;
    }

    if (Number(amountSAR) > walletBalance) {
      const confirmSpend = window.confirm(
        `Peringatan: Jumlah pengeluaran (${amountSAR} SAR) melebihi sisa saldo dompet digital Anda (${walletBalance} SAR).\n\nApakah Anda ingin mengajukan dana talangan darurat (Overdraft)?`
      );
      if (!confirmSpend) return;
    }

    onSubmitExpense({
      groupName: groupInput.trim(),
      category: category.trim() || 'Lainnya',
      amountSAR: Number(amountSAR),
      note: note.trim(),
      date,
      walletSourceId: 'wallet-1' // Default wallet for mock
    });

    // Reset Form & Feedback
    setAmountSAR('');
    setNote('');
    setCategory('');
    setIsModalOpen(false);
    
    setFeedback('Laporan Pengeluaran Berhasil Dikirim! Meminta verifikasi Manager Penanganan Lapangan.');
    setTimeout(() => setFeedback(''), 5000);
  };

  const ownExpenses = expenses.filter(expense => {
    if (!currentUser) return true;
    const uName = currentUser.toLowerCase();
    const hName = expense.handlingName.toLowerCase();
    return hName === uName || uName.includes(hName) || hName.includes(uName);
  });

  const totalSpentApproved = ownExpenses
    .filter(e => e.status === 'Selesai')
    .reduce((val, curr) => val + curr.amountSAR, 0);

  const totalSpentPending = ownExpenses
    .filter(e => e.status === 'Pending')
    .reduce((val, curr) => val + curr.amountSAR, 0);

  // Suggestions filter
  const filteredGroups = groupInput.trim() === '' 
    ? groups 
    : groups.filter(g => g.toLowerCase().includes(groupInput.toLowerCase()));

  return (
    <div className="space-y-4" id="field-report-section">
      
      {/* Toast Feedback */}
      {feedback && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-black rounded-xl border border-emerald-250 flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Redesigned, High-Density "Fit" Stats Header Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4" id="fe-stats">
        
        {/* Stat 1: Saldo */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-2.5 sm:p-4 rounded-xl border border-slate-800 flex flex-col justify-between shadow-xs relative overflow-hidden group">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-2 text-white/5 text-4xl font-black font-mono select-none pointer-events-none group-hover:scale-110 transition-transform">
            SAR
          </div>
          <div>
            <div className="flex items-center gap-1 text-slate-400">
              <span className="text-[9px] sm:text-[10px] font-black tracking-wider uppercase text-slate-400">SALDO DOMPET</span>
            </div>
            <div className="text-sm sm:text-lg font-black text-amber-400 font-mono mt-0.5 sm:mt-1 truncate">
              {walletBalance.toLocaleString('id-ID')} <span className="text-[10px] sm:text-xs">SAR</span>
            </div>
          </div>
          <div className="mt-1 sm:mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[8px] sm:text-[11px]">
            <span className="text-slate-400 truncate">Kas Operasional</span>
            <Landmark className="w-3 h-3 text-amber-500 shrink-0 ml-1" />
          </div>
        </div>

        {/* Stat 2: Disetujui */}
        <div className="bg-white p-2.5 sm:p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs relative overflow-hidden group">
          <div>
            <div className="flex items-center gap-1 text-slate-500">
              <span className="text-[9px] sm:text-[10px] font-black tracking-wider uppercase">DISETUJUI</span>
            </div>
            <div className="text-sm sm:text-lg font-black text-slate-900 font-mono mt-0.5 sm:mt-1 truncate">
              {totalSpentApproved.toLocaleString('id-ID')} <span className="text-[10px] sm:text-xs text-slate-500">SAR</span>
            </div>
          </div>
          <div className="mt-1 sm:mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[8px] sm:text-[11px]">
            <span className="text-emerald-600 font-bold truncate">Audit Aman</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
          </div>
        </div>

        {/* Stat 3: Menunggu Review */}
        <div className="bg-amber-500/5 p-2.5 sm:p-4 rounded-xl border border-amber-500/20 flex flex-col justify-between shadow-xs relative overflow-hidden">
          <div>
            <div className="flex items-center gap-1 text-amber-800">
              <span className="text-[9px] sm:text-[10px] font-black tracking-wider uppercase text-amber-700">REVIEW</span>
            </div>
            <div className="text-sm sm:text-lg font-black text-amber-700 font-mono mt-0.5 sm:mt-1 truncate">
              {totalSpentPending.toLocaleString('id-ID')} <span className="text-[10px] sm:text-xs">SAR</span>
            </div>
          </div>
          <div className="mt-1 sm:mt-2 pt-1.5 border-t border-amber-200/50 flex items-center justify-between text-[8px] sm:text-[11px]">
            <span className="text-amber-600 font-semibold truncate">Pending</span>
            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-1 animate-pulse" />
          </div>
        </div>

      </div>

      {/* Single Dynamic Visual Layout Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-3xs overflow-hidden" id="fe-main-layout">
        
        {/* Table Banner Header with Trigger Button */}
        <div className="p-4 bg-slate-50 border-b border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-4.5 h-4.5 text-[#D4AF37]" />
              <span>Riwayat Laporan Kas</span>
            </h3>
          </div>

          <button
            onClick={() => {
              setGroupInput(groups[0] || '');
              setCategory('');
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-black text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 duration-100"
          >
            <Plus className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>Lapor Pengeluaran Baru</span>
          </button>
        </div>

        {/* ----------------------------------------------------
            DESKTOP VIEW: Pristine Table Layout
           ---------------------------------------------------- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Tanggal & Grup</th>
                <th className="py-3 px-4">Uraian / Keterangan Keperluan</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-right">Nominal SAR</th>
                <th className="py-3 px-4 text-center">Status Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-semibold">
              {ownExpenses.length > 0 ? (
                ownExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50/40 transition-colors align-middle">
                    
                    {/* Date / Group */}
                    <td className="py-3 px-4 text-xs">
                      <div className="font-mono text-[10.5px] text-slate-400 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{expense.date}</span>
                      </div>
                      <div className="font-extrabold text-slate-800 text-[11px] mt-0.5 truncate max-w-[200px]" title={expense.groupName}>
                        {expense.groupName}
                      </div>
                    </td>

                    {/* Description note */}
                    <td className="py-3 px-4 text-xs">
                      <div className="text-slate-950 text-xs font-black leading-snug">{expense.note}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                        Oleh: <strong className="text-slate-600 font-bold">{expense.handlingName}</strong>
                      </div>
                    </td>

                    {/* Category Sektor */}
                    <td className="py-3 px-4 text-xs">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded text-[9.5px] uppercase font-black">
                        <Tag className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                        <span>{expense.category}</span>
                      </span>
                    </td>

                    {/* Nominal SAR only (without Rupiah calculations) */}
                    <td className="py-3 px-4 text-right font-mono font-bold align-middle text-xs">
                      <div className="text-slate-900 text-xs font-black">{expense.amountSAR.toLocaleString('id-ID')} SAR</div>
                    </td>

                    {/* Status audit badge */}
                    <td className="py-3 px-4 text-center align-middle">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black border ${
                        expense.status === 'Selesai' ? 'bg-emerald-50 text-emerald-800 border-emerald-250' :
                        expense.status === 'Ditolak' ? 'bg-rose-50 text-rose-800 border-rose-250' :
                        'bg-amber-50 text-amber-800 border-amber-250'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          expense.status === 'Selesai' ? 'bg-emerald-600' :
                          expense.status === 'Ditolak' ? 'bg-rose-600' : 'bg-amber-500 animate-pulse'
                        }`}></span>
                        {expense.status === 'Selesai' ? 'DISETUJUI' : expense.status === 'Ditolak' ? 'DITOLAK' : 'PROSESSING'}
                      </span>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 italic">
                    Belum ada riwayat belanja yang tercatat untuk rombongan ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ----------------------------------------------------
            MOBILE VIEW: Fits, clean, vertical stacking layout 
           ---------------------------------------------------- */}
        <div className="block md:hidden p-3 divide-y divide-slate-150" id="fe-mobile-history-list">
          {ownExpenses.length > 0 ? (
            ownExpenses.map((expense) => (
              <div 
                key={expense.id} 
                className="py-3.5 flex flex-col gap-2"
              >
                {/* Mobile Header: Date & Status Badge */}
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400 font-mono font-black flex items-center gap-1.5 text-[10px]">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{expense.date}</span>
                  </span>
                  
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black border uppercase ${
                    expense.status === 'Selesai' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                    expense.status === 'Ditolak' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                    'bg-amber-50 text-amber-805 border-amber-200'
                  }`}>
                    {expense.status === 'Selesai' ? 'DISETUJUI' : expense.status === 'Ditolak' ? 'DITOLAK' : 'PENDING'}
                  </span>
                </div>

                {/* Mobile Body: Description and Group Target */}
                <div className="space-y-1">
                  <p className="text-xs font-black text-slate-900 leading-snug">
                    {expense.note}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-450 font-bold">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Folder className="w-3 h-3 text-slate-450 shrink-0" />
                      <span>{expense.groupName.split('(')[0].trim()}</span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-slate-450 shrink-0" />
                      <span>{expense.category}</span>
                    </span>
                  </div>
                </div>

                {/* Mobile Footer: Price SAR only */}
                <div className="flex justify-between items-center bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-150 text-[11px]">
                  <span className="text-[10px] font-black text-slate-450 uppercase tracking-tight">TOTAL BIAYA:</span>
                  <span className="font-mono font-black text-slate-900">{expense.amountSAR.toLocaleString('id-ID')} SAR</span>
                </div>

              </div>
            ))
          ) : (
            <p className="py-8 text-center text-slate-400 text-xs italic">Belum ada riwayat pengeluaran kas.</p>
          )}
        </div>

        {/* Helpful synchronization footnote banner */}
        <div className="p-3 bg-amber-50 border-t border-amber-150 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[10px] text-slate-600 leading-normal font-sans font-medium">
            <strong>KONEKTIVITAS INTEGRAL KSA:</strong> Semua kuitansi & nota yang diunggah oleh petugas lapangan langsung divalidasi oleh Tim Keuangan Makkah / Jakarta.
          </div>
        </div>

      </div>

      {/* ----------------------------------------------------
          INPUT EXPENSE TRIGGER - MODAL POP UP (POP-UP INPUT)
         ---------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-100">
          
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-visible animate-in fade-in zoom-in-95 duration-120 flex flex-col uppercase-labels">
            
            {/* Modal Header */}
            <div className="px-4 py-3 bg-slate-950 text-white flex items-center justify-between border-b border-[#D4AF37]/30 shrink-0">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-extrabold text-xs text-[#D4AF37] uppercase tracking-wide">Lapor Pengeluaran Lapangan</span>
              </div>
              <button 
                onClick={() => {
                  setShowSuggestions(false);
                  setIsModalOpen(false);
                }} 
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5 hover:bg-white/5 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-left text-xs font-semibold overflow-visible">
              
              {/* Group Rombongan Target (Search input + suggestion list + full list icon dropdown) */}
              <div className="relative">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Grup Jamaah</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ketik atau pilih grup jamaah..."
                    value={groupInput}
                    onChange={(e) => {
                      setGroupInput(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full p-2.5 pr-8 bg-slate-50 border border-slate-250 text-slate-800 rounded-lg font-bold focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer text-xs"
                  >
                    ▼
                  </button>
                </div>
                
                {/* Suggestions dropdown dropdown overlay */}
                {showSuggestions && (
                  <div className="absolute left-0 right-0 mt-1 max-h-44 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-50 divide-y divide-slate-100">
                    {filteredGroups.length > 0 ? (
                      filteredGroups.map((g) => (
                        <div
                          key={g}
                          onClick={() => {
                            setGroupInput(g);
                            setShowSuggestions(false);
                          }}
                          className={`p-2 hover:bg-slate-50 cursor-pointer text-[11px] font-bold ${g === groupInput ? 'bg-amber-550/10 text-amber-900' : 'text-slate-700'}`}
                        >
                          {g}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-slate-450 italic text-[10px]">Grup tidak ditemukan. Tekan luar untuk simpan ketikan baru</div>
                    )}
                  </div>
                )}
              </div>

              {/* Category & Amount Row */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* Column Kategori (Isian Kolom Kosong) */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Kategori</label>
                  <input
                    type="text"
                    required
                    placeholder="Kategori belanja..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-250 text-slate-850 rounded-lg font-bold focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Amount in Saudi Riyals (SAR) */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 font-mono">Nominal SAR (Riyal)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="Contoh: 150"
                      value={amountSAR}
                      onChange={(e) => setAmountSAR(e.target.value)}
                      className="w-full pl-9 pr-2.5 py-2.5 bg-slate-50 border border-slate-250 text-slate-900 rounded-lg font-mono font-black placeholder-slate-400 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9.5px] text-slate-400 font-black font-mono">
                      SAR
                    </span>
                  </div>
                </div>

              </div>

              {/* Notes Statement description */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Keterangan Pengeluaran</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pembelian air mineral botol di halte"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-250 text-slate-900 rounded-lg placeholder-slate-400 font-bold focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Date selection & receipt upload trigger */}
              <div className="grid grid-cols-2 gap-3">
                
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Tanggal Transaksi</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-250 text-slate-800 rounded-lg font-mono font-bold focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Kuitansi / Nota</label>
                  <div 
                    onClick={() => setInvoiceUploaded(!invoiceUploaded)}
                    className="flex items-center justify-center border border-dashed border-slate-250 bg-slate-50 p-2.5 rounded-lg text-center cursor-pointer hover:bg-slate-100 transition-colors select-none"
                    title="Klik untuk simulasi upload kuitansi"
                  >
                    <span className="text-[9.5px] uppercase font-black text-emerald-600 flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 shrink-0" />
                      <span>TER-UNGGAH</span>
                    </span>
                  </div>
                </div>

              </div>

              {/* Helpful notification box */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-150 text-[9.5px] text-slate-500 leading-normal font-sans text-center">
                Saldo Anda otomatis disesuaikan secara real-time setelah laporan diverifikasi oleh pusat.
              </div>

              {/* Modal controls footer */}
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-150 text-slate-600 rounded-lg font-bold text-center transition-colors cursor-pointer text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#1A1A1A] hover:bg-black border border-[#D4AF37]/35 text-[#D4AF37] rounded-lg font-extrabold text-center transition-all cursor-pointer shadow-3xs text-xs"
                >
                  Kirim Laporan
                </button>
              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}
