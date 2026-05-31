import React, { useState } from 'react';
import { HotelInfographic } from '../types';
import { Plus, Edit2, Trash2, Camera, Upload, X, MapPin, Wifi, Utensils, Watch, CheckCircle2, ChevronLeft } from 'lucide-react';

interface ManagerHotelInfoProps {
  hotelInfos: HotelInfographic[];
  onUpdateHotelInfos: (newHotelInfos: HotelInfographic[]) => void;
}

export default function ManagerHotelInfo({ hotelInfos, onUpdateHotelInfos }: ManagerHotelInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<HotelInfographic>>({});
  
  const [showPreview, setShowPreview] = useState<string | null>(null); // infographic ID

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setIsEditing(false);
  };

  const handleEdit = (hotel: HotelInfographic) => {
    setFormData(hotel);
    setEditingId(hotel.id);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus infografis hotel ini?')) {
      onUpdateHotelInfos(hotelInfos.filter(h => h.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.hotelName) {
      alert('Nama hotel harus diisi');
      return;
    }

    if (editingId) {
      onUpdateHotelInfos(hotelInfos.map(h => h.id === editingId ? { ...h, ...formData } as HotelInfographic : h));
    } else {
      const newHotel: HotelInfographic = {
        id: `hotel-${Date.now()}`,
        hotelName: formData.hotelName || '',
        city: formData.city || 'Makkah',
        restaurantInfo: formData.restaurantInfo || '',
        mealTimes: formData.mealTimes || '',
        receptionistInfo: formData.receptionistInfo || '',
        wifiInfo: formData.wifiInfo || '',
        hotelPhoto: formData.hotelPhoto || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
        restaurantPhoto: formData.restaurantPhoto || 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=800',
        receptionistPhoto: formData.receptionistPhoto || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800'
      };
      onUpdateHotelInfos([...hotelInfos, newHotel]);
    }
    resetForm();
  };

  const handleImageUpload = (field: keyof HotelInfographic, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 600; // downscale to max 600px
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.6); // 0.6 quality for small footprint
          setFormData(prev => ({ ...prev, [field]: compressed }));
        } else {
          setFormData(prev => ({ ...prev, [field]: reader.result as string }));
        }
      };
      img.src = reader.result as string;
    };
    if (file) reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 border-l-4 border-emerald-500 pl-3 uppercase">
            Direktori Infografis Hotel
          </h2>
          <p className="text-xs text-slate-500 mt-1 pl-4">Kelola infografis visual hotel (Restaurant, Resepsionis, WiFi) untuk panduan jamaah</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsEditing(true); }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Tambah Hotel Baru
        </button>
      </div>

      {!isEditing && !showPreview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotelInfos.map(hotel => (
            <div key={hotel.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-40 w-full relative">
                <img src={hotel.hotelPhoto} alt={hotel.hotelName} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold rounded">
                  {hotel.city}
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{hotel.hotelName}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Utensils className="w-3.5 h-3.5" />
                    <span className="truncate">{hotel.restaurantInfo || '-'}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => setShowPreview(hotel.id)}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    Lihat Infografis
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(hotel)} className="p-1.5 text-slate-400 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(hotel.id)} className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {hotelInfos.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="font-semibold">Belum ada data infografis hotel.</p>
              <p className="text-xs mt-1">Klik "Tambah Hotel Baru" untuk membuat infografis.</p>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
            <h3 className="font-bold text-[#D4AF37] uppercase">{editingId ? 'Edit Infografis Hotel' : 'Tambah Infografis Hotel'}</h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-6 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 border-b pb-2">📋 Informasi Dasar</h4>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nama Hotel</label>
                  <input type="text" value={formData.hotelName || ''} onChange={e => setFormData({...formData, hotelName: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-emerald-500" placeholder="Misal: Pullman ZamZam" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Kota</label>
                  <select value={formData.city || 'Makkah'} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-emerald-500">
                    <option value="Makkah">Makkah</option>
                    <option value="Madinah">Madinah</option>
                    <option value="Jeddah">Jeddah</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Informasi Resepsionis</label>
                  <textarea value={formData.receptionistInfo || ''} onChange={e => setFormData({...formData, receptionistInfo: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-emerald-500" placeholder="Lantai G, hubungi Ext 0..." rows={2} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Koneksi WiFi</label>
                  <textarea value={formData.wifiInfo || ''} onChange={e => setFormData({...formData, wifiInfo: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-emerald-500" placeholder="SSID: xxx, Password: xxx" rows={2} />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 border-b pb-2">🍽️ Informasi Restoran</h4>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nama & Lokasi Restoran</label>
                  <textarea value={formData.restaurantInfo || ''} onChange={e => setFormData({...formData, restaurantInfo: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-emerald-500" placeholder="Al Zahra Restaurant (Lantai 3)..." rows={2} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Jam Makan (Meal Times)</label>
                  <textarea value={formData.mealTimes || ''} onChange={e => setFormData({...formData, mealTimes: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-emerald-500" placeholder="Breakfast: 06:00-10:00..." rows={2} />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-bold text-slate-800">📸 Foto Dokumentasi Infografis</h4>
              <p className="text-[10px] text-slate-400">Pilih foto/gambar yang sesuai. Gambar akan otomatis ter-crop menyesuaikan layout template (1:1 Ratio disarankan).</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Foto Hotel */}
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <span className="block text-xs font-bold text-slate-700 mb-2">Foto / Fasad Hotel</span>
                  <div className="relative h-32 bg-slate-200 rounded-md overflow-hidden mb-3 group">
                    {(formData.hotelPhoto) ? (
                      <img src={formData.hotelPhoto} alt="Hotel" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <Camera className="w-8 h-8 mb-1 opacity-50" />
                        <span className="text-[10px]">Belum ada foto</span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white">
                      <Upload className="w-5 h-5 mr-1" /> <span className="text-xs font-bold">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload('hotelPhoto', e.target.files[0])} />
                    </label>
                  </div>
                </div>

                {/* Foto Restoran */}
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <span className="block text-xs font-bold text-slate-700 mb-2">Foto Restoran (Makan)</span>
                  <div className="relative h-32 bg-slate-200 rounded-md overflow-hidden mb-3 group">
                    {(formData.restaurantPhoto) ? (
                      <img src={formData.restaurantPhoto} alt="Restaurant" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <Camera className="w-8 h-8 mb-1 opacity-50" />
                        <span className="text-[10px]">Belum ada foto</span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white">
                      <Upload className="w-5 h-5 mr-1" /> <span className="text-xs font-bold">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload('restaurantPhoto', e.target.files[0])} />
                    </label>
                  </div>
                </div>

                {/* Foto Resepsionis */}
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <span className="block text-xs font-bold text-slate-700 mb-2">Foto Resepsionis / Lobi</span>
                  <div className="relative h-32 bg-slate-200 rounded-md overflow-hidden mb-3 group">
                    {(formData.receptionistPhoto) ? (
                      <img src={formData.receptionistPhoto} alt="Receptionist" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <Camera className="w-8 h-8 mb-1 opacity-50" />
                        <span className="text-[10px]">Belum ada foto</span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white">
                      <Upload className="w-5 h-5 mr-1" /> <span className="text-xs font-bold">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload('receptionistPhoto', e.target.files[0])} />
                    </label>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 text-right border-t">
            <button onClick={handleSave} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow flex items-center gap-2 ml-auto inline-flex">
              <CheckCircle2 className="w-4 h-4" /> Simpan Infografis
            </button>
          </div>
        </div>
      )}

      {/* PREVIEW INFOGRAPHIC MODAL */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8">
            {(() => {
              const hotel = hotelInfos.find(h => h.id === showPreview);
              if (!hotel) return null;
              
              return (
                <div>
                  {/* Print Button / Close */}
                  <div className="absolute top-4 right-4 z-10 flex gap-2 print:hidden">
                    <button 
                      onClick={() => {
                        const originalTitle = document.title;
                        document.title = `Info Hotel ${hotel.hotelName}`;
                        
                        const printableArea = document.getElementById('infographic-print-area');
                        let printContainer = document.getElementById('print-container');
                        
                        if (printableArea) {
                          if (!printContainer) {
                            printContainer = document.createElement('div');
                            printContainer.id = 'print-container';
                            document.body.appendChild(printContainer);
                          }
                          
                          printContainer.innerHTML = printableArea.innerHTML;
                          
                          window.setTimeout(() => {
                            window.print();
                            if (printContainer) printContainer.innerHTML = '';
                            document.title = originalTitle;
                          }, 100);
                        } else {
                          window.print();
                          document.title = originalTitle;
                        }
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold cursor-pointer"
                    >
                      Export / Print
                    </button>
                    <button 
                      onClick={() => setShowPreview(null)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Infographic Content to Print */}
                  <div id="infographic-print-area" className="w-full bg-slate-50 print:bg-white text-slate-800">
                    <div className="p-8 sm:p-10 space-y-8" style={{ width: '100%', maxWidth: '210mm', minHeight: '297mm', margin: '0 auto', backgroundColor: 'white' }}>
                      
                      {/* Header */}
                      <div className="text-center space-y-2 border-b-2 border-emerald-800 pb-6">
                        <h1 className="text-3xl font-black uppercase text-emerald-900 tracking-tight">INFORMASI HOTEL</h1>
                        <h2 className="text-2xl font-black text-[#D4AF37] uppercase">{hotel.hotelName}</h2>
                        <div className="inline-flex items-center gap-1.5 text-sm font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full uppercase">
                          <MapPin className="w-4 h-4" /> {hotel.city}
                        </div>
                      </div>

                      {/* Main Photos Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Left column (Hero Hotel Photo) */}
                        <div className="col-span-2">
                          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-md">
                            <img src={hotel.hotelPhoto} alt="Fasad Hotel" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                              <span className="text-white font-black text-xl drop-shadow-md">FASAD HOTEL</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                        
                        {/* Restoran & Meal Times */}
                        <div className="flex flex-col rounded-2xl overflow-hidden border border-emerald-100 shadow-sm bg-white">
                          <div className="h-40 w-full relative shrink-0">
                            <img src={hotel.restaurantPhoto} alt="Restoran" className="w-full h-full object-cover" />
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-emerald-900 font-black text-xs flex items-center gap-1 shadow-sm">
                              <Utensils className="w-3.5 h-3.5" /> AREA MAKAN
                            </div>
                          </div>
                          <div className="p-5 bg-emerald-50/50 flex-1 flex flex-col justify-center space-y-4">
                            <div>
                              <h4 className="text-sm font-black text-emerald-900 mb-1">RESTORAN</h4>
                              <p className="text-sm font-bold text-slate-700 leading-snug">{hotel.restaurantInfo}</p>
                            </div>
                            <div className="border-t border-emerald-200/50 pt-3">
                              <h4 className="text-xs font-black text-emerald-900 mb-1 flex items-center gap-1"><Watch className="w-3.5 h-3.5" /> JAM MAKAN</h4>
                              <p className="text-xs font-bold text-slate-700 leading-relaxed whitespace-pre-wrap">{hotel.mealTimes}</p>
                            </div>
                          </div>
                        </div>

                        {/* Recepsionis & Wifi */}
                        <div className="flex flex-col rounded-2xl overflow-hidden border border-emerald-100 shadow-sm bg-white">
                          <div className="h-40 w-full relative shrink-0">
                            <img src={hotel.receptionistPhoto} alt="Resepsionis" className="w-full h-full object-cover" />
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-emerald-900 font-black text-xs flex items-center gap-1 shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5" /> LOBI HOTEL
                            </div>
                          </div>
                          <div className="p-5 bg-emerald-50/50 flex-1 flex flex-col justify-center space-y-4">
                            <div>
                              <h4 className="text-sm font-black text-emerald-900 mb-1">RESEPSIONIS</h4>
                              <p className="text-sm font-bold text-slate-700 leading-snug whitespace-pre-wrap">{hotel.receptionistInfo}</p>
                            </div>
                            <div className="border-t border-emerald-200/50 pt-3">
                              <h4 className="text-xs font-black text-emerald-900 mb-1 flex items-center gap-1"><Wifi className="w-3.5 h-3.5" /> AKSES WIFI</h4>
                              <p className="text-xs font-bold text-slate-700 leading-relaxed whitespace-pre-wrap">{hotel.wifiInfo}</p>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Footer Logo/Brand */}
                      <div className="pt-8 text-center text-xs font-bold text-slate-400 mt-auto flex items-center justify-center gap-3">
                        <img src="https://via.placeholder.com/150x50/111827/FFFFFF?text=JEJAK+IMANI" alt="Logo" className="h-6 grayscale opacity-50" />
                        <span>DIVISI HANDLING & OPERATIONS - PT JEJAK IMANI BERKAH BERSAMA</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

    </div>
  );
}
