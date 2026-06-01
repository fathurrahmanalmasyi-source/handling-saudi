import React, { useRef, useState } from 'react';
import { Camera, X, Check } from 'lucide-react';

interface Props {
  onCapture: (base64: string) => void;
  onClear: () => void;
  photoUrl: string | null;
  taskName?: string;
}

export default function ImageCapture({ onCapture, onClear, photoUrl, taskName }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    if (isCameraOpen) {
      const interval = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(interval);
    }
  }, [isCameraOpen]);


  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // Essential for autoplay
        videoRef.current.play().catch(e => console.error("Play failed:", e));
        setIsCameraOpen(true);
      }
    } catch (err) {
      console.error("Camera access failed", err);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(0, canvasRef.current.height - 60, canvasRef.current.width, 60);
        context.fillStyle = 'white';
        context.font = '14px sans-serif';
        context.fillText(`${currentTime.toLocaleDateString()} ${currentTime.toLocaleTimeString()}`, 10, canvasRef.current.height - 35);
        if (taskName) {
            context.font = '12px sans-serif';
            context.fillText(taskName, 10, canvasRef.current.height - 15);
        } else {
            context.font = '12px sans-serif';
            context.fillText("Presensi Tugas", 10, canvasRef.current.height - 15);
        }
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
        <div className={`relative rounded-lg overflow-hidden ${isFullScreen ? "fixed inset-0 z-50 bg-black" : ""}`}>
          <video ref={videoRef} autoPlay playsInline className={`w-full ${isFullScreen ? "h-screen object-cover" : "h-48 object-cover"}`} />
          <div className={`absolute top-2 left-2 bg-black/50 text-white p-2 rounded ${isFullScreen ? "text-lg" : "text-[10px]"}`}>
             <div>{currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}</div>
             {taskName && <div>{taskName}</div>}
          </div>
          <button onClick={() => setIsFullScreen(!isFullScreen)} className={`absolute top-10 right-2 p-3 bg-[#D4AF37] text-white rounded-full ${isFullScreen ? "text-lg" : "text-sm"}`}>
             {isFullScreen ? "Minimize" : "Full Screen"}
          </button>
          <button onClick={captureImage} className="absolute bottom-4 left-1/2 -translate-x-1/2 p-4 bg-[#D4AF37] text-white rounded-full"><Check /></button>
          <canvas ref={canvasRef} width="400" height="400" className="hidden" />
        </div>
      ) : (
        <div className="space-y-2">
            <button type="button" onClick={startCamera} className="w-full border-2 border-dashed border-slate-250 rounded-lg p-4 bg-slate-50 flex flex-col items-center justify-center gap-1">
              <Camera className="w-6 h-6 text-[#D4AF37]" />
              <span className="text-xs font-black uppercase text-slate-500">Ambil Foto</span>
            </button>
            <button type="button" onClick={() => { setIsFullScreen(true); startCamera(); }} className="w-full border-2 border-solid border-[#D4AF37] rounded-lg p-4 bg-[#D4AF37]/10 flex flex-col items-center justify-center gap-1">
              <Camera className="w-6 h-6 text-[#D4AF37]" />
              <span className="text-xs font-black uppercase text-[#D4AF37]">Ambil Foto (Full Screen)</span>
            </button>
        </div>
      )}
    </div>
  );
}
