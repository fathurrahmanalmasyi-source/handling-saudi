import React, { useState } from 'react';
import { Search, BookOpen, AlertTriangle, Filter, CheckCircle2, Info } from 'lucide-react';
import { SOPDoc } from '../types';

interface SOPListProps {
  sops: SOPDoc[];
}

export default function SOPList({ sops }: SOPListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Airport');
  const [expandedSopId, setExpandedSopId] = useState<string | null>('sop-1'); // Default open first

  const categories = ['Airport', 'Hotel', 'Logistics', 'Ziarah'];

  const filteredSops = sops.filter((sop) => {
    const matchesSearch = sop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sop.content.some(line => line.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = sop.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4" id="sop-section">
      
      {/* Filter and Search Bar */}
      <div className="relative" id="sop-controls">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari kata kunci SOP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 font-extrabold focus:outline-none focus:ring-1 focus:ring-[#D4AF37] placeholder:text-slate-400 shadow-2xs"
        />
      </div>

      {/* Kategori SOP (Sesuai Tema Premium Slate & Gold) */}
      <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 max-w-md select-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-1 py-1.5 px-3 text-[10px] uppercase font-black tracking-wider rounded-lg transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
                isActive 
                  ? 'bg-slate-900 text-[#D4AF37] shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/40'
              }`}
            >
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* SOP Accordion List */}
      <div className="space-y-2" id="sop-accordion-container">
        {filteredSops.length > 0 ? (
          filteredSops.map((sop) => {
            const isExpanded = expandedSopId === sop.id;
            return (
              <div 
                key={sop.id} 
                className={`bg-white rounded-lg border transition-all duration-150 ${
                  isExpanded ? 'border-[#D4AF37]/40 shadow-xs' : 'border-slate-200 hover:border-slate-350'
                }`}
              >
                {/* Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => setExpandedSopId(isExpanded ? null : sop.id)}
                  className="w-full text-left p-3.5 sm:p-4 flex items-start justify-between gap-3 cursor-pointer focus:outline-none"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                        sop.category === 'Airport' ? 'bg-blue-50 text-blue-700 border border-blue-150' :
                        sop.category === 'Hotel' ? 'bg-purple-50 text-purple-700 border border-purple-150' :
                        sop.category === 'Logistics' ? 'bg-slate-100 text-slate-800 border border-slate-200' :
                        sop.category === 'Ziarah' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' :
                        'bg-amber-50 text-amber-700 border border-amber-150'
                      }`}>
                        {sop.category}
                      </span>
                      {sop.important && (
                        <span className="px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-150 rounded text-[9px] font-bold">
                          ⚠️ PENTING
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight leading-snug">
                      {sop.title}
                    </h3>
                    <div className="text-[10px] text-slate-400">
                      Update: <span className="text-slate-550 font-semibold">{sop.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="shrink-0 pt-0.5">
                    <span className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-705 border border-slate-150 text-xs font-bold">
                      {isExpanded ? '−' : '+'}
                    </span>
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-3.5 sm:px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50 rounded-b-lg">
                    <div className="space-y-2 mt-3">
                      {sop.content.map((step, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                            {idx + 1}
                          </span>
                          <div className="text-[11px] sm:text-xs text-slate-600 leading-relaxed pt-0.5 font-medium">
                            {step}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-2.5 bg-sky-50 rounded border border-sky-100 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <div className="text-[10px] text-sky-850 leading-normal font-medium">
                        <strong>Konfirmasi Lapangan:</strong> Bila terjadi ketidaksamaan kondisi di lapangan, hubungi Manager via menu Chat.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white p-8 text-center rounded-lg border border-slate-200">
            <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-750">Tidak ada SOP ditemukan</p>
            <p className="text-[10px] text-slate-400 mt-1">Cari dengan filter atau kata kunci lainnya.</p>
          </div>
        )}
      </div>
    </div>
  );
}
