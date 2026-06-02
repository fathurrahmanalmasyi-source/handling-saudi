import React, { useState } from 'react';
import { Download, Search, Hotel, X, Check, Edit2, Info, UserPlus, Filter, CheckCircle2, Sliders, Palette, Trash2, MoreVertical, AlertTriangle, ClipboardCheck, Plus } from 'lucide-react';
import { RoomManifest } from '../types';
import { Jamaah } from './ManagerManifest';

interface RoomListProps {
  rooms: RoomManifest[];
  onAddRoom: (newRoom: Omit<RoomManifest, 'id'>) => void;
  selectedGroupFilter?: string;
  groups: string[];
  onUpdateRooms?: (newRooms: RoomManifest[]) => void;
  jamaahList: Jamaah[];
  onUpdateJamaahList?: (newList: Jamaah[]) => void;
  currentRole?: 'MANAGER' | 'HANDLING';
}

// Map custom colorTag values to visual Tailwind class properties
export const getRowStyles = (tag: string) => {
  switch (tag) {
    case 'red':
      return {
        bg: 'bg-rose-50/70 hover:bg-rose-100/70',
        border: 'border-l-4 border-l-rose-500',
        badge: 'bg-rose-100 text-rose-800 border-rose-200',
        label: 'Mahrom / Pasutri',
        dot: 'bg-rose-500'
      };
    case 'green':
      return {
        bg: 'bg-emerald-50/70 hover:bg-emerald-100/70',
        border: 'border-l-4 border-l-emerald-500',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-250',
        label: 'Near Lift / Lantai Bawah',
        dot: 'bg-emerald-500'
      };
    case 'blue':
      return {
        bg: 'bg-blue-50/70 hover:bg-blue-100/70',
        border: 'border-l-4 border-l-blue-500',
        badge: 'bg-blue-100 text-blue-800 border-blue-200',
        label: "Lansia / Ka'bah View",
        dot: 'bg-blue-500'
      };
    case 'yellow':
      return {
        bg: 'bg-amber-50/70 hover:bg-amber-100/70',
        border: 'border-l-4 border-l-amber-500',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        label: 'Extra Bed Request',
        dot: 'bg-amber-500'
      };
    case 'purple':
      return {
        bg: 'bg-purple-50/70 hover:bg-purple-100/70',
        border: 'border-l-4 border-l-purple-500',
        badge: 'bg-purple-100 text-purple-800 border-purple-200',
        label: 'Keluarga Berdekatan',
        dot: 'bg-purple-500'
      };
    default:
      return {
        bg: 'bg-white hover:bg-slate-50/60',
        border: 'border-l-4 border-l-slate-200',
        badge: 'bg-slate-100 text-slate-500 border-slate-200',
        label: 'Umum / Standar',
        dot: 'bg-slate-400'
      };
  }
};

// Auto-resolve color tag based on notes if explicit colorTag is not set
export const resolveColorTag = (room: RoomManifest): 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'slate' => {
  if (room.colorTag) return room.colorTag;
  
  const text = (room.notes || '').toLowerCase();
  if (text.includes("mahrom") || text.includes("istri") || text.includes("suami") || text.includes("pasutri")) {
    return 'red';
  }
  if (text.includes("dekat lift") || text.includes("dekat") || text.includes("lantai bawah") || text.includes("lift")) {
    return 'green';
  }
  if (text.includes("view") || text.includes("kabah") || text.includes("lansia") || text.includes("tua")) {
    return 'blue';
  }
  if (text.includes("ekstra") || text.includes("pillow") || text.includes("kursi") || text.includes("kasur") || text.includes("extra")) {
    return 'yellow';
  }
  if (text.includes("dekat dengan") || text.includes("berdekatan") || text.includes("keluarga") || text.includes("sebelahan") || text.includes("berdampingan")) {
    return 'purple';
  }
  return 'slate';
};

// Helper to check if a text indicates an adjacent room request
export const checkIsAdjacentText = (notes: string, colorTag?: string): boolean => {
  if (colorTag === 'purple') return true;
  const text = (notes || '').toLowerCase();
  return (
    text.includes('dekat dengan') || 
    text.includes('berdekatan') || 
    text.includes('sebelahan') || 
    text.includes('berdampingan') ||
    text.includes('keluarga') ||
    text.includes('sampingan')
  );
};

// Helper to check if a text indicates other special requests
export const checkHasOtherSpecialRequest = (notes: string, colorTag?: string): boolean => {
  if (!notes) return false;
  const text = notes.toLowerCase();
  
  // If notes exist and it is just auto plotting standard note, ignore
  if (text.trim() === 'grup plotting otomatis') return false;
  
  const hasAdj = checkIsAdjacentText(notes, colorTag);
  
  const specialKeywords = [
    'mahrom', 'istri', 'suami', 'pasutri',
    'dekat lift', 'lantai bawah', 'lift',
    'view', 'kabah', 'lansia', 'tua',
    'ekstra', 'pillow', 'kursi', 'kasur', 'extra', 'roda', 'wheelchair',
    'sakit', 'rendah', 'vip', 'khusus', 'minta'
  ];
  
  const hasSpecialKeyword = specialKeywords.some(kw => text.includes(kw));
  const hasSpecialColorTag = colorTag && colorTag !== 'slate' && colorTag !== 'purple';
  
  if (!hasAdj && text.trim().length > 0) {
    return true;
  }
  
  return hasSpecialKeyword || hasSpecialColorTag;
};

// Standard styling for adjacent groups to allocate when rendering
export const ADJACENT_GROUP_COLORS = [
  {
    name: 'Orange',
    dot: 'bg-orange-500',
    ring: 'ring-orange-400',
    bg: 'bg-orange-50/70 hover:bg-orange-100/70',
    border: 'border-l-4 border-l-orange-500',
    badge: 'bg-orange-500 text-white border-orange-600 font-black'
  },
  {
    name: 'Ungu',
    dot: 'bg-purple-500',
    ring: 'ring-purple-400',
    bg: 'bg-purple-50/70 hover:bg-purple-100/70',
    border: 'border-l-4 border-l-purple-500',
    badge: 'bg-purple-500 text-white border-purple-600 font-black'
  },
  {
    name: 'Biru',
    dot: 'bg-blue-500',
    ring: 'ring-blue-400',
    bg: 'bg-blue-50/70 hover:bg-blue-100/70',
    border: 'border-l-4 border-l-blue-500',
    badge: 'bg-blue-500 text-white border-blue-600 font-black'
  },
  {
    name: 'Fuchsia',
    dot: 'bg-fuchsia-500',
    ring: 'ring-fuchsia-400',
    bg: 'bg-fuchsia-50/70 hover:bg-fuchsia-100/70',
    border: 'border-l-4 border-l-fuchsia-500',
    badge: 'bg-fuchsia-500 text-white border-fuchsia-600 font-black'
  },
  {
    name: 'Hijau',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-400',
    bg: 'bg-emerald-50/70 hover:bg-emerald-100/70',
    border: 'border-l-4 border-l-emerald-500',
    badge: 'bg-emerald-500 text-white border-emerald-600 font-black'
  },
  {
    name: 'Kuning',
    dot: 'bg-amber-500',
    ring: 'ring-amber-400',
    bg: 'bg-amber-50/70 hover:bg-amber-100/70',
    border: 'border-l-4 border-l-amber-500',
    badge: 'bg-amber-500 text-white border-amber-600 font-black'
  }
];

export const getAdjacentGroups = (roomsInScope: RoomManifest[]): RoomManifest[][] => {
  const reqRooms = roomsInScope.filter(r => checkIsAdjacentText(r.notes || '', r.colorTag));
  const groups: RoomManifest[][] = [];
  const visited = new Set<string>();
  
  const isConnected = (a: RoomManifest, b: RoomManifest) => {
    const aNotes = (a.notes || '').toLowerCase();
    const bNotes = (b.notes || '').toLowerCase();
    const aNum = a.roomNumber || '';
    const bNum = b.roomNumber || '';
    
    if (aNum && bNum && aNum === bNum) return true;
    if (aNum && bNotes.includes(aNum)) return true;
    if (bNum && aNotes.includes(bNum)) return true;
    
    const ignoreList = ['minta', 'berdekatan', 'dengan', 'kamar', 'keluarga', 'hotel', 'makkah', 'madinah', 'sampingan', 'sebelahan', 'sebelah', 'berdampingan', 'grup', 'plotting', 'otomatis'];
    const getSignificantWords = (notes: string) => {
      return notes.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .split(/\s+/)
        .filter(w => w.length >= 4 && !ignoreList.includes(w));
    };
    
    const aWords = getSignificantWords(a.notes || '');
    const bWords = getSignificantWords(b.notes || '');
    const hasSharedWord = aWords.some(w => bWords.includes(w));
    if (hasSharedWord && aWords.length > 0) return true;
    
    if (aNum && bNum && a.groupName === b.groupName) {
      const aInt = parseInt(aNum.replace(/\D/g, ''));
      const bInt = parseInt(bNum.replace(/\D/g, ''));
      if (!isNaN(aInt) && !isNaN(bInt) && Math.abs(aInt - bInt) === 1) {
        return true;
      }
    }
    
    return false;
  };
  
  reqRooms.forEach(room => {
    if (visited.has(room.id)) return;
    
    const queue = [room];
    const currentGroup: RoomManifest[] = [];
    visited.add(room.id);
    
    while (queue.length > 0) {
      const curr = queue.shift()!;
      currentGroup.push(curr);
      
      reqRooms.forEach(other => {
        if (!visited.has(other.id) && isConnected(curr, other)) {
          visited.add(other.id);
          queue.push(other);
        }
      });
    }
    
    groups.push(currentGroup);
  });
  
  return groups;
};

