import React, { useState } from 'react';
import { Calendar, Plus, Edit2, Trash2, X, Check, Clock, MapPin, ListCollapse, Coffee, MoreVertical } from 'lucide-react';
import { INITIAL_6_GROUPS_ITINERARIES } from '../data/initialItineraries';

export interface ItineraryItem {
  id: string;
  groupName: string;
  dayNo: number;
  date: string;
  timeRange: string;
  activityTitle: string;
  location: string;
  notes?: string;
  muthawifInCharge?: string;
}

interface ManagerItineraryProps {
  itineraries: ItineraryItem[];
  onUpdateItineraryList: (newList: ItineraryItem[]) => void;
  groups: string[];
}

export default function ManagerItinerary({ itineraries, onUpdateItineraryList, groups }: ManagerItineraryProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  
  // Create / Input Sub-panel
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState(groups[0] || 'Umroh Reguler 11 Juni 2026 (Madinah Awal)');
  const [dayNo, setDayNo] = useState(1);
  const [date, setDate] = useState('2026-05-24');
  const [timeRange, setTimeRange] = useState('08:00 - 12:00 AST');
  const [activityTitle, setActivityTitle] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [muthawifInCharge, setMuthawifInCharge] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [editDayNo, setEditDayNo] = useState(1);
  const [editDate, setEditDate] = useState('');
  const [editTimeRange, setEditTimeRange] = useState('');
  const [editActivityTitle, setEditActivityTitle] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editMuthawif, setEditMuthawif] = useState('');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityTitle.trim() || !location.trim()) {
      alert('Judul Kegiatan & Lokasi harus diisi!');
      return;
    }

    const newItem: ItineraryItem = {
      id: `iti-${Date.now()}`,
      groupName,
      dayNo: Number(dayNo),
      date,
      timeRange: timeRange.trim(),
      activityTitle: activityTitle.trim(),
      location: location.trim(),
      notes: notes.trim() || undefined,
      muthawifInCharge: muthawifInCharge.trim() || undefined
    };

    onUpdateItineraryList([...itineraries, newItem]);
    setIsModalOpen(false);

    // reset
    setActivityTitle('');
    setLocation('');
    setNotes('');
    setMuthawifInCharge('');
  };

  const handleEditInit = (item: ItineraryItem) => {
    setEditingId(item.id);
    setEditGroupName(item.groupName);
    setEditDayNo(item.dayNo);
    setEditDate(item.date);
    setEditTimeRange(item.timeRange);
    setEditActivityTitle(item.activityTitle);
    setEditLocation(item.location);
    setEditNotes(item.notes || '');
    setEditMuthawif(item.muthawifInCharge || '');
  };

  const handleSaveEdit = (id: string) => {
    if (!editActivityTitle.trim() || !editLocation.trim()) {
      alert('Activity Title and Location cannot be empty.');
      return;
    }

    const updated = itineraries.map(item => {
      if (item.id === id) {
        return {
          ...item,
          groupName: editGroupName,
          dayNo: Number(editDayNo),
          date: editDate,
          timeRange: editTimeRange.trim(),
          activityTitle: editActivityTitle.trim(),
          location: editLocation.trim(),
          notes: editNotes.trim() || undefined,
          muthawifInCharge: editMuthawif.trim() || undefined
        };
      }
      return item;
    });

    onUpdateItineraryList(updated);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const filtered = itineraries.filter(item => item.id !== id);
    onUpdateItineraryList(filtered);
  };

  const filteredItinerary = itineraries
    .filter(item => selectedGroup === 'All' || item.groupName === selectedGroup)
    .sort((a, b) => {
      // Sort chronologically by date first
      const dateComparison = a.date.localeCompare(b.date);
      if (dateComparison !== 0) {
        return dateComparison;
      }
      
      // Extract approximate starting minutes from timeRange (e.g. "08:00 - 11:30 AST")
      const extractMinutes = (timeStr: string) => {
        const match = timeStr.match(/(\d{2}):(\d{2})/);
        if (match) {
          return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
        }
        return 9999; // Fallback to end of day if no formatted time sequence
      };

      const timeA = extractMinutes(a.timeRange);
      const timeB = extractMinutes(b.timeRange);

      if (timeA !== timeB) {
        return timeA - timeB;
      }

      // Fallback further to Day Number if dates & times are equal
      return a.dayNo - b.dayNo;
    });

  return (
    <div className="space-y-4" id="manager-itinerary-com">
      {/* Header card with Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-200 gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Modul Itinerary</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-4 py-1.5 bg-[#1A1A1A] hover:bg-black text-[#D4AF37] border border-[#D4AF37]/35 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Kegiatan</span>
          </button>
        </div>
      </div>

      {/* Group dropdown selective filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="max-w-md text-left">
          <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5 flex items-center gap-1">
            <span>🔍</span> Filter Berdasarkan Nama Grup:
          </label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
          >
            <option value="All">Semua Rombongan / Grup</option>
            {groups.map((g, idx) => (
              <option key={idx} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ITINERARY TIMELINE CARDS or TABLE VIEW */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden" id="itinerary-table-container">
        {filteredItinerary.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto text-xs min-w-[800px] sm:min-w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-550 uppercase font-black text-[10px] tracking-wider">
                  <th className="py-3 px-4 w-36">Hari & Grup</th>
                  <th className="py-3 px-4 w-44">Tanggal / Jam</th>
                  <th className="py-3 px-4">Agenda Kegiatan & Lokasi</th>
                  <th className="py-3 px-4 w-60">Muthawif & Catatan Khusus</th>
                  <th className="py-3 px-4 w-28 text-center">Aksi Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredItinerary.map((item) => {
                  const isEditing = editingId === item.id;
                  
                  if (isEditing) {
                    return (
                      <tr key={item.id} className="bg-amber-50/60 font-semibold align-top animate-fade-in">
                        {/* Day indicator */}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-rose-500 block">Hari Ke-</label>
                            <input
                              type="number"
                              min={1}
                              value={editDayNo}
                              onChange={(e) => setEditDayNo(Number(e.target.value))}
                              className="w-16 p-1 bg-white border border-slate-300 rounded font-bold text-center text-xs shadow-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                            />
                            <label className="text-[9px] uppercase font-bold text-slate-400 block pt-1.5">Grup</label>
                            <select
                              value={editGroupName}
                              onChange={(e) => setEditGroupName(e.target.value)}
                              className="w-full text-[10px] p-1 bg-white border border-slate-300 rounded font-bold max-w-[125px] focus:ring-1 focus:ring-amber-400 focus:outline-none"
                            >
                              {groups.map((grp, idx) => (
                                <option key={idx} value={grp}>{grp}</option>
                              ))}
                            </select>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="py-3 px-4">
                          <div className="space-y-1.5">
                            <div>
                              <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Tanggal</label>
                              <input
                                type="date"
                                value={editDate}
                                onChange={(e) => setEditDate(e.target.value)}
                                className="w-full p-1 bg-white border border-slate-300 rounded font-mono font-bold text-[11px] focus:ring-1 focus:ring-amber-400 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Jam Kegiatan</label>
                              <input
                                type="text"
                                value={editTimeRange}
                                onChange={(e) => setEditTimeRange(e.target.value)}
                                placeholder="08:00 - 12:00 AST"
                                className="w-full p-1 bg-white border border-slate-300 rounded font-mono text-[11px] focus:ring-1 focus:ring-amber-400 focus:outline-none"
                              />
                            </div>
                          </div>
                        </td>

                        {/* Agenda & Location */}
                        <td className="py-3 px-4">
                          <div className="space-y-1.5">
                            <div>
                              <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Nama Program Agenda</label>
                              <input
                                type="text"
                                value={editActivityTitle}
                                onChange={(e) => setEditActivityTitle(e.target.value)}
                                placeholder="Uraian Kegiatan"
                                className="w-full p-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Lokasi / Sektor Sinergi</label>
                              <input
                                type="text"
                                value={editLocation}
                                onChange={(e) => setEditLocation(e.target.value)}
                                placeholder="Lokasi Kegiatan"
                                className="w-full p-1 bg-white border border-slate-300 rounded text-xs font-semibold focus:ring-1 focus:ring-amber-400 focus:outline-none"
                              />
                            </div>
                          </div>
                        </td>

                        {/* Muthawif & Notes */}
                        <td className="py-3 px-4">
                          <div className="space-y-1.5">
                            <div>
                              <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Muthawif Pembimbing</label>
                              <input
                                type="text"
                                value={editMuthawif}
                                onChange={(e) => setEditMuthawif(e.target.value)}
                                placeholder="👤 Ust. Fulan"
                                className="w-full p-1 bg-white border border-slate-300 rounded text-xs font-bold text-amber-800 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Catatan Logistik Lapangan</label>
                              <textarea
                                rows={1}
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                placeholder="Tambahan info bus, koper, drop katering..."
                                className="w-full p-1 bg-white border border-slate-300 rounded text-[11px] focus:ring-1 focus:ring-amber-400 focus:outline-none"
                              />
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex flex-col gap-1.5 items-center justify-center pt-2">
                            <button
                              onClick={() => handleSaveEdit(item.id)}
                              className="w-full max-w-[80px] px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Simpan</span>
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="w-full max-w-[80px] px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1"
                            >
                              <X className="w-3 h-3" />
                              <span>Batal</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/45 text-slate-750 font-semibold align-top transition-colors group">
                      {/* Hari & Grup */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 text-[9px] font-black bg-amber-50 text-amber-800 rounded border border-amber-200 uppercase tracking-wider inline-block">
                            HARI ke-{item.dayNo}
                          </span>
                          <div className="text-[10px] text-slate-500 font-extrabold leading-tight max-w-[125px] line-clamp-3 hover:text-slate-900" title={item.groupName}>
                            {item.groupName}
                          </div>
                        </div>
                      </td>

                      {/* Tanggal & Waktu */}
                      <td className="py-3 px-4">
                        <div className="space-y-1 text-[11px]">
                          <div className="flex items-center gap-1 font-bold text-slate-800">
                            <span>📅</span>
                            <span>{item.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-550 bg-slate-100 rounded px-1.5 py-0.5 w-fit font-mono font-bold tracking-tight">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{item.timeRange}</span>
                          </div>
                        </div>
                      </td>

                      {/* Agenda & Lokasi */}
                      <td className="py-3 px-4">
                        <div className="space-y-1.5 max-w-sm">
                          <div className="font-extrabold text-[#111111] text-xs sm:text-[12px] leading-snug">
                            {item.activityTitle}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5 w-fit">
                            <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                            <span>Sektor: <strong className="text-slate-850 font-black">{item.location}</strong></span>
                          </div>
                        </div>
                      </td>

                      {/* Muthawif & Catatan */}
                      <td className="py-3 px-4 text-[11px]">
                        <div className="space-y-1.5">
                          <span className="inline-flex items-center gap-1 font-bold text-amber-800 text-[10px] bg-amber-50/70 border border-amber-100 px-1.5 py-0.5 rounded-md">
                            👤 {item.muthawifInCharge || 'Ops Lapangan Ground'}
                          </span>
                          {item.notes ? (
                            <div className="text-[10px] text-slate-600 leading-normal pl-1 border-l-2 border-slate-200 italic font-medium">
                              {item.notes}
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-400 italic">Tidak ada instruksi logistik khusus.</div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center overflow-visible relative">
                        <div className="inline-block text-left">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdownId(activeDropdownId === item.id ? null : item.id);
                            }}
                            className="p-1 hover:bg-slate-150 text-slate-500 hover:text-slate-900 border border-slate-100 hover:border-slate-300 rounded-md transition-all cursor-pointer shadow-3xs"
                            title="Pilihan Aksi"
                          >
                            <MoreVertical className="w-4 h-4 text-slate-500" />
                          </button>

                          {activeDropdownId === item.id && (
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
                                    handleEditInit(item);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-1.5 font-sans"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
                                  <span>Edit Kegiatan</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDropdownId(null);
                                    handleDelete(item.id);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center gap-1.5 font-sans"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Hapus Kegiatan</span>
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
        ) : (
          <div className="p-10 text-center text-slate-450 text-xs">
            Belum ada agenda kegiatan / itinerary dalam rombongan grup ini.
          </div>
        )}
      </div>

      {/* CREATE NEW ITINERARY DIALOG MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="px-4 py-3 bg-[#1A1A1A] text-white flex items-center justify-between">
              <span className="font-extrabold text-xs text-[#D4AF37] uppercase">Tambah Kegiatan Rombongan</span>
              <button onClick={() => setIsModalOpen(false)} className="text-white">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleAddActivity} className="p-4 space-y-3 text-xs font-semibold text-left">
              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">Rombongan Grup</label>
                <select
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-bold"
                >
                  {groups.map((g, idx) => (
                    <option key={idx} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Hari ke- (Day Number)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={dayNo}
                    onChange={(e) => setDayNo(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Waktu Kegiatan (AST)</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 08:00 - 11:30 AST"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">Tanggal Masehi / Arab</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">Judul Agenda / Program Kerja</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mengambil Miqat di Bir Ali & Ihram Mandiri"
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Koordinator / Muthawif</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ust. Malik, Lc"
                    value={muthawifInCharge}
                    onChange={(e) => setMuthawifInCharge(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">Sektor Lokasi Fisik</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bir Ali Madinah"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">Keterangan / Catatan Kebutuhan Logisitik (Opsional)</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Semua jamaah sudah memakai kain ihram bersih, koper besar standby dikonfirmasi pihak porter..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="flex justify-end gap-1.5 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 rounded text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-black border border-[#D4AF37]/35 text-[#D4AF37] rounded font-bold"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
