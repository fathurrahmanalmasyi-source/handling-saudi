import React, { useState } from 'react';
import { UserPlus, Search, Edit2, Trash2, FileSpreadsheet, X, Check, Filter, MoreVertical, LogIn, CheckCircle2 } from 'lucide-react';
import { ItineraryItem } from './ManagerItinerary';
import { PackageDetail } from '../types';

export interface Jamaah {
  id: string;
  nomorJamaah: string;
  namaJamaah: string;
  nomorRoomlist: string;
  groupName: string;
  passportNo?: string;
  phone?: string;
  visaStatus: 'Tersedia' | 'Proses' | 'Belum Ada';
  packageTag?: 'Private' | 'Sapphire' | 'Ruby' | 'Onyx' | 'Yaqin';
  // New user requested data tracking
  age?: number;               // Data Umur
  gender?: 'Laki-laki' | 'Perempuan'; // Jenis Kelamin
  companionInfo?: string;     // Satu akun pendaftaran dengan siapa saja
}

interface ManagerManifestProps {
  jamaahList: Jamaah[];
  onUpdateJamaahList: (newList: Jamaah[]) => void;
  groups: string[];
  onAddGroup: (newGroupName: string) => void;
  onRemoveGroup?: (removedGroupName: string) => void;
  itineraries?: ItineraryItem[];
  packages?: PackageDetail[];
  onUpdatePackages?: (newList: PackageDetail[]) => void;
}

