import React, { useState } from 'react';
import { Users, UserPlus, Trash2, Edit2, X, Check, Eye, EyeOff, Shield, MoreVertical } from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  username: string;
  password?: string;
  status: 'Aktif' | 'Standby' | 'Cuti';
}

interface ManagerStaffTeamProps {
  teamMembers: TeamMember[];
  onUpdateTeamMembers: (newList: TeamMember[]) => void;
}

export default function ManagerStaffTeam({ teamMembers, onUpdateTeamMembers }: ManagerStaffTeamProps) {
  // Add modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Handling Makkah');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'Aktif' | 'Standby' | 'Cuti'>('Aktif');
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editStatus, setEditStatus] = useState<'Aktif' | 'Standby' | 'Cuti'>('Aktif');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) {
      alert('Nama dan Username tim wajib diisi.');
      return;
    }

    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      phone: phone.trim() || '+966 50 000 0000',
      username: username.toLowerCase().trim(),
      password: password.trim() || 'pass123',
      status
    };

    onUpdateTeamMembers([...teamMembers, newMember]);
    setIsModalOpen(false);

    // Reset input fields
    setName('');
    setPhone('');
    setUsername('');
    setPassword('');
    setRole('Handling Makkah');
    setStatus('Aktif');
  };

  const startEditing = (member: TeamMember) => {
    setEditingId(member.id);
    setEditName(member.name);
    setEditRole(member.role);
    setEditPhone(member.phone);
    setEditUsername(member.username);
    setEditPassword(member.password || 'secret123');
    setEditStatus(member.status);
  };

  const saveEdit = (id: string) => {
    if (!editName.trim() || !editUsername.trim()) {
      alert('Nama and Username cannot be empty.');
      return;
    }

    const updated = teamMembers.map(item => {
      if (item.id === id) {
        return {
          ...item,
          name: editName.trim(),
          role: editRole,
          phone: editPhone.trim(),
          username: editUsername.toLowerCase().trim(),
          password: editPassword.trim(),
          status: editStatus
        };
      }
      return item;
    });

    onUpdateTeamMembers(updated);
    setEditingId(null);
  };

  const deleteMember = (id: string) => {
    onUpdateTeamMembers(teamMembers.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4" id="manager-team-com">
      {/* Header element */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-200 gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="🔍 Cari nama atau wilayah tim..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          />
          {searchQuery && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-32 overflow-y-auto z-10 py-1 font-semibold text-[11px] text-slate-600">
              {teamMembers
                .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.role.toLowerCase().includes(searchQuery.toLowerCase()))
                .slice(0, 5)
                .map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSearchQuery(m.name)}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 truncate block cursor-pointer"
                  >
                    🎯 {m.name} ({m.role})
                  </button>
                ))
              }
            </div>
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-4 py-1.5 bg-[#1A1A1A] hover:bg-black text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Tambah Anggota Tim</span>
        </button>
      </div>

      {/* Grid listing team cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers
          .filter((member) => !searchQuery || member.name.toLowerCase().includes(searchQuery.toLowerCase()) || member.role.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((member) => {
            return (
              <div key={member.id} className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-2xs transition-all relative">
                {/* Corner badge state */}
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider ${
                    member.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    member.status === 'Standby' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    ● {member.status}
                  </span>
                </div>

                {/* Card visual profile */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 mb-3 text-xs leading-relaxed">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center text-lg font-bold uppercase select-none text-slate-700 shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-slate-900 truncate pr-16">{member.name}</h3>
                    <p className="text-[10px] uppercase font-bold text-[#A47F17]">{member.role}</p>
                  </div>
                </div>

                {/* Data listing of phone & credentials */}
                <div className="text-[11px] space-y-2 pb-3 mb-1 font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">WhatsApp HP:</span>
                    <span className="text-slate-800 font-mono">{member.phone}</span>
                  </div>

                  {/* Secure Username config */}
                  <div className="flex justify-between items-center py-0.5 bg-slate-50/60 px-1.5 rounded">
                    <span className="text-slate-400">Username:</span>
                    <span className="text-indigo-800 font-mono font-bold">@{member.username}</span>
                  </div>

                  {/* Secure Password config */}
                  <div className="flex justify-between items-center py-0.5 bg-slate-50/60 px-1.5 rounded">
                    <span className="text-slate-400">Password:</span>
                    <span className="text-slate-500 font-mono select-all">•••••••• (Klik Edit)</span>
                  </div>
                </div>

                {/* Action buttons footer */}
                <div className="flex justify-end gap-1.5 border-t border-slate-100 pt-3 text-[10px] relative overflow-visible">
                  <div className="relative inline-block text-left overflow-visible shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownId(activeDropdownId === member.id ? null : member.id);
                      }}
                      className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 rounded-md transition-all cursor-pointer shadow-3xs inline-flex items-center justify-center bg-white"
                      title="Pilihan Aksi"
                    >
                      <MoreVertical className="w-3.5 h-3.5 text-slate-500" />
                    </button>

                    {activeDropdownId === member.id && (
                      <>
                        <button
                          type="button"
                          className="fixed inset-0 z-30 cursor-default bg-transparent"
                          onClick={() => setActiveDropdownId(null)}
                        />
                        <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-40 text-left animate-in fade-in slide-in-from-top-1 duration-105">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveDropdownId(null);
                              startEditing(member);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-1.5 font-sans"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Ubah Password / Data</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveDropdownId(null);
                              deleteMember(member.id);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center gap-1.5 font-sans"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            <span>Hapus Anggota Tim</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* CREATE NEW TEAM MEMBER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-100 text-left">
            <div className="px-4 py-3 bg-[#1A1A1A] text-white flex justify-between items-center border-b border-[#D4AF37]/25">
              <span className="font-extrabold text-[#D4AF37] text-xs uppercase flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                <span>Pendaftaran Tim Baru</span>
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-white">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="p-4 space-y-3.5 text-xs font-semibold">
              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">Nama Lengkap Personel</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Faiz Al-Qarni"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-extrabold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">Wilayah Kerja</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-black text-slate-800"
                >
                  <option value="Handling Madinah">Handling Madinah</option>
                  <option value="Handling Makkah">Handling Makkah</option>
                  <option value="Handling Jeddah">Handling Jeddah</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">Nomor WhatsApp HP (Dengan kode negara)</label>
                <input
                  type="text"
                  placeholder="Contoh: +966 50 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-mono"
                />
              </div>

              {/* Login Credentials area */}
              <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 space-y-3">
                <p className="text-[10px] text-indigo-900 font-bold uppercase">🔐 SET ALKSA LOGIN CREDENTIALS</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] text-indigo-600 mb-0.5">USERNAME LOGIN</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. faiz_lapangan"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded font-mono font-bold text-indigo-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-indigo-600 mb-0.5">PASSWORD PIN</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="e.g. secret123"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-1.5 bg-white border border-slate-200 rounded font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-1.5 flex items-center pr-1 text-slate-400"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">Status Keaktifan Awal</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-black text-slate-800"
                >
                  <option value="Aktif">🟢 AKTIF DI LAPANGAN SAUDI</option>
                  <option value="Standby">🔵 STANDBY / BACKUP RIYADH</option>
                  <option value="Cuti">⚪ SEDANG CUTI / DINAS JAKARTA</option>
                </select>
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
                  Confirm Buat Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TEAM MEMBER MODAL (POP UP VIEW) */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-100 text-left">
            <div className="px-4 py-3 bg-[#1A1A1A] text-white flex justify-between items-center border-b border-[#D4AF37]/25">
              <span className="font-extrabold text-[#D4AF37] text-xs uppercase flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                <span>Ubah Data Tim</span>
              </span>
              <button onClick={() => setEditingId(null)} className="text-white">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                saveEdit(editingId);
              }} 
              className="p-4 space-y-3.5 text-xs font-semibold text-slate-800"
            >
              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">Nama Lengkap Personel</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-extrabold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">Wilayah Kerja</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-black text-slate-800"
                >
                  <option value="Handling Madinah">Handling Madinah</option>
                  <option value="Handling Makkah">Handling Makkah</option>
                  <option value="Handling Jeddah">Handling Jeddah</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">Nomor WhatsApp HP</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-mono text-slate-900"
                />
              </div>

              {/* Login Credentials area */}
              <div className="p-3 bg-indigo-50/55 rounded-lg border border-indigo-100 space-y-3">
                <p className="text-[10px] text-indigo-900 font-bold uppercase">🔐 EDIT LOGIN CREDENTIALS</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] text-indigo-600 mb-0.5">USERNAME LOGIN</label>
                    <input
                      type="text"
                      required
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded font-mono font-bold text-indigo-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-indigo-600 mb-0.5">PASSWORD PIN</label>
                    <input
                      type="text"
                      required
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded font-mono text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">Status Keaktifan</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-black text-slate-800"
                >
                  <option value="Aktif">🟢 AKTIF DI LAPANGAN SAUDI</option>
                  <option value="Standby">🔵 STANDBY / BACKUP RIYADH</option>
                  <option value="Cuti">⚪ SEDANG CUTI / DINAS JAKARTA</option>
                </select>
              </div>

              <div className="flex justify-end gap-1.5 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="px-3.5 py-1.5 bg-slate-100 rounded text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-black border border-[#D4AF37]/35 text-[#D4AF37] rounded font-bold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
