import React, { useState } from 'react';
import { Files, Plus, Edit2, Trash2, X, Check, FileText, Upload, Folder, Calendar, BookOpen, AlertTriangle, CheckCircle } from 'lucide-react';
import { DocumentGroup, DocumentItem, SOPDoc } from '../types';

interface ManagerDocumentEditorProps {
  documents: DocumentGroup[];
  onUpdateDocuments: (newDocs: DocumentGroup[]) => void;
  groups: string[];
  sops: SOPDoc[];
  onUpdateSops: (newSops: SOPDoc[]) => void;
}

export default function ManagerDocumentEditor({ 
  documents, 
  onUpdateDocuments, 
  groups,
  sops,
  onUpdateSops
}: ManagerDocumentEditorProps) {
  const [activeSubTab, setActiveSubTab] = useState<'dosir' | 'sop'>('dosir');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');

  // Modal Input states for Documents
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetGroup, setTargetGroup] = useState(groups[0] || 'Umroh Reguler 11 Juni 2026 (Madinah Awal)');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<'visa' | 'passport' | 'ticket' | 'manifest'>('visa');
  const [fileSize, setFileSize] = useState('1.5 MB');

  // Inline rename states for Documents
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editNameInput, setEditNameInput] = useState('');
  const [editTypeInput, setEditTypeInput] = useState<'visa' | 'passport' | 'ticket' | 'manifest'>('visa');

  // SOP Editor States
  const [isSopModalOpen, setIsSopModalOpen] = useState(false);
  const [editingSopId, setEditingSopId] = useState<string | null>(null);
  const [sopTitle, setSopTitle] = useState('');
  const [sopCategory, setSopCategory] = useState<'Airport' | 'Hotel' | 'Logistics' | 'Ziarah' | 'Lounge'>('Airport');
  const [sopImportant, setSopImportant] = useState(false);
  const [sopContentRaw, setSopContentRaw] = useState('');

  // -----------------------------------------------------------------
  // Documents Handlers
  // -----------------------------------------------------------------
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) {
      alert('Nama file wajib diisi!');
      return;
    }

    let formattedName = fileName.trim();
    if (!formattedName.toLowerCase().endsWith('.pdf') && !formattedName.toLowerCase().endsWith('.jpg') && !formattedName.toLowerCase().endsWith('.xlsx')) {
      formattedName += '.pdf';
    }

    const newItem: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: formattedName,
      type: fileType,
      size: fileSize.trim() || '1.2 MB',
      uploadDate: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    const groupExist = documents.find(d => d.groupName === targetGroup);

    let updatedDocs: DocumentGroup[];
    if (groupExist) {
      updatedDocs = documents.map(group => {
        if (group.groupName === targetGroup) {
          return {
            ...group,
            items: [newItem, ...group.items]
          };
        }
        return group;
      });
    } else {
      updatedDocs = [
        ...documents,
        {
          id: `dg-${Date.now()}`,
          groupName: targetGroup,
          items: [newItem]
        }
      ];
    }

    onUpdateDocuments(updatedDocs);
    setIsModalOpen(false);

    // reset
    setFileName('');
    setFileSize('1.5 MB');
  };

  const handleStartEditItem = (groupId: string, item: DocumentItem) => {
    setEditingGroupId(groupId);
    setEditingItemId(item.id);
    setEditNameInput(item.name);
    setEditTypeInput(item.type);
  };

  const handleSaveRename = (groupId: string, itemId: string) => {
    if (!editNameInput.trim()) return;

    const updated = documents.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          items: group.items.map(item => {
            if (item.id === itemId) {
              return {
                ...item,
                name: editNameInput.trim(),
                type: editTypeInput
              };
            }
            return item;
          })
        };
      }
      return group;
    });

    onUpdateDocuments(updated);
    setEditingGroupId(null);
    setEditingItemId(null);
  };

  const handleDeleteItem = (groupId: string, itemId: string) => {
    if (!window.confirm('Hapus dokumen ini dari database dosir?')) return;
    const updated = documents.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          items: group.items.filter(item => item.id !== itemId)
        };
      }
      return group;
    }).filter(group => group.items.length > 0);

    onUpdateDocuments(updated);
  };

  // -----------------------------------------------------------------
  // SOP Handlers
  // -----------------------------------------------------------------
  const handleOpenAddSop = () => {
    setEditingSopId(null);
    setSopTitle('');
    setSopCategory('Airport');
    setSopImportant(false);
    setSopContentRaw('');
    setIsSopModalOpen(true);
  };

  const handleOpenEditSop = (sop: SOPDoc) => {
    setEditingSopId(sop.id);
    setSopTitle(sop.title);
    setSopCategory(sop.category);
    setSopImportant(sop.important);
    setSopContentRaw(sop.content.join('\n'));
    setIsSopModalOpen(true);
  };

  const handleSaveSop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sopTitle.trim()) {
      alert('Judul SOP wajib diisi!');
      return;
    }
    const steps = sopContentRaw
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (steps.length === 0) {
      alert('Tulis langkah-langkah SOP minimal 1 baris!');
      return;
    }

    const todayStr = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    if (editingSopId) {
      // Edit mode
      const updated = sops.map(s => {
        if (s.id === editingSopId) {
          return {
            ...s,
            title: sopTitle.trim(),
            category: sopCategory,
            important: sopImportant,
            content: steps,
            lastUpdated: todayStr
          };
        }
        return s;
      });
      onUpdateSops(updated);
      alert('Dokumen SOP berhasil diperbarui!');
    } else {
      // Create mode
      const newSop: SOPDoc = {
        id: `sop-${Date.now()}`,
        title: sopTitle.trim(),
        category: sopCategory,
        important: sopImportant,
        content: steps,
        lastUpdated: todayStr
      };
      onUpdateSops([...sops, newSop]);
      alert('Standar Operasional Prosedur (SOP) berhasil ditambahkan!');
    }

    setIsSopModalOpen(false);
  };

  const handleDeleteSop = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus dokumen SOP ini secara permanen? Ini akan segera dicopot dari menu penanganan lapangan.')) {
      const updated = sops.filter(s => s.id !== id);
      onUpdateSops(updated);
    }
  };

  return (
    <div className="space-y-4" id="manager-doc-editor-component">
      {/* Tab Switcher at top of Document View */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl" id="doc-tabs-bar">
        <button
          onClick={() => setActiveSubTab('dosir')}
          className={`flex-1 sm:flex-initial px-6 py-3.5 text-xs font-black tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeSubTab === 'dosir' 
              ? 'border-[#D4AF37] text-slate-950 bg-amber-500/5' 
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
          }`}
        >
          <Folder className="w-4 h-4 text-[#D4AF37]" />
          <span>Arsip Dosir / Dokumen Resmi</span>
        </button>
        <button
          onClick={() => setActiveSubTab('sop')}
          className={`flex-1 sm:flex-initial px-6 py-3.5 text-xs font-black tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeSubTab === 'sop' 
              ? 'border-emerald-600 text-slate-950 bg-emerald-500/5' 
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Edit SOP Pelayanan Lapangan</span>
        </button>
      </div>

      {/* -----------------------------------------------------------------
          SUBTAB 1: DOKUMEN / DOSIR DIGITAL
         ----------------------------------------------------------------- */}
      {activeSubTab === 'dosir' && (
        <div className="space-y-4 animate-fade-in">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-200 gap-3">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                <Files className="w-4.5 h-4.5 text-[#D4AF37]" />
                <span>Pusat Unggah & Edit Dokumen Resmi (Manager)</span>
              </h2>
              <p className="text-xs text-slate-500">Input berkas visa umroh, tiket Saudi Airlines, paspor berkas imigrasi, manifest mutawif</p>
            </div>

            <button
              onClick={() => {
                if (groups.length > 0) setTargetGroup(groups[0]);
                setIsModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-1.5 bg-[#1A1A1A] hover:bg-black text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah Berkas Baru</span>
            </button>
          </div>

          {/* Selector Group Category */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-3xs">
            <span className="font-extrabold text-slate-555 flex items-center gap-1">
              <Folder className="w-4 h-4 text-[#D4AF37]" />
              <span>SOROT FILTER FOLDER GRUP DOSIR:</span>
            </span>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-slate-50 border border-slate-220 text-slate-800 py-1 px-2 rounded font-bold focus:outline-none focus:ring-1 focus:ring-[#D4AF37] cursor-pointer text-xs"
            >
              <option value="All">Lihat Semua Kumpulan Folder ({documents.reduce((total, g) => total + g.items.length, 0)} Berkas)</option>
              {groups.map((g, idx) => (
                <option key={idx} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Grid container of Document Folders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents
              .filter(g => selectedGroup === 'All' || g.groupName === selectedGroup)
              .map((group) => (
                <div key={group.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                  {/* Folder Banner */}
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">📂</span>
                      <div>
                        <h3 className="font-black text-slate-900 text-xs sm:text-sm">{group.groupName}</h3>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Arsip Digital • {group.items.length} file</p>
                      </div>
                    </div>
                  </div>

                  {/* Items in folder */}
                  <div className="p-4 divide-y divide-slate-100">
                    {group.items.length > 0 ? (
                      group.items.map((file) => {
                        const isEditingThis = editingGroupId === group.id && editingItemId === file.id;
                        return (
                          <div key={file.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                            <div className="flex items-start gap-2.5 flex-1 min-w-0">
                              <span className="text-xl shrink-0 mt-0.5">📄</span>
                              <div className="flex-1 min-w-0">
                                {isEditingThis ? (
                                  <div className="space-y-1">
                                    <input
                                      type="text"
                                      value={editNameInput}
                                      onChange={(e) => setEditNameInput(e.target.value)}
                                      className="w-full p-1 bg-amber-50 border border-amber-300 rounded font-semibold text-xs focus:outline-none"
                                    />
                                    <select
                                      value={editTypeInput}
                                      onChange={(e) => setEditTypeInput(e.target.value as any)}
                                      className="text-[10px] p-0.5 bg-slate-100 border rounded font-bold cursor-pointer"
                                    >
                                      <option value="visa">Visa</option>
                                      <option value="passport">Paspor</option>
                                      <option value="ticket">Ticket</option>
                                      <option value="manifest">Manifest</option>
                                    </select>
                                  </div>
                                ) : (
                                  <>
                                    <span className="font-bold text-slate-800 truncate block hover:text-indigo-900 transition-colors">
                                      {file.name}
                                    </span>
                                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-semibold mt-0.5">
                                      <span className={`uppercase font-black ${
                                        file.type === 'visa' ? 'text-amber-600' :
                                        file.type === 'passport' ? 'text-blue-600' :
                                        file.type === 'ticket' ? 'text-green-600' :
                                        'text-slate-650'
                                      }`}>{file.type}</span>
                                      <span>• Size: {file.size}</span>
                                      <span>• Diunggah: {file.uploadDate}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Inline Controls panel */}
                            <div className="flex gap-1 shrink-0">
                              {isEditingThis ? (
                                <>
                                  <button
                                    onClick={() => handleSaveRename(group.id, file.id)}
                                    className="p-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded shadow-3xs cursor-pointer"
                                    title="Selesai"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => { setEditingGroupId(null); setEditingItemId(null); }}
                                    className="p-1 bg-slate-150 hover:bg-slate-200 text-slate-800 rounded shadow-3xs cursor-pointer"
                                    title="Batal"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleStartEditItem(group.id, file)}
                                    className="p-1 hover:bg-slate-150 text-slate-600 hover:text-slate-900 rounded cursor-pointer"
                                    title="Edit Berkas"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(group.id, file.id)}
                                    className="p-1 hover:bg-red-50 text-red-500 hover:text-red-750 rounded cursor-pointer"
                                    title="Hapus Berkas"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center text-slate-400 text-[10px] py-4">Folder ini kosong.</p>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* INPUT FILE MODAL */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-3 bg-[#1A1A1A] text-white flex items-center justify-between border-b border-[#D4AF37]/25">
                  <span className="font-extrabold text-xs text-[#D4AF37] uppercase">Simulasi Unggah Berkas Digital</span>
                  <button onClick={() => setIsModalOpen(false)} className="text-white">
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                <form onSubmit={handleAddDocument} className="p-4 space-y-3.5 text-xs font-semibold text-left">
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-1">Pilih Folder Rombongan</label>
                    <select
                      value={targetGroup}
                      onChange={(e) => setTargetGroup(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-bold focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
                    >
                      {groups.map((g, idx) => (
                        <option key={idx} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-1">Nama Berkas Dokumen</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Paket_Tiket_SV816_KSA"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 font-bold focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase text-slate-400 mb-1">Jenis Berkas (Type)</label>
                      <select
                        value={fileType}
                        onChange={(e) => setFileType(e.target.value as any)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-850 font-bold cursor-pointer"
                      >
                        <option value="visa">Visa Umroh/Haji</option>
                        <option value="passport">Paspor Scan</option>
                        <option value="ticket">Tiket Pesawat</option>
                        <option value="manifest">Manifest Kamar</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-slate-400 mb-1">Ukuran File</label>
                      <input
                        type="text"
                        required
                        value={fileSize}
                        onChange={(e) => setFileSize(e.target.value)}
                        placeholder="Contoh: 1.5 MB"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-center focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Drag and drop simulation screen */}
                  <div className="p-4 border-2 border-dashed border-slate-200 hover:border-[#D4AF37]/50 rounded-lg text-center bg-slate-50 transition-colors">
                    <span className="text-xl">📁</span>
                    <p className="text-[10px] text-slate-400 mt-1 font-bold">Seret berkas PDF di sini untuk menggunggah secara cerdas</p>
                    <p className="text-[9px] text-emerald-600 block mt-0.5">Sistem memindai virus sebelum disimpan secara cloud</p>
                  </div>

                  <div className="flex justify-end gap-1.5 pt-3 border-t">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-3.5 py-1.5 bg-slate-100 rounded text-slate-600 font-bold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-black border border-[#D4AF37]/35 text-[#D4AF37] rounded font-bold cursor-pointer"
                    >
                      Confirm Unggah
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* -----------------------------------------------------------------
          SUBTAB 2: SOP PELAYANAN LAPANGAN (SOPs MANAGER)
         ----------------------------------------------------------------- */}
      {activeSubTab === 'sop' && (
        <div className="space-y-4 animate-fade-in" id="sop-editor-subtab">
          {/* SOP Manager Banner Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-200 gap-3">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-emerald-600" />
                <span>Pusat Edit SOP Pelayanan Lapangan (Manager)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Pembaruan Standar Operasional Prosedur (SOP) secara real-time yang langsung terbaca oleh ground handling & mutawif di aplikasi penanganan.
              </p>
            </div>

            <button
              onClick={handleOpenAddSop}
              className="w-full sm:w-auto px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah SOP Baru</span>
            </button>
          </div>

          {/* Table Container listing all current SOPs */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto text-xs min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black text-[10px] tracking-wider">
                    <th className="py-3 px-4 w-44">Kategori & Prioritas</th>
                    <th className="py-3 px-4">Judul Standar Operasional (SOP)</th>
                    <th className="py-3 px-4 w-32">Keterangan Langkah</th>
                    <th className="py-3 px-4 w-36">Update Terakhir</th>
                    <th className="py-3 px-4 w-28 text-center bg-slate-50/50">Aksi Operasional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {sops && sops.length > 0 ? (
                    sops.map((sop) => (
                      <tr key={sop.id} className="hover:bg-slate-50/40 text-slate-750 font-semibold align-middle transition-colors">
                        
                        {/* 1. Category & Priority */}
                        <td className="py-3.5 px-4 font-bold">
                          <div className="flex flex-col gap-1 items-start">
                            <span className={`px-2 py-0.5 rounded text-[9.5px] uppercase font-black border ${
                              sop.category === 'Airport' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              sop.category === 'Hotel' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              sop.category === 'Logistics' ? 'bg-slate-100 text-slate-800 border-slate-300' :
                              sop.category === 'Ziarah' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              ⚙️ {sop.category}
                            </span>
                            
                            {sop.important ? (
                              <span className="px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[9px] font-black tracking-tight">
                                ⚠️ WAJIB PATUH
                              </span>
                            ) : (
                              <span className="text-[9px] text-slate-400 font-semibold px-1.5">Standard SOP</span>
                            )}
                          </div>
                        </td>

                        {/* 2. Title */}
                        <td className="py-3.5 px-4">
                          <div className="max-w-md">
                            <h4 className="font-extrabold text-slate-900 text-xs sm:text-[12.5px] tracking-tight leading-snug">
                              {sop.title}
                            </h4>
                            {/* preview first step */}
                            {sop.content && sop.content.length > 0 && (
                              <p className="text-[10px] text-slate-400 mt-1 italic truncate font-medium max-w-[320px]">
                                Langkah 1: "{sop.content[0]}"
                              </p>
                            )}
                          </div>
                        </td>

                        {/* 3. Steps count */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 border border-slate-200 text-slate-700 font-mono font-bold rounded-lg text-[11px]">
                            📝 <strong>{sop.content ? sop.content.length : 0}</strong> Langkah
                          </span>
                        </td>

                        {/* 4. Last updated */}
                        <td className="py-3.5 px-4 text-slate-500 font-mono font-bold text-[11px]">
                          📅 {sop.lastUpdated || 'Baru Saja'}
                        </td>

                        {/* 5. Actions */}
                        <td className="py-3.5 px-4 text-center bg-slate-50/15">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditSop(sop)}
                              className="p-1.5 hover:bg-amber-55 text-slate-600 hover:text-amber-800 border border-slate-200 rounded-md transition-all cursor-pointer shadow-3xs"
                              title="Edit SOP"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSop(sop.id)}
                              className="p-1.5 hover:bg-rose-50 text-red-500 hover:text-red-700 border border-transparent hover:border-rose-100 rounded-md transition-all cursor-pointer"
                              title="Hapus SOP"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 italic">
                        Belum ada SOP yang tercantum. Klik "Tambah SOP Baru" di atas untuk menambahkan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SOP MODAL DIALOG CONTAINER */}
          {isSopModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs">
              <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-120">
                
                {/* Header header */}
                <div className="px-4 py-3 bg-[#111111] text-white flex items-center justify-between border-b border-emerald-500/35">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <span className="font-black text-xs text-white uppercase tracking-wider">
                      {editingSopId ? 'Edit Draft SOP Pelayanan' : 'Rancang SOP Pelayanan Baru'}
                    </span>
                  </div>
                  <button onClick={() => setIsSopModalOpen(false)} className="text-white hover:text-rose-500 cursor-pointer">
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                <form onSubmit={handleSaveSop} className="p-5 space-y-4 text-xs font-semibold text-left">
                  
                  {/* Title of SOP */}
                  <div>
                    <label className="block text-[10.5px] uppercase text-slate-400 mb-1 font-black">Judul Regulasi SOP</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: SOP Distribusi Bagasi Zam-zam & Keberangkatan Ke Bandara"
                      value={sopTitle}
                      onChange={(e) => setSopTitle(e.target.value)}
                      className="w-full p-2 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 font-extrabold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Category and Priority Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[10.5px] uppercase text-slate-400 mb-1 font-black">Sektor Kategori Kerja</label>
                      <select
                        value={sopCategory}
                        onChange={(e) => setSopCategory(e.target.value as any)}
                        className="w-full p-2 bg-slate-55 border border-slate-200 rounded text-slate-850 font-bold cursor-pointer text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Airport">🛫 Airport (Bandara Kedatangan/Kepulangan)</option>
                        <option value="Hotel">🏨 Hotel Lobi & Rooming transit</option>
                        <option value="Logistics">📦 Logistics & Bagasi Koper</option>
                        <option value="Ziarah">🕋 Ziarah Wisata & Raudhah</option>
                        <option value="Lounge">☕ Lounge Bandara Transit</option>
                      </select>
                    </div>

                    {/* Checkbox important status */}
                    <div className="flex items-center bg-slate-50 p-2 border rounded border-slate-200 mt-5 cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        id="sopImportant"
                        checked={sopImportant}
                        onChange={(e) => setSopImportant(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer mr-2"
                      />
                      <label htmlFor="sopImportant" className="text-[10px] text-slate-700 font-extrabold cursor-pointer select-none">
                        ⚠️ SET SEBAGAI PENTING (Hanya Kepatuhan Wajib)
                      </label>
                    </div>
                  </div>

                  {/* Content of SOP (One Step Per Line) */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[10.5px] uppercase text-slate-400 font-black">Langkah-Langkah Kerja (SOP Steps)</label>
                      <span className="text-[9.5px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded leading-none">
                        💡 Pisahkan dengan Enter (Satu Baris per Langkah)
                      </span>
                    </div>
                    <textarea
                      rows={6}
                      required
                      placeholder={`Contoh baris 1: Pastikan bus ber-AC telah siap sedia di pinggir jalan utama \nContoh baris 2: Minta perwakilan mutawif memeriksa jumlah koper penyeberang lobi\nContoh baris 3: Lakukan review kepatuhan visa sebelum memasuki bus`}
                      value={sopContentRaw}
                      onChange={(e) => setSopContentRaw(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded font-medium text-xs text-slate-850 leading-relaxed focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                    <p className="text-[9.5px] text-slate-400 mt-1 font-semibold leading-normal font-sans italic">
                      Langkah-langkah yang Anda tulis di atas akan diurutkan secara numerik 1, 2, 3... secara otomatis saat muncul dalam genggaman personel lapangan.
                    </p>
                  </div>

                  {/* Modal Footer buttons */}
                  <div className="flex justify-end gap-1.5 pt-3.5 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsSopModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-600 rounded font-bold cursor-pointer hover:bg-slate-150 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold cursor-pointer transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Simpan SOP Lapangan</span>
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
