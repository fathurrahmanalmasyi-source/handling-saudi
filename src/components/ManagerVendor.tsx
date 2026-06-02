import React, { useState } from 'react';
import { 
  Building2, Plus, Edit2, Trash2, Bell, CheckCircle2, AlertCircle, Clock, 
  ExternalLink, Search, Filter, Phone, DollarSign, ListOrdered, CalendarDays, ClipboardCheck, ArrowUpRight,
  Copy, Check
} from 'lucide-react';
import { VendorOrder } from '../types';
import { ItineraryItem } from './ManagerItinerary';

interface ManagerVendorProps {
  vendorOrders: VendorOrder[];
  onUpdateVendorOrders: React.Dispatch<React.SetStateAction<VendorOrder[]>>;
  itineraries: ItineraryItem[];
  groups: string[];
}

export default function ManagerVendor({
  vendorOrders,
  onUpdateVendorOrders,
  itineraries,
  groups
}: ManagerVendorProps) {
  // Filter States
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [searchText, setSearchText] = useState('');

  // Form States (Add/Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [groupName, setGroupName] = useState(groups[0] || '');
  const [itineraryId, setItineraryId] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [category, setCategory] = useState<'Snack' | 'Transportasi' | 'Hotel' | 'Catering' | 'Lainnya'>('Snack');
  const [itemDescription, setItemDescription] = useState('');
  const [qty, setQty] = useState<number>(0);
  const [unitPriceSAR, setUnitPriceSAR] = useState<number>(0);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [status, setStatus] = useState<'Pending' | 'Dipesan' | 'Terkonfirmasi' | 'Selesai'>('Pending');
  const [notes, setNotes] = useState('');
  const [reminderPhone, setReminderPhone] = useState('');

  // Tab state within Vendor section: 'orders' or 'itinerary-link'
  const [vendorTab, setVendorTab] = useState<'orders' | 'itinerary-analysis'>('orders');

  // WhatsApp Reminder State
  const [reminderModalOrder, setReminderModalOrder] = useState<VendorOrder | null>(null);
  const [copied, setCopied] = useState(false);

  // Suggested preset descriptions for fast ordering
  const descPresets: Record<string, string[]> = {
    Snack: ['Snack Box isi 3 roti & air mineral', 'Snack ringan premium plus kurma', 'Snack perjalanan Ziarah Kota'],
    Transportasi: ['Sewa Bis Sholawat Saptco Executive', 'Coaster penjemputan Bandara', 'Sewa GMC VIP mutawwif'],
    Hotel: ['Sewa kamar tambahan Double Room', 'Sewa extra bed di hotel', 'Transit room jamaah sakit'],
    Catering: ['Catering Prasmanan Menu Indonesia', 'Nasi Box Al-Buraq (Makan Malam)', 'Catering sarapan pagi di hotel'],
    Lainnya: ['Tiket masuk objek bersejarah', 'Tips supir bus sholawat', 'Simcard data Saudi Telecom']
  };

  const handleResetForm = () => {
    setEditingId(null);
    setGroupName(groups[0] || '');
    setItineraryId('');
    setVendorName('');
    setCategory('Snack');
    setItemDescription('');
    setQty(0);
    setUnitPriceSAR(0);
    setDeliveryDate('');
    setStatus('Pending');
    setNotes('');
    setReminderPhone('');
    setIsFormOpen(false);
  };

  // Helper to prefill details when an itinerary is selected
  const handleSelectItinerary_InForm = (id: string) => {
    setItineraryId(id);
    if (!id) return;
    const item = itineraries.find(i => i.id === id);
    if (item) {
      setGroupName(item.groupName);
      setDeliveryDate(item.date);
      // Auto fill description hints
      setItemDescription(`Penyediaan ${category === 'Snack' ? 'Snack Box' : category} untuk kegiatan "${item.activityTitle}" di ${item.location}`);
    }
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName.trim()) {
      alert('Nama Vendor wajib diisi!');
      return;
    }
    if (!itemDescription.trim()) {
      alert('Deskripsi pesanan wajib diisi!');
      return;
    }
    if (qty <= 0) {
      alert('Jumlah (QTY) harus lebih besar dari 0!');
      return;
    }

    const total = qty * unitPriceSAR;

    if (editingId) {
      // Edit
      onUpdateVendorOrders(prev => prev.map(o => o.id === editingId ? {
        ...o,
        groupName,
        itineraryId: itineraryId || undefined,
        vendorName: vendorName.trim(),
        category,
        itemDescription: itemDescription.trim(),
        qty,
        unitPriceSAR,
        totalPriceSAR: total,
        deliveryDate,
        status,
        notes: notes.trim(),
        reminderPhone: reminderPhone.trim(),
      } : o));
      alert('Pesanan vendor berhasil diubah!');
    } else {
      // Add New
      const newOrder: VendorOrder = {
        id: `vendor-ord-${Date.now()}`,
        groupName,
        itineraryId: itineraryId || undefined,
        vendorName: vendorName.trim(),
        category,
        itemDescription: itemDescription.trim(),
        qty,
        unitPriceSAR,
        totalPriceSAR: total,
        deliveryDate,
        status,
        notes: notes.trim(),
        reminderSent: false,
        reminderPhone: reminderPhone.trim()
      };
      onUpdateVendorOrders(prev => [newOrder, ...prev]);
      alert('Pesanan vendor baru berhasil didata!');
    }
    handleResetForm();
  };

  const handleEditClick = (o: VendorOrder) => {
    setEditingId(o.id);
    setGroupName(o.groupName);
    setItineraryId(o.itineraryId || '');
    setVendorName(o.vendorName);
    setCategory(o.category);
    setItemDescription(o.itemDescription);
    setQty(o.qty);
    setUnitPriceSAR(o.unitPriceSAR);
    setDeliveryDate(o.deliveryDate);
    setStatus(o.status);
    setNotes(o.notes || '');
    setReminderPhone(o.reminderPhone || '');
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data pemesanan vendor ini?')) {
      onUpdateVendorOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  const handleQuickAddForItinerary = (item: ItineraryItem, cat: 'Snack' | 'Transportasi' | 'Hotel' | 'Catering' | 'Lainnya') => {
    setEditingId(null);
    setGroupName(item.groupName);
    setItineraryId(item.id);
    setDeliveryDate(item.date);
    setCategory(cat);
    setVendorName('');
    setItemDescription(`Penyediaan ${cat === 'Snack' ? 'Snack Box' : cat} untuk kegiatan "${item.activityTitle}" di ${item.location}`);
    setQty(50); // initial suggestion based on usual pax
    setUnitPriceSAR(cat === 'Snack' ? 7 : cat === 'Catering' ? 18 : 25);
    setStatus('Pending');
    setNotes(`Pesanan terhubung dengan itinerary hari ke-${item.dayNo}`);
    setVendorTab('orders');
    setIsFormOpen(true);
  };

  const triggerSMSOrWAReminder = (order: VendorOrder) => {
    // Open WA dialog modal
    setReminderModalOrder(order);
  };

  const confirmReminderSent = () => {
    if (!reminderModalOrder) return;
    onUpdateVendorOrders(prev => prev.map(o => o.id === reminderModalOrder.id ? { ...o, reminderSent: true } : o));
    alert(`Status pengingat berhasil ditandai telah dikirim ke Vendor "${reminderModalOrder.vendorName}"!`);
    setReminderModalOrder(null);
  };

  // Stats Counters
  const totalOrdersCount = vendorOrders.length;
  const pendingCount = vendorOrders.filter(o => o.status === 'Pending').length;
  const orderedCount = vendorOrders.filter(o => o.status === 'Dipesan').length;
  const validatedCount = vendorOrders.filter(o => o.status === 'Terkonfirmasi').length;
  const completedCount = vendorOrders.filter(o => o.status === 'Selesai').length;
  const totalCostSAR = vendorOrders.reduce((sum, o) => sum + o.totalPriceSAR, 0);

  // Filtered Orders
  const filteredOrders = vendorOrders.filter(o => {
    const matchesGroup = selectedGroupFilter === 'All' || o.groupName === selectedGroupFilter;
    const matchesCategory = selectedCategoryFilter === 'All' || o.category === selectedCategoryFilter;
    const matchesStatus = selectedStatusFilter === 'All' || o.status === selectedStatusFilter;
    
    const searchLow = searchText.toLowerCase();
    const matchesSearch = !searchText || 
      o.vendorName.toLowerCase().includes(searchLow) ||
      o.itemDescription.toLowerCase().includes(searchLow) ||
      (o.notes && o.notes.toLowerCase().includes(searchLow));

    return matchesGroup && matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 text-slate-800" id="manager-vendor-root">
      {/* 1. Header with custom icon and title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-3xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-550/10 text-amber-600 rounded-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Manajemen Booking & Hubungan Vendor</h2>
            <p className="text-xs text-slate-500">Mendata pesanan snack, transportasi, hotel & catering yang sinkron dengan jadwal Itinerary.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setVendorTab(vendorTab === 'orders' ? 'itinerary-analysis' : 'orders');
            }}
            className={`px-3.5 py-1.5 border border-slate-250 text-xs rounded-md font-bold transition-all ${
              vendorTab === 'itinerary-analysis' ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {vendorTab === 'orders' ? '🔍 Analisa Itinerary & Vendor' : '📂 Lihat Daftar Pesanan'}
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-1.5 bg-[#1A1A1A] hover:bg-black text-[#D4AF37] border border-[#D4AF37]/35 rounded-md font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-3xs hover:-translate-y-0.5 transition-transform duration-100"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pesanan Vendor</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs">
          <span className="text-slate-400 block text-[9px] uppercase font-black tracking-wider">Total Pemesanan</span>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-mono">{totalOrdersCount}</p>
          <span className="text-[10px] text-indigo-600 font-bold block mt-1">Layanan Aktif</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs">
          <span className="text-slate-400 block text-[9px] uppercase font-black tracking-wider">Belum Diproses (Pending)</span>
          <p className="text-xl sm:text-2xl font-black text-amber-600 mt-1 font-mono">{pendingCount}</p>
          <span className="text-[10px] text-slate-400 block mt-1">Perlu diorder segera</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs">
          <span className="text-slate-400 block text-[9px] uppercase font-black tracking-wider">Terkonfirmasi Vendor</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-650 mt-1 font-mono">{validatedCount}</p>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">Aman & Terverifikasi</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs">
          <span className="text-slate-400 block text-[9px] uppercase font-black tracking-wider">Selesai Dikirim</span>
          <p className="text-xl sm:text-2xl font-black text-indigo-950 mt-1 font-mono">{completedCount}</p>
          <span className="text-[10px] text-indigo-600 font-bold block mt-1">Layanan Tersedia</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs col-span-2 lg:col-span-1">
          <span className="text-slate-400 block text-[9px] uppercase font-black tracking-wider">Total Estimasi Biaya</span>
          <p className="text-xl sm:text-2xl font-black text-rose-800 mt-1 font-mono">{totalCostSAR.toLocaleString()} SAR</p>
          <span className="text-[10px] text-rose-600 font-semibold block mt-1">Metode Cash / Transfer</span>
        </div>
      </div>

      {/* 3. Form Add/Edit (If visible) */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-indigo-50 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm uppercase flex items-center gap-1.5">
              <Building2 className="w-5 h-5 text-amber-550" />
              <span>{editingId ? 'Edit Detail Pesanan Vendor' : 'Form Pemesanan Layanan Vendor Baru'}</span>
            </h3>
            <button 
              onClick={handleResetForm}
              className="text-slate-400 hover:text-slate-600 font-black text-xs uppercase hover:underline"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleSaveOrder} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
            
            {/* Itinerary Link Selection */}
            <div className="col-span-1 md:col-span-3 bg-slate-55/35 p-3.5 rounded-lg border border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 block font-black uppercase text-[9px]">Hubungkan Dengan Kegiatan Itinerary? (Sangat Direkomendasikan)</label>
                <p className="text-[10px] text-slate-450">Pesanan snack, bus, hotel otomatis disinkronkan dengan rincian jadwal.</p>
              </div>
              <select
                value={itineraryId}
                onChange={(e) => handleSelectItinerary_InForm(e.target.value)}
                className="bg-white border border-slate-250 py-1.5 px-3 rounded font-semibold text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none max-w-sm"
              >
                <option value="">-- Berdiri Sendiri (Tidak Terikat Itinerary) --</option>
                {itineraries.map((itin) => (
                  <option key={itin.id} value={itin.id}>
                    [{itin.groupName}] Hari {itin.dayNo} - {itin.activityTitle} ({itin.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Kelompok Jamaah */}
            <div className="space-y-1.5">
              <label className="text-slate-650 uppercase font-black text-[9px] block">Kelompok / Grup Jamaah</label>
              <select
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded focus:ring-1 focus:ring-amber-400 focus:outline-none"
              >
                {groups.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Kategori Vendor */}
            <div className="space-y-1.5">
              <label className="text-slate-650 uppercase font-black text-[9px] block">Kategori Pemesanan</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as any);
                  // Update description suggested presets if empty
                  if (!itemDescription && descPresets[e.target.value]) {
                    setItemDescription(descPresets[e.target.value][0]);
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded focus:ring-1 focus:ring-amber-400 focus:outline-none font-bold text-slate-900"
              >
                <option value="Snack">Snack (Snack Box, Roti, dll)</option>
                <option value="Transportasi">Transportasi (Bus Sholawat, Coaster, dll)</option>
                <option value="Hotel">Hotel (Kamar Ekstra, Tiket, Transit, dll)</option>
                <option value="Catering">Catering (Makan Siang/Malam, dll)</option>
                <option value="Lainnya">Lainnya (Tiket, Simcard, dll)</option>
              </select>
            </div>

            {/* Nama Vendor */}
            <div className="space-y-1.5">
              <label className="text-slate-650 uppercase font-black text-[9px] block">Nama Vendor Penyedia</label>
              <input
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="Misal: Al-Muallim Catering, Saptco Bus, Anjum Vendor"
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded focus:ring-1 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            {/* Deskripsi Detil Pesanan */}
            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-650 uppercase font-black text-[9px] block">Rincian & Deskripsi Pesanan</label>
                {descPresets[category] && (
                  <div className="flex gap-2">
                    {descPresets[category].slice(0, 2).map((p, itemIdx) => (
                      <button
                        key={itemIdx}
                        type="button"
                        onClick={() => setItemDescription(p)}
                        className="text-[10px] text-slate-450 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded transition-all"
                      >
                        {p.slice(0, 15)}...
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="text"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                placeholder="Deskripsikan pesanan (misal: Sediakan 50 pax snack box ditaruh di bus city tour)"
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded focus:ring-1 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            {/* No Telepon Vendor */}
            <div className="space-y-1.5">
              <label className="text-slate-650 uppercase font-black text-[9px] block">No Telepon Vendor (WA)</label>
              <input
                type="text"
                value={reminderPhone}
                onChange={(e) => setReminderPhone(e.target.value)}
                placeholder="Misal: +62812345678 (untuk kirim WA)"
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded focus:ring-1 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            {/* Qty, Unit Price, Delivery Date */}
            <div className="space-y-1.5">
              <label className="text-slate-650 uppercase font-black text-[9px] block">QTY (Porsi / Pax / Unit)</label>
              <input
                type="number"
                value={qty || ''}
                onChange={(e) => setQty(Number(e.target.value))}
                placeholder="Jumlah"
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded font-mono focus:ring-1 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-650 uppercase font-black text-[9px] block">Harga Satuan (SAR)</label>
              <input
                type="number"
                value={unitPriceSAR || ''}
                onChange={(e) => setUnitPriceSAR(Number(e.target.value))}
                placeholder="SAR"
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded font-mono focus:ring-1 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-650 uppercase font-black text-[9px] block">Tanggal Pengiriman / Ekspedisi</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded focus:ring-1 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            {/* Status & Catatan */}
            <div className="space-y-1.5">
              <label className="text-slate-650 uppercase font-black text-[9px] block">Status Pemesanan</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded focus:ring-1 focus:ring-amber-400 focus:outline-none font-bold text-slate-800"
              >
                <option value="Pending">Menunggu Konfirmasi (Pending)</option>
                <option value="Dipesan">Sedang Di-order ke Vendor (Dipesan)</option>
                <option value="Terkonfirmasi">Terkonfirmasi Aman (Terkonfirmasi)</option>
                <option value="Selesai">Layanan Selesai Diterima (Selesai)</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <label className="text-slate-650 uppercase font-black text-[9px] block">Catatan Tambahan</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misal: Catatan alergi seafood / koordinasi dg Bus Sholawat No 4"
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded focus:ring-1 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            {/* Calculated price visual */}
            <div className="col-span-1 md:col-span-3 flex items-center justify-between border-t border-slate-100 pt-4 bg-slate-50/50 p-2 rounded">
              <div className="text-xs font-bold text-slate-600">
                Total Estimasi: <span className="font-mono text-sm text-amber-800 font-extrabold">{(qty * unitPriceSAR).toLocaleString()} SAR</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 rounded font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-amber-550 hover:bg-amber-600 text-slate-950 font-black rounded cursor-pointer shadow-3xs"
                >
                  {editingId ? '💾 Simpan Perubahan' : '➕ Amankan Pesanan'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 4. Tab 1: Daftar Pemesanan Vendor */}
      {vendorTab === 'orders' && (
        <div className="space-y-4">
          
          {/* Filters controls */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs flex flex-col lg:flex-row gap-3 items-center justify-between text-xs">
            
            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari vendor, deskripsi, catatan..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 w-full lg:w-auto font-semibold">
              <select
                value={selectedGroupFilter}
                onChange={(e) => setSelectedGroupFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 py-1.5 px-3 rounded focus:ring-1 focus:ring-amber-400 focus:outline-none text-slate-750"
              >
                <option value="All">Semua Kelompok</option>
                {groups.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 py-1.5 px-3 rounded focus:ring-1 focus:ring-amber-400 focus:outline-none text-slate-755"
              >
                <option value="All">Semua Kategori</option>
                <option value="Snack">Snack Box</option>
                <option value="Transportasi">Transportasi</option>
                <option value="Hotel">Hotel</option>
                <option value="Catering">Catering</option>
                <option value="Lainnya">Lainnya Service</option>
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 py-1.5 px-3 rounded focus:ring-1 focus:ring-amber-400 focus:outline-none text-slate-760"
              >
                <option value="All">Semua Status</option>
                <option value="Pending">Menunggu (Pending)</option>
                <option value="Dipesan">Dipesan</option>
                <option value="Terkonfirmasi">Terkonfirmasi</option>
                <option value="Selesai">Layanan Selesai</option>
              </select>
            </div>
          </div>

          {/* List Table of Bookings */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-3xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto text-xs min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-550 uppercase font-black text-[10px] tracking-wider">
                    <th className="py-3 px-4">Nama Vendor</th>
                    <th className="py-3 px-4">Rincian Layanan & Deskripsi</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Koneksi Itinerary</th>
                    <th className="py-3 px-4 text-right">QTY & Harga</th>
                    <th className="py-3 px-4 text-right">Total (SAR)</th>
                    <th className="py-3 px-4">Tgl Pengiriman</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Pengingat (WA)</th>
                    <th className="py-3 px-4 text-center">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-slate-800">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-450 font-semibold bg-slate-50/20">
                        <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        No vendor orders matching selected filters found. Click "Tambah Pesanan Vendor" to add!
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => {
                      const itin = o.itineraryId ? itineraries.find(i => i.id === o.itineraryId) : null;
                      return (
                        <tr key={o.id} className="hover:bg-amber-50/5 font-semibold text-slate-850">
                          
                          {/* Nama Vendor */}
                          <td className="py-3.5 px-4 font-black text-slate-900 border-r border-slate-100">
                            <span className="block">{o.vendorName}</span>
                            <span className="text-[10px] text-indigo-700 block font-normal">{o.groupName}</span>
                          </td>

                          {/* Deskripsi */}
                          <td className="py-3.5 px-4 max-w-sm mb-1.5">
                            <p className="font-bold text-slate-900 line-clamp-2">{o.itemDescription}</p>
                            {o.notes && <span className="block text-[10px] text-amber-700 font-medium">📝 Catatan: {o.notes}</span>}
                          </td>

                          {/* Kategori Tag */}
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-center block ${
                              o.category === 'Snack' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              o.category === 'Transportasi' ? 'bg-sky-50 text-sky-700 border border-sky-100' :
                              o.category === 'Hotel' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                              o.category === 'Catering' ? 'bg-emerald-50 text-emerald-750 border border-emerald-100' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {o.category}
                            </span>
                          </td>

                          {/* Koneksi Itinerary */}
                          <td className="py-3.5 px-4 border-r border-slate-100">
                            {itin ? (
                              <div className="space-y-0.5 max-w-xs">
                                <span className="text-[#D4AF37] text-[10px] uppercase font-black tracking-wide flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> Linked Itinerary Day-{itin.dayNo}
                                </span>
                                <span className="text-slate-900 block font-bold text-[11px] truncate" title={itin.activityTitle}>
                                  {itin.activityTitle}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[10px] italic">Mandiri (Tanpa Itinerary)</span>
                            )}
                          </td>

                          {/* Harga detail */}
                          <td className="py-3.5 px-4 text-right font-mono">
                            <span className="block text-slate-900 font-extrabold">{o.qty} x</span>
                            <span className="text-[10px] text-slate-500 font-normal">{o.unitPriceSAR} SAR</span>
                          </td>

                          {/* Total SAR */}
                          <td className="py-3.5 px-4 text-right font-mono font-black text-[#8A1538]">
                            {o.totalPriceSAR.toLocaleString()} SAR
                          </td>

                          {/* Delivery Date */}
                          <td className="py-3.5 px-4 font-bold text-indigo-950 font-mono">
                            {o.deliveryDate ? o.deliveryDate : '-'}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase text-center block ${
                              o.status === 'Pending' ? 'bg-slate-100 text-slate-600' :
                              o.status === 'Dipesan' ? 'bg-amber-100 text-amber-800' :
                              o.status === 'Terkonfirmasi' ? 'bg-emerald-50 text-emerald-700 border border-emerald-250/50' :
                              'bg-indigo-950/5 text-indigo-950 font-extrabold'
                            }`}>
                              {o.status}
                            </span>
                          </td>

                          {/* WhatsApp Reminder Button */}
                          <td className="py-3.5 px-4 text-center border-l border-r border-slate-100">
                            <button
                              onClick={() => triggerSMSOrWAReminder(o)}
                              className={`px-2.5 py-1 rounded text-[10px] font-black flex items-center gap-1 mx-auto transition-all ${
                                o.reminderSent 
                                  ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700' 
                                  : 'bg-white hover:bg-rose-50 text-rose-650 border border-rose-200'
                              }`}
                              title={o.reminderPhone ? "Kirim WA pengingat pesanan" : "Tidak ada no telp vendor"}
                            >
                              <Bell className="w-3 h-3" />
                              <span>{o.reminderSent ? 'Dikirim (Ulang)' : 'Kirim Pengingat'}</span>
                            </button>
                            {o.reminderPhone && <span className="text-[9px] text-slate-450 font-mono block mt-1">{o.reminderPhone}</span>}
                          </td>

                          {/* Edit / Delete Actions */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleEditClick(o)}
                                className="p-1 bg-slate-100 hover:bg-amber-500/10 text-slate-700 hover:text-amber-700 rounded border border-slate-200"
                                title="Edit Booking Vendor"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(o.id)}
                                className="p-1 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-650 rounded border border-slate-200"
                                title="Hapus Data"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab 2: Analisa Itinerary & Status Kesiapan Vendor */}
      {vendorTab === 'itinerary-analysis' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase">Analisa Kelengkapan Logistik & Vendor Per Itinerary</h3>
            <p className="text-xs text-slate-500">
              Berikut adalah peta rute itinerary kelompok. Anda dapat memantau dengan cermat kesiapan akomodasi, snack kota, katering, dan armada bus untuk setiap sub-kegiatan. Klik "Siapkan Layanan" di sebelah kegiatan untuk mulai pendataan instan!
            </p>
          </div>

          <div className="space-y-4">
            {groups.map((groupNameSelected) => {
              const groupItins = itineraries.filter(i => i.groupName === groupNameSelected);
              if (groupItins.length === 0) return null;
              
              return (
                <div key={groupNameSelected} className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  
                  {/* Group Name Banner Header */}
                  <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-[#D4AF37] text-xs uppercase tracking-wider">Kelompok Perjalanan</h4>
                      <h3 className="font-black text-slate-900 text-sm">{groupNameSelected}</h3>
                    </div>
                    <span className="bg-indigo-100 text-indigo-755 text-[10px] font-black uppercase px-2.5 py-1 rounded">
                      {groupItins.length} Kegiatan Itinerary
                    </span>
                  </div>

                  <div className="divide-y divide-slate-150">
                    {groupItins.map((itin) => {
                      const linkedOrders = vendorOrders.filter(o => o.itineraryId === itin.id);
                      
                      return (
                        <div key={itin.id} className="p-4 flex flex-col md:flex-row justify-between gap-4 hover:bg-slate-50/40 text-xs">
                          {/* Inside Left Details */}
                          <div className="md:w-1/3 space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="bg-[#1A1A1A] text-[#D4AF37] px-2 py-0.5 rounded text-[9px] font-black">
                                Hari {itin.dayNo}
                              </span>
                              <span className="text-slate-450 font-mono text-[10px]">{itin.date} • {itin.timeRange}</span>
                            </div>
                            <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">{itin.activityTitle}</h4>
                            <p className="text-[11px] text-slate-550">📍 Lokasi: {itin.location}</p>
                            {itin.notes && <p className="text-[10px] text-slate-450 italic mt-0.5">ℹ️ Catatan Itinerary: {itin.notes}</p>}
                          </div>

                          {/* Middle: Linked Vendor bookings details */}
                          <div className="flex-1 md:px-4 border-t border-dashed border-slate-150 pt-3 md:pt-0 md:border-t-0 md:border-l md:border-r border-slate-150 text-xs space-y-2">
                            <h5 className="font-black text-[10px] uppercase text-slate-400 tracking-wider">Status Kelengkapan Layanan Vendor:</h5>
                            
                            {linkedOrders.length === 0 ? (
                              <div className="p-2.5 bg-rose-50 border border-rose-150 rounded text-rose-800 text-[11px] font-bold flex items-center justify-between">
                                <span>⚠️ Belum ada pesanan vendor terdaftar untuk hari ini!</span>
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => handleQuickAddForItinerary(itin, 'Snack')}
                                    className="px-1.5 py-0.5 bg-[#1A1A1A] text-[#D4AF37] font-black rounded hover:bg-black text-[9px]"
                                  >
                                    + Snack Box
                                  </button>
                                  <button
                                    onClick={() => handleQuickAddForItinerary(itin, 'Transportasi')}
                                    className="px-1.5 py-0.5 bg-sky-600 text-white font-black rounded hover:bg-sky-700 text-[9px]"
                                  >
                                    + Bus Sholawat
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                {linkedOrders.map(o => (
                                  <div key={o.id} className="p-2 border border-slate-150 rounded bg-slate-50 relative">
                                    <div className="flex justify-between font-bold text-slate-900">
                                      <span className="truncate">{o.vendorName}</span>
                                      <span className={`px-1 rounded text-[9px] ${
                                        o.status === 'Terkonfirmasi' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                                      }`}>
                                        {o.status}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{o.itemDescription}</p>
                                    <div className="text-[10px] font-mono text-amber-800 font-bold mt-1">
                                      {o.qty} Pax • {o.totalPriceSAR} SAR
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Right: Actions */}
                          <div className="flex flex-col justify-center gap-1.5 md:w-48 text-right shrink-0">
                            {linkedOrders.length > 0 && (
                              <div className="text-slate-500 font-bold text-[10px]">
                                Berhasil mengamankan <span className="font-bold text-slate-800">{linkedOrders.length} Pesanan</span>
                              </div>
                            )}
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setGroupName(itin.groupName);
                                setItineraryId(itin.id);
                                setDeliveryDate(itin.date);
                                setCategory('Snack');
                                setVendorName('');
                                setItemDescription(`Pemesanan Snack Box & Roti untuk kegiatan "${itin.activityTitle}"`);
                                setQty(45);
                                setUnitPriceSAR(7);
                                setIsFormOpen(true);
                                setVendorTab('orders');
                                window.scrollTo({ top: 300, behavior: 'smooth' });
                              }}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-amber-500/10 text-slate-700 hover:text-amber-700 border border-slate-250 rounded font-bold text-xs text-center flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Tambah Service Vendor</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. WA-Style Dialog Prompt Modal */}
      {reminderModalOrder && (() => {
        const waDraftText = `Halo ${reminderModalOrder.vendorName},
Kami dari Tim Manajemen Jejak Imani ingin mengkonfirmasi kesiapan pesanan berikut:

• Kategori: ${reminderModalOrder.category}
• Layanan: ${reminderModalOrder.itemDescription}
• Kelompok: ${reminderModalOrder.groupName}
• Jumlah: ${reminderModalOrder.qty} Pax / Unit
• Tanggal Pengiriman: ${reminderModalOrder.deliveryDate || '-'}

Mohon konfirmasinya kembali agar kru handling lapangan kami dapat berkoordinasi dengan lancar. Terima kasih banyak!`;

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  <h3 className="font-black text-sm uppercase tracking-wide">Kirim Pengingat Layanan Vendor</h3>
                </div>
                <button 
                  onClick={() => setReminderModalOrder(null)}
                  className="text-white/80 hover:text-white font-extrabold text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Simulated smartphone WhatsApp box */}
              <div className="p-5 space-y-4 text-xs font-semibold">
                <p className="text-slate-500">
                  Pesan WhatsApp pengingat otomatis telah dikompilasi berdasarkan detail rute dan itinerary kelompok!
                </p>

                <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-150 text-[11px] text-slate-800 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between gap-2 text-emerald-700 font-extrabold uppercase text-[10px]">
                    <span>📲 Draft Pesanan WhatsApp (Vendor: {reminderModalOrder.vendorName})</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(waDraftText);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2050);
                      }}
                      className="flex items-center gap-1 bg-white border border-emerald-250 text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded cursor-pointer transition-all shadow-3xs"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-emerald-600" />
                          <span>Salin Teks</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200 whitespace-pre-wrap font-mono select-all select-text tracking-tight shadow-3xs leading-relaxed">
                    {waDraftText}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4 font-bold">
                  <div className="text-[11px] text-slate-500">
                    Phone: <span className="font-mono text-slate-900 font-black">{reminderModalOrder.reminderPhone || '(Belum diset - diset default)'}</span>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        // Mark reminder status as sent
                        confirmReminderSent();
                      }}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-850 rounded text-center transition-all cursor-pointer"
                    >
                      Tandai Dikirim
                    </button>
                    <a
                      href={`https://wa.me/${(reminderModalOrder.reminderPhone || '62812345678').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waDraftText)}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        // Also mark as sent
                        confirmReminderSent();
                      }}
                      className="flex-1 sm:flex-initial px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-center flex items-center justify-center gap-1.5 shadow-3xs transition-transform active:scale-95 duration-100 cursor-pointer"
                    >
                      <span>Hubungi WA Vendor</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
