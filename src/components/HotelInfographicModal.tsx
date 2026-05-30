import React from 'react';
import { MapPin, Utensils, Watch, CheckCircle2, Wifi, X } from 'lucide-react';
import { HotelInfographic } from '../types';

interface HotelInfographicModalProps {
  hotelInfo: HotelInfographic;
  onClose: () => void;
}

export default function HotelInfographicModal({ hotelInfo, onClose }: HotelInfographicModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 animate-in zoom-in-95 duration-200">
        
        {/* Print Button / Close */}
        <div className="absolute top-4 right-4 z-10 flex gap-2 print:hidden">
          <button 
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-full cursor-pointer shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Infographic Content to Print */}
        <div className="w-full bg-slate-50 text-slate-800">
          <div className="p-6 sm:p-10 space-y-6 sm:space-y-8" style={{ width: '100%', maxWidth: '210mm', minHeight: 'auto', margin: '0 auto', backgroundColor: 'white' }}>
            
            {/* Header */}
            <div className="text-center space-y-2 border-b-2 border-emerald-800 pb-6">
              <h1 className="text-2xl sm:text-3xl font-black uppercase text-emerald-900 tracking-tight">INFORMASI HOTEL</h1>
              <h2 className="text-xl sm:text-2xl font-black text-[#D4AF37] uppercase">{hotelInfo.hotelName}</h2>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full uppercase">
                <MapPin className="w-4 h-4" /> {hotelInfo.city}
              </div>
            </div>

            {/* Main Photos Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <div className="relative h-48 sm:h-80 w-full rounded-2xl overflow-hidden shadow-md bg-slate-100">
                  <img src={hotelInfo.hotelPhoto} alt="Fasad Hotel" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">
                    <span className="text-white font-black text-lg sm:text-xl drop-shadow-md">FASAD HOTEL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
              
              {/* Restoran & Meal Times */}
              <div className="flex flex-col rounded-2xl overflow-hidden border border-emerald-100 shadow-sm bg-white">
                <div className="h-32 sm:h-40 w-full relative shrink-0 bg-slate-100">
                  <img src={hotelInfo.restaurantPhoto} alt="Restoran" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 rounded-full text-emerald-900 font-black text-[10px] sm:text-xs flex items-center gap-1 shadow-sm">
                    <Utensils className="w-3.5 h-3.5" /> AREA MAKAN
                  </div>
                </div>
                <div className="p-4 sm:p-5 bg-emerald-50/50 flex-1 flex flex-col justify-center space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-emerald-900 mb-1">RESTORAN</h4>
                    <p className="text-xs sm:text-sm font-bold text-slate-700 leading-snug">{hotelInfo.restaurantInfo || '-'}</p>
                  </div>
                  <div className="border-t border-emerald-200/50 pt-3">
                    <h4 className="text-[10px] sm:text-xs font-black text-emerald-900 mb-1 flex items-center gap-1"><Watch className="w-3.5 h-3.5" /> JAM MAKAN</h4>
                    <p className="text-xs font-bold text-slate-700 leading-relaxed whitespace-pre-wrap">{hotelInfo.mealTimes || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Recepsionis & Wifi */}
              <div className="flex flex-col rounded-2xl overflow-hidden border border-emerald-100 shadow-sm bg-white">
                <div className="h-32 sm:h-40 w-full relative shrink-0 bg-slate-100">
                  <img src={hotelInfo.receptionistPhoto} alt="Resepsionis" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 rounded-full text-emerald-900 font-black text-[10px] sm:text-xs flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" /> LOBI HOTEL
                  </div>
                </div>
                <div className="p-4 sm:p-5 bg-emerald-50/50 flex-1 flex flex-col justify-center space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-emerald-900 mb-1">RESEPSIONIS</h4>
                    <p className="text-xs sm:text-sm font-bold text-slate-700 leading-snug whitespace-pre-wrap">{hotelInfo.receptionistInfo || '-'}</p>
                  </div>
                  <div className="border-t border-emerald-200/50 pt-3">
                    <h4 className="text-[10px] sm:text-xs font-black text-emerald-900 mb-1 flex items-center gap-1"><Wifi className="w-3.5 h-3.5" /> AKSES WIFI</h4>
                    <p className="text-xs font-bold text-slate-700 leading-relaxed whitespace-pre-wrap">{hotelInfo.wifiInfo || '-'}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Logo/Brand */}
            <div className="pt-6 sm:pt-8 text-center text-[10px] sm:text-xs font-bold text-slate-400 mt-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <span>DIVISI HANDLING & OPERATIONS - PT JEJAK IMANI BERKAH BERSAMA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
