import React, { useRef, useState } from 'react';
import { Camera, X, Check } from 'lucide-react';

interface Props {
  onCapture: (base64: string) => void;
  onClear: () => void;
  photoUrl: string | null;
}

export default function ImageCapture({ onCapture, onClear, photoUrl }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraOpen(true);
      }
    } catch (err) {
      console.error("Camera access failed", err);
      alert("Izin kamera gagal/tidak didapatkan.");
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        onCapture(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  if (photoUrl) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-slate-200">
        <img src={photoUrl} alt="Hasil Foto" className="w-full h-40 object-cover" />
        <button onClick={onClear} className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full"><X className="w-4 h-4"/></button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {isCameraOpen ? (
        <div className="relative rounded-lg overflow-hidden">
          <video ref={videoRef} className="w-full h-48 object-cover" />
          <button onClick={captureImage} className="absolute bottom-2 left-1/2 -translate-x-1/2 p-2 bg-[#D4AF37] text-white rounded-full"><Check /></button>
          <canvas ref={canvasRef} width="400" height="400" className="hidden" />
        </div>
      ) : (
        <button type="button" onClick={startCamera} className="w-full border-2 border-dashed border-slate-250 rounded-lg p-4 bg-slate-50 flex flex-col items-center justify-center gap-1">
          <Camera className="w-6 h-6 text-[#D4AF37]" />
          <span className="text-xs font-black uppercase text-slate-500">Ambil Foto</span>
        </button>
      )}
    </div>
  );
}
