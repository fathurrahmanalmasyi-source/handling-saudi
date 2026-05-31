import React, { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../firebase';
import {
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  deleteField,
  getDoc
} from 'firebase/firestore';
import Peer, { MediaConnection } from 'peerjs';
import { Mic, MicOff, Power, Radio, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PeerData {
  callsign: string;
  peerId: string;
  isTalking: boolean;
  updatedAt: number;
}

interface RoomData {
  participants: Record<string, PeerData>;
}

interface WalkieTalkieWidgetProps {
  currentUser?: string;
}

export default function WalkieTalkieWidget({ currentUser }: WalkieTalkieWidgetProps) {
  const [roomId, setRoomId] = useState('MAIN-CH');
  const [callsign, setCallsign] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [participants, setParticipants] = useState<Record<string, PeerData>>({});
  
  const peerRef = useRef<Peer | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const callsRef = useRef<Record<string, MediaConnection>>({});
  const audioElementsRef = useRef<Record<string, HTMLAudioElement>>({});
  const myUserIdRef = useRef<string>(Math.random().toString(36).substring(2, 9));
  const keepAliveInterval = useRef<any>(null);

  useEffect(() => {
    // Generate a default callsign if empty
    if (currentUser) {
       setCallsign(currentUser);
    } else {
       setCallsign(`Opr-${Math.floor(Math.random() * 1000)}`);
    }
  }, [currentUser]);

  const connectToRoom = async () => {
    if (!roomId.trim() || !callsign.trim()) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      // Mute local stream track initially
      stream.getAudioTracks().forEach(track => { track.enabled = false; });
      localStreamRef.current = stream;

      const peer = new Peer();
      peerRef.current = peer;

      peer.on('open', async (id) => {
        // Register in Firestore
        const roomRef = doc(db, 'walkie_rooms', roomId);
        
        await setDoc(roomRef, {
          participants: {
            [myUserIdRef.current]: {
              callsign,
              peerId: id,
              isTalking: false,
              updatedAt: Date.now()
            }
          }
        }, { merge: true });

        setIsConnected(true);

        // Keep alive
        keepAliveInterval.current = setInterval(() => {
          setDoc(roomRef, {
            participants: {
              [myUserIdRef.current]: {
                callsign,
                peerId: id,
                isTalking: isTalking,
                updatedAt: Date.now()
              }
            }
          }, { merge: true });
        }, 10000); // 10s heartbeat

        // Listen for incoming calls
        peer.on('call', (call) => {
          call.answer(localStreamRef.current!);
          call.on('stream', (remoteStream) => {
            playIncomingStream(call.peer, remoteStream);
          });
          callsRef.current[call.peer] = call;
        });

      });

    } catch (err) {
      console.error("Failed to access microphone", err);
      alert("Akses Mikrofon ditolak atau tidak tersedia!");
    }
  };

  const playIncomingStream = (peerId: string, stream: MediaStream) => {
    if (audioElementsRef.current[peerId]) return;
    const audio = new Audio();
    audio.srcObject = stream;
    audio.autoplay = true;
    audioElementsRef.current[peerId] = audio;
  };

  const cleanupConnections = async () => {
    setIsConnected(false);
    setIsTalking(false);
    setIsLocked(false);
    
    if (keepAliveInterval.current) clearInterval(keepAliveInterval.current);
    
    // Remove from Firestore
    try {
        const roomRef = doc(db, 'walkie_rooms', roomId);
        await setDoc(roomRef, {
          participants: {
            [myUserIdRef.current]: deleteField()
          }
        }, { merge: true });
    } catch(e) {}

    Object.values(callsRef.current).forEach((c) => c.close());
    callsRef.current = {};

    Object.values(audioElementsRef.current).forEach((a) => {
      a.pause();
      a.srcObject = null;
    });
    audioElementsRef.current = {};

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }

    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
  };

  // Firestore Snapshot listener
  useEffect(() => {
    if (!isConnected) return;
    
    const roomRef = doc(db, 'walkie_rooms', roomId);
    const unsub = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as RoomData;
        const now = Date.now();
        const activeParticipants: Record<string, PeerData> = {};
        
        Object.entries(data.participants || {}).forEach(([uid, pData]) => {
           // Filter out dead participants (older than 25 seconds)
           if (now - pData.updatedAt < 25000) {
             activeParticipants[uid] = pData;
             
             // If there's a peer we haven't connected to, call them
             if (uid !== myUserIdRef.current && peerRef.current && !callsRef.current[pData.peerId]) {
                 const call = peerRef.current.call(pData.peerId, localStreamRef.current!);
                 if (call) {
                     call.on('stream', (remoteStream) => {
                        playIncomingStream(pData.peerId, remoteStream);
                     });
                     callsRef.current[pData.peerId] = call;
                 }
             }
           }
        });
        
        setParticipants(activeParticipants);
      }
    });

    return () => unsub();
  }, [isConnected, roomId]);

  useEffect(() => {
    // Window unload cleanup
    const handleBeforeUnload = () => {
      if (isConnected) {
        // Synchronous beacon or simple attempt
        cleanupConnections();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isConnected]);


  // PTT Handlers
  const startTransmitting = () => {
    if (!isConnected) return;
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(t => t.enabled = true);
    }
    setIsTalking(true);
    updateTalkStateInDB(true);
  };

  const stopTransmitting = () => {
    if (!isConnected) return;
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(t => t.enabled = false);
    }
    setIsTalking(false);
    updateTalkStateInDB(false);
  };

  const updateTalkStateInDB = (talking: boolean) => {
    if (!peerRef.current) return;
    const roomRef = doc(db, 'walkie_rooms', roomId);
    setDoc(roomRef, {
      participants: {
        [myUserIdRef.current]: {
          callsign,
          peerId: peerRef.current.id,
          isTalking: talking,
          updatedAt: Date.now()
        }
      }
    }, { merge: true });
  };

  // Double click logic
  const dtRef = useRef<number>(0);
  
  const handlePttMouseDown = () => {
    if (!isConnected) return;
    const now = Date.now();
    if (now - dtRef.current < 400) {
      // Double click
      const newLocked = !isLocked;
      setIsLocked(newLocked);
      if (newLocked) {
        startTransmitting();
      } else {
        stopTransmitting();
      }
      dtRef.current = 0; // reset
    } else {
      if (!isLocked) {
        startTransmitting();
      }
      dtRef.current = now;
    }
  };

  const handlePttMouseUp = () => {
    if (!isConnected) return;
    // Only stop if not locked
    setTimeout(() => {
      if (!isLocked) {
         stopTransmitting();
      }
    }, 100);
  };

  const activeTalkers = Object.values(participants).filter((p) => p.isTalking && p.callsign !== callsign);
  const isReceiving = activeTalkers.length > 0;
  
  let ledColor = "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"; // Standby
  if (isTalking || isLocked) ledColor = "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"; // TX
  else if (isReceiving) ledColor = "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"; // RX

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col gap-3 text-[#111] font-sans relative overflow-hidden">
      
      {/* Top Header */}
      <div className="flex items-center justify-between w-full border-b border-slate-100 pb-2 mb-1">
         <div className="flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-extrabold text-[#111] text-xs uppercase">Koordinasi Suara</h3>
         </div>
         <div className="flex items-center gap-2">
            {isConnected && (
               <div className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold">
                 <Users className="w-3 h-3" />
                 {Object.keys(participants).length} Terhubung
               </div>
            )}
            <div className={cn("w-2.5 h-2.5 rounded-full transition-colors duration-300", 
               isConnected ? ledColor : "bg-slate-200 shadow-none")} 
            />
         </div>
      </div>

      <div className="flex flex-row items-start justify-between gap-4">
        {/* LEFT SIDE: Inputs / Connection Status */}
        <div className="flex-1 flex flex-col gap-3 pt-1">
          {!isConnected ? (
            <>
               <div>
                 <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Kode Saluran</label>
                 <input 
                   type="text" 
                   value={roomId}
                   onChange={e => setRoomId(e.target.value)}
                   className="w-full bg-slate-50 text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all font-bold"
                   placeholder="CH-1"
                 />
               </div>
               <button 
                 onClick={connectToRoom}
                 className="w-full bg-[#111] hover:bg-[#D4AF37] text-white font-bold text-[11px] py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm mt-1"
               >
                 <Power className="w-3.5 h-3.5" /> HUBUNGKAN
               </button>
               <div className="text-[10px] text-slate-400 font-medium mt-1">
                 Masuk sebagai: <span className="font-bold text-slate-600">{callsign}</span>
               </div>
            </>
          ) : (
            <div className="flex flex-col gap-3">
               <div className="flex flex-col gap-1">
                 <span className="text-slate-400 uppercase text-[10px] font-bold block">Saluran Aktif</span>
                 <div className="flex items-center gap-2">
                   <span className="font-extrabold text-[#111] text-xl">{roomId}</span>
                   <div className="flex items-center gap-0.5 h-4">
                     {[1, 2, 3, 4].map((i) => (
                       <motion.div
                         key={i}
                         animate={
                           isTalking || isReceiving || isLocked
                             ? { height: ["20%", "100%", "40%", "80%", "20%"] }
                             : { height: "20%" }
                         }
                         transition={{
                           repeat: Infinity,
                           duration: 0.5 + Math.random() * 0.5,
                           ease: "easeInOut",
                         }}
                         className={cn(
                           "w-1 rounded-full",
                           isTalking || isLocked ? "bg-red-500" : isReceiving ? "bg-amber-500" : "bg-slate-300"
                         )}
                       />
                     ))}
                   </div>
                 </div>
               </div>

               <div className="flex flex-col gap-1 w-full bg-slate-50 p-2 rounded-lg border border-slate-200">
                 <span className="text-slate-500 text-[10px] font-bold uppercase">Petugas Online</span>
                 <div className="flex flex-wrap gap-1 mt-0.5">
                   <span className="text-[10px] bg-[#111] text-white px-1.5 py-0.5 rounded font-bold">{callsign} (Anda)</span>
                   {Object.values(participants).map((p) => {
                     if (p.callsign === callsign) return null;
                     return (
                       <span key={p.peerId} className={cn("text-[10px] px-1.5 py-0.5 rounded font-bold transition-colors", p.isTalking ? "bg-amber-100 text-amber-700" : "bg-white border border-slate-200 text-slate-700")}>
                         {p.callsign}
                       </span>
                     );
                   })}
                 </div>
               </div>

               <button 
                 onClick={cleanupConnections}
                 className="w-full bg-white hover:bg-slate-50 text-red-600 border border-slate-200 font-bold text-[11px] py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 mt-1"
               >
                 <Power className="w-3.5 h-3.5" /> PUTUSKAN
               </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: PTT Button */}
        <div className="flex flex-col items-center justify-center w-32 relative">
           {isConnected ? (
             <>
               {/* Radar Pulse Backgrounds */}
               <AnimatePresence>
                 {(isTalking || isLocked || isReceiving) && (
                    <motion.div 
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.5, 1] }}
                       transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                       className={cn(
                          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+1rem)] rounded-full w-24 h-24 pointer-events-none blur-md",
                          isTalking || isLocked ? "bg-red-500/20" : "bg-amber-400/20"
                       )}
                    />
                 )}
               </AnimatePresence>

               {/* PTT Button */}
               <button
                 onMouseDown={handlePttMouseDown}
                 onMouseUp={handlePttMouseUp}
                 onMouseLeave={handlePttMouseUp}
                 onTouchStart={handlePttMouseDown}
                 onTouchEnd={handlePttMouseUp}
                 className={cn(
                   "relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1.5 transition-all duration-200 select-none shadow-md border-4 active:scale-95",
                   isLocked 
                     ? "bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)] border-red-200" 
                     : isTalking 
                        ? "bg-red-500 border-red-200" 
                        : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                 )}
               >
                  {isLocked || isTalking ? <Mic className="w-8 h-8 text-white" /> : <MicOff className="w-8 h-8 text-slate-400" />}
                  <span className={cn("text-[11px] font-extrabold uppercase tracking-widest", isLocked || isTalking ? "text-white" : "text-slate-500")}>
                    {isLocked ? 'TERKUNCI' : 'PTT'}
                  </span>
               </button>
               
               <div className="mt-4 flex flex-col items-center w-full min-h-[32px] absolute -bottom-8">
                  {isReceiving ? (
                    <div className="flex items-center gap-1.5 text-amber-700 text-[10px] font-bold bg-amber-100 px-2.5 py-1 rounded shadow-sm border border-amber-200">
                       <motion.div 
                         animate={{ opacity: [0, 1, 0] }} 
                         transition={{ repeat: Infinity, duration: 1 }}
                         className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0"
                       />
                       <span className="truncate max-w-[80px]">MENDENGARKAN...</span>
                    </div>
                  ) : isTalking || isLocked ? (
                    <div className="flex items-center gap-1.5 text-red-600 text-[10px] font-bold bg-red-50 px-2.5 py-1 rounded shadow-sm border border-red-200">
                       <motion.div 
                         animate={{ opacity: [0, 1, 0] }} 
                         transition={{ repeat: Infinity, duration: 1 }}
                         className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"
                       />
                       MEMANCARKAN...
                    </div>
                  ) : (
                    <div className="text-[9px] text-slate-500 font-bold text-center leading-tight bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      {isLocked ? "MIC TERKUNCI" : "TAHAN = BICARA\n2x KLIK = KUNCI"}
                    </div>
                  )}
               </div>
             </>
           ) : (
             <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-slate-100 flex flex-col items-center justify-center gap-1.5 text-slate-300 select-none">
               <MicOff className="w-8 h-8 opacity-40" />
               <span className="text-[11px] font-extrabold uppercase tracking-widest opacity-40">PTT</span>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
