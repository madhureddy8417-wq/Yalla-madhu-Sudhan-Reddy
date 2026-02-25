'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Droplets, 
  Lightbulb, 
  Trash2, 
  Home, 
  FileText, 
  Truck, 
  PhoneCall,
  X,
  MapPin,
  Image as ImageIcon,
  Brain,
  Shield,
  Zap,
  Camera,
  Cpu,
  Navigation
} from 'lucide-react';
import Image from 'next/image';

const COMPLAINT_TYPES = [
  { id: 'road', icon: AlertTriangle, label: 'Damaged Road', dept: 'Roads', color: 'var(--red)', count: 84, areas: ['MG Road', 'Benz Circle', 'Autonagar'], photos: [10, 11, 12] },
  { id: 'pipe', icon: Droplets, label: 'Pipe Leakage', dept: 'Water', color: '#3b82f6', count: 52, areas: ['Suryaraopet', 'Governorpet', 'Labbipet'], photos: [20, 21, 22] },
  { id: 'light', icon: Lightbulb, label: 'Street Lights', dept: 'Electrical', color: 'var(--yellow)', count: 47, areas: ['Patamata', 'Gunadala', 'Ramalingeswara Nagar'], photos: [30, 31, 32] },
  { id: 'garbage', icon: Trash2, label: 'Garbage Heap', dept: 'Sanitation', color: 'var(--green)', count: 64, areas: ['Ajit Singh Nagar', 'Vambay Colony', 'Payakapuram'], photos: [40, 41, 42] },
  { id: 'tax', icon: Home, label: 'Property Tax', dept: 'Finance', color: 'var(--cyan)', count: 'Pay', areas: ['Central Zone', 'East Zone', 'West Zone'], photos: [50, 51, 52] },
  { id: 'cert', icon: FileText, label: 'Certificates', dept: 'Admin', color: 'var(--purple)', count: 'Apply', areas: ['VMC Main Office', 'Ward Offices'], photos: [60, 61, 62] },
  { id: 'track', icon: Truck, label: 'Vehicle Track', dept: 'GPS', color: 'var(--lime)', count: '6 Live', areas: ['Route A', 'Route B', 'Route C'], photos: [70, 71, 72] },
  { id: 'help', icon: PhoneCall, label: '155300 Help', dept: 'Support', color: 'var(--orange)', count: '24/7', areas: ['Command Control Center'], photos: [80, 81, 82] },
];

const WARD_NAMES = ['Ajit Singh Nagar W47', 'Suryaraopet W32', 'Patamata W55', 'Krishnanagar W28', 'Kanaka Durga W61', 'Ramalingeswara W18'];
const OFFICERS = ['K. Rajesh (AE)', 'M. Sravani (DE)', 'P. Venkat (EE)', 'S. Lakshmi (Env)', 'D. Kumar (Health)'];
const WARD_MEMBERS = ['B. Anjali', 'V. Prasad', 'T. Mohan', 'G. Sita', 'R. Naidu'];

const OFFICES = ['VMC Main Office', 'Zonal Office - East', 'Zonal Office - West', 'Zonal Office - Central', 'Ward Office 47'];
const PROCESS_STAGES = ['Received', 'Assigned', 'In Progress', 'Stalled', 'Resolved'];

interface Complaint {
  id: string;
  label: string;
  ward: string;
  status: 'pending' | 'progress' | 'resolved';
  processStage: string;
  time: string;
  color: string;
  assignedTo: {
    officer: string;
    wardMember: string;
    office: string;
  };
  deadline: number; // timestamp
  isEscalated: boolean;
  escalatedTo?: string;
}

