import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface SaudiClockWidgetProps {
  compact?: boolean;
}

export default function SaudiClockWidget({ compact = false }: SaudiClockWidgetProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Christian date (Masehi)
  const masehiDate = new Intl.DateTimeFormat('id-ID', {
    weekday: compact ? undefined : 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(time);

  // Time format (AST - Arabia Standard Time, UTC+3)
  const saudiTimeStr = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Riyadh',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(time);

  // Format Hijri Date
  let hijriDate = '';
  try {
    const hijriFormatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
      timeZone: 'Asia/Riyadh',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    hijriDate = hijriFormatter.format(time) + ' H';
  } catch (e) {
    hijriDate = '11 Dzulhijjah 1447 H';
  }

  if (compact) {
    return (
      <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-600 select-none shrink-0" id="saudi-clock-widget-compact">
        <Calendar className="w-3 h-3 text-[#D4AF37] shrink-0" />
        <span>{masehiDate} M</span>
        <span className="opacity-40 text-slate-400">|</span>
        <span className="text-[#D4AF37]">{hijriDate}</span>
        <span className="opacity-40 text-slate-400">|</span>
        <span className="font-mono text-[9px] text-slate-700 bg-slate-100 px-1 py-0.5 rounded">{saudiTimeStr} AST</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-600 select-none" id="saudi-clock-widget-full">
      <div className="flex items-center gap-1 bg-slate-50 text-slate-700 px-2 py-1 rounded border border-slate-200">
        <Calendar className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
        <span>{masehiDate} M</span>
      </div>
      <span className="text-slate-300">|</span>
      <div className="flex items-center gap-1 bg-amber-50/60 text-amber-900 border border-amber-200 px-2 py-1 rounded">
        <span className="text-[#D4AF37] font-extrabold">☪</span>
        <span>{hijriDate}</span>
      </div>
      <span className="text-slate-300">|</span>
      <div className="flex items-center gap-1 bg-slate-900 text-white rounded px-2 py-1 font-mono text-[10px] tracking-tight">
        <Clock className="w-3 h-3 text-[#D4AF37] shrink-0 scroll-py-1" />
        <span>{saudiTimeStr} AST</span>
      </div>
    </div>
  );
}