export default function ManagerManifest({ 
  jamaahList, 
  onUpdateJamaahList, 
  groups, 
  onAddGroup,
  onRemoveGroup,
  itineraries = [],
  packages = [],
  onUpdatePackages
}: ManagerManifestProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupDirectory, setSelectedGroupDirectory] = useState<string | null>(null);

  // Setup Directory search bars
  const [directorySearchName, setDirectorySearchName] = useState('');
  const [directorySearchGroup, setDirectorySearchGroup] = useState('');

  // Input States for New Jamaah
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nomorJamaah, setNomorJamaah] = useState('');
  const [namaJamaah, setNamaJamaah] = useState('');
  const [nomorRoomlist, setNomorRoomlist] = useState('');
  const [groupName, setGroupName] = useState(groups[0] || 'Umroh Reguler 11 Juni 2026 (Madinah Awal)');
  const [passportNo, setPassportNo] = useState('');
  const [phone, setPhone] = useState('');
  const [visaStatus, setVisaStatus] = useState<'Tersedia' | 'Proses' | 'Belum Ada'>('Tersedia');
  const [selectedPackageTag, setSelectedPackageTag] = useState<'Private' | 'Sapphire' | 'Ruby' | 'Onyx' | 'Yaqin'>('Yaqin');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [companionInfo, setCompanionInfo] = useState('');

  // New Group input
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupInput, setNewGroupInput] = useState('');

  const [subTabView, setSubTabView] = useState<'jamaah' | 'paketInfo'>('jamaah');

  // Editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isEditingPackage, setIsEditingPackage] = useState(false);
  const [editNomorJamaah, setEditNomorJamaah] = useState('');
  const [editNamaJamaah, setEditNamaJamaah] = useState('');
  const [editNomorRoomlist, setEditNomorRoomlist] = useState('');
  const [editGroupName, setEditGroupName] = useState('');
  const [editPassportNo, setEditPassportNo] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editVisaStatus, setEditVisaStatus] = useState<'Tersedia' | 'Proses' | 'Belum Ada'>('Tersedia');
  const [editPackageTag, setEditPackageTag] = useState<'Private' | 'Sapphire' | 'Ruby' | 'Onyx' | 'Yaqin'>('Yaqin');
  const [editAge, setEditAge] = useState<string>('');
  const [editGender, setEditGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [editCompanionInfo, setEditCompanionInfo] = useState('');

  const [activeGroupDropdown, setActiveGroupDropdown] = useState<string | null>(null);
  const [activeJemaahDropdown, setActiveJemaahDropdown] = useState<string | null>(null);
  const [activeSearchDropdown, setActiveSearchDropdown] = useState<string | null>(null);

  const getPackageTag = (j: Jamaah): 'Private' | 'Sapphire' | 'Ruby' | 'Onyx' | 'Yaqin' => {
    if (j.packageTag) return j.packageTag;
    const name = j.groupName.toLowerCase();
    if (name.includes('private') || name.includes('vip')) return 'Private';
    if (name.includes('sapphire')) return 'Sapphire';
    if (name.includes('ruby')) return 'Ruby';
    if (name.includes('onyx')) return 'Onyx';
    return 'Yaqin';
  };

  const handleAddGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupInput.trim()) return;
    onAddGroup(newGroupInput.trim());
    setGroupName(newGroupInput.trim());
    setNewGroupInput('');
    setShowAddGroup(false);
  };

  const handleAddJamaah = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomorJamaah.trim() || !namaJamaah.trim()) {
      alert('Nomor Jamaah dan Nama Jamaah wajib diisi.');
      return;
    }

    const newItem: Jamaah = {
      id: `jam-${Date.now()}`,
      nomorJamaah: nomorJamaah.trim(),
      namaJamaah: namaJamaah.trim(),
      nomorRoomlist: nomorRoomlist.trim() || '-',
      groupName,
      passportNo: passportNo.trim() || undefined,
      phone: phone.trim() || undefined,
      visaStatus,
      packageTag: selectedPackageTag,
      age: age ? parseInt(age) || undefined : undefined,
      gender,
      companionInfo: companionInfo.trim() || undefined
    };

    onUpdateJamaahList([newItem, ...jamaahList]);
    setIsModalOpen(false);
    
    // reset
    setNomorJamaah('');
    setNamaJamaah('');
    setNomorRoomlist('');
    setPassportNo('');
    setPhone('');
    setVisaStatus('Tersedia');
    setSelectedPackageTag('Yaqin');
    setAge('');
    setGender('Laki-laki');
    setCompanionInfo('');
  };

  const handleEditInit = (item: Jamaah) => {
    setEditingId(item.id);
    setEditNomorJamaah(item.nomorJamaah);
    setEditNamaJamaah(item.namaJamaah);
    setEditNomorRoomlist(item.nomorRoomlist);
    setEditGroupName(item.groupName);
    setEditPassportNo(item.passportNo || '');
    setEditPhone(item.phone || '');
    setEditVisaStatus(item.visaStatus);
    setEditPackageTag(item.packageTag || getPackageTag(item));
    setEditAge(item.age ? String(item.age) : '');
    setEditGender(item.gender || 'Laki-laki');
    setEditCompanionInfo(item.companionInfo || '');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (id: string) => {
    if (!editNomorJamaah.trim() || !editNamaJamaah.trim()) {
      alert('Nama dan Nomor tidak boleh kosong');
      return;
    }

    const updated = jamaahList.map(item => {
      if (item.id === id) {
        return {
          ...item,
          nomorJamaah: editNomorJamaah.trim(),
          namaJamaah: editNamaJamaah.trim(),
          nomorRoomlist: editNomorRoomlist.trim() || '-',
          groupName: editGroupName,
          passportNo: editPassportNo.trim() || undefined,
          phone: editPhone.trim() || undefined,
          visaStatus: editVisaStatus,
          packageTag: editPackageTag,
          age: editAge ? parseInt(editAge) || undefined : undefined,
          gender: editGender,
          companionInfo: editCompanionInfo.trim() || undefined
        };
      }
      return item;
    });

    onUpdateJamaahList(updated);
    setEditingId(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jemaah ini dari manifest?')) {
      const filtered = jamaahList.filter(item => item.id !== id);
      onUpdateJamaahList(filtered);
    }
  };

  const handleDeleteGroup = (e: React.MouseEvent, groupNameDeleted: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Apakah Anda yakin ingin menghapus grup rombongan "${groupNameDeleted}"?\n\nSemua jemaah di dalam grup ini akan dialihkan ke "Belum Ada Grup".`)) {
      if (onRemoveGroup) {
        onRemoveGroup(groupNameDeleted);
      }
      // re-assign jamaah of that group to empty
      const updated = jamaahList.map(j => {
        if (j.groupName === groupNameDeleted) {
          return { ...j, groupName: 'Belum Ada Grup' };
        }
        return j;
      });
      onUpdateJamaahList(updated);
    }
  };

  const filteredList = jamaahList.filter(item => {
    const matchSearch = item.namaJamaah.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.nomorJamaah.includes(searchTerm) ||
                        item.nomorRoomlist.includes(searchTerm);
    // Filter by selectedGroupDirectory strictly when not null
    const matchGroup = !selectedGroupDirectory || selectedGroupDirectory === 'All' || item.groupName === selectedGroupDirectory;
    return matchSearch && matchGroup;
  });

  // Calculate detailed active schedule days for the active group (if any)
  const activeGroupItineraries = selectedGroupDirectory && selectedGroupDirectory !== 'All'
    ? itineraries.filter(i => i.groupName === selectedGroupDirectory)
    : [];
  const activeGroupTotalDays = activeGroupItineraries.length > 0 
    ? Math.max(...activeGroupItineraries.map(i => i.dayNo)) 
    : 9;

  return (
    <div className="space-y-4" id="manager-manifest-com">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-200 gap-3">
        <div>
          <h2 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
            <FileSpreadsheet className="w-4.5 h-4.5 text-[#D4AF37]" />
            <span>Manajemen Manifest & Grup</span>
          </h2>
          <p className="text-xs text-slate-500">Kelola rombongan jamaah, nomor jamaah, koordinasi roomlist, visa, dan paspor</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowAddGroup(true)}
            className="flex-1 sm:flex-initial px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold border border-slate-200 transition-all text-center"
          >
            + Buat Grup Baru
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-initial px-3 py-1.5 bg-slate-900 border border-[#D4AF37]/25 hover:bg-black text-[#D4AF37] rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Tambah Jamaah</span>
          </button>
        </div>
      </div>

      {selectedGroupDirectory === null ? (
        <div className="space-y-4" id="group-directory-grid">
          {/* SEARCH BAR PADA TAMPILAN AWAL SEPERTI REQUEST USER */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 shadow-xs">
            <div>
              <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Cari Nama / ID / Kamar Jamaah (Tampilan Awal)</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ketik nama jemaah atau kamar untuk mencari..."
                  value={directorySearchName}
                  onChange={(e) => setDirectorySearchName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 pl-8 pr-3 py-2 rounded-lg font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Cari / Saring Nama Rombongan Grup</label>
              <div className="relative">
                <Filter className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ketik kata kunci nama grup untuk menyaring..."
                  value={directorySearchGroup}
                  onChange={(e) => setDirectorySearchGroup(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 pl-8 pr-3 py-2 rounded-lg font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* LIVE SEARCH RESULTS FOR JAMAAH */}
          {directorySearchName.trim() !== '' && (() => {
            const matches = jamaahList.filter(item => {
              const nameMatch = item.namaJamaah.toLowerCase().includes(directorySearchName.toLowerCase());
              const numMatch = item.nomorJamaah.includes(directorySearchName);
              const roomMatch = item.nomorRoomlist.includes(directorySearchName);
              return nameMatch || numMatch || roomMatch;
            });
            return (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs animate-in slide-in-from-top-1 duration-100">
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                    🔍 Hasil Pencarian Jemaah ({matches.length} ditemukan)
                  </h4>
                  <button 
                    onClick={() => setDirectorySearchName('')}
                    className="text-[10px] text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-2.5 py-0.5 rounded font-semibold uppercase cursor-pointer transition-all"
                  >
                    Hapus
                  </button>
                </div>

                {matches.length > 0 ? (
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[9.5px]">
                            <th className="py-2.5 px-3">No. Jemaah</th>
                            <th className="py-2.5 px-3">Nama Jamaah & Paket</th>
                            <th className="py-2.5 px-3">No Roomlist</th>
                            <th className="py-2.5 px-3">Grup Rombongan</th>
                            <th className="py-2.5 px-3">Paspor / Kontak</th>
                            <th className="py-2.5 px-3 text-center">Visa</th>
                            <th className="py-2.5 px-3 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px]">
                          {matches.map((item) => {
                            const pTag = getPackageTag(item);
                            return (
                              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-2 px-3 font-mono font-bold text-slate-600">{item.nomorJamaah}</td>
                                <td className="py-2 px-3">
                                  <span className="font-extrabold text-slate-900 block">{item.namaJamaah}</span>
                                  <div className="flex flex-wrap gap-1 mt-1 items-center">
                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase border ${
                                      pTag === 'Private' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                                      pTag === 'Sapphire' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                      pTag === 'Ruby' ? 'bg-amber-50 text-[#8C6B1B] border-amber-200' :
                                      pTag === 'Onyx' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                                      'bg-emerald-50 text-emerald-800 border-emerald-250'
                                    }`}>
                                      {pTag === 'Private' ? '🔑' : pTag === 'Sapphire' ? '💎' : pTag === 'Ruby' ? '❤️' : pTag === 'Onyx' ? '🟣' : '🟢'} {pTag}
                                    </span>
                                    {item.age !== undefined && (
                                      <span className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-[8.5px] font-extrabold border border-slate-200 font-mono">
                                        🎂 {item.age} Thn
                                      </span>
                                    )}
                                    {item.gender && (
                                      <span className={`px-1 py-0.5 rounded text-[8.5px] font-extrabold border uppercase ${
                                        item.gender === 'Laki-laki' ? 'bg-sky-50 text-sky-800 border-sky-150' : 'bg-pink-50 text-pink-800 border-pink-150'
                                      }`}>
                                        {item.gender === 'Laki-laki' ? '♂ Laki' : '♀ Perempuan'}
                                      </span>
                                    )}
                                    {item.companionInfo && (
                                      <span className="bg-violet-50 text-violet-800 px-1 py-0.5 rounded text-[8.5px] font-extrabold border border-violet-150 max-w-[150px] truncate" title={item.companionInfo}>
                                        👥 {item.companionInfo}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-2 px-3 font-mono">
                                  <span className="font-semibold text-indigo-900 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px]">
                                    🚪 {item.nomorRoomlist}
                                  </span>
                                </td>
                                <td className="py-2 px-3 font-bold text-slate-600">{item.groupName}</td>
                                <td className="py-2 px-3 text-[10.5px]">
                                  <span className="text-slate-500 font-semibold block">Psp: {item.passportNo || '-'}</span>
                                  <span className="text-[#D4AF37] font-semibold block">Telf: {item.phone || '-'}</span>
                                </td>
                                <td className="py-2 px-3 text-center">
                                  <span className={`px-1.5 py-0.5 text-[9px] font-black rounded uppercase ${
                                    item.visaStatus === 'Tersedia' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                                    item.visaStatus === 'Proses' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                                    'bg-red-50 text-red-800 border border-red-200'
                                  }`}>
                                    {item.visaStatus}
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-right overflow-visible relative">
                                  <div className="inline-block text-left">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveSearchDropdown(activeSearchDropdown === item.id ? null : item.id);
                                      }}
                                      className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-md transition-all cursor-pointer"
                                      title="Pilihan Aksi"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>

                                    {activeSearchDropdown === item.id && (
                                      <>
                                        <button
                                          type="button"
                                          className="fixed inset-0 z-30 cursor-default bg-transparent"
                                          onClick={() => setActiveSearchDropdown(null)}
                                        />
                                        <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-40 text-left animate-in fade-in slide-in-from-top-1 duration-105">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setActiveSearchDropdown(null);
                                              setSelectedGroupDirectory(item.groupName);
                                            }}
                                            className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-1.5"
                                          >
                                            <LogIn className="w-3.5 h-3.5 text-amber-500" />
                                            <span>Buka Portal</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setActiveSearchDropdown(null);
                                              handleEditInit(item);
                                            }}
                                            className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-1.5"
                                          >
                                            <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
                                            <span>Edit Jemaah</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setActiveSearchDropdown(null);
                                              handleDelete(item.id);
                                            }}
                                            className="w-full text-left px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center gap-1.5"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Hapus Jemaah</span>
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-slate-400 py-3 text-xs">Tidak ada jemaah yang cocok.</p>
                )}
              </div>
            );
          })()}

          {/* TAMPILAN GRUP BARIS TABEL KE BAWAH DENGAN DETAIL DENGAN TAMPILAN YANG FIT SEPERTI REQUEST USER */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Nama Rombongan Grup</th>
                    <th className="py-3 px-3 text-center">Durasi Jadwal</th>
                    <th className="py-3 px-3 text-center">Tipe Paket Default</th>
                    <th className="py-3 px-3 text-center">Jumlah Pax</th>
                    <th className="py-3 px-3 text-center">Status Dokumentasi Visa</th>
                    <th className="py-3 px-4 text-right">Aksi Portal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(() => {
                    const filteredG = groups.filter(g => g.toLowerCase().includes(directorySearchGroup.toLowerCase()));
                    if (filteredG.length === 0) {
                      return (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 font-bold">
                            Tidak ada grup yang sesuai filter "{directorySearchGroup}".
                          </td>
                        </tr>
                      );
                    }
                    return filteredG.map((group) => {
                      const groupJamaah = jamaahList.filter(j => j.groupName === group);
                      const visaTersedia = groupJamaah.filter(j => j.visaStatus === 'Tersedia').length;
                      const visaBelum = groupJamaah.filter(j => j.visaStatus === 'Belum Ada').length;
                      const visaProses = groupJamaah.filter(j => j.visaStatus === 'Proses').length;
                      
                      const isSapphire = group.toLowerCase().includes('sapphire');
                      const isRuby = group.toLowerCase().includes('ruby');
                      const isOnyx = group.toLowerCase().includes('onyx');
                      const isPrivate = group.toLowerCase().includes('private') || group.toLowerCase().includes('vip');
                      const isYaqin = group.toLowerCase().includes('yaqin');

                      let typeBadge = "Reguler Package";
                      let badgeColor = "bg-slate-100 text-slate-800 border-slate-200";
                      if (isSapphire) { typeBadge = "Sapphire Package"; badgeColor = "bg-blue-50 text-blue-800 border-blue-200"; }
                      else if (isRuby) { typeBadge = "Ruby Package"; badgeColor = "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20"; }
                      else if (isOnyx) { typeBadge = "Onyx Package"; badgeColor = "bg-purple-50 text-purple-800 border-purple-200"; }
                      else if (isPrivate) { typeBadge = "Private Luxury"; badgeColor = "bg-rose-50 text-rose-800 border-rose-200"; }
                      else if (isYaqin) { typeBadge = "Yaqin Silver"; badgeColor = "bg-emerald-50 text-emerald-800 border-emerald-250"; }

                      // Calculate schedule days
                      const groupItineraries = itineraries.filter(i => i.groupName === group);
                      const totalDaysSchedule = groupItineraries.length > 0 
                        ? Math.max(...groupItineraries.map(i => i.dayNo)) 
                        : 9;

                      return (
                        <tr 
                          key={group}
                          onClick={() => {
                            setSelectedGroupDirectory(group);
                          }}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">📂</span>
                              <div>
                                <span className="font-extrabold text-slate-800 group-hover:text-amber-600 transition-colors block text-[12px]">{group}</span>
                                <span className="text-[10px] text-slate-450 font-medium block md:hidden mt-0.5">{groupJamaah.length} Pax</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-center font-bold text-indigo-700 bg-indigo-50/20 font-mono">
                            {totalDaysSchedule} Hari
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[8.5px] font-black tracking-wider border uppercase ${badgeColor}`}>
                              {typeBadge}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-800">
                            {groupJamaah.length} Pax
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <div className="inline-flex gap-1.5 text-[9px] font-bold">
                              <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                                {visaTersedia} Ok
                              </span>
                              {visaProses > 0 && (
                                <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 font-bold">
                                  {visaProses} Proc
                                </span>
                              )}
                              {visaBelum > 0 && (
                                <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">
                                  {visaBelum} N/A
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                             <div className="inline-block text-left">
                               <button
                                 type="button"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setActiveGroupDropdown(activeGroupDropdown === group ? null : group);
                                 }}
                                 className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-md transition-all cursor-pointer inline-flex items-center justify-center"
                                 title="Pilihan Aksi"
                               >
                                 <MoreVertical className="w-4 h-4 text-slate-500" />
                               </button>

                               {activeGroupDropdown === group && (
                                 <>
                                   <button
                                     type="button"
                                     className="fixed inset-0 z-30 cursor-default bg-transparent"
                                     onClick={() => setActiveGroupDropdown(null)}
                                   />
                                   <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-40 text-left animate-in fade-in slide-in-from-top-1 duration-105">
                                     <button
                                       type="button"
                                       onClick={() => {
                                         setActiveGroupDropdown(null);
                                         setSelectedGroupDirectory(group);
                                       }}
                                       className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-1.5 font-sans"
                                     >
                                       <LogIn className="w-3.5 h-3.5 text-amber-500" />
                                       <span>Buka Portal</span>
                                     </button>
                                     <button
                                       type="button"
                                       onClick={(e) => {
                                         setActiveGroupDropdown(null);
                                         handleDeleteGroup(e, group);
                                       }}
                                       className="w-full text-left px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center gap-1.5 font-sans"
                                     >
                                       <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                       <span>Hapus Grup</span>
                                     </button>
                                   </div>
                                 </>
                               )}
                             </div>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-slate-100/80 p-3 text-xs font-semibold text-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between border border-slate-200 mb-3 hover:bg-slate-100 transition-colors gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-500 font-bold">📂</span>
              <span className="font-bold">
                Detail Manifest Jemaah untuk: <strong className="text-slate-900">{selectedGroupDirectory === 'All' ? 'Semua Rombongan' : selectedGroupDirectory}</strong>
              </span>
              {selectedGroupDirectory !== 'All' && (
                <span className="ml-1.5 px-2 py-0.5 text-[9.5px] font-black bg-indigo-50 text-indigo-700 rounded border border-indigo-200 font-mono uppercase">
                  ⏱️ {activeGroupTotalDays} Hari Jadwal
                </span>
              )}
            </div>
            <button 
              type="button" 
              onClick={() => {
                setSelectedGroupDirectory(null);
                setSubTabView('jamaah');
              }}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-350 rounded-lg font-semibold text-[10px] uppercase cursor-pointer transition-all tracking-wide shadow-2xs"
            >
              ◀ Kembali ke Direktori Grup
            </button>
          </div>

          {selectedGroupDirectory !== 'All' && (
            <div className="flex bg-white rounded-lg p-1 border border-slate-200 w-full sm:w-fit mb-4">
              <button
                onClick={() => setSubTabView('jamaah')}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${subTabView === 'jamaah' ? 'bg-slate-900 text-[#D4AF37]' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Manifest Jemaah
              </button>
              <button
                onClick={() => setSubTabView('paketInfo')}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${subTabView === 'paketInfo' ? 'bg-slate-900 text-[#D4AF37]' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Data Paket & Info
              </button>
            </div>
          )}

          {subTabView === 'jamaah' ? (
            <>
              {/* SEARCH BAR PADA DETAIL VIEW - TIDAK ADA FILTER ROMBONGAN LAGI SEPERTI REQUEST USER */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Cari Jamaah / No Kamar / ID</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama, nomor jemaah atau kamar di dalam grup ini..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 pl-8 pr-3 py-2 rounded-lg font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* MANIFEST LIST TABLE */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px]">
                    <th className="py-2.5 px-3">No. Jemaah</th>
                    <th className="py-2.5 px-3">Nama Jamaah</th>
                    <th className="py-2.5 px-3">No Roomlist</th>
                    <th className="py-2.5 px-3">Grup Rombongan</th>
                    <th className="py-2.5 px-3">Paspor / Kontak</th>
                    <th className="py-2.5 px-3 text-center">Visa</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {filteredList.length > 0 ? (
                    filteredList.map((item) => {
                      const pTag = getPackageTag(item);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                          {/* Nomor Jamaah */}
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-600">
                            <span>{item.nomorJamaah}</span>
                          </td>

                          {/* Nama Jamaah & Paket */}
                          <td className="py-2.5 px-3">
                            <div>
                              <span className="font-extrabold text-slate-900 block">{item.namaJamaah}</span>
                              <div className="flex flex-wrap gap-1 mt-1 items-center">
                                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase border ${
                                  pTag === 'Private' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                                  pTag === 'Sapphire' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                  pTag === 'Ruby' ? 'bg-amber-50 text-[#8C6B1B] border-amber-200' :
                                  pTag === 'Onyx' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                                  'bg-emerald-50 text-emerald-800 border-emerald-250'
                                }`}>
                                  {pTag === 'Private' ? '🔑' : pTag === 'Sapphire' ? '💎' : pTag === 'Ruby' ? '❤️' : pTag === 'Onyx' ? '🟣' : '🟢'} {pTag}
                                </span>
                                {item.age !== undefined && (
                                  <span className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-[8.5px] font-extrabold border border-slate-200 font-mono">
                                    🎂 {item.age} Thn
                                  </span>
                                )}
                                {item.gender && (
                                  <span className={`px-1 py-0.5 rounded text-[8.5px] font-extrabold border uppercase ${
                                    item.gender === 'Laki-laki' ? 'bg-sky-50 text-sky-800 border-sky-150' : 'bg-pink-50 text-pink-800 border-pink-150'
                                  }`}>
                                    {item.gender === 'Laki-laki' ? '♂ Laki' : '♀ Perempuan'}
                                  </span>
                                )}
                                {item.companionInfo && (
                                  <span className="bg-violet-50 text-violet-800 px-1 py-0.5 rounded text-[8.5px] font-extrabold border border-violet-150 max-w-[180px] truncate" title={item.companionInfo}>
                                    👥 {item.companionInfo}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Nomor Roomlist */}
                          <td className="py-2.5 px-3 font-mono">
                            <span className="font-semibold text-indigo-900 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px]">
                              🚪 {item.nomorRoomlist}
                            </span>
                          </td>

                          {/* Grup */}
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-700 block max-w-[150px] truncate" title={item.groupName}>
                              {item.groupName}
                            </span>
                          </td>

                          {/* Paspor / Kontak */}
                          <td className="py-2.5 px-3">
                            <div className="leading-none space-y-0.5 text-[10.5px]">
                              <span className="text-slate-500 font-semibold block">Psp: {item.passportNo || '-'}</span>
                              <span className="text-[#D4AF37] font-semibold block">Telf: {item.phone || '-'}</span>
                            </div>
                          </td>

                          {/* Visa Status */}
                          <td className="py-2.5 px-3 text-center">
                            <span className={`px-1.5 py-0.5 text-[9px] font-black rounded uppercase ${
                              item.visaStatus === 'Tersedia' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                              item.visaStatus === 'Proses' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                              'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                              {item.visaStatus}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-2.5 px-3 text-right">
                             <div className="inline-block text-left">
                               <button
                                 type="button"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setActiveJemaahDropdown(activeJemaahDropdown === item.id ? null : item.id);
                                 }}
                                 className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-md transition-all cursor-pointer inline-flex items-center justify-center"
                                 title="Pilihan Aksi"
                               >
                                 <MoreVertical className="w-4 h-4 text-slate-500" />
                               </button>

                               {activeJemaahDropdown === item.id && (
                                 <>
                                   <button
                                     type="button"
                                     className="fixed inset-0 z-30 cursor-default bg-transparent"
                                     onClick={() => setActiveJemaahDropdown(null)}
                                   />
                                   <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-40 text-left animate-in fade-in slide-in-from-top-1 duration-105">
                                     <button
                                       type="button"
                                       onClick={() => {
                                         setActiveJemaahDropdown(null);
                                         handleEditInit(item);
                                       }}
                                       className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-1.5 font-sans"
                                     >
                                       <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
                                       <span>Edit Jemaah</span>
                                     </button>
                                     <button
                                       type="button"
                                       onClick={() => {
                                         setActiveJemaahDropdown(null);
                                         handleDelete(item.id);
                                       }}
                                       className="w-full text-left px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center gap-1.5 font-sans"
                                     >
                                       <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                       <span>Hapus Jemaah</span>
                                     </button>
                                   </div>
                                 </>
                               )}
                             </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-400 text-xs">
                        Tidak ada jemaah yang sesuai pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : subTabView === 'paketInfo' && selectedGroupDirectory ? (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs animate-in fade-in duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-black text-slate-900 border-l-4 border-[#D4AF37] pl-3 uppercase">
              Detail Paket Info Grup
            </h3>
            <button 
              onClick={() => {
                const existing = packages.find(p => p.groupName === selectedGroupDirectory);
                if (!existing && onUpdatePackages) {
                  onUpdatePackages([...packages, {
                    id: `pkg-${Date.now()}`,
                    groupName: selectedGroupDirectory,
                    departureDate: '',
                    departureFlightCode: '',
                    departureFlightRoute: '',
                    departureTimeRange: '',
                    returnDate: '',
                    returnFlightCode: '',
                    returnFlightRoute: '',
                    returnTimeRange: '',
                    totalJamaah: 0,
                    jamaahPerPackage: '',
                    hotelDetails: '',
                    tourLeader: '',
                    mutawwifName: '',
                    arrivalMeals: '',
                    returnMeals: '',
                    status: 'Pre-Arrival'
                  }]);
                }
                setIsEditingPackage(true);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-[#D4AF37] text-[10px] font-bold rounded-lg transition-colors border border-[#D4AF37]/30"
            >
              Ubah Data Paket Info
            </button>
          </div>
          
          {(() => {
            const currentPkg = packages.find(p => p.groupName === selectedGroupDirectory);
            if (!currentPkg) {
              return (
                <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                  <p className="text-sm font-semibold mb-2">Data Paket Belum Dibuat</p>
                  <p className="text-xs">Silakan klik "Ubah Data Paket Info" untuk membuat baru.</p>
                </div>
              );
            }

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Keberangkatan */}
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
                    <h4 className="font-bold text-slate-800 text-xs border-b pb-2">🛫 KEBERANGKATAN</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <span className="text-slate-500">Tanggal</span>
                      <span className="font-semibold">{currentPkg.departureDate || '-'}</span>
                      <span className="text-slate-500">Maskapai</span>
                      <span className="font-semibold uppercase">{currentPkg.departureFlightCode || '-'}</span>
                      <span className="text-slate-500">Rute</span>
                      <span className="font-semibold uppercase">{currentPkg.departureFlightRoute || '-'}</span>
                      <span className="text-slate-500">Takeoff & Landing</span>
                      <span className="font-semibold font-mono">{currentPkg.departureTimeRange || '-'}</span>
                    </div>
                  </div>

                  {/* Kepulangan */}
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
                    <h4 className="font-bold text-slate-800 text-xs border-b pb-2">🛬 KEPULANGAN</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <span className="text-slate-500">Tanggal</span>
                      <span className="font-semibold">{currentPkg.returnDate || '-'}</span>
                      <span className="text-slate-500">Maskapai</span>
                      <span className="font-semibold uppercase">{currentPkg.returnFlightCode || '-'}</span>
                      <span className="text-slate-500">Rute</span>
                      <span className="font-semibold uppercase">{currentPkg.returnFlightRoute || '-'}</span>
                      <span className="text-slate-500">Takeoff & Landing</span>
                      <span className="font-semibold font-mono">{currentPkg.returnTimeRange || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Jamaah Info */}
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
                    <h4 className="font-bold text-slate-800 text-xs border-b pb-2">👥 DATA JAMAAH</h4>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total Keseluruhan</span>
                        <span className="font-black text-indigo-900">{currentPkg.totalJamaah} Pax</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-1">Rincian Paket Jamaah:</span>
                        <p className="font-semibold whitespace-pre-wrap bg-white p-2 rounded border border-slate-200">
                          {currentPkg.jamaahPerPackage || '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Meals */}
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
                    <h4 className="font-bold text-slate-800 text-xs border-b pb-2">🍽️ INFORMASI KATERING / MEALS</h4>
                    <div className="grid grid-cols-1 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block mb-1">Meals Kedatangan</span>
                        <p className="font-semibold">{currentPkg.arrivalMeals || '-'}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-1">Meals Kepulangan</span>
                        <p className="font-semibold">{currentPkg.returnMeals || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hotel & PIC */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
                    <h4 className="font-bold text-slate-800 text-xs border-b pb-2">🏨 NAMA HOTEL MASING-MASING PAKET</h4>
                    <div className="text-xs">
                      <p className="font-semibold whitespace-pre-wrap bg-white p-3 rounded border border-slate-200">
                        {currentPkg.hotelDetails || '-'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
                    <h4 className="font-bold text-slate-800 text-xs border-b pb-2">👔 PERSONAL IN CHARGE</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <span className="text-slate-500">Tour Leader (TL)</span>
                      <span className="font-bold text-slate-800">{currentPkg.tourLeader || '-'}</span>
                      <span className="text-slate-500">Muthawif Pembimbing</span>
                      <span className="font-bold text-slate-800">{currentPkg.mutawwifName || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      ) : null}
        </>
      )}

      {/* CREATE NEW ROMBONGAN GROUP DIALOG */}
      {showAddGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="p-3 bg-slate-900 text-white flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">BUAT ROMBONGAN BARU</span>
              <button onClick={() => setShowAddGroup(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddGroupSubmit} className="p-4 space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">Nama Rombongan Grup</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Umroh Ramadhan VIP 2026"
                  value={newGroupInput}
                  onChange={(e) => setNewGroupInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-[#D4AF37]"
                />
              </div>
              <div className="flex justify-end gap-1.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGroup(false)}
                  className="px-3 py-1 bg-slate-100 rounded text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-slate-900 border border-[#D4AF37]/30 text-[#D4AF37] rounded font-bold"
                >
                  Simpan Rombongan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW JAMAAH DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 bg-[#1A1A1A] text-white flex items-center justify-between border-b border-[#D4AF37]/20">
              <span className="font-black text-xs text-[#D4AF37] uppercase">Tambah Jamaah Baru</span>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white border border-slate-700 rounded p-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddJamaah} className="p-4 space-y-3 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left">No. Jemaah (ID)</label>
                  <input
                    type="text"
                    required
                    placeholder="Bisa 5-digit, e.g. 10051"
                    value={nomorJamaah}
                    onChange={(e) => setNomorJamaah(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left">No. Roomlist / Kamar</label>
                  <input
                    type="text"
                    placeholder="E.g. 1405"
                    value={nomorRoomlist}
                    onChange={(e) => setNomorRoomlist(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-center font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left">Nama Lengkap Jamaah</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ibu Fatimah Ahmad binti Salim"
                  value={namaJamaah}
                  onChange={(e) => setNamaJamaah(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs block font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left font-black">Pilih Rombongan</label>
                  <select
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs block font-bold text-slate-800"
                  >
                    {groups.map((g, idx) => (
                      <option key={idx} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left font-black">Paket Layanan</label>
                  <select
                    value={selectedPackageTag}
                    onChange={(e) => setSelectedPackageTag(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs block font-black text-slate-800"
                  >
                    <option value="Private">🔑 Private</option>
                    <option value="Sapphire">💎 Sapphire</option>
                    <option value="Ruby">❤️ Ruby</option>
                    <option value="Onyx">🟣 Onyx</option>
                    <option value="Yaqin">🟢 Yaqin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left">Nomor Paspor</label>
                  <input
                    type="text"
                    placeholder="E.g. X11094E"
                    value={passportNo}
                    onChange={(e) => setPassportNo(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left">Kontak Aktif (No HP / WA)</label>
                  <input
                    type="text"
                    placeholder="E.g. +62811..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left">Status Dokumen Visa KSA</label>
                <select
                  value={visaStatus}
                  onChange={(e) => setVisaStatus(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs block font-bold text-slate-800"
                >
                  <option value="Tersedia">🟢 TERSEDIA (Sticker / E-Visa Ter-print)</option>
                  <option value="Proses">🟡 PROSES (Sedang diajukan ke Muassasah)</option>
                  <option value="Belum Ada">🔴 BELUM ADA / DITANGGUHKAN</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left">Umur (Tahun)</label>
                  <input
                    type="number"
                    placeholder="E.g. 45"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left font-black">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs block font-bold text-slate-800"
                  >
                    <option value="Laki-laki">♂ Laki-laki</option>
                    <option value="Perempuan">♀ Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left">Satu Akun Pendaftaran Dengan (Keluarga/Mahram)</label>
                <input
                  type="text"
                  placeholder="Contoh: Suami (Ahmad Salim), Anak (Wati)"
                  value={companionInfo}
                  onChange={(e) => setCompanionInfo(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold"
                />
              </div>

              <div className="flex justify-end gap-1.5 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 rounded text-[11px] font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-black border border-[#D4AF37]/35 text-[#D4AF37] rounded text-[11px] font-bold"
                >
                  Simpan ke Manifest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT JAMAAH POP UP DIALOG (REPLACES INLINE INPUTS FOR FLAWLESS MOBILE & DESKTOP DESIGNS) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="px-4 py-3 bg-[#1A1A1A] text-white flex items-center justify-between border-b border-[#D4AF37]/20">
              <span className="font-black text-xs text-[#D4AF37] uppercase">Edit Data Jamaah</span>
              <button 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingId(null);
                }} 
                className="text-slate-400 hover:text-white border border-slate-700 rounded p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (editingId) {
                  handleSaveEdit(editingId);
                }
              }} 
              className="p-4 space-y-3 text-xs font-semibold"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left">No. Jemaah (ID)</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. 1"
                    value={editNomorJamaah}
                    onChange={(e) => setEditNomorJamaah(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left">No. Roomlist / Kamar</label>
                  <input
                    type="text"
                    placeholder="E.g. 1405"
                    value={editNomorRoomlist}
                    onChange={(e) => setEditNomorRoomlist(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-center font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left">Nama Lengkap Jamaah</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ibu Fatimah Ahmad binti Salim"
                  value={editNamaJamaah}
                  onChange={(e) => setEditNamaJamaah(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs block font-bold focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left font-black">Pilih Rombongan</label>
                  <select
                    value={editGroupName}
                    onChange={(e) => setEditGroupName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs block font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  >
                    {groups.map((g, idx) => (
                      <option key={idx} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left font-black">Paket Layanan</label>
                  <select
                    value={editPackageTag}
                    onChange={(e) => setEditPackageTag(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs block font-black text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  >
                    <option value="Private">🔑 Private</option>
                    <option value="Sapphire">💎 Sapphire</option>
                    <option value="Ruby">❤️ Ruby</option>
                    <option value="Onyx">🟣 Onyx</option>
                    <option value="Yaqin">🟢 Yaqin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left">Nomor Paspor</label>
                  <input
                    type="text"
                    placeholder="E.g. X11094E"
                    value={editPassportNo}
                    onChange={(e) => setEditPassportNo(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left">Kontak Aktif (No HP / WA)</label>
                  <input
                    type="text"
                    placeholder="E.g. +62811..."
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left">Status Dokumen Visa KSA</label>
                <select
                  value={editVisaStatus}
                  onChange={(e) => setEditVisaStatus(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs block font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                >
                  <option value="Tersedia">🟢 TERSEDIA (Sticker / E-Visa Ter-print)</option>
                  <option value="Proses">🟡 PROSES (Sedang diajukan ke Muassasah)</option>
                  <option value="Belum Ada">🔴 BELUM ADA / DITANGGUHKAN</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left">Umur (Tahun)</label>
                  <input
                    type="number"
                    placeholder="E.g. 45"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left font-black">Jenis Kelamin</label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs block font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  >
                    <option value="Laki-laki">♂ Laki-laki</option>
                    <option value="Perempuan">♀ Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1 uppercase text-left">Satu Akun Pendaftaran Dengan (Keluarga/Mahram)</label>
                <input
                  type="text"
                  placeholder="Contoh: Suami (Ahmad Salim), Anak (Wati)"
                  value={editCompanionInfo}
                  onChange={(e) => setEditCompanionInfo(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="flex justify-end gap-1.5 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingId(null);
                  }}
                  className="px-3.5 py-1.5 bg-slate-100 rounded text-[11px] font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-black border border-[#D4AF37]/35 text-[#D4AF37] rounded text-[11px] font-bold animate-pulse"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PACKAGE INFO MODAL */}
      {isEditingPackage && selectedGroupDirectory && (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-10 pb-10 overflow-y-auto px-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-5 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center rounded-t-xl shrink-0">
              <span className="font-black text-[#D4AF37] uppercase tracking-wider text-sm flex items-center gap-2">
                <Edit2 className="w-4 h-4" /> Form Edit Paket Info: {selectedGroupDirectory}
              </span>
              <button onClick={() => setIsEditingPackage(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
              {(() => {
                const pkg = packages.find(p => p.groupName === selectedGroupDirectory);
                if (!pkg) return null;

                const handleChange = (field: keyof PackageDetail, value: any) => {
                  if (onUpdatePackages) {
                    onUpdatePackages(packages.map(p => p.id === pkg.id ? { ...p, [field]: value } : p));
                  }
                };

                return (
                  <div className="space-y-6 text-sm">
                    {/* KEBERANGKATAN */}
                    <div className="bg-white border rounded p-4 shadow-sm">
                      <h4 className="font-bold border-b pb-2 mb-3">🛫 Keberangkatan</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tanggal Keberangkatan</label>
                          <input type="text" value={pkg.departureDate} onChange={e => handleChange('departureDate', e.target.value)} className="w-full p-2 border rounded focus:ring-1 focus:ring-[#D4AF37]" placeholder="Misal: 11 Juni 2026" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Maskapai</label>
                          <input type="text" value={pkg.departureFlightCode} onChange={e => handleChange('departureFlightCode', e.target.value)} className="w-full p-2 border rounded focus:ring-1 focus:ring-[#D4AF37]" placeholder="Misal: SV819" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Rute Penerbangan</label>
                          <input type="text" value={pkg.departureFlightRoute} onChange={e => handleChange('departureFlightRoute', e.target.value)} className="w-full p-2 border rounded focus:ring-1 focus:ring-[#D4AF37]" placeholder="Misal: CGK - JED" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Jam Takeoff & Landing</label>
                          <input type="text" value={pkg.departureTimeRange} onChange={e => handleChange('departureTimeRange', e.target.value)} className="w-full p-2 border rounded focus:ring-1 focus:ring-[#D4AF37]" placeholder="Misal: 17:30 - 23:00" />
                        </div>
                      </div>
                    </div>

                    {/* KEPULANGAN */}
                    <div className="bg-white border rounded p-4 shadow-sm">
                      <h4 className="font-bold border-b pb-2 mb-3">🛬 Kepulangan</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tanggal Kepulangan</label>
                          <input type="text" value={pkg.returnDate} onChange={e => handleChange('returnDate', e.target.value)} className="w-full p-2 border rounded focus:ring-1 focus:ring-[#D4AF37]" placeholder="Misal: 19 Juni 2026" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Maskapai</label>
                          <input type="text" value={pkg.returnFlightCode} onChange={e => handleChange('returnFlightCode', e.target.value)} className="w-full p-2 border rounded focus:ring-1 focus:ring-[#D4AF37]" placeholder="Misal: SV818" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Rute Penerbangan</label>
                          <input type="text" value={pkg.returnFlightRoute} onChange={e => handleChange('returnFlightRoute', e.target.value)} className="w-full p-2 border rounded focus:ring-1 focus:ring-[#D4AF37]" placeholder="Misal: JED - CGK" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Jam Takeoff & Landing</label>
                          <input type="text" value={pkg.returnTimeRange} onChange={e => handleChange('returnTimeRange', e.target.value)} className="w-full p-2 border rounded focus:ring-1 focus:ring-[#D4AF37]" placeholder="Misal: 01:55 - 16:00" />
                        </div>
                      </div>
                    </div>

                    {/* JAMAAH & PAKET */}
                    <div className="bg-white border rounded p-4 shadow-sm">
                      <h4 className="font-bold border-b pb-2 mb-3">👥 Data Jamaah & Hotel</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Total Jamaah Keseluruhan</label>
                            <input type="number" value={pkg.totalJamaah} onChange={e => handleChange('totalJamaah', parseInt(e.target.value) || 0)} className="w-full p-2 border rounded focus:ring-1 focus:ring-[#D4AF37]" placeholder="0" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Jumlah Per Masing-masing Paket</label>
                            <input type="text" value={pkg.jamaahPerPackage} onChange={e => handleChange('jamaahPerPackage', e.target.value)} className="w-full p-2 border rounded focus:ring-1 focus:ring-[#D4AF37]" placeholder="Misal: Sapphire: 20 Jamaah, Ruby: 30" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Hotel Masing-masing Paket</label>
                          <textarea rows={3} value={pkg.hotelDetails} onChange={e => handleChange('hotelDetails', e.target.value)} className="w-full p-2 border rounded focus:ring-1 focus:ring-[#D4AF37]" placeholder="Misal: Hotel Sapphire: Al Marwa (Makkah), Maden Rawdah (Madinah)..." />
                        </div>
                      </div>
                    </div>

                    {/* MEALS & PIC */}
                    <div className="bg-white border rounded p-4 shadow-sm">
                      <h4 className="font-bold border-b pb-2 mb-3">🍽️ Meals & Person In Charge</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Meals Kedatangan</label>
                          <input type="text" value={pkg.arrivalMeals} onChange={e => handleChange('arrivalMeals', e.target.value)} className="w-full p-2 border rounded focus:ring-1 focus:ring-[#D4AF37]" placeholder="Misal: Breakfast: Albaik + Nasi, Lunch at Hotel: Mealbox" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Meals Kepulangan</label>
                          <input type="text" value={pkg.returnMeals} onChange={e => handleChange('returnMeals', e.target.value)} className="w-full p-2 border rounded focus:ring-1 focus:ring-[#D4AF37]" placeholder="Misal: Dinner: Mealbox, Breakfast: Mealbox" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tour Leader (TL)</label>
                          <input type="text" value={pkg.tourLeader} onChange={e => handleChange('tourLeader', e.target.value)} className="w-full p-2 border rounded focus:ring-1 focus:ring-[#D4AF37]" placeholder="Nama Tour Leader" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mutthawif Pembimbing</label>
                          <input type="text" value={pkg.mutawwifName} onChange={e => handleChange('mutawwifName', e.target.value)} className="w-full p-2 border rounded focus:ring-1 focus:ring-[#D4AF37]" placeholder="Nama Muthawif" />
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>
            
            <div className="p-4 bg-white border-t border-slate-200 flex justify-end shrink-0">
              <button 
                onClick={() => setIsEditingPackage(false)}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Simpan & Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