export default function PurasevaScreen() {
  const [selectedService, setSelectedService] = useState<typeof COMPLAINT_TYPES[0] | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const generateComplaint = (seed: number, useCurrentTime = false, baseTime = 1740333600000): Complaint => {
    const type = COMPLAINT_TYPES[seed % 4]; 
    const status = (['pending', 'progress', 'resolved'] as const)[seed % 3];
    const uniqueId = useCurrentTime 
      ? `${seed.toString().slice(-4)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
      : (1000 + seed).toString();
    
    // Deadline is 2-5 minutes from now for demo purposes
    const deadlineOffset = (2 + (seed % 4)) * 60 * 1000;
    const deadline = (useCurrentTime ? Date.now() : baseTime) + deadlineOffset;
    const processStage = status === 'resolved' ? 'Resolved' : status === 'progress' ? 'In Progress' : (seed % 2 === 0 ? 'Received' : 'Stalled');

    return {
      id: `NR-2025-${uniqueId}`,
      label: type.label,
      ward: WARD_NAMES[seed % WARD_NAMES.length],
      status,
      processStage,
      time: useCurrentTime ? new Date().toLocaleTimeString('en-IN', { hour12: false }) : "10:00:00",
      color: type.color,
      assignedTo: {
        officer: OFFICERS[seed % OFFICERS.length],
        wardMember: WARD_MEMBERS[seed % WARD_MEMBERS.length],
        office: OFFICES[seed % OFFICES.length],
      },
      deadline,
      isEscalated: false,
    };
  };

  const [complaints, setComplaints] = useState<Complaint[]>(() => 
    Array.from({ length: 8 }).map((_, i) => generateComplaint(i, false))
  );
  const [stats, setStats] = useState({ total: 247, resolved: 189, pending: 58 });

  const resolveComplaint = (id: string) => {
    setComplaints(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'resolved', processStage: 'Resolved' } : c
    ));
    setStats(prev => ({
      ...prev,
      resolved: prev.resolved + 1,
      pending: Math.max(0, prev.pending - 1)
    }));
  };

  const escalateComplaint = (id: string) => {
    setComplaints(prev => prev.map(c => 
      c.id === id ? { ...c, isEscalated: true, escalatedTo: 'Commissioner Office' } : c
    ));
  };

  useEffect(() => {
    setMounted(true);
    const escalationInterval = setInterval(() => {
      setComplaints(prev => prev.map(c => {
        if (c.status !== 'resolved' && !c.isEscalated && Date.now() > c.deadline) {
          return { ...c, isEscalated: true, escalatedTo: 'Commissioner Office' };
        }
        return c;
      }));
    }, 5000);

    return () => clearInterval(escalationInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newC = generateComplaint(Date.now(), true);
      setComplaints(prev => [newC, ...prev.slice(0, 19)]);
      setStats(prev => ({
        total: prev.total + 1,
        resolved: newC.status === 'resolved' ? prev.resolved + 1 : prev.resolved,
        pending: newC.status !== 'resolved' ? prev.pending + 1 : prev.pending,
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-12">
      {/* Sidebar: Citizen Services */}
      <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="flex items-center gap-2 px-2">
            <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Citizen Services</h3>
          </div>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          {COMPLAINT_TYPES.map((svc, i) => (
            <motion.button 
              key={i} 
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedService(svc)}
              className="bg-white border border-black/5 rounded-xl p-4 text-left hover:border-blue-500/50 transition-all group relative overflow-hidden flex items-center gap-4 shadow-sm"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <svc.icon className="opacity-80 group-hover:scale-110 transition-transform shrink-0" size={20} style={{ color: svc.color }} />
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-500 truncate uppercase tracking-wider">{svc.label}</div>
                <div className="text-xs font-bold font-rajdhani text-slate-900">{svc.count}</div>
              </div>
            </motion.button>
          ))}
          
          {/* Architecture Icon Button */}
          <button 
            onClick={() => setShowHeatmap(!showHeatmap)} // Reusing showHeatmap state for simplicity or adding new one
            className="bg-white border border-black/5 rounded-xl p-4 text-left hover:border-blue-500/50 transition-all group relative overflow-hidden flex items-center gap-4 shadow-sm"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Shield className="text-cyan-600 opacity-80 group-hover:scale-110 transition-transform shrink-0" size={20} />
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-slate-500 truncate uppercase tracking-wider">System Arch</div>
              <div className="text-xs font-bold font-rajdhani text-slate-900">View Map</div>
            </div>
          </button>
        </div>

        {/* Impact Summary moved to sidebar bottom */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-2">
            <Zap size={14} className="text-emerald-600" /> Efficiency
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Fuel Saving', value: '30%' },
              { label: 'Resolution', value: '40%' },
              { label: 'Fake Reports', value: '-90%' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-[10px] text-emerald-600/70 font-bold uppercase">{item.label}</span>
                <span className="text-xs font-bold text-emerald-900 font-rajdhani">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 space-y-8">
        {/* Hero Section */}
        <section className="relative h-[350px] rounded-3xl overflow-hidden border border-black/10 group">
          <Image 
            src="https://picsum.photos/seed/vmc/1200/600" 
            alt="Vijayawada Smart City" 
            fill 
            className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
          <div className="absolute inset-0 p-8 flex flex-col justify-end gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-rajdhani text-slate-900 tracking-tight uppercase leading-none">SMART MUNICIPAL MITRA</h1>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Green & Smart Municipal Platform</p>
              </div>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-xl text-slate-700 text-xs leading-relaxed font-medium"
            >
              Integrating Citizen Services, AI Monitoring, and Data Intelligence for Andhra Pradesh. 
              Our 360° Garbage Vehicle AI System automatically detects issues and streamlines municipal operations.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-4"
            >
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20">
                Register Complaint
              </button>
              <button className="bg-white hover:bg-slate-50 text-slate-900 border border-black/10 px-5 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm">
                Track Status
              </button>
            </motion.div>
          </div>
        </section>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-black/5 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-600">
              <Truck size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-rajdhani uppercase tracking-wider">Mounted Hardware</h3>
            <ul className="space-y-2">
              {[
                { icon: Camera, text: '360° High-Res Camera' },
                { icon: Cpu, text: 'Edge AI Processor' },
                { icon: Navigation, text: 'GPS Tracking Module' }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[10px] text-slate-600 font-medium">
                  <item.icon size={12} className="text-orange-600" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600">
              <Brain size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-rajdhani uppercase tracking-wider">Auto Detection</h3>
            <ul className="grid grid-cols-1 gap-2">
              {[
                'Garbage piles & Overflow drains', 'Broken lights & Potholes', 'Encroachments'
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase">
                  <CheckCircle2 size={12} className="text-green-600" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-600">
              <Zap size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-rajdhani uppercase tracking-wider">Workflow</h3>
            <div className="space-y-3">
              {[
                'Van moves through ward',
                'AI detects issue automatically',
                'Complaint filed instantly'
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[9px] font-bold text-cyan-600 bg-cyan-400/10 w-4 h-4 rounded flex items-center justify-center shrink-0">{i+1}</span>
                  <span className="text-[10px] text-slate-600 font-medium leading-tight">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-2 overflow-hidden whitespace-nowrap relative">
          <motion.div 
            animate={{ x: [1000, -2000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="text-[10px] font-mono text-emerald-600/60 inline-block"
          >
            🟢 Ward 47: Pothole filled on MG Road | ⚠️ Ward 32: Pipe burst reported at Suryaraopet | 🚛 AP29-GV-007 covering Ward 55 | ✅ 12 complaints resolved in last hour | 📊 City cleanliness score: 68/100 | 🤖 AI detected 3 garbage heaps in Patamata
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-black/5 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-black/5 flex items-center justify-between bg-slate-50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <ClipboardList size={14} /> Live Feed
              </h3>
              <span className="text-[10px] bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full font-bold animate-pulse">LIVE</span>
            </div>
            <div className="divide-y divide-black/5 max-h-[400px] overflow-y-auto no-scrollbar">
              <AnimatePresence initial={false}>
                {complaints.map((c) => (
                  <motion.div 
                    layout
                    key={c.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      backgroundColor: c.status === 'resolved' ? 'rgba(34, 197, 94, 0.05)' : 'rgba(255, 255, 255, 0)'
                    }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 group relative overflow-hidden"
                  >
                    {c.status === 'resolved' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 bg-green-500/10 pointer-events-none"
                      />
                    )}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${c.color}15` }}>
                      <AlertTriangle size={18} style={{ color: c.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-bold transition-all duration-500 ${c.status === 'resolved' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {c.label} — {c.ward}
                      </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex flex-wrap gap-x-3 gap-y-1">
                <span>{c.id} • {c.time}</span>
                <span className="text-blue-600">Officer: {c.assignedTo.officer}</span>
                <span className="text-cyan-600">Ward: {c.assignedTo.wardMember}</span>
                <span className="text-blue-700">Office: {c.assignedTo.office}</span>
              </div>
                      
                      {/* Process Timeline */}
                      <div className="mt-3 flex items-center gap-1">
                        {PROCESS_STAGES.map((stage, idx) => {
                          const isCurrent = c.processStage === stage;
                          const isPast = PROCESS_STAGES.indexOf(c.processStage) > idx;
                          return (
                            <React.Fragment key={idx}>
                              <div className="flex flex-col items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-blue-600 ring-4 ring-blue-600/20' : isPast ? 'bg-green-600' : 'bg-black/10'}`} />
                                <span className={`text-[7px] font-bold uppercase ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`}>{stage}</span>
                              </div>
                              {idx < PROCESS_STAGES.length - 1 && (
                                <div className={`flex-1 h-[1px] mb-3 ${isPast ? 'bg-green-600/50' : 'bg-black/5'}`} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>

                      {c.status !== 'resolved' && (
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex-1 h-1 bg-black/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: '100%' }}
                              animate={{ width: mounted ? Math.max(0, (c.deadline - Date.now()) / (5 * 60 * 1000) * 100) + '%' : '100%' }}
                              className={`h-full ${c.isEscalated ? 'bg-red-500' : 'bg-blue-600'}`}
                            />
                          </div>
                          <span className={`text-[8px] font-bold uppercase ${c.isEscalated ? 'text-red-600 animate-pulse' : 'text-slate-400'}`}>
                            {c.isEscalated ? `Escalated to ${c.escalatedTo}` : 'Time Remaining'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <motion.div 
                          key={c.status}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`text-[10px] font-bold uppercase tracking-widest ${
                            c.status === 'resolved' ? 'text-green-600' : c.status === 'progress' ? 'text-blue-600' : 'text-orange-600'
                          }`}
                        >
                          {c.status}
                        </motion.div>
                      <div className="flex gap-2">
                        {c.status !== 'resolved' && (
                          <>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => resolveComplaint(c.id)}
                              className="p-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Resolve"
                            >
                              <CheckCircle2 size={14} />
                            </motion.button>
                            {!c.isEscalated && (
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => escalateComplaint(c.id)}
                                className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Escalate to Higher Officer"
                              >
                                <AlertTriangle size={14} />
                              </motion.button>
                            )}
                          </>
                        )}
                      </div>
                      {c.status === 'resolved' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 15 }}
                          className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center text-green-600"
                        >
                          <CheckCircle2 size={12} />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">Ward Performance</h3>
            <div className="space-y-5">
              {[
                { name: 'Ajit Singh Nagar', score: 87 },
                { name: 'Suryaraopet', score: 81 },
                { name: 'Patamata', score: 63 },
                { name: 'Krishnanagar', score: 71 },
                { name: 'Kanaka Durga', score: 55 },
              ].map((ward, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-400 w-4">{i+1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] font-bold mb-1.5">
                      <span className="text-slate-900 uppercase tracking-wider">{ward.name}</span>
                      <span className={ward.score > 80 ? 'text-green-600' : ward.score > 70 ? 'text-blue-600' : 'text-orange-600'}>{ward.score}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${ward.score}%` }}
                        className={`h-full ${ward.score > 80 ? 'bg-green-600' : ward.score > 70 ? 'bg-blue-600' : 'bg-orange-600'}`} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedService && (
          <DetailModal 
            selectedService={selectedService} 
            onClose={() => setSelectedService(null)} 
          />
        )}
        {showHeatmap && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHeatmap(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white border border-black/10 rounded-3xl overflow-hidden shadow-2xl p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 font-rajdhani uppercase tracking-wider">Platform Architecture</h3>
                <button onClick={() => setShowHeatmap(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
              </div>
              <svg viewBox="0 0 520 280" className="w-full h-auto">
                <defs>
                  <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <polygon points="0 0,6 3,0 6" fill="#1565C0"/>
                  </marker>
                </defs>
                <rect x="10" y="10" width="160" height="50" rx="8" fill="rgba(21,101,192,0.05)" stroke="#1565C0" strokeWidth="1.5"/>
                <text x="90" y="30" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1565C0">CITIZEN LAYER</text>
                <text x="90" y="46" textAnchor="middle" fontSize="9" fill="#64748b">Mobile App + Portal</text>
                <rect x="190" y="70" width="140" height="60" rx="8" fill="rgba(22,163,74,0.05)" stroke="#16a34a" strokeWidth="2"/>
                <text x="260" y="94" textAnchor="middle" fontSize="11" fontWeight="700" fill="#16a34a">AI CORE ENGINE</text>
                <text x="260" y="108" textAnchor="middle" fontSize="9" fill="#64748b">YOLOv8s + WTConv</text>
                <rect x="10" y="100" width="160" height="50" rx="8" fill="rgba(234,179,8,0.05)" stroke="#ca8a04" strokeWidth="1.5"/>
                <text x="90" y="120" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ca8a04">360° VEHICLE AI</text>
                <text x="90" y="136" textAnchor="middle" fontSize="9" fill="#64748b">Camera + GPS Tag</text>
                <rect x="370" y="70" width="140" height="60" rx="8" fill="rgba(220,38,38,0.05)" stroke="#dc2626" strokeWidth="1.5"/>
                <text x="440" y="94" textAnchor="middle" fontSize="11" fontWeight="700" fill="#dc2626">DATA LAYER</text>
                <text x="440" y="108" textAnchor="middle" fontSize="9" fill="#64748b">Real-time Sync</text>
                <line x1="170" y1="35" x2="190" y2="90" stroke="#1565C0" strokeWidth="1.5" markerEnd="url(#arr)"/>
                <line x1="170" y1="125" x2="190" y2="110" stroke="#ca8a04" strokeWidth="1.5" markerEnd="url(#arr)"/>
                <line x1="330" y1="100" x2="370" y2="100" stroke="#16a34a" strokeWidth="1.5" markerEnd="url(#arr)"/>
              </svg>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailModal({ selectedService, onClose }: { selectedService: typeof COMPLAINT_TYPES[0], onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-white border border-black/10 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-black/5 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${selectedService.color}20` }}>
              <selectedService.icon size={24} style={{ color: selectedService.color }} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-rajdhani">{selectedService.label}</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{selectedService.dept} Department</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <MapPin size={14} /> Active Locations
              </h4>
              <div className="space-y-2">
                {selectedService.areas.map((area, i) => (
                  <div key={i} className="bg-slate-50 border border-black/5 p-3 rounded-xl flex items-center justify-between group hover:border-blue-500/30 transition-colors">
                    <span className="text-xs font-bold text-slate-700">{area}</span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded font-bold">Active</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <ImageIcon size={14} /> Field Intelligence
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-black/5">
                  <div className="text-lg font-bold text-slate-900 font-rajdhani">{selectedService.count}</div>
                  <div className="text-[8px] text-slate-500 uppercase font-bold">Total Active</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-black/5">
                  <div className="text-lg font-bold text-green-600 font-rajdhani">84%</div>
                  <div className="text-[8px] text-slate-500 uppercase font-bold">Resolution Rate</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <ImageIcon size={14} /> Recent Field Photos
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {selectedService.photos.map((id, i) => (
                <div key={i} className="aspect-video relative rounded-xl overflow-hidden border border-black/10 group">
                  <Image 
                    src={`https://picsum.photos/seed/${id}/400/300`}
                    alt="Field Photo"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-[8px] text-white font-bold uppercase">Field Unit {i+1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-black/5 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-emerald-600/20"
          >
            Close View
          </button>
        </div>
      </motion.div>
    </div>
  );
}
