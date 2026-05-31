import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Lock, ArrowRight, BookOpen, KeyRound, Eye, EyeOff, X, Download, Smartphone, Share2 } from 'lucide-react';
import { UserRole, Team } from '../types';

interface LoginProps {
  onLoginSuccess: (username: string, role: UserRole) => void;
  teamList?: Team[];
}

export default function Login({ onLoginSuccess, teamList = [] }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginRole, setLoginRole] = useState<UserRole>('HANDLING');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // PWA installation state management
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [showInstallGuide, setShowInstallGuide] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in standalone display mode (installed PWA)
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      const isDocReferrer = document.referrer.includes('android-app://');
      return isStandaloneMedia || isIOSStandalone || isDocReferrer;
    };

    setIsStandalone(checkStandalone());

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      console.log('App successfully installed to home screen!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt automatically
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      // Prompt not deferred (either iOS Safari or another browser), show descriptive modal
      setShowInstallGuide(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Harap masukkan Username dan Password.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Safe simulation of login
    setTimeout(() => {
      let finalUser = username.trim();
      
      // Attempt to look up the username in the team map if they selected from dropdown or typed exact ID
      if (loginRole === 'HANDLING') {
        const matchedTeam = teamList.find(t => t.id.replace('-', '_') === finalUser || t.name === finalUser);
        if (matchedTeam) {
            finalUser = matchedTeam.name; // Keep full name for display
        } else {
             // Let it just be whatever they typed if not manager, but ideally they select from the dropdown
             finalUser = finalUser.charAt(0).toUpperCase() + finalUser.slice(1);
        }
      } else {
        finalUser = finalUser.charAt(0).toUpperCase() + finalUser.slice(1);
      }
      
      onLoginSuccess(finalUser, loginRole);
      setIsLoading(false);
    }, 600);
  };

  const selectQuickLogin = (user: string, role: UserRole) => {
    setUsername(user);
    setPassword('secret123');
    setLoginRole(role);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between relative overflow-hidden" id="login-container">
      {/* Decorative Islamic Pattern Geometry Backdrop (Subtle gold circles & gradients) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full filter blur-3xl pointer-events-none -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none -ml-16 -mb-16"></div>

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10" id="login-main">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-md border border-[#D4AF37]/15 p-5 sm:p-6 relative">
          
          <div className="text-center mb-5">
            {/* Highly optimized logo display */}
            <div className="flex justify-center mb-3">
              <img 
                src="https://lh3.googleusercontent.com/d/1ADaHuVjVHr8tP1WuWy1q6f8bLGdFYU9a=w400" 
                alt="Logo" 
                className="h-12 w-auto object-contain rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                referrerPolicy="no-referrer"
              />
            </div>
            
            <h1 className="text-base font-bold text-slate-900 tracking-tight mt-2">Handling Saudi Arabia</h1>
          </div>

          {/* Role selector tabs */}
          <div className="mb-4">
            <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 tracking-wider text-center">MASUK SEBAGAI :</label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setLoginRole('HANDLING');
                  if (username === 'fathur') { setUsername(teamList[0]?.name || ''); }
                }}
                className={`py-1.5 text-xs font-extrabold rounded-md transition-all cursor-pointer ${
                  loginRole === 'HANDLING'
                    ? 'bg-slate-900 text-[#D4AF37] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Tim Lapangan
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginRole('MANAGER');
                  if (username !== 'fathur') { setUsername('fathur'); }
                }}
                className={`py-1.5 text-xs font-extrabold rounded-md transition-all cursor-pointer ${
                  loginRole === 'MANAGER'
                    ? 'bg-slate-900 text-[#D4AF37] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Manager
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            {error && (
              <div className="p-2.5 bg-red-50 text-xs text-red-700 font-medium rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1 tracking-wider">USERNAME</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 z-10">
                  <User className="h-3.5 w-3.5" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setShowSuggestions(true);
                    setError('');
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={loginRole === 'HANDLING' ? 'Cari / ketik nama Tim Lapangan...' : 'Masukkan nama Manager...'}
                  className="w-full py-2 pl-9 pr-8 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
                {username && (
                  <button
                    type="button"
                    onClick={() => { setUsername(''); setShowSuggestions(true); }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 p-0.5 rounded cursor-pointer z-10"
                    title="Bersihkan Pencarian"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}

                {showSuggestions && (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-20 cursor-default bg-transparent"
                      onClick={() => setShowSuggestions(false)}
                    />
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto py-1 divide-y divide-slate-50 animate-in fade-in slide-in-from-top-1 duration-100">
                      {(() => {
                        const query = username.toLowerCase().trim();
                        let filtered = [];
                        if (loginRole === 'HANDLING') {
                          filtered = teamList.filter(t => 
                            !query || 
                            t.name.toLowerCase().includes(query) ||
                            t.sector.toLowerCase().includes(query)
                          );
                        } else {
                          const mgrs = ['fathur'];
                          filtered = mgrs.filter(m => !query || m.includes(query)).map(m => ({ name: m, sector: 'Manager' }));
                        }

                        if (filtered.length === 0) {
                          return (
                            <div className="px-3 py-2 text-xs text-slate-450 italic text-center">
                              Tidak ada hasil "{username}"
                            </div>
                          );
                        }

                        return filtered.map((item, idx) => {
                          const isTeam = 'sector' in item;
                          const nameValue = isTeam ? item.name : (item as any).name;
                          const sectorTag = isTeam ? item.sector : 'Manager';
                          return (
                            <button
                              key={idx}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setUsername(nameValue);
                                setShowSuggestions(false);
                                setError('');
                              }}
                              onClick={() => {
                                setUsername(nameValue);
                                setShowSuggestions(false);
                                setError('');
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors flex justify-between items-center cursor-pointer font-sans"
                            >
                              <span className="font-semibold text-slate-800">{nameValue}</span>
                              <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded select-none shrink-0 font-mono">
                                {sectorTag}
                              </span>
                            </button>
                          );
                        });
                      })()}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-semibold text-slate-500 tracking-wider">PASSWORD</label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Hubungi admin pusat untuk reset.'); }} className="text-[10px] text-[#D4AF37] hover:underline">
                  Lupa Password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-3.5 w-3.5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Masukkan password"
                  className="w-full py-2 pl-9 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-705 cursor-pointer"
                  title="Tampilkan Password"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#D4AF37] font-bold rounded-lg text-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer border border-[#D4AF37]/20 active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Masuk Aplikasi</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#D4AF37]" />
                </>
              )}
            </button>

            {!isStandalone && !isInstalled && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer mt-2.5 shadow-xs border border-emerald-500/20 active:scale-[0.98]"
              >
                <Download className="h-4 w-4 text-white" />
                <span>Install Aplikasi (PWA)</span>
              </button>
            )}
          </form>

          {/* Tester Helper for easy platform evaluation */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-450 mb-2.5">
              <KeyRound className="w-3 h-3 text-[#D4AF37]" />
              <span>AKSES DEMO INSTAN</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => selectQuickLogin(teamList[0]?.name || 'ahmad', 'HANDLING')}
                className="p-2 border border-dashed border-slate-200 rounded-lg hover:bg-[#D4AF37]/5 text-left transition-all cursor-pointer"
              >
                <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                  <span className="truncate">Tim Lapangan</span>
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5">Akses acak tim</div>
              </button>
              
              <button
                type="button"
                onClick={() => selectQuickLogin('fathur', 'MANAGER')}
                className="p-2 border border-dashed border-slate-200 rounded-lg hover:bg-[#D4AF37]/5 text-left transition-all cursor-pointer"
              >
                <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-[#D4AF37]"></span>
                  <span>Manager</span>
                </div>
                <div className="text-[9px] text-slate-450 mt-0.5">Atur jadwal & kasir</div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center text-slate-400 text-[10px] border-t border-slate-200/40 bg-white" id="login-footer">
        <p>© 2026 PT. JEJAK IMANI BERKAH BERSAMA</p>
      </footer>

      {/* PWA INSTALLATION GUIDE MODAL CARD */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-[#0f172a] text-sm uppercase flex items-center gap-1.5 border-l-4 border-[#D4AF37] pl-2">
                <Smartphone className="w-4 h-4 text-[#D4AF37]" /> Install Aplikasi
              </h3>
              <button 
                onClick={() => setShowInstallGuide(false)}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-[11px] text-slate-600 leading-relaxed font-sans">
              <p className="font-bold text-slate-800">
                Aplikasi "Handling jejak imani" dapat di-install secara langsung ke Home Screen smartphone Anda sebagai Web App berkecepatan tinggi!
              </p>

              {/* iOS Safari Guide */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs text-amber-700">
                  <Share2 className="w-3.5 h-3.5" /> JIKA ANDA MENGGUNAKAN iOS (Safari)
                </span>
                <ol className="list-decimal list-inside pl-1 space-y-1.5 font-semibold text-slate-700">
                  <li>Klik tombol <span className="font-black text-slate-900 bg-white border px-1 py-0.5 rounded shadow-3xs inline-flex items-center gap-0.5"><Share2 className="w-2.5 h-2.5" /> Bagikan / Share</span> di bar bawah Safari.</li>
                  <li>Gulir ke bawah pada menu opsi yang muncul.</li>
                  <li>Pilih opsi <span className="font-black text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100">Add to Home Screen</span> (Tambahkan ke Layar Utama).</li>
                </ol>
              </div>

              {/* Android/Others Guide */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs text-emerald-700">
                  <Download className="w-3.5 h-3.5" /> JIKA ANDA MENGGUNAKAN ANDROID (Chrome)
                </span>
                <ol className="list-decimal list-inside pl-1 space-y-1.5 font-semibold text-slate-700">
                  <li>Ketuk tombol menu titik tiga (<span className="font-black text-slate-900">⋮</span>) di pojok kanan atas browser.</li>
                  <li>Pilih opsi <span className="font-black text-[#0f172a] bg-slate-100 px-1 py-0.5 rounded border border-slate-200">Tambahkan ke Layar Utama</span> atau <span className="font-black text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100">Instal Aplikasi</span>.</li>
                  <li>Sistem akan memasang aplikasi ke layar depan secara otomatis.</li>
                </ol>
              </div>
            </div>

            <div className="text-right pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowInstallGuide(false)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-[#D4AF37] font-black rounded-lg text-[10px] uppercase cursor-pointer"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