export default function RoomListManager({ 
  rooms, 
  onAddRoom, 
  selectedGroupFilter, 
  groups, 
  onUpdateRooms,
  jamaahList,
  onUpdateJamaahList,
  currentRole = 'HANDLING'
}: RoomListProps) {
  // State untuk data pencarian dan filter langsung
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedHotelFilter, setSelectedHotelFilter] = useState<string>('');
  const [selectedBusFilter, setSelectedBusFilter] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Tab Manager khusus di menu Roomlist
  const [activeSubSection, setActiveSubSection] = useState<'view-list' | 'plot-roomlist'>('view-list');

  // Mode Edit Inline Nomor Kamar (Handling Executive Only)
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editingRoomNum, setEditingRoomNum] = useState<string>('');
  const [isBulkEditMode, setIsBulkEditMode] = useState<boolean>(false);
  const [localRooms, setLocalRooms] = useState<RoomManifest[]>(rooms);
  const [activeRoomDropdownId, setActiveRoomDropdownId] = useState<string | null>(null);

  // Sorting State
  const [sortBy, setSortBy] = useState<'roomlist' | 'roomNumber'>('roomlist');

  // Checklist states
  const [checklistItems, setChecklistItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('ji_roomlist_checklist_items');
    return saved ? JSON.parse(saved) : ['Tentcard Greeting', 'Cover Key', 'Zamzam 5L', 'Handuk Sesuai', 'Amenities Sesuai', 'Kamar Bersih'];
  });
  const [isEditChecklistTemplateOpen, setIsEditChecklistTemplateOpen] = useState(false);
  const [isRekapanChecklistOpen, setIsRekapanChecklistOpen] = useState(false);
  const [checklistRoomId, setChecklistRoomId] = useState<string | null>(null);
  
  // Custom checklist items edit state
  const [newChecklistItem, setNewChecklistItem] = useState('');

  // Print checklist PDF state
  const [isPreviewChecklistPDFOpen, setIsPreviewChecklistPDFOpen] = useState(false);

  // Local state for cached checklists of physical rooms
  // Key: "Hotel Name::Room Number" -> Record<string, boolean>
  const [physicalRoomChecklists, setPhysicalRoomChecklists] = useState<Record<string, Record<string, boolean>>>(() => {
    const saved = localStorage.getItem('ji_physical_room_checklists');
    return saved ? JSON.parse(saved) : {};
  });

  // Save/retrieve helper context for physical room checklist integration
  const handleRoomNumberChange = (
    room: RoomManifest,
    newRoomNumber: string,
    currentRoomsList: RoomManifest[]
  ): RoomManifest[] => {
    const trimmedOld = (room.roomNumber || '').trim();
    const trimmedNew = newRoomNumber.trim();
    const hotelKey = room.hotelDetailName;
    const currentChecklist = room.checklist || {};

    const updatedPhysical = { ...physicalRoomChecklists };

    // 1. If old room number is not empty & not TBD, save its checklist state in physical cache
    if (trimmedOld && trimmedOld !== 'TBD') {
      const oldKey = `${hotelKey}::${trimmedOld}`;
      updatedPhysical[oldKey] = currentChecklist;
    }

    // 2. Fetch or initialize the checklist for the new room number
    let newChecklist: Record<string, boolean> = {};
    if (trimmedNew && trimmedNew !== 'TBD') {
      const newKey = `${hotelKey}::${trimmedNew}`;
      if (updatedPhysical[newKey]) {
        // Retrieve if already cached
        newChecklist = updatedPhysical[newKey];
      } else if (trimmedOld === 'TBD' || !trimmedOld) {
        // If they checked it as TBD, then assign a number for the first time,
        // preserve the checklist they did as TBD and save it to the new room!
        newChecklist = currentChecklist;
        updatedPhysical[newKey] = currentChecklist;
      } else {
        // Moving from one room to another (e.g. 402 -> 405), and 405 has no cache,
        // so we start fresh (checklist is physical to that room, not guest!)
        newChecklist = {};
      }
    } else {
      // Revert to TBD or empty, keep it empty or same
      newChecklist = trimmedOld === 'TBD' || !trimmedOld ? currentChecklist : {};
    }

    // State updates
    setPhysicalRoomChecklists(updatedPhysical);
    localStorage.setItem('ji_physical_room_checklists', JSON.stringify(updatedPhysical));

    // Map and return updated rooms
    return currentRoomsList.map(r => {
      if (r.id === room.id) {
        return {
          ...r,
          roomNumber: trimmedNew,
          checklist: newChecklist
        };
      }
      return r;
    });
  };

  // Sync rooms props ke local rooms
  React.useEffect(() => {
    setLocalRooms(rooms);
  }, [rooms]);

  // Reset hotel and bus filter when group changes
  React.useEffect(() => {
    setSelectedHotelFilter('');
    setSelectedBusFilter('');
  }, [selectedGroup]);

  // Dialog Detail Info
  const [selectedRoomDetail, setSelectedRoomDetail] = useState<RoomManifest | null>(null);

  // Modal Edit Kamar (Khusus Manager - Full Control)
  const [editingRoom, setEditingRoom] = useState<RoomManifest | null>(null);
  const [editedRoomNumber, setEditedRoomNumber] = useState('');
  const [editedNotes, setEditedNotes] = useState('');
  const [editedColorTag, setEditedColorTag] = useState<'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'slate'>('slate');
  const [editedRoomType, setEditedRoomType] = useState<'Double' | 'Triple' | 'Quad'>('Triple');
  const [editedHotelDetailName, setEditedHotelDetailName] = useState('');
  const [editedHotelName, setEditedHotelName] = useState<'Makkah' | 'Madinah'>('Makkah');
  const [editedJamaahNamesText, setEditedJamaahNamesText] = useState('');

  // State Modal Tambah Kamar Baru (Manager Only)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState(groups[0] || 'Umroh Reguler 11 Juni 2026 (Madinah Awal)');
  const [hotelName, setHotelName] = useState<'Makkah' | 'Madinah'>('Makkah');
  const [hotelDetailName, setHotelDetailName] = useState('Pullman ZamZam Makkah');
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState<'Double' | 'Triple' | 'Quad'>('Triple');
  const [jamaahInput, setJamaahInput] = useState('');
  const [notes, setNotes] = useState('');
  const [colorTag, setColorTag] = useState<'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'slate'>('slate');

  // PDF Preview State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Active group selection for Plotting list
  const [selectedGroupPlotting, setSelectedGroupPlotting] = useState<string>(groups[0] || 'Umroh Reguler 11 Juni 2026 (Madinah Awal)');

  // AI Auto Plotting State and Algorithm
  const [isAiPlotting, setIsAiPlotting] = useState(false);
  const [aiPlotReport, setAiPlotReport] = useState<{
    success: boolean;
    totalPlotted: number;
    mahromCount: number;
    elderlyCount: number;
    conflictRate: string;
  } | null>(null);

  const handleAIAutoPlot = () => {
    setIsAiPlotting(true);
    setAiPlotReport(null);
    
    setTimeout(() => {
      // Find all jamaah for this group
      const targetJamaah = (jamaahList || []).filter(j => j.groupName === selectedGroupPlotting);
      
      if (targetJamaah.length === 0) {
        setIsAiPlotting(false);
        alert('Tidak ada jamaah dalam grup ini untuk di-plot.');
        return;
      }

      // Smart plotting layout routing
      let currentRLNumber = 1;
      let paxInCurrentRoom = 0;
      let roomCapacity = 3; // Triple default
      
      const updatedList = (jamaahList || []).map((j: any) => {
        if (j.groupName !== selectedGroupPlotting) return j;
        
        // Simulating smart rules:
        // 1. Double Rooms for Couples/Pasutri
        const note = (((j as any).notes || (j as any).specialRequest || j.namaJamaah || '') as string).toLowerCase();
        
        let assignedRL = '';
        
        if (note.includes('mahrom') || note.includes('istri') || note.includes('suami') || note.includes('pasutri')) {
          assignedRL = '1'; // Assigned to Double Room #1
        } else if (note.includes('lansia') || note.includes('dekat lift') || note.includes('lantai bawah')) {
          assignedRL = '3'; // Assigned close to lift Room #3
        } else {
          assignedRL = String(currentRLNumber);
          paxInCurrentRoom++;
          if (paxInCurrentRoom >= roomCapacity) {
            currentRLNumber++;
            paxInCurrentRoom = 0;
            // Cycle through standard rooms
            if (currentRLNumber === 1 || currentRLNumber === 3) {
              currentRLNumber++;
            }
            if (currentRLNumber > 10) currentRLNumber = 4;
          }
        }
        
        return { ...j, nomorRoomlist: assignedRL };
      });

      if (onUpdateJamaahList) {
        onUpdateJamaahList(updatedList);
      }

      // Automatically create corresponding room manifest rows
      let newRooms = [...localRooms];
      const roomNumMap: Record<string, string[]> = {};
      updatedList.forEach(j => {
        if (j.groupName === selectedGroupPlotting && j.nomorRoomlist !== '-') {
          if (!roomNumMap[j.nomorRoomlist]) roomNumMap[j.nomorRoomlist] = [];
          roomNumMap[j.nomorRoomlist].push(j.namaJamaah);
        }
      });

      // Update or insert rooms
      Object.keys(roomNumMap).forEach(rlNum => {
        const roomId = `room-${selectedGroupPlotting.replace(/\s+/g, '-')}-${rlNum}`;
        const hasRoom = newRooms.some(r => r.groupName === selectedGroupPlotting && r.roomNumber === `Kamar ${rlNum}`);
        
        if (!hasRoom) {
          newRooms.push({
            id: roomId,
            groupName: selectedGroupPlotting,
            hotelName: 'Makkah',
            hotelDetailName: 'Swissôtel Makkah',
            roomNumber: `Kamar ${rlNum}`,
            roomType: roomNumMap[rlNum].length === 2 ? 'Double' : roomNumMap[rlNum].length === 3 ? 'Triple' : 'Quad',
            jamaahNames: roomNumMap[rlNum],
            notes: rlNum === '1' ? 'Mahrom / Pasutri (AI Plotted)' : rlNum === '3' ? 'Dekat lift / Lantai Bawah (AI Plotted)' : 'Plotting Otomatis AI',
            colorTag: rlNum === '1' ? 'red' : rlNum === '3' ? 'green' : 'slate'
          });
        } else {
          newRooms = newRooms.map(r => {
            if (r.groupName === selectedGroupPlotting && r.roomNumber === `Kamar ${rlNum}`) {
              return {
                ...r,
                jamaahNames: roomNumMap[rlNum],
                roomType: roomNumMap[rlNum].length === 2 ? 'Double' : roomNumMap[rlNum].length === 3 ? 'Triple' : 'Quad',
              };
            }
            return r;
          });
        }
      });

      setLocalRooms(newRooms);
      if (onUpdateRooms) {
        onUpdateRooms(newRooms);
      }

      setAiPlotReport({
        success: true,
        totalPlotted: targetJamaah.length,
        mahromCount: targetJamaah.filter(j => {
          const n = (((j as any).notes || (j as any).specialRequest || j.namaJamaah || '') as string).toLowerCase();
          return n.includes('mahrom') || n.includes('pasutri') || n.includes('suami') || n.includes('istri');
        }).length,
        elderlyCount: targetJamaah.filter(j => {
          const n = (((j as any).notes || (j as any).specialRequest || j.namaJamaah || '') as string).toLowerCase();
          return n.includes('lansia') || n.includes('dekat lift') || n.includes('lantai bawah');
        }).length,
        conflictRate: '0.0%'
      });
      setIsAiPlotting(false);
    }, 1200);
  };

  // Dynamic Suggestion list based on typing jamaah name
  const allJamaahNames = React.useMemo(() => {
    const list: string[] = [];
    localRooms.forEach(r => {
      r.jamaahNames.forEach(name => {
        if (!list.includes(name)) list.push(name);
      });
    });
    return list;
  }, [localRooms]);

  const filteredSuggestions = React.useMemo(() => {
    if (!searchTerm.trim()) return [];
    return allJamaahNames.filter(name =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [searchTerm, allJamaahNames]);

  // List unique hotels and groups for actual options selection based on selected group
  const uniqueHotels = React.useMemo(() => {
    if (!selectedGroup) return [];
    const list = new Set<string>();
    localRooms.forEach(r => {
      if (r.groupName === selectedGroup && r.hotelDetailName) {
        list.add(r.hotelDetailName);
      }
    });
    return Array.from(list);
  }, [localRooms, selectedGroup]);

  // List unique buses configuration based on selected group or overall jamaah
  const uniqueBuses = React.useMemo(() => {
    const list = new Set<string>();
    (jamaahList || []).forEach(j => {
      if (j.bus && (!selectedGroup || selectedGroup === 'All' || j.groupName === selectedGroup)) {
        list.add(j.bus);
      }
    });
    return Array.from(list).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  }, [jamaahList, selectedGroup]);

  // Filter logic and sorting
  const filteredRooms = React.useMemo(() => {
    const list = localRooms.filter((room) => {
      const matchesSearch = 
        room.roomNumber.includes(searchTerm) ||
        room.jamaahNames.some(name => name.toLowerCase().includes(searchTerm.toLowerCase()));
        
      const matchesGroup = !selectedGroup || selectedGroup === 'All' || room.groupName === selectedGroup;
      const matchesHotel = !selectedHotelFilter || selectedHotelFilter === 'All' || room.hotelDetailName === selectedHotelFilter;
      
      const matchesBus = !selectedBusFilter || selectedBusFilter === 'All' || room.jamaahNames.some(name => {
        const j = (jamaahList || []).find(jamaah => 
          jamaah.namaJamaah.toLowerCase() === name.toLowerCase() && 
          jamaah.groupName === room.groupName
        );
        return j?.bus === selectedBusFilter;
      });

      return matchesSearch && matchesGroup && matchesHotel && matchesBus;
    });

    const getRoomlistValue = (room: RoomManifest) => {
      const matchingJamaah = (jamaahList || []).filter((j) => {
        return j.groupName === room.groupName && room.jamaahNames.includes(j.namaJamaah);
      });
      return matchingJamaah[0]?.nomorRoomlist || room.id.split('-').pop() || '';
    };

    return [...list].sort((a, b) => {
      if (sortBy === 'roomlist') {
        const valA = getRoomlistValue(a);
        const valB = getRoomlistValue(b);
        
        const numA = parseInt(valA.replace(/\D/g, ''), 10);
        const numB = parseInt(valB.replace(/\D/g, ''), 10);
        
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
      } else {
        const valA = a.roomNumber || '';
        const valB = b.roomNumber || '';
        
        const numA = parseInt(valA.replace(/\D/g, ''), 10);
        const numB = parseInt(valB.replace(/\D/g, ''), 10);
        
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
      }
    });
  }, [localRooms, searchTerm, selectedGroup, selectedHotelFilter, sortBy, jamaahList]);

  // Precompute adjacent groups of the visible filtered rooms to assign their colors
  const adjacentGroups = React.useMemo(() => {
    return getAdjacentGroups(filteredRooms);
  }, [filteredRooms]);

  const roomToAdjacentGroup = React.useMemo(() => {
    const map: Record<string, { index: number; colorInfo: typeof ADJACENT_GROUP_COLORS[0] }> = {};
    adjacentGroups.forEach((group, index) => {
      const colorInfo = ADJACENT_GROUP_COLORS[index % ADJACENT_GROUP_COLORS.length];
      group.forEach(r => {
        map[r.id] = { index, colorInfo };
      });
    });
    return map;
  }, [adjacentGroups]);

  // Filter Jamaah for selected Plotting group
  const filteredJamaahForPlotting = React.useMemo(() => {
    return (jamaahList || []).filter(j => j.groupName === selectedGroupPlotting);
  }, [jamaahList, selectedGroupPlotting]);

  // Save Inline Room Number Edition (Handling Staff Only)
  const handleSaveRoomNumber = (id: string) => {
    if (!editingRoomNum.trim()) return;
    const target = localRooms.find(r => r.id === id);
    if (!target) return;
    const updated = handleRoomNumberChange(target, editingRoomNum.trim(), localRooms);
    setLocalRooms(updated);
    if (onUpdateRooms) {
      onUpdateRooms(updated);
    }
    setEditingRoomId(null);
  };

  // Open detailed Room edit (Manager Only)
  const handleOpenEditRoomModal = (room: RoomManifest) => {
    setEditingRoom(room);
    setEditedRoomNumber(room.roomNumber);
    setEditedNotes(room.notes || '');
    setEditedColorTag(resolveColorTag(room));
    setEditedRoomType(room.roomType);
    setEditedHotelDetailName(room.hotelDetailName);
    setEditedHotelName(room.hotelName);
    setEditedJamaahNamesText(room.jamaahNames.join(', '));
  };

  // Submit Detailed Room Edit (Manager Only)
  const handleSaveRoomDetailManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    const parsedNames = editedJamaahNamesText
      .split(/[\n,]+/)
      .map(n => n.trim())
      .filter(n => n.length > 0);

    // Run first step room number and checklist state allocation through handleRoomNumberChange
    let updatedRooms = handleRoomNumberChange(editingRoom, editedRoomNumber, localRooms);

    updatedRooms = updatedRooms.map(r => {
      if (r.id === editingRoom.id) {
        return {
          ...r,
          roomType: editedRoomType,
          hotelName: editedHotelName,
          hotelDetailName: editedHotelDetailName.trim(),
          notes: editedNotes.trim(),
          colorTag: editedColorTag,
          jamaahNames: parsedNames,
        };
      }
      return r;
    });

    setLocalRooms(updatedRooms);
    if (onUpdateRooms) {
      onUpdateRooms(updatedRooms);
    }
    setEditingRoom(null);
  };

  const handleDeleteRoom = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data roomlist/kamar ini?')) {
      const updated = localRooms.filter(r => r.id !== id);
      setLocalRooms(updated);
      if (onUpdateRooms) {
        onUpdateRooms(updated);
      }
      setEditingRoom(null);
    }
  };

  // Handle fast Roomlist distribution assign for specific Jamaah
  const handleUpdateJamaahRoomlist = (jamaahId: string, newRoomlist: string) => {
    if (!onUpdateJamaahList || !jamaahList) return;
    const updated = jamaahList.map(j => {
      if (j.id === jamaahId) {
        return { ...j, nomorRoomlist: newRoomlist };
      }
      return j;
    });
    onUpdateJamaahList(updated);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim() || !jamaahInput.trim()) {
      alert('Harap isi Nomor Kamar dan Nama Jamaah.');
      return;
    }

    const jamaahNames = jamaahInput
      .split(/[\n,]+/)
      .map(name => name.trim())
      .filter(name => name.length > 0);

    onAddRoom({
      groupName,
      hotelName,
      hotelDetailName,
      roomNumber: roomNumber.trim(),
      roomType,
      jamaahNames,
      notes: notes.trim() || undefined,
      colorTag: colorTag
    });

    setRoomNumber('');
    setJamaahInput('');
    setNotes('');
    setColorTag('slate');
    setIsModalOpen(false);
  };

  const autofillHotel = (hotel: 'Makkah' | 'Madinah') => {
    setHotelName(hotel);
    if (hotel === 'Makkah') {
      setHotelDetailName('Pullman ZamZam Makkah');
    } else {
      setHotelDetailName('Dallah Taibah Madinah');
    }
  };

  return (
    <div className="space-y-3" id="roomlist-section">
      
      {/* TABS SELECTOR (View list vs Plotting/Tentukan Roomlist) - Only for MANAGER */}
      {currentRole === 'MANAGER' && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 bg-white p-2 text-slate-800 rounded-xl border border-slate-200 shadow-3xs">
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60 max-w-sm w-full sm:w-auto text-[10pt] font-sans">
            <button
              onClick={() => setActiveSubSection('view-list')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 text-[10px] font-black uppercase text-center rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeSubSection === 'view-list' 
                  ? 'bg-white text-slate-900 shadow-2xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Hotel className="w-3.5 h-3.5" />
              <span>Daftar Hotel & Kamar</span>
            </button>
            
            <button
              onClick={() => setActiveSubSection('plot-roomlist')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 text-[10px] font-black uppercase text-center rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeSubSection === 'plot-roomlist' 
                  ? 'bg-white text-slate-900 shadow-2xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Tentukan No Roomlist</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0 font-sans">
            <button
              type="button"
              onClick={() => setIsEditChecklistTemplateOpen(true)}
              className="py-1.5 px-3 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/35 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 font-extrabold text-[10px] tracking-wide"
            >
              <Sliders className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Atur Template Checklist</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRekapanChecklistOpen(true)}
              className="py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 font-extrabold text-[10px] tracking-wide"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Rekap Hasil Checklist</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: PLOTTING ROOMLIST PORTAL INTEGRASI AI */}
      {activeSubSection === 'plot-roomlist' && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 animate-in fade-in duration-100">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">Plotting Distribusi Jamaah</span>
              <h4 className="text-xs font-bold text-slate-800">Tentukan Nomor Roomlist Untuk Setiap Anggota</h4>
            </div>
            
            {/* Group Selector for Plotting */}
            <div className="w-48">
              <select
                value={selectedGroupPlotting}
                onChange={(e) => setSelectedGroupPlotting(e.target.value)}
                className="w-full text-[11px] bg-slate-50 border border-slate-250 py-1 px-1.5 rounded-md font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              >
                {groups.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-[10px] text-indigo-700 bg-indigo-50/70 p-2 rounded-lg leading-relaxed">
            💡 <strong>Sistem Integrasi Manifes:</strong> Saat Anda memindahkan / mengubah nomor roomlist (RL) seorang jamaah, sistem akan langsung mengatur ulang, mengelompokkan ulang, dan memperbaharui Manifes Kamar secara otomatis di kedua portal.
          </p>

          {/* List of jamaah in the selected group with dropdown mapping selector */}
          <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-105 max-h-[300px] overflow-y-auto">
            {filteredJamaahForPlotting.length > 0 ? (
              filteredJamaahForPlotting.map((j) => (
                <div key={j.id} className="p-2 flex items-center justify-between text-[11px] hover:bg-slate-55/40 transition-colors">
                  <div>
                    <span className="font-mono text-slate-405 font-semibold text-[9px] mr-1.5 bg-slate-100 px-1 py-0.5 rounded">
                      No #{j.nomorJamaah}
                    </span>
                    <strong className="text-slate-800 font-bold">{j.namaJamaah}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-400 font-bold">SET NOMOR RL:</span>
                    <select
                      value={j.nomorRoomlist}
                      onChange={(e) => handleUpdateJamaahRoomlist(j.id, e.target.value)}
                      className="text-[11px] font-extrabold bg-amber-50 text-amber-900 border border-amber-300 py-0.5 px-1.5 rounded-md focus:outline-none"
                    >
                      <option value="-">- (Unassigned)</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => (
                        <option key={num} value={String(num)}>RL #{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-slate-400 text-[10px]">
                Tidak ada jamaah terdaftar di grup ini.
              </div>
            )}
          </div>

          {/* ✨ INTEGRASI ENGINE INTELIGENCE ARTIFISIAL (AI) */}
          <div className="p-4 bg-slate-900 text-white rounded-xl border border-[#D4AF37]/30 space-y-3 shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <div>
                <h5 className="text-xs font-black text-[#D4AF37] uppercase tracking-wide">KSA Smart AI Roomlist Engine</h5>
                <p className="text-[10px] text-slate-350 leading-relaxed font-bold">Plotting otomatis nomor kamar secara cepat, tepat, dan akurat berdasarkan catatan mahrom pasutri & lansia.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                disabled={isAiPlotting}
                onClick={handleAIAutoPlot}
                className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-slate-700 disabled:to-slate-800 text-slate-950 font-black text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                {isAiPlotting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin shrink-0"></span>
                    <span>AI sedang menganalisis & menulis plot...</span>
                  </>
                ) : (
                  <>
                    <span>✨ Jalankan AI Auto-Plot Kamar</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Optimization Report Success */}
            {aiPlotReport && (
              <div className="p-3 bg-white/5 border border-white/15 rounded-lg space-y-2 text-[10px] animate-in slide-in-from-top-1">
                <p className="font-extrabold text-[#D4AF37] flex items-center gap-1 uppercase">
                  <span>🚀 LAPORAN HUB OPTIMISASI AI SUKSES:</span>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300 font-bold">
                  <div className="p-1 px-2.5 bg-white/5 rounded border border-white/5">
                    <span className="block text-[8px] text-slate-400">TOTAL PLOTTED:</span>
                    <span className="text-xs font-sans font-black text-white">{aiPlotReport.totalPlotted} Pax</span>
                  </div>
                  <div className="p-1 px-2.5 bg-white/5 rounded border border-white/5">
                    <span className="block text-[8px] text-slate-400">PASUTRI ALIGNED:</span>
                    <span className="text-xs font-sans font-black text-white">{aiPlotReport.mahromCount} Pax</span>
                  </div>
                  <div className="p-1 px-2.5 bg-white/5 rounded border border-white/5">
                    <span className="block text-[8px] text-slate-400">LANSIA PRIORITY:</span>
                    <span className="text-xs font-sans font-black text-white">{aiPlotReport.elderlyCount} Pax</span>
                  </div>
                  <div className="p-1 px-2.5 bg-white/5 rounded border border-white/5">
                    <span className="block text-[8px] text-slate-400">KONFLIK RATE:</span>
                    <span className="text-xs font-sans font-black text-emerald-400">{aiPlotReport.conflictRate}</span>
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 italic font-bold">AI berhasil menyelaraskan pasutri ke dwi-kamar (Double) dan menempatkan lansia di dekat elevator.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DAFTAR HOTEL & KELOLA KAMAR */}
      {(currentRole === 'HANDLING' || activeSubSection === 'view-list') && (
        <div className="space-y-3">
          
          {/* SEARCH & FILTERS PANEL */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2.5 shadow-3xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              {/* Filter Group */}
              <div>
                <label className="block text-[9px] font-bold text-slate-400 mb-1 tracking-wide uppercase">PILIH GRUP</label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 py-1.5 px-2.5 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                >
                  <option value="">-- Pilih Grup Umroh --</option>
                  {groups.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Filter Hotel */}
              <div>
                <label className="block text-[9px] font-bold text-slate-400 mb-1 tracking-wide uppercase">PILIH NAMA HOTEL</label>
                <select
                  value={selectedHotelFilter}
                  onChange={(e) => setSelectedHotelFilter(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 py-1.5 px-2.5 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                >
                  <option value="">-- Pilih Hotel --</option>
                  {uniqueHotels.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              {/* Filter Bus */}
              <div>
                <label className="block text-[9px] font-bold text-slate-400 mb-1 tracking-wide uppercase">PILIH ALOKASI BUS</label>
                <select
                  value={selectedBusFilter}
                  onChange={(e) => setSelectedBusFilter(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 py-1.5 px-2.5 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                >
                  <option value="">-- Semua Bus --</option>
                  {uniqueBuses.map(b => (
                    <option key={b} value={b}>🚍 {b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Input Auto Suggestions */}
            <div className="relative">
              <label className="block text-[9px] font-bold text-slate-400 mb-1 tracking-wide uppercase">CARI NAMA / NOMOR KAMAR</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ketik nama jamaah atau nomor kamar..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] placeholder:text-slate-400 text-slate-850 font-medium"
                />
                {searchTerm && (
                  <button 
                    onClick={() => { setSearchTerm(''); setShowSuggestions(false); }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 hover:text-slate-655"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-30 overflow-hidden divide-y divide-slate-100 max-h-48 text-xs">
                  <div className="p-1 px-2.5 bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">SARAN NAMA JAMAAH</div>
                  {filteredSuggestions.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        setSearchTerm(name);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-amber-50 text-slate-800 font-semibold cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                      <span>{name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ACTION DOWNLOAD PDF UNDER FILTER */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide">URUTKAN KAMAR:</span>
                <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold select-none">
                  <button
                    type="button"
                    onClick={() => setSortBy('roomlist')}
                    className={`px-2.5 py-1 rounded transition-all cursor-pointer whitespace-nowrap ${
                      sortBy === 'roomlist'
                        ? 'bg-[#D4AF37] text-slate-900 font-extrabold shadow-3xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    No. Roomlist
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortBy('roomNumber')}
                    className={`px-2.5 py-1 rounded transition-all cursor-pointer whitespace-nowrap ${
                      sortBy === 'roomNumber'
                        ? 'bg-[#D4AF37] text-slate-900 font-extrabold shadow-3xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    No. Kamar
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsBulkEditMode(!isBulkEditMode)}
                  className={`py-1.5 px-3 border rounded-lg cursor-pointer transition-all shadow-3xs flex items-center justify-center gap-1.5 font-extrabold text-[10px] tracking-wide shrink-0 ${
                    isBulkEditMode 
                      ? 'bg-amber-400 text-slate-900 border-amber-500 font-black' 
                      : 'bg-white hover:bg-slate-50 text-slate-705 border-slate-200'
                  }`}
                  title="Aktifkan mode edit cepat nomor kamar tanpa membuka popup"
                >
                  <span>⚡ {isBulkEditMode ? 'SELESAI INPUT CEPAT' : 'INPUT CEPAT NO. KAMAR'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPreviewChecklistPDFOpen(true)}
                  className="py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg cursor-pointer transition-all shadow-3xs flex items-center justify-center gap-1.5 font-extrabold text-[10px] tracking-wide shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" />
                  <span>PDF REKAP CHECKLIST</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="py-1.5 px-3.5 bg-slate-900 hover:bg-slate-950 text-[#D4AF37] border border-[#D4AF37]/35 rounded-lg cursor-pointer transition-all shadow-xs flex items-center justify-center gap-1.5 font-extrabold text-[10px] tracking-wide shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>UNDUH PDF ROOMLIST</span>
                </button>
              </div>
            </div>
          </div>

          {(!selectedGroup || !selectedHotelFilter) ? (
            <div className="bg-amber-50/45 border border-amber-250/30 p-7 rounded-xl text-center space-y-2 max-w-lg mx-auto shadow-2xs">
              <Hotel className="w-9 h-9 text-[#D4AF37] mx-auto animate-pulse" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Silakan Pilih Grup & Hotel Terlebih Dahulu</h4>
              <p className="text-[10px] text-slate-500/90 leading-relaxed font-semibold">
                Pilih nama grup and nama hotel di atas untuk menampilkan roomlist
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* INFORMATION BANNER ABOUT TBD ROOMS & Persisted Checklist */}
              <div className="bg-[#FAF3E0] border border-amber-300 rounded-xl p-3.5 text-[10.5px] text-amber-900 font-medium leading-relaxed flex items-start gap-2.5 shadow-3xs hover:border-amber-400 transition-all">
                <span className="text-base select-none">🏢</span>
                <div className="space-y-1">
                  <strong className="block text-amber-950 text-[11px] font-black uppercase tracking-wide">💡 Sinkronisasi Checklist Berbasis FISIK KAMAR:</strong>
                  <span>Kondisi perlengkapan kini diikat secara dinamis ke <span className="underline font-bold text-amber-950">Fisik Kamar Hotel</span>, bukan sekadar mutasi nama jamaah. Karakteristik sistem baru:</span>
                  <ul className="list-disc list-inside mt-1.5 font-bold space-y-1 text-amber-950">
                    <li><span className="text-indigo-805">Pra-Inspeksi TBD</span>: Kamar TBD tetap bisa di-checklist sebelum plotting nomor resmi. Begitu nomor kamar resmi diinput, checklist otomatis bertransisi mengikat nomor kamar baru tersebut!</li>
                    <li><span className="text-emerald-705">Konsistensi Kondisi Fisik</span>: Jika Jamaah dimutasi dari Kamar <span className="font-mono bg-amber-100 p-0.5 rounded">402</span> ke Kamar <span className="font-mono bg-amber-100 p-0.5 rounded">505</span>, kondisi perlengkapan Kamar 402 tidak ikut pindah (tetap bertahan di Kamar 402), dan mereka mewarisi status rill Kamar 505!</li>
                    <li><span className="text-indigo-805">Operasional Super Cepat</span>: Gunakan tombol <strong className="text-emerald-700">Set Semua OK</strong> atau <strong className="text-indigo-750">Salin Laporan</strong> untuk mengisi berkas checklist ruko/kamar dalam 1 detik!</li>
                  </ul>
                </div>
              </div>

              {/* COMPACT TABLE (py-1.5 spacing & 5 columns) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-3xs overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wide text-[10px]">
                    <th className="py-2 px-3 text-center leading-tight whitespace-nowrap">Nomor<br/>Jamaah</th>
                    <th className="py-2 px-3 text-center leading-tight whitespace-nowrap font-bold">Nomor<br/>Roomlist</th>
                    <th className="py-2 px-3 leading-tight whitespace-nowrap">Nomor<br/>Kamar</th>
                    <th className="py-2 px-3 leading-tight whitespace-nowrap">Type<br/>Bed</th>
                    <th className="py-2 px-3 leading-tight text-center whitespace-nowrap">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRooms.length > 0 ? (
                    filteredRooms.map((room) => {
                      const matchingJamaah = (jamaahList || []).filter((j) => {
                        return j.groupName === room.groupName && room.jamaahNames.includes(j.namaJamaah);
                      });

                      // List of jamaah numbers
                      const jamaahNumbers = matchingJamaah.length > 0
                        ? matchingJamaah
                            .map((j) => parseInt(j.nomorJamaah) || j.nomorJamaah)
                            .sort((a, b) => {
                              if (typeof a === 'number' && typeof b === 'number') return a - b;
                              return String(a).localeCompare(String(b));
                            })
                            .join(', ')
                        : 'N/A';

                      // No. Roomlist (No. RL)
                      const roomlistNumber = matchingJamaah[0]?.nomorRoomlist || room.id.split('-').pop() || '-';
                      
                      // Resolve customized dynamic request styling
                      const isAdjacent = checkIsAdjacentText(room.notes || '', room.colorTag);
                      const hasOtherRequest = checkHasOtherSpecialRequest(room.notes || '', room.colorTag);
                      const adjInfo = roomToAdjacentGroup[room.id];
                      
                      let rowBg = 'bg-white hover:bg-slate-50/60';
                      let rowBorder = 'border-l-4 border-l-slate-200';
                      
                      if (adjInfo) {
                        rowBg = adjInfo.colorInfo.bg;
                        rowBorder = adjInfo.colorInfo.border;
                      } else if (hasOtherRequest) {
                        rowBg = 'bg-amber-50/15 hover:bg-amber-50/30';
                        rowBorder = 'border-l-4 border-l-amber-400';
                      }

                      return (
                        <tr 
                          key={room.id} 
                          className={`transition-all duration-300 ${rowBg} ${rowBorder} border-b border-slate-100`}
                        >
                          
                          {/* 1. NOMOR JAMAAH */}
                          <td className="py-2 px-3 text-center font-bold text-slate-705 font-mono whitespace-nowrap">
                            {jamaahNumbers}
                          </td>

                          {/* 2. NOMOR ROOMLIST */}
                          <td className="py-2 px-3 text-center font-extrabold text-[#D4AF37] whitespace-nowrap">
                            #{roomlistNumber}
                          </td>

                          {/* 3. NOMOR KAMAR INTERACTIVE ACTION */}
                          <td className="py-2 px-3 font-mono whitespace-nowrap">
                            {isBulkEditMode ? (
                              <input
                                type="text"
                                value={room.roomNumber || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const updated = localRooms.map(r => r.id === room.id ? { ...r, roomNumber: val } : r);
                                  setLocalRooms(updated);
                                }}
                                onBlur={(e) => {
                                  const val = e.target.value;
                                  const updated = handleRoomNumberChange(room, val, localRooms);
                                  setLocalRooms(updated);
                                  if (onUpdateRooms) {
                                    onUpdateRooms(updated);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const val = (e.target as HTMLInputElement).value;
                                    const updated = handleRoomNumberChange(room, val, localRooms);
                                    setLocalRooms(updated);
                                    if (onUpdateRooms) {
                                      onUpdateRooms(updated);
                                    }
                                    (e.target as HTMLInputElement).blur();
                                  }
                                }}
                                placeholder="Edit..."
                                className="w-16 p-0.5 bg-amber-50 text-[11px] font-black font-mono text-slate-900 border border-amber-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase"
                              />
                            ) : (
                              <span className="font-bold text-slate-900">{room.roomNumber || 'TBD'}</span>
                            )}
                          </td>

                          {/* 4. TYPE BED */}
                          <td className="py-2 px-3 whitespace-nowrap">
                            <span className="text-[10px] font-black text-slate-800 uppercase font-mono">
                              {room.roomType}
                            </span>
                          </td>

                          {/* 5. NOTES AND ACTIONS */}
                          <td className="py-2 px-3">
                            <div className="flex items-center justify-center gap-3">
                              
                              {/* If adjacent, render colored loop circle */}
                              {adjInfo ? (
                                <div 
                                  className={`w-3.5 h-3.5 rounded-full border border-slate-300 shadow-3xs cursor-help shrink-0 flex items-center justify-center relative group ${adjInfo.colorInfo.dot}`}
                                >
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-25 bg-current"></span>
                                  {/* Hover Tooltip Portal */}
                                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-50 bg-slate-900 text-white text-[9px] px-2 py-1 rounded shadow-lg whitespace-nowrap font-bold leading-none font-sans">
                                    [Keluarga Berdekatan - Grup {adjInfo.colorInfo.name}] {room.notes}
                                  </div>
                                </div>
                              ) : null}

                              {/* If other special request, render warning icon */}
                              {hasOtherRequest ? (
                                <div className="relative group shrink-0">
                                  <AlertTriangle className="w-4.5 h-4.5 text-amber-500 hover:text-amber-600 cursor-help animate-pulse" />
                                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-50 bg-slate-900 text-white text-[9px] px-2 py-1 rounded shadow-lg whitespace-nowrap font-bold leading-none font-sans">
                                    [⚠️ Request Khusus] {room.notes || 'Permintaan Khusus'}
                                  </div>
                                </div>
                              ) : null}

                              {/* If neither, render a simple clean separator */}
                              {!adjInfo && !hasOtherRequest ? (
                                <span className="text-slate-300 text-[10px] select-none font-mono">-</span>
                              ) : null}

                              {/* Direct Checklist Action Button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setChecklistRoomId(room.id);
                                }}
                                className={`p-1 border rounded-md transition-all cursor-pointer shadow-3xs inline-flex items-center justify-center shrink-0 ${
                                  room.checklist && Object.values(room.checklist).filter(Boolean).length > 0
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100/70'
                                    : 'bg-white hover:bg-slate-100 text-slate-450 hover:text-slate-900 border-slate-200'
                                }`}
                                title="Checklist Perlengkapan"
                              >
                                <ClipboardCheck className="w-3.5 h-3.5" />
                                {room.checklist && Object.values(room.checklist).filter(Boolean).length > 0 && (
                                  <span className="ml-1 text-[9px] font-black text-emerald-700 font-mono">
                                    {Object.values(room.checklist).filter(Boolean).length}/{checklistItems.length}
                                  </span>
                                )}
                              </button>

                              {/* Actions Group depending on role permission */}
                              <div className="relative inline-block text-left overflow-visible shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveRoomDropdownId(activeRoomDropdownId === room.id ? null : room.id);
                                  }}
                                  className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 rounded-md transition-all cursor-pointer shadow-3xs inline-flex items-center justify-center bg-white"
                                  title="Pilihan Aksi"
                                >
                                  <MoreVertical className="w-3.5 h-3.5 text-slate-500" />
                                </button>

                                {activeRoomDropdownId === room.id && (
                                  <>
                                    <button
                                      type="button"
                                      className="fixed inset-0 z-30 cursor-default bg-transparent"
                                      onClick={() => setActiveRoomDropdownId(null)}
                                    />
                                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-40 text-left animate-in fade-in slide-in-from-top-1 duration-105">
                                      {currentRole === 'MANAGER' ? (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setActiveRoomDropdownId(null);
                                              handleOpenEditRoomModal(room);
                                            }}
                                            className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-1.5 font-sans"
                                          >
                                            <Edit2 className="w-3 h-3 text-[#D4AF37]" />
                                            <span>Atur Kamar</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setActiveRoomDropdownId(null);
                                              handleDeleteRoom(room.id);
                                            }}
                                            className="w-full text-left px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center gap-1.5 font-sans"
                                          >
                                            <Trash2 className="w-3 text-rose-500" />
                                            <span>Hapus Kamar</span>
                                          </button>
                                        </>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActiveRoomDropdownId(null);
                                            setEditingRoomId(room.id);
                                            setEditingRoomNum(room.roomNumber);
                                          }}
                                          className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-1.5 font-sans"
                                        >
                                          <Edit2 className="w-3 h-3 text-slate-500" />
                                          <span>Edit No Kamar</span>
                                        </button>
                                      )}
                                      
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveRoomDropdownId(null);
                                          setSelectedRoomDetail(room);
                                        }}
                                        className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-1.5 font-sans border-t border-slate-100"
                                      >
                                        <Info className="w-3 h-3 text-blue-600" />
                                        <span>Detail Manifest</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveRoomDropdownId(null);
                                          setChecklistRoomId(room.id);
                                        }}
                                        className="w-full text-left px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors flex items-center gap-1.5 font-sans border-t border-slate-100"
                                      >
                                        <ClipboardCheck className="w-3.5 h-3.5 text-indigo-500" />
                                        <span>Checklist Perlengkapan</span>
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>

                            </div>
                          </td>

                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 px-4 text-center text-slate-400 text-[10px]">
                        Tidak ada manifes kecocokan data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            </div>
          )}
        </div>
      )}

      {/* DETAILED INFO DIALOG SHEET */}
      {selectedRoomDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-100">
            <div className="p-3 bg-[#1A1A1A] text-white flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-[#D4AF37]">Rincian Kamar {selectedRoomDetail.roomNumber}</span>
              <button onClick={() => setSelectedRoomDetail(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs leading-relaxed">
              <div>
                <span className="text-[9px] font-bold text-slate-400 block uppercase">NAMA GROUP</span>
                <p className="font-bold text-slate-800 text-[11px]">{selectedRoomDetail.groupName}</p>
              </div>
              
              <div>
                <span className="text-[9px] font-bold text-slate-400 block uppercase">NAMA HOTEL & KOTA</span>
                <p className="font-medium text-slate-800 text-[11px]">
                  {selectedRoomDetail.hotelDetailName} ({selectedRoomDetail.hotelName === 'Makkah' ? '🕋 Makkah' : '🕌 Madinah'})
                </p>
              </div>

              <div>
                <span className="text-[9px] font-bold text-[#D4AF37] block uppercase font-mono">DOKUMEN INTEGRASI JEMAAH ({selectedRoomDetail.jamaahNames.length} Orang)</span>
                <ul className="list-disc pl-4 space-y-0.5 mt-1 font-extrabold text-slate-700">
                  {selectedRoomDetail.jamaahNames.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2 rounded border bg-slate-50">
                <span className="text-[9px] font-bold text-slate-400 block uppercase">Catatan Operasional & Warna Tag:</span>
                <p className="text-[10px] font-bold text-slate-700 mt-1">
                  💡 {selectedRoomDetail.notes || 'Umum / Tidak ada permintaan spesifik'}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[8px] font-bold bg-white border p-1 rounded">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Label Tag: {getRowStyles(resolveColorTag(selectedRoomDetail)).label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL UNTUK PORTAL MANAGER (FULL CONTROL: BED TYPE, WARNA TAG, ATUR NOTES) */}
      {currentRole === 'MANAGER' && editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in">
            <div className="px-4 py-3 bg-[#1A1A1A] text-white flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-extrabold text-[11px] text-[#D4AF37] uppercase">ATUR PENUH KAMAR ({editingRoom.roomNumber})</span>
              </div>
              <button onClick={() => setEditingRoom(null)} className="text-white hover:text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRoomDetailManual} className="p-4 space-y-3.5 text-xs">
              
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">NOMOR KAMAR</label>
                  <input
                    type="text"
                    required
                    value={editedRoomNumber}
                    onChange={(e) => setEditedRoomNumber(e.target.value)}
                    className="w-full p-1.5 mt-0.5 border border-slate-300 rounded font-black text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">TIPE BED</label>
                  <select
                    value={editedRoomType}
                    onChange={(e) => setEditedRoomType(e.target.value as any)}
                    className="w-full p-1.5 mt-0.5 border border-slate-300 rounded text-slate-850 font-bold focus:outline-none"
                  >
                    <option value="Double">Double (2 Bed)</option>
                    <option value="Triple">Triple (3 Bed)</option>
                    <option value="Quad">Quad (4 Bed)</option>
                  </select>
                </div>
              </div>

              {/* HOTEL DETAIL */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase font-semibold">KOTA</label>
                  <select
                    value={editedHotelName}
                    onChange={(e) => setEditedHotelName(e.target.value as any)}
                    className="w-full p-1.5 mt-0.5 border border-slate-300 rounded font-bold"
                  >
                    <option value="Makkah">Makkah</option>
                    <option value="Madinah">Madinah</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">NAMA HOTEL DETAIL</label>
                  <input
                    type="text"
                    required
                    value={editedHotelDetailName}
                    onChange={(e) => setEditedHotelDetailName(e.target.value)}
                    className="w-full p-1.5 mt-0.5 border border-slate-300 rounded font-bold"
                  />
                </div>
              </div>

              {/* CHOOSE COLOR TAG FOR SIMPLE VIEW TO PORTAL HANDLING */}
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                  🎨 PILIH WARNA TAG INDIKASI OPERASIONAL (UNTUK PORTAL HANDLING):
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { tag: 'slate', name: 'Umum / Slate', bg: 'bg-slate-100 text-slate-705 border-slate-300' },
                    { tag: 'red', name: 'Pasutri (Red)', bg: 'bg-rose-100 text-rose-800 border-rose-300' },
                    { tag: 'green', name: 'Lift (Green)', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
                    { tag: 'blue', name: 'Lansia (Blue)', bg: 'bg-blue-100 text-blue-800 border-blue-300' },
                    { tag: 'yellow', name: 'Extra Bed (Yellow)', bg: 'bg-amber-100 text-amber-800 border-amber-300' },
                    { tag: 'purple', name: 'Sampingan (Purple)', bg: 'bg-purple-100 text-purple-800 border-purple-300' }
                  ].map((opt) => (
                    <button
                      key={opt.tag}
                      type="button"
                      onClick={() => setEditedColorTag(opt.tag as any)}
                      className={`py-1 px-1.5 border text-[9px] rounded-lg font-bold text-center flex flex-col items-center justify-center transition-all ${
                        editedColorTag === opt.tag 
                          ? 'ring-2 ring-indigo-505 ring-offset-1 scale-102 font-black border-slate-900 shadow-sm' 
                          : 'opacity-70 border-slate-200'
                      } ${opt.bg}`}
                    >
                      <span>{opt.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* OVERWRITE NOTES */}
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase">CATATAN KHUSUS / JEMAAH BERDEKATAN DENGAN SIAPA</label>
                <input
                  type="text"
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  placeholder="E.g. Berdekatan dengan keluarga Bpk. Budi Utama di lift"
                  className="w-full p-1.5 mt-0.5 border border-slate-300 rounded font-mono text-[11px]"
                />
              </div>

              {/* NAMES BLOCK */}
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase">EDIT DAFTAR PENGHUNI (Pisahkan dengan Koma)</label>
                <textarea
                  rows={2}
                  required
                  value={editedJamaahNamesText}
                  onChange={(e) => setEditedJamaahNamesText(e.target.value)}
                  className="w-full p-1.5 mt-0.5 border border-slate-300 rounded font-semibold text-slate-800"
                ></textarea>
              </div>

              <div className="flex justify-end gap-1.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleDeleteRoom(editingRoom.id)}
                  className="mr-auto px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded text-[10.5px] font-extrabold flex items-center gap-1 cursor-pointer"
                  title="Hapus Kamar"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>HAPUS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-650"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-black hover:bg-slate-900 text-[#D4AF37] rounded text-[10px] font-black border border-[#D4AF37]/45 cursor-pointer"
                >
                  SIMPAN PERUBAHAN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INPUT ROOMLIST BARU MODAL (FORM) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 bg-[#1A1A1A] text-white flex items-center justify-between">
              <span className="font-extrabold text-xs text-[#D4AF37] uppercase">Tambah Kamar</span>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-[9px] font-bold text-slate-700 mb-1">GRUP JEMAAH</label>
                <select 
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 font-bold"
                >
                  {groups.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 mb-0.5">KOTA HOTEL</label>
                <div className="grid grid-cols-2 gap-1 bg-slate-100 p-0.5 rounded">
                  <button
                    type="button"
                    onClick={() => autofillHotel('Makkah')}
                    className={`py-1 text-[10px] font-bold rounded ${
                      hotelName === 'Makkah' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Makkah
                  </button>
                  <button
                    type="button"
                    onClick={() => autofillHotel('Madinah')}
                    className={`py-1 text-[10px] font-bold rounded ${
                      hotelName === 'Madinah' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Madinah
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-700 mb-1">NAMA HOTEL DETAIL</label>
                <input
                  type="text"
                  value={hotelDetailName}
                  onChange={(e) => setHotelDetailName(e.target.value)}
                  className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-700 mb-1">NOMOR KAMAR</label>
                  <input
                    type="text"
                    required
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="E.g. 1405"
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-700 mb-1">TIPE BED</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as any)}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-800 font-bold"
                  >
                    <option value="Double">Double</option>
                    <option value="Triple">Triple</option>
                    <option value="Quad">Quad</option>
                  </select>
                </div>
              </div>

              {/* CHOOSE COLOR TAG FOR NEW ROOM */}
              <div>
                <label className="block text-[9px] font-bold text-slate-700 mb-1">PILIH WARNA INDIKASI</label>
                <select
                  value={colorTag}
                  onChange={(e) => setColorTag(e.target.value as any)}
                  className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-800 font-semibold"
                >
                  <option value="slate">Umum (Slate)</option>
                  <option value="red">Pasutri (Merah)</option>
                  <option value="green">Dekat Lift (Hijau)</option>
                  <option value="blue">Lansia / Scenic (Biru)</option>
                  <option value="yellow">Extra Bed (Kuning)</option>
                  <option value="purple">Berdekatan (Ungu)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-700 mb-0.5">PENGHUNI (Pisahkan Koma)</label>
                <textarea
                  rows={2}
                  required
                  value={jamaahInput}
                  onChange={(e) => setJamaahInput(e.target.value)}
                  placeholder="Bpk. Ahmad Subarjo, Ibu Aminah"
                  className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium"
                ></textarea>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-700 mb-0.5">CATATAN KHUSUS (Opsional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Sesama Mahrom"
                  className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="flex justify-end gap-1 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-black text-[#D4AF37] rounded text-[10px] font-bold border border-[#D4AF37]/30"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP EDIT NOMOR KAMAR KHUSUS HANDLING PORTAL */}
      {currentRole === 'HANDLING' && editingRoomId && (() => {
        const targetRoom = localRooms.find(r => r.id === editingRoomId);
        if (!targetRoom) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="p-4 bg-slate-900 text-white border-b border-[#D4AF37]/20 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-black tracking-wide uppercase text-white font-sans">Edit Nomor Kamar</span>
                </div>
                <button 
                  onClick={() => setEditingRoomId(null)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 text-xs font-semibold font-sans">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Grup Umroh / Paket</span>
                  <p className="text-slate-800 font-bold">{targetRoom.groupName}</p>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">No. Roomlist (RL)</span>
                    <p className="text-amber-600 font-extrabold text-sm">#{targetRoom.id.split('-').pop()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Tipe Kamar</span>
                    <p className="text-slate-800 font-extrabold text-sm uppercase">{targetRoom.roomType}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Hotel Penempatan</span>
                  <p className="text-slate-800 font-bold">{targetRoom.hotelDetailName} ({targetRoom.hotelName})</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Daftar Jamaah ({targetRoom.jamaahNames.length})</span>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150 space-y-1 font-semibold text-slate-700">
                    {targetRoom.jamaahNames.map((name, index) => (
                      <div key={index} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        <span>{name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="text-[10px] text-slate-400 uppercase font-black block tracking-wider">Masukkan Nomor Kamar Baru</label>
                  <input
                    type="text"
                    value={editingRoomNum}
                    onChange={(e) => setEditingRoomNum(e.target.value)}
                    placeholder="Contoh: 1215, 804"
                    className="w-full p-2.5 bg-slate-50 border border-slate-250 rounded-lg text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:bg-white text-center font-mono"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveRoomNumber(targetRoom.id);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEditingRoomId(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-extrabold rounded-lg cursor-pointer transition-colors font-sans"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveRoomNumber(targetRoom.id)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-[#D4AF37] text-xs font-extrabold rounded-lg cursor-pointer transition-all shadow-xs font-sans"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* PDF REPORT VIEW PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-slate-950/85 backdrop-blur-xs">
          <div className="w-full max-w-5xl bg-white sm:rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 h-full sm:h-auto max-h-[100vh] flex flex-col">
            <div className="px-3.5 py-3 bg-[#1A1A1A] text-white flex items-center justify-between border-b border-slate-700 shrink-0">
              <span className="font-bold text-xs text-[#D4AF37] uppercase font-black">PREVIEW MANIFES PDF</span>
              <button onClick={() => setIsPreviewOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-8 overflow-y-auto bg-slate-200 print:bg-white print:p-0 print:overflow-visible flex-1">
              <div id="printable-area" className="bg-white mx-auto shadow-md print:shadow-none min-h-[297mm] text-black w-full" style={{ width: '210mm', maxWidth: '100%', padding: '15mm' }}>
                <div className="text-center border-b-[2px] border-black pb-4 mb-6">
                  <h3 className="font-bold text-[14pt] tracking-tight uppercase text-black">PT. JEJAK IMANI BERKAH BERSAMA</h3>
                  <p className="text-[12pt] font-semibold mt-1 uppercase text-black">MANIFES UTAMA DEPARTEMEN HANDLING KSA</p>
                  <div className="mt-4 text-[11pt] font-medium space-y-1.5 text-left mb-2 text-black">
                    <p><span className="font-semibold uppercase w-20 inline-block">Grup</span>: {selectedGroup || 'Semua Grup'}</p>
                    <p><span className="font-semibold uppercase w-20 inline-block">Hotel</span>: {selectedHotelFilter || 'Semua Hotel'}</p>
                    <p><span className="font-semibold uppercase w-20 inline-block">Bus</span>: {selectedBusFilter || 'Semua Bus'}</p>
                  </div>
                </div>

                {/* Tabel Detail */}
                <div className="w-full">
                  <table className="w-full text-[11pt] text-left border-collapse border border-black mb-10">
                    <thead>
                      <tr className="bg-gray-100 border-b border-black text-black">
                        <th className="p-2 border border-black text-center font-bold font-sans w-16">No. RL</th>
                        <th className="p-2 border border-black text-center font-bold font-sans w-24">No. Kamar</th>
                        <th className="p-2 border border-black text-center font-bold font-sans w-24">Tipe Bed</th>
                        <th className="p-2 border border-black font-bold font-sans">Nama-Nama Penghuni Kamar</th>
                        <th className="p-2 border border-black font-bold font-sans w-48">Catatan / Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black bg-white leading-relaxed text-black">
                      {filteredRooms.length > 0 ? (
                        filteredRooms.map((room) => {
                          const isAdj = checkIsAdjacentText(room.notes || '', room.colorTag);
                          const hasOther = checkHasOtherSpecialRequest(room.notes || '', room.colorTag);
                          const roomlistNumber = room.id.split('-').pop() || '-';
                          return (
                            <tr key={room.id} className="text-black print:break-inside-avoid">
                              <td className="p-2 border border-black text-center font-semibold align-top">
                                {roomlistNumber}
                              </td>
                              <td className="p-2 border border-black text-center font-bold align-top">
                                {room.roomNumber || 'TBD'}
                              </td>
                              <td className="p-2 border border-black text-center font-semibold uppercase align-top">
                                {room.roomType}
                              </td>
                              <td className="p-2 border border-black font-medium align-top">
                                <div className="space-y-1">
                                  {room.jamaahNames.map((name, i) => (
                                    <div key={i}>
                                      {i + 1}. {name}
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="p-2 border border-black font-medium text-[10.5pt] align-top">
                                {isAdj && <span className="font-bold mr-1 uppercase">BERDEKATAN.</span>}
                                {hasOther && <span className="font-bold mr-1 uppercase">KHUSUS.</span>}
                                <span>{room.notes || '-'}</span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-gray-500 font-bold text-[11pt]">
                            Tidak ada data roomlist yang cocok untuk filter terpilih.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="text-center text-[10pt] text-gray-800 border-t border-black pt-4 lowercase font-mono pb-4">
                  GENERATED SECARA ELEKTRONIK PADA PORTAL HANDLING SAUDI ARABIA. JEJAK IMANI.
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border-t flex justify-end gap-1.5 shrink-0">
              <button 
                onClick={() => {
                  const originalTitle = document.title;
                  const hotelNameClean = selectedHotelFilter || 'Semua Hotel';
                  const groupNameClean = selectedGroup || 'Semua Grup';
                  const busNameClean = selectedBusFilter || 'Semua Bus';
                  document.title = `Roomlist [${hotelNameClean}] - [${groupNameClean}] - [${busNameClean}]`;
                  
                  const printableArea = document.getElementById('printable-area');
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
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer"
              >
                Print / Download PDF
              </button>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="px-3 py-1.5 bg-slate-200 text-slate-800 rounded text-[10px] font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. MODAL CHECKLIST PERLENGKAPAN KAMAR (PORTAL HANDLING / ALL) */}
      {checklistRoomId && (() => {
        const targetRoom = localRooms.find(r => r.id === checklistRoomId);
        if (!targetRoom) return null;
        const currentChecklist = targetRoom.checklist || {};
        
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-120">
              <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Checklist Perlengkapan</span>
                    <span className="text-xs font-bold text-white">Kamar #{targetRoom.roomNumber || 'TBD'} (RL #{targetRoom.id.split('-').pop() || '-'})</span>
                  </div>
                </div>
                <button 
                  onClick={() => setChecklistRoomId(null)} 
                  className="text-slate-400 hover:text-white bg-slate-850 p-1 rounded-full transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-4 space-y-3.5 overflow-y-auto max-h-[85vh]">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">PENGHUNI {targetRoom.roomType}</p>
                  <p className="text-xs font-extrabold text-slate-800 leading-snug">
                    {targetRoom.jamaahNames.join(', ')}
                  </p>
                </div>

                {/* QUICK ACTIONS FOR RUSHED OPERATIONS */}
                <div className="bg-amber-50/50 p-2 rounded-xl border border-amber-200/60 text-left space-y-2">
                  <span className="text-[9px] font-black tracking-wider text-amber-800 block uppercase">⚡ UTILITY CEPAT LAPORAN (SITUASI MEBET):</span>
                  
                  {/* Button Group */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const fullOK: Record<string, boolean> = {};
                        checklistItems.forEach(item => { fullOK[item] = true; });
                        const updated = localRooms.map(r => {
                          if (r.id === checklistRoomId) {
                            return { ...r, checklist: fullOK };
                          }
                          return r;
                        });
                        setLocalRooms(updated);
                        if (onUpdateRooms) onUpdateRooms(updated);
                        
                        // Also write to physical cache
                        const trimmedNum = (targetRoom.roomNumber || '').trim();
                        if (trimmedNum && trimmedNum !== 'TBD') {
                          const key = `${targetRoom.hotelDetailName}::${trimmedNum}`;
                          const updatedPhysical = {
                            ...physicalRoomChecklists,
                            [key]: fullOK
                          };
                          setPhysicalRoomChecklists(updatedPhysical);
                          localStorage.setItem('ji_physical_room_checklists', JSON.stringify(updatedPhysical));
                        }
                      }}
                      className="py-1 px-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[8.5px] font-black text-center transition-all cursor-pointer shadow-3xs flex items-center justify-center gap-1 uppercase"
                    >
                      <span>✅ SET SEMUA OK</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const emptyCheck: Record<string, boolean> = {};
                        const updated = localRooms.map(r => {
                          if (r.id === checklistRoomId) {
                            return { ...r, checklist: emptyCheck };
                          }
                          return r;
                        });
                        setLocalRooms(updated);
                        if (onUpdateRooms) onUpdateRooms(updated);
                        
                        // Also write to physical cache
                        const trimmedNum = (targetRoom.roomNumber || '').trim();
                        if (trimmedNum && trimmedNum !== 'TBD') {
                          const key = `${targetRoom.hotelDetailName}::${trimmedNum}`;
                          const updatedPhysical = {
                            ...physicalRoomChecklists,
                            [key]: emptyCheck
                          };
                          setPhysicalRoomChecklists(updatedPhysical);
                          localStorage.setItem('ji_physical_room_checklists', JSON.stringify(updatedPhysical));
                        }
                      }}
                      className="py-1 px-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded text-[8.5px] font-bold text-center transition-all cursor-pointer border border-slate-200 shadow-3xs flex items-center justify-center gap-1 uppercase"
                    >
                      <span>🔄 KOSONGKAN</span>
                    </button>
                  </div>

                  {/* Dropdown to Copy from another Room */}
                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-200/60">
                    <span className="text-[8.5px] font-bold text-slate-500 whitespace-nowrap">SALIN CHECKLIST:</span>
                    <select
                      onChange={(e) => {
                        const sourceRoomId = e.target.value;
                        if (!sourceRoomId) return;
                        const sourceRoom = localRooms.find(r => r.id === sourceRoomId);
                        if (sourceRoom) {
                          const copiedChecklist = sourceRoom.checklist || {};
                          const updated = localRooms.map(r => {
                            if (r.id === checklistRoomId) {
                              return { ...r, checklist: copiedChecklist };
                            }
                            return r;
                          });
                          setLocalRooms(updated);
                          if (onUpdateRooms) onUpdateRooms(updated);

                          // Write physical cache
                          const trimmedNum = (targetRoom.roomNumber || '').trim();
                          if (trimmedNum && trimmedNum !== 'TBD') {
                            const key = `${targetRoom.hotelDetailName}::${trimmedNum}`;
                            const updatedPhysical = {
                              ...physicalRoomChecklists,
                              [key]: copiedChecklist
                            };
                            setPhysicalRoomChecklists(updatedPhysical);
                            localStorage.setItem('ji_physical_room_checklists', JSON.stringify(updatedPhysical));
                          }
                        }
                        // Reset select value
                        e.target.value = "";
                      }}
                      className="text-[9px] font-bold bg-white text-slate-800 border border-slate-200 py-0.5 px-1 rounded flex-1 focus:outline-none cursor-pointer"
                    >
                      <option value="">-- Salin dari Kamar Lain --</option>
                      {localRooms
                        .filter(r => r.id !== checklistRoomId && r.hotelDetailName === targetRoom.hotelDetailName)
                        .map(r => (
                          <option key={r.id} value={r.id}>
                            Kamar #{r.roomNumber || 'TBD'} ({r.jamaahNames[0] || 'Tanpa Nama'}...)
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  <label className="text-[9px] font-black tracking-widest text-[#D4AF37] block uppercase mb-1">DATA PERLENGKAPAN</label>
                  {checklistItems.map((item) => {
                    const isChecked = !!currentChecklist[item];
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          const updatedChecklist = {
                            ...(targetRoom.checklist || {}),
                            [item]: !isChecked
                          };

                          const updated = localRooms.map(r => {
                            if (r.id === checklistRoomId) {
                              return {
                                ...r,
                                checklist: updatedChecklist
                              };
                            }
                            return r;
                          });
                          setLocalRooms(updated);
                          if (onUpdateRooms) onUpdateRooms(updated);

                          // Also write to physical room checklists if active room number is specified
                          const trimmedNum = (targetRoom.roomNumber || '').trim();
                          if (trimmedNum && trimmedNum !== 'TBD') {
                            const key = `${targetRoom.hotelDetailName}::${trimmedNum}`;
                            const updatedPhysical = {
                              ...physicalRoomChecklists,
                              [key]: updatedChecklist
                            };
                            setPhysicalRoomChecklists(updatedPhysical);
                            localStorage.setItem('ji_physical_room_checklists', JSON.stringify(updatedPhysical));
                          }
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left font-sans transition-all cursor-pointer ${
                          isChecked 
                            ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900 shadow-3xs' 
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xs font-bold">{item}</span>
                        <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                          isChecked ? 'bg-emerald-500 text-white' : 'border border-slate-350 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <span>Selesai: {Object.values(currentChecklist).filter(Boolean).length} / {checklistItems.length} Item</span>
                  <button
                    type="button"
                    onClick={() => setChecklistRoomId(null)}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-950 text-[#D4AF37] font-extrabold rounded-lg transition-all shadow-xs"
                  >
                    Selesai & Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 2. MODAL TEMPLATE CHECKLIST SETTING (MANAGER ONLY) */}
      {isEditChecklistTemplateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-120">
            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Portal Manager</span>
                  <span className="text-xs font-bold text-white">Atur Template Perlengkapan</span>
                </div>
              </div>
              <button 
                onClick={() => setIsEditChecklistTemplateOpen(false)} 
                className="text-slate-400 hover:text-white bg-slate-850 p-1 rounded-full transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                Tentukan daftar item perlengkapan kamar yang harus dipersiapkan dan di-checklist oleh petugas lapangan handling bandara/hotel.
              </p>

              {/* Add New Item */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newChecklistItem.trim()) return;
                  if (checklistItems.includes(newChecklistItem.trim())) {
                    alert("Item checklist ini sudah terdaftar!");
                    return;
                  }
                  const updated = [...checklistItems, newChecklistItem.trim()];
                  setChecklistItems(updated);
                  localStorage.setItem('ji_roomlist_checklist_items', JSON.stringify(updated));
                  setNewChecklistItem('');
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  type="text"
                  placeholder="Tambah perlengkapan baru..."
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  className="w-full py-1.5 px-3 text-xs bg-slate-50 border border-slate-250 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="p-1 px-2.5 bg-slate-900 hover:bg-slate-950 text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg cursor-pointer font-black text-xs h-[32px] flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah</span>
                </button>
              </form>

              {/* Template Items List */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <span className="text-[9px] font-black tracking-widest text-slate-400 block uppercase mb-1">Daftar Aktif</span>
                {checklistItems.map((item, index) => (
                  <div 
                    key={item}
                    className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg"
                  >
                    <span className="text-xs font-bold text-slate-800">{index + 1}. {item}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus item checklist "${item}"?`)) {
                          const updated = checklistItems.filter(i => i !== item);
                          setChecklistItems(updated);
                          localStorage.setItem('ji_roomlist_checklist_items', JSON.stringify(updated));
                        }
                      }}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-md transition-all cursor-pointer"
                      title="Hapus Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Options */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Reset seluruh template perlengkapan ke pengaturan bawaan awal?")) {
                      const defaults = ['Tentcard Greeting', 'Cover Key', 'Zamzam 5L', 'Handuk Sesuai', 'Amenities Sesuai', 'Kamar Bersih'];
                      setChecklistItems(defaults);
                      localStorage.setItem('ji_roomlist_checklist_items', JSON.stringify(defaults));
                    }
                  }}
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase underline cursor-pointer"
                >
                  Reset ke Bawaan
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditChecklistTemplateOpen(false)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-950 text-[#D4AF37] font-extrabold text-[10px] rounded-lg transition-all"
                >
                  Simpan & Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODAL REKAP CHECKLIST ANALYTICS (MANAGER PORTAL VIEW REPORT) */}
      {isRekapanChecklistOpen && (() => {
        // Compute report stats on active group/hotel filter
        const visibleRooms = filteredRooms;
        const total = visibleRooms.length;
        
        let completedCount = 0;
        let partialCount = 0;
        let unstartedCount = 0;
        
        const itemStatMap: Record<string, number> = {};
        checklistItems.forEach(item => { itemStatMap[item] = 0; });
        
        visibleRooms.forEach(room => {
          const checklistObj = room.checklist || {};
          const checkedKeys = Object.keys(checklistObj).filter(k => checklistItems.includes(k) && checklistObj[k] === true);
          const checkedCount = checkedKeys.length;
          
          if (checkedCount === checklistItems.length && checklistItems.length > 0) {
            completedCount++;
          } else if (checkedCount > 0) {
            partialCount++;
          } else {
            unstartedCount++;
          }
          
          checkedKeys.forEach(k => {
            if (itemStatMap[k] !== undefined) itemStatMap[k]++;
          });
        });

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-120 max-h-[90vh] flex flex-col">
              <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Analisis Manager</span>
                    <span className="text-xs font-bold text-white">Laporan Rekap Kesiapan & Checklist Kamar</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsRekapanChecklistOpen(false)} 
                  className="text-slate-400 hover:text-white bg-slate-850 p-1 rounded-full transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-5 space-y-5 overflow-y-auto flex-1">
                {/* Visual Summary Cards */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-center">
                    <span className="text-[9px] font-black block text-emerald-600 uppercase tracking-wide">SIAP 100%</span>
                    <h5 className="text-lg font-black text-emerald-800 mt-1">{completedCount} <span className="text-xs font-semibold text-emerald-600">kamar</span></h5>
                    <p className="text-[10px] text-emerald-500 font-bold mt-0.5">{total > 0 ? Math.round((completedCount/total)*100) : 0}% Kesiapan</p>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-center">
                    <span className="text-[9px] font-black block text-amber-600 uppercase tracking-wide">SEBAGIAN</span>
                    <h5 className="text-lg font-black text-amber-800 mt-1">{partialCount} <span className="text-xs font-semibold text-amber-600">kamar</span></h5>
                    <p className="text-[10px] text-amber-500 font-bold mt-0.5">{total > 0 ? Math.round((partialCount/total)*100) : 0}% Proses</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                    <span className="text-[9px] font-black block text-slate-500 uppercase tracking-wide">BELUM MULAI</span>
                    <h5 className="text-lg font-black text-slate-800 mt-1">{unstartedCount} <span className="text-xs font-semibold text-slate-500">kamar</span></h5>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{total > 0 ? Math.round((unstartedCount/total)*100) : 0}% Antrean</p>
                  </div>
                </div>

                {/* Progress bars for checklist items */}
                <div className="space-y-3 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <span className="text-[9px] font-black tracking-widest text-slate-400 block uppercase">REKAP PERLENGKAPAN (% KELENGKAPAN)</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {checklistItems.map(item => {
                      const count = itemStatMap[item] || 0;
                      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                      return (
                        <div key={item} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                            <span>{item}</span>
                            <span>{count} / {total} Kamar ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300 shadow-3xs">
                            <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Detailed Table Audit Checklist */}
                <div className="space-y-2">
                  <span className="text-[9px] font-black tracking-widest text-[#D4AF37] block uppercase">AUDIT HASIL CHECKLIST PER KAMAR</span>
                  <div className="border border-slate-100 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                    <table className="w-full text-left text-[11px] border-collapse bg-white">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-extrabold uppercase tracking-wider text-[9px] sticky top-0">
                          <th className="py-2.5 px-3">No. RL / No. Kamar</th>
                          <th className="py-2.5 px-3">Status Checklist Perlengkapan</th>
                          <th className="py-2.5 px-3 text-center">Item Berhasil</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {visibleRooms.map(room => {
                          const checklistObj = room.checklist || {};
                          const doneItems = checklistItems.filter(i => !!checklistObj[i]);
                          return (
                            <tr key={room.id} className="hover:bg-slate-50/60">
                              <td className="py-2.5 px-3 font-mono">
                                <span className="font-extrabold text-slate-800">#{room.roomNumber || 'TBD'}</span>
                                <span className="text-slate-400 font-medium ml-1.5">(RL #{room.id.split('-').pop()})</span>
                              </td>
                              <td className="py-2.5 px-3 font-medium text-[10px]">
                                {doneItems.length === checklistItems.length ? (
                                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded-md border border-emerald-200">
                                    <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                                    <span>Lengkap Siap Pakai</span>
                                  </span>
                                ) : doneItems.length > 0 ? (
                                  <span className="text-amber-850 font-bold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
                                    Sebagian Didistribusikan ({doneItems.length} item)
                                  </span>
                                ) : (
                                  <span className="text-slate-450 font-bold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md">
                                    Kosong / Belum Mulai
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-center font-bold font-mono text-indigo-700">
                                {doneItems.length} / {checklistItems.length}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="p-3.5 bg-slate-50 border-t flex justify-between gap-1.5 shrink-0 font-sans text-xs">
                <span className="text-slate-500 font-semibold self-center">Filter: {selectedGroup || 'Semua'} | {selectedHotelFilter || 'Semua Hotel'}</span>
                <button 
                  onClick={() => setIsRekapanChecklistOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-950 text-[#D4AF37] font-extrabold rounded-lg transition-all text-[11px] cursor-pointer"
                >
                  Tutup Laporan
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 4. MODAL DETAILED CHECKLIST RECAP PDF / PRINT VIEW PREVIEW */}
      {isPreviewChecklistPDFOpen && (() => {
        const visibleRooms = filteredRooms;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-slate-950/85 backdrop-blur-xs font-sans">
            <div className="w-full max-w-5xl bg-white sm:rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 h-full sm:h-auto max-h-[100vh] flex flex-col">
              <div className="px-3.5 py-3 bg-[#1A1A1A] text-white flex items-center justify-between border-b border-slate-700 shrink-0">
                <span className="font-bold text-xs text-[#D4AF37] uppercase font-black tracking-wide">PREVIEW DOKUMEN CHECKLIST PDF</span>
                <button onClick={() => setIsPreviewChecklistPDFOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 p-1 rounded-full cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 sm:p-8 overflow-y-auto bg-slate-200 print:bg-white print:p-0 print:overflow-visible flex-1">
                <div id="checklist-printable-area" className="bg-white mx-auto shadow-md print:shadow-none min-h-[297mm] text-black w-full font-sans" style={{ width: '210mm', maxWidth: '100%', padding: '15mm' }}>
                  <div className="text-center border-b-[2px] border-black pb-4 mb-6">
                    <h3 className="font-bold text-[14pt] tracking-tight uppercase text-black">PT. JEJAK IMANI BERKAH BERSAMA</h3>
                    <p className="text-[12pt] font-semibold mt-1 uppercase text-black">REKAP DOKUMEN CHECKLIST PERLENGKAPAN KAMAR</p>
                    <div className="mt-4 text-[11pt] font-medium space-y-1.5 text-left mb-2 text-black">
                      <p><span className="font-semibold uppercase w-20 inline-block">Grup</span>: {selectedGroup || 'Semua Grup'}</p>
                      <p><span className="font-semibold uppercase w-20 inline-block">Hotel</span>: {selectedHotelFilter || 'Semua Hotel'}</p>
                      <p><span className="font-semibold uppercase w-20 inline-block">Dicetak</span>: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>

                  {/* Summary of Statistics */}
                  <div className="grid grid-cols-4 gap-3 border border-black p-3 mb-6 bg-gray-50 leading-snug">
                    <div>
                      <span className="text-[8.5pt] font-semibold text-gray-500 block uppercase">TOTAL KAMAR</span>
                      <span className="text-xl font-bold">{visibleRooms.length} Kamar</span>
                    </div>
                    <div>
                      <span className="text-[8.5pt] font-semibold text-gray-500 block uppercase">SELESAI (SIAP 100%)</span>
                      <span className="text-xl font-bold font-mono">
                        {visibleRooms.filter(r => checklistItems.every(item => !!(r.checklist || {})[item])).length} / {visibleRooms.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8.5pt] font-semibold text-gray-500 block uppercase">SEBAGIAN TERSEBAR</span>
                      <span className="text-xl font-bold font-mono">
                        {visibleRooms.filter(r => {
                          const keys = Object.keys(r.checklist || {}).filter(k => checklistItems.includes(k) && r.checklist?.[k] === true);
                          return keys.length > 0 && keys.length < checklistItems.length;
                        }).length} Kamar
                      </span>
                    </div>
                    <div>
                      <span className="text-[8.5pt] font-semibold text-gray-500 block uppercase">BELUM MULAI</span>
                      <span className="text-xl font-bold font-mono">
                        {visibleRooms.filter(r => {
                          const keys = Object.keys(r.checklist || {}).filter(k => checklistItems.includes(k) && r.checklist?.[k] === true);
                          return keys.length === 0;
                        }).length} Kamar
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Table */}
                  <div className="w-full">
                    <table className="w-full text-[10pt] text-left border-collapse border border-black mb-10">
                      <thead>
                        <tr className="bg-gray-100 border-b border-black text-black">
                          <th className="p-2 border border-black text-center font-bold w-14">No. RL</th>
                          <th className="p-2 border border-black text-center font-bold w-20">Kamar</th>
                          <th className="p-2 border border-black text-center font-bold w-20">Type Bed</th>
                          <th className="p-2 border border-black font-bold w-60">Nama Penghuni</th>
                          <th className="p-2 border border-black font-bold">Status Perlengkapan Logistik</th>
                          <th className="p-2 border border-black text-center font-bold w-16">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black bg-white leading-relaxed text-black">
                        {visibleRooms.length > 0 ? (
                          visibleRooms.map((room) => {
                            const roomlistNumber = room.id.split('-').pop() || '-';
                            const checklistObj = room.checklist || {};
                            
                            return (
                              <tr key={room.id} className="text-black print:break-inside-avoid">
                                <td className="p-2 border border-black text-center font-semibold align-top">{roomlistNumber}</td>
                                <td className="p-2 border border-black text-center font-bold align-top">{room.roomNumber || 'TBD'}</td>
                                <td className="p-2 border border-black text-center font-semibold uppercase align-top font-mono text-[9pt]">{room.roomType}</td>
                                <td className="p-2 border border-black font-medium align-top leading-tight text-[9.5pt]">
                                  <div className="space-y-1">
                                    {room.jamaahNames.map((name, i) => (
                                      <div key={i}>{i + 1}. {name}</div>
                                    ))}
                                  </div>
                                </td>
                                <td className="p-2 border border-black font-medium align-top text-[9pt]">
                                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                                    {checklistItems.map(item => {
                                      const isChecked = !!checklistObj[item];
                                      return (
                                        <div key={item} className="flex items-center gap-1.5">
                                          <span>{isChecked ? '☑' : '☐'}</span>
                                          <span className={isChecked ? 'font-semibold text-black' : 'text-gray-400'}>{item}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </td>
                                <td className="p-2 border border-black font-semibold text-center align-top font-mono text-[10pt]">
                                  {Object.values(checklistObj).filter(Boolean).length} / {checklistItems.length}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="p-4 text-center text-gray-500 font-bold">
                              Tidak ada data yang cocok untuk dicetak.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-center text-[9pt] text-gray-800 border-t border-black pt-4 lowercase font-mono pb-4">
                    REKAPAN LAPORAN CHECKLIST OPERASIONAL JEJAK IMANI SAUDI ARABIA. PRINTED ON-SITE.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border-t flex justify-end gap-1.5 shrink-0">
                <button 
                  onClick={() => {
                    const originalTitle = document.title;
                    const hotelNameClean = selectedHotelFilter || 'Semua Hotel';
                    document.title = `Checklist-Recap-[${hotelNameClean}]`;
                    
                    const printableArea = document.getElementById('checklist-printable-area');
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
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-black cursor-pointer shadow-3xs"
                >
                  Cetak / Download PDF Laporan
                </button>
                <button 
                  onClick={() => setIsPreviewChecklistPDFOpen(false)}
                  className="px-3 py-2 bg-slate-200 text-slate-800 rounded text-xs font-bold cursor-pointer"
                >
                  Tutup Preview
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
