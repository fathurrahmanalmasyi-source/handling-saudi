import React, { useState, useEffect } from 'react';
import { Calendar, UserPlus, MapPin, Clock, Check, Plus, Tag, ShieldAlert, BadgeCheck, AlertTriangle, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { DutyTask } from '../types';
import { TeamMember } from './ManagerStaffTeam';

interface ManagerScheduleProps {
  tasks: DutyTask[];
  onAddTask: (newTask: Omit<DutyTask, 'id'>) => void;
  onToggleTaskStatus: (id: string) => void;
  groups: string[];
  teamMembers?: TeamMember[];
  onDeleteTask?: (id: string) => void;
  onUpdateTask?: (id: string, updatedTask: Partial<DutyTask>) => void;
  taskChecklists?: Record<string, string[]>;
  onUpdateTaskChecklists?: (updated: Record<string, string[]>) => void;
}

export default function ManagerSchedule({ 
  tasks, 
  onAddTask, 
  onToggleTaskStatus, 
  groups,
  teamMembers = [],
  onDeleteTask,
  onUpdateTask,
  taskChecklists = {},
  onUpdateTaskChecklists
}: ManagerScheduleProps) {
  const [handlingName, setHandlingName] = useState('Ahmad');
  const [showPetugasSuggestions, setShowPetugasSuggestions] = useState(false);
  const [roleTag, setRoleTag] = useState<'Check In Hotel' | 'Check Out Perpindahan Kota' | 'Check Out to Bandara' | 'City Tour' | 'Bandara Kedatangan' | 'Bandara Kepulangan'>('Check In Hotel');
  const [groupName, setGroupName] = useState(groups[0] || 'Umroh Reguler 11 Juni 2026 (Madinah Awal)');
  const [date, setDate] = useState('2026-05-24');
  const [timeRange, setTimeRange] = useState('08:00 - 13:00 AST');
  const [location, setLocation] = useState('Lobby Pullman Makkah');
  const [feedback, setFeedback] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editHandlingName, setEditHandlingName] = useState('Ahmad');
  const [editShowPetugasSuggestions, setEditShowPetugasSuggestions] = useState(false);
  const [editRoleTag, setEditRoleTag] = useState<'Check In Hotel' | 'Check Out Perpindahan Kota' | 'Check Out to Bandara' | 'City Tour' | 'Bandara Kedatangan' | 'Bandara Kepulangan'>('Check In Hotel');
  const [editGroupName, setEditGroupName] = useState('');
  const [editDate, setEditDate] = useState('2026-05-24');
  const [editTimeRange, setEditTimeRange] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Checklist management states
  const [selectedCategoryForChecklist, setSelectedCategoryForChecklist] = useState<'Check In Hotel' | 'Check Out Perpindahan Kota' | 'Check Out to Bandara' | 'City Tour' | 'Bandara Kedatangan' | 'Bandara Kepulangan'>('Check In Hotel');
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    const currentItems = taskChecklists[selectedCategoryForChecklist] || [];
    const updated = {
      ...taskChecklists,
      [selectedCategoryForChecklist]: [...currentItems, newChecklistItem.trim()]
    };
    if (onUpdateTaskChecklists) {
      onUpdateTaskChecklists(updated);
    }
    setNewChecklistItem('');
  };

  const handleRemoveChecklistItem = (indexToRemove: number) => {
    const currentItems = taskChecklists[selectedCategoryForChecklist] || [];
    const updated = {
      ...taskChecklists,
      [selectedCategoryForChecklist]: currentItems.filter((_, idx) => idx !== indexToRemove)
    };
    if (onUpdateTaskChecklists) {
      onUpdateTaskChecklists(updated);
    }
  };

  const handleEditInit = (task: DutyTask) => {
    setEditingId(task.id);
    setEditHandlingName(task.handlingName);
    setEditRoleTag(task.roleTag);
    setEditGroupName(task.groupName);
    setEditDate(task.date);
    setEditTimeRange(task.timeRange);
    setEditLocation(task.location);
  };

  const handleSaveEdit = (id: string) => {
    if (!editLocation.trim() || !editTimeRange.trim()) {
      alert('Jam dan lokasi tidak boleh kosong.');
      return;
    }
    if (onUpdateTask) {
      onUpdateTask(id, {
        handlingName: editHandlingName,
        roleTag: editRoleTag,
        groupName: editGroupName,
        date: editDate,
        timeRange: editTimeRange.trim(),
        location: editLocation.trim()
      });
    }
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (onDeleteTask) {
      onDeleteTask(id);
    }
  };

  // Automatically sync handlingName default values with the active teamMembers
  useEffect(() => {
    if (teamMembers && teamMembers.length > 0) {
      const found = teamMembers.some(member => member.name === handlingName);
      if (!found) {
        setHandlingName(teamMembers[0].name);
      }
    }
  }, [teamMembers]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !timeRange.trim()) {
      alert('Mohon isi jam penugasan dan lokasi tugas.');
      return;
    }

    onAddTask({
      handlingName,
      roleTag,
      groupName,
      date,
      timeRange,
      location: location.trim(),
      status: 'Belum Selesai'
    });

    setLocation('');
    setTimeRange('08:00 - 12:00 AST');
    setFeedback('Penugasan Tim Lapangan Berhasil Disimpan!');
    setTimeout(() => setFeedback(''), 4000);
  };

  const getTagStyle = (tag: string) => {
    switch (tag) {
      case 'Check In Hotel': return 'bg-blue-100 text-blue-900 border border-blue-250 font-bold';
      case 'Check Out Perpindahan Kota': return 'bg-amber-100 text-amber-900 border border-amber-250 font-bold';
      case 'Check Out to Bandara': return 'bg-rose-105 text-rose-900 border border-rose-250 font-bold';
      case 'City Tour': return 'bg-emerald-100 text-emerald-900 border border-emerald-250 font-bold';
      case 'Bandara Kedatangan': return 'bg-cyan-100 text-cyan-950 border border-cyan-250 font-bold';
      case 'Bandara Kepulangan': return 'bg-indigo-100 text-indigo-900 border border-indigo-250 font-bold';
      default: return 'bg-slate-100 text-slate-800 border border-slate-205';
    }
  };

  return (
    <div className="space-y-4" id="manager-schedule-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" id="sch-layout">
        
        {/* Left column: Assign task Form */}
        <div className="lg:col-span-4 bg-white p-4 rounded-lg border border-slate-200 h-fit">
          <div className="border-b border-slate-100 pb-2 mb-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
              <UserPlus className="w-4.5 h-4.5 text-[#D4AF37]" />
              <span>Tambah Tugas Baru</span>
            </h3>
          </div>

          {feedback && (
            <div className="p-2 bg-emerald-50 text-emerald-800 text-[11px] font-semibold rounded mb-3">
              {feedback}
            </div>
          )}

          <form onSubmit={handleCreateTask} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">PETUGAS</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ketik & cari nama petugas..."
                  value={handlingName}
                  onChange={(e) => {
                    setHandlingName(e.target.value);
                    setShowPetugasSuggestions(true);
                  }}
                  onFocus={() => setShowPetugasSuggestions(true)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded font-bold text-slate-800 focus:outline-none"
                />
                {showPetugasSuggestions && (
                  <>
                    <div 
                      className="fixed inset-0 z-20 bg-transparent" 
                      onClick={() => setShowPetugasSuggestions(false)} 
                    />
                    <div className="absolute z-30 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto py-1 divide-y divide-slate-50 animate-in fade-in duration-100">
                      {(teamMembers && teamMembers.length > 0 ? teamMembers : [
                        { id: '1', name: 'Ahmad', role: 'Makkah Lead' },
                        { id: '2', name: 'Faiz', role: 'Madinah Lead' },
                        { id: '3', name: 'Tariq', role: 'Jeddah Airport Handling' }
                      ])
                        .filter(member => !handlingName || member.name.toLowerCase().includes(handlingName.toLowerCase()))
                        .map(member => (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => {
                              setHandlingName(member.name);
                              setShowPetugasSuggestions(false);
                            }}
                            className="w-full text-left p-2 hover:bg-slate-50 text-xs font-bold text-slate-800 flex justify-between cursor-pointer"
                          >
                            <span>👨‍✈️ {member.name}</span>
                            <span className="text-[9px] text-slate-400 capitalize">{member.role || 'Staff'}</span>
                          </button>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">JENIS TUGAS</label>
                <select
                  value={roleTag}
                  onChange={(e) => setRoleTag(e.target.value as any)}
                  className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-205 rounded font-bold text-slate-800 focus:outline-none"
                >
                  <option value="Check In Hotel">Check In Hotel</option>
                  <option value="Check Out Perpindahan Kota">Check Out Perpindahan Kota</option>
                  <option value="Check Out to Bandara">Check Out to Bandara</option>
                  <option value="City Tour">City Tour</option>
                  <option value="Bandara Kedatangan">Bandara Kedatangan</option>
                  <option value="Bandara Kepulangan">Bandara Kepulangan</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">TANGGAL</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded text-slate-800 font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">PILIH NAMA GRUP</label>
              <select
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none"
              >
                {groups.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 font-mono">JAM (AST)</label>
              <input
                type="text"
                required
                placeholder="Misal: 08:00 - 13:00 AST"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded font-mono text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">KETERANGAN</label>
              <textarea
                rows={4}
                required
                placeholder="Masukkan rincian keterangan lengkap tugas..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded text-slate-850 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#1A1A1A] hover:bg-black text-[#D4AF37] font-bold rounded text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#D4AF37]/20"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Simpan & Kirim Tugas</span>
            </button>
          </form>
        </div>

        {/* Right column: Timetable Schedule lists */}
        <div className="lg:col-span-8 bg-white p-4 rounded-lg border border-slate-200">
          <div className="border-b border-slate-100 pb-2 mb-3 flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Daftar Agenda Lapangan</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Centang jika penugasan sudah diselesaikan oleh tim harian.</p>
            </div>
            
            <div className="flex gap-1.5 text-[9px] bg-slate-50 p-1 rounded border border-slate-150">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
                <span className="font-bold text-slate-500">Selesai</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 block"></span>
                <span className="font-bold text-slate-500">Berjalan</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-300 block"></span>
                <span className="font-bold text-slate-500">BelumSelesai</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5" id="schedule-running-cards">
            {tasks.map((task) => {
              const isEditing = editingId === task.id;
              if (isEditing) {
                return (
                  <div key={task.id} className="p-3.5 rounded-lg border bg-[#D4AF37]/5 border-amber-300 space-y-2.5 shadow-3xs" id={`edit-schedule-${task.id}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-bold">
                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Petugas</label>
                        <select
                          value={editHandlingName}
                          onChange={(e) => setEditHandlingName(e.target.value)}
                          className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded font-bold"
                        >
                          {teamMembers.length > 0 ? (
                            teamMembers.map(tm => (
                              <option key={tm.id} value={tm.name}>{tm.name}</option>
                            ))
                          ) : (
                            <>
                              <option value="Ahmad">Ahmad</option>
                              <option value="Faiz">Faiz</option>
                              <option value="Tariq">Tariq</option>
                            </>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Jenis Tugas</label>
                        <select
                          value={editRoleTag}
                          onChange={(e) => setEditRoleTag(e.target.value as any)}
                          className="w-full text-xs p-1.5 bg-white border border-slate-205 rounded font-bold text-slate-800"
                        >
                          <option value="Check In Hotel">Check In Hotel</option>
                          <option value="Check Out Perpindahan Kota">Check Out Perpindahan Kota</option>
                          <option value="Check Out to Bandara">Check Out to Bandara</option>
                          <option value="City Tour">City Tour</option>
                          <option value="Bandara Kedatangan">Bandara Kedatangan</option>
                          <option value="Bandara Kepulangan">Bandara Kepulangan</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-bold">
                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Rombongan</label>
                        <select
                          value={editGroupName}
                          onChange={(e) => setEditGroupName(e.target.value)}
                          className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded font-semibold"
                        >
                          {groups.map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Tanggal</label>
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-bold">
                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Jam (AST)</label>
                        <input
                          type="text"
                          value={editTimeRange}
                          onChange={(e) => setEditTimeRange(e.target.value)}
                          className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Lokasi</label>
                        <input
                          type="text"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded font-bold"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-1.5 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleSaveEdit(task.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>SIMPAN</span>
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-slate-150 hover:bg-slate-200 text-slate-700 font-bold rounded text-[10px] cursor-pointer"
                      >
                        BATAL
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div 
                  key={task.id} 
                  className={`p-3 rounded-lg border transition-all ${
                    task.status === 'Selesai' 
                      ? 'bg-slate-50/70 border-slate-200 opacity-80' 
                      : task.status === 'Sedang Berjalan'
                      ? 'bg-[#D4AF37]/5 border-[#D4AF37]/30 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${getTagStyle(task.roleTag)}`}>
                          {task.roleTag}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 font-mono">
                          🗓️ {task.date}
                        </span>
                      </div>
                      
                      <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">
                        {task.groupName}
                      </h4>

                      {/* Metadata line */}
                      <div className="flex flex-wrap items-center gap-y-0.5 gap-x-3 text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{task.location}</span>
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{task.timeRange}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 shrink-0">
                      <div className="mr-2">
                        <span className="text-[9px] text-slate-400 block font-bold">PETUGAS</span>
                        <span className="text-[10px] font-bold text-slate-850 bg-amber-50 px-1.5 py-0.5 rounded border border-[#D4AF37]/20">
                          👨‍✈️ {task.handlingName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onToggleTaskStatus(task.id)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            task.status === 'Selesai'
                              ? 'bg-emerald-50 text-emerald-850 hover:bg-emerald-100 border border-emerald-200'
                              : task.status === 'Sedang Berjalan'
                              ? 'bg-amber-50 text-amber-850 hover:bg-amber-100 border border-amber-200 animate-pulse'
                              : 'bg-slate-550 border border-slate-200 hover:bg-slate-100 bg-slate-50 text-slate-600'
                          }`}
                        >
                          {task.status === 'Selesai' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-700" />
                              <span>Selesai</span>
                            </>
                          ) : (
                            <span>Simulasi</span>
                          )}
                        </button>

                        <div className="relative inline-block text-left overflow-visible ml-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdownId(activeDropdownId === task.id ? null : task.id);
                            }}
                            className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 rounded-md transition-all cursor-pointer shadow-3xs"
                            title="Pilihan Aksi"
                          >
                            <MoreVertical className="w-4 h-4 text-slate-500" />
                          </button>

                          {activeDropdownId === task.id && (
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
                                    handleEditInit(task);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-1.5 font-sans"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                                  <span>Edit Jadwal</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDropdownId(null);
                                    handleDelete(task.id);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center gap-1.5 font-sans"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Hapus Jadwal</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-2.5 bg-slate-50 rounded border border-slate-200 flex items-start gap-1.5 text-slate-600">
            <ShieldAlert className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div className="text-[10px] font-medium text-slate-650 leading-normal">
              <strong>Notifikasi Tugas:</strong> Petugas harian akan mendapat pemberitahuan instan di handphone saat tugas baru ini disimpan.
            </div>
          </div>
        </div>
      </div>

      {/* 📋 INTEGRATABLE TASK CHECKLIST EDITOR */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-1.5">
            <BadgeCheck className="w-5 h-5 text-emerald-600" />
            <span>📋 Pengaturan SOP Checklist Kegiatan</span>
          </h3>
          <p className="text-xs text-slate-500">Edit daftar checklist kegiatan wajib yang harus diperiksa dan dicentang oleh petugas lapangan saat melapor presensi harian.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* List of categories */}
          <div className="md:col-span-1 border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 bg-slate-50/50">
            {['Check In Hotel', 'Check Out Perpindahan Kota', 'Check Out to Bandara', 'City Tour', 'Bandara Kedatangan', 'Bandara Kepulangan'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategoryForChecklist(cat as any)}
                className={`w-full text-left p-2.5 text-xs font-bold transition-all flex justify-between items-center ${
                  selectedCategoryForChecklist === cat 
                    ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-600 font-extrabold' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{cat}</span>
                <span className="px-1.5 py-0.5 bg-slate-200 text-slate-750 text-[10px] rounded-full font-black">
                  {taskChecklists[cat]?.length || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Checklist items in selected category */}
          <div className="md:col-span-2 border border-slate-200 p-4 rounded-lg bg-white space-y-3">
            <h4 className="text-xs font-black text-slate-900 border-b pb-1.5 uppercase flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Daftar Pemeriksaan: {selectedCategoryForChecklist}</span>
            </h4>

            {/* List */}
            <ul className="space-y-2 max-h-[220px] overflow-y-auto">
              {(taskChecklists[selectedCategoryForChecklist] || []).length > 0 ? (
                (taskChecklists[selectedCategoryForChecklist] || []).map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-150 text-[11px] font-semibold text-slate-700">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      <span>{item}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveChecklistItem(idx)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded-full transition-colors cursor-pointer"
                      title="Hapus SOP Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))
              ) : (
                <div className="text-center text-slate-400 py-6 text-[10px] font-medium bg-slate-50 rounded-lg shadow-inner">
                  Belum ada item checklist di dalam kriteria tugas ini. Klik Tambah untuk membuat baru.
                </div>
              )}
            </ul>

            {/* Input field to add */}
            <div className="flex gap-2 border-t pt-3">
              <input
                type="text"
                placeholder="Tambah item pemeriksaan SOP baru..."
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                className="flex-1 text-xs bg-slate-50 border border-slate-250 rounded px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-[#D4AF37]"
                onKeyDown={(e) => e.key === 'Enter' && handleAddChecklistItem()}
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
