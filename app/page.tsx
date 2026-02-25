'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Activity, 
  Map as MapIcon, 
  Camera, 
  Truck, 
  LayoutDashboard, 
  Settings, 
  Navigation,
  AlertTriangle,
  Brain,
  BarChart3,
  X,
  Bell,
  User,
  Menu,
  ChevronLeft,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import dynamic from 'next/dynamic';
import PurasevaScreen from '@/components/screens/PurasevaScreen';
import AIVerifyScreen from '@/components/screens/AIVerifyScreen';
import VehicleAIScreen from '@/components/screens/VehicleAIScreen';
import WardDashboardScreen from '@/components/screens/WardDashboardScreen';
import EngineeringScreen from '@/components/screens/EngineeringScreen';
import DataIntelScreen from '@/components/screens/DataIntelScreen';
import AIMonitoringScreen from '@/components/screens/AIMonitoringScreen';
import AITrainingScreen from '@/components/screens/AITrainingScreen';
import GovernanceScreen from '@/components/screens/GovernanceScreen';
import DashboardOverview from '@/components/DashboardOverview';

import AIChatBot from '@/components/AIChatBot';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded-xl border border-black/5">
      <div className="text-slate-400 animate-pulse flex flex-col items-center gap-2">
        <MapIcon size={32} />
        <span className="text-xs font-mono uppercase tracking-widest">Initializing Map...</span>
      </div>
    </div>
  )
});

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['citizen', 'ward', 'engineer', 'admin'] },
  { id: 'puraseva', label: 'Citizen Services', icon: Activity, roles: ['citizen', 'admin'] },
  { id: 'verify', label: 'AI Verify', icon: Camera, roles: ['citizen', 'admin'] },
  { id: 'vehicle', label: '360° Vehicle AI', icon: Truck, roles: ['engineer', 'admin'] },
  { id: 'map', label: 'Smart Routing', icon: MapIcon, roles: ['citizen', 'ward', 'engineer', 'admin'] },
  { id: 'ward', label: 'Ward Dashboard', icon: LayoutDashboard, roles: ['ward', 'admin'] },
  { id: 'engineering', label: 'Engineering', icon: Settings, roles: ['engineer', 'admin'] },
  { id: 'data', label: 'Data Intelligence', icon: Activity, roles: ['ward', 'engineer', 'admin'] },
  { id: 'ai-monitoring', label: 'AI Monitoring', icon: BarChart3, roles: ['engineer', 'admin'] },
  { id: 'training', label: 'AI Training', icon: Brain, roles: ['engineer', 'admin'] },
  { id: 'governance', label: 'Governance', icon: Shield, roles: ['admin'] },
];

type Role = 'citizen' | 'ward' | 'engineer' | 'admin';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState<Role>('admin');
  const [time, setTime] = useState('');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-IN', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredNav = React.useMemo(() => 
    NAV_ITEMS.filter(item => item.roles.includes(userRole)),
    [userRole]
  );

  // Ensure active tab is valid for role
  useEffect(() => {
    const isValid = filteredNav.some(n => n.id === activeTab);
    if (!isValid && filteredNav.length > 0) {
      const timer = setTimeout(() => {
        setActiveTab(filteredNav[0].id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [userRole, filteredNav, activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview />;
      case 'puraseva': return <PurasevaScreen />;
      case 'verify': return <AIVerifyScreen />;
      case 'vehicle': return <VehicleAIScreen />;
      case 'ward': return <WardDashboardScreen />;
      case 'engineering': return <EngineeringScreen />;
      case 'data': return <DataIntelScreen />;
      case 'ai-monitoring': return <AIMonitoringScreen />;
      case 'training': return <AITrainingScreen />;
      case 'governance': return <GovernanceScreen />;
      case 'map': return (
        <motion.div
          key="map-view"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-4"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-rajdhani">Smart GPS Routing</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mt-1">Real-time Vijayawada municipal vehicle tracking and complaint mapping.</p>
            </div>
            <div className="flex gap-2">
              <div className="bg-white border border-black/5 p-3 rounded-xl flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-600">
                  <Truck size={20} />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 font-rajdhani leading-none">24</div>
                  <div className="text-[9px] text-slate-500 uppercase font-bold mt-1">Active Vehicles</div>
                </div>
              </div>
              <div className="bg-white border border-black/5 p-3 rounded-xl flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-600">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 font-rajdhani leading-none">14</div>
                  <div className="text-[9px] text-slate-500 uppercase font-bold mt-1">Hotspots</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 h-[600px]">
              <LeafletMap 
                selectedVehicleId={selectedVehicleId} 
                onVehicleSelect={setSelectedVehicleId} 
              />
            </div>
            
            <div className="space-y-4">
              <div className="bg-white border border-black/5 rounded-xl overflow-hidden shadow-sm">
                <div className="p-3 border-b border-black/5 flex items-center justify-between bg-slate-50">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Vehicles</h3>
                  <span className="text-[8px] bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full font-bold uppercase">18 Online</span>
                </div>
                <div className="p-2 space-y-2 max-h-[400px] overflow-y-auto no-scrollbar">
                  {[
                    { id: 'C101', name: 'AP29-GV-101', ward: 'Ward 10', status: 'In Service' },
                    { id: 'M202', name: 'AP29-GV-202', ward: 'Ward 11', status: 'Maintenance' },
                    { id: 'S303', name: 'AP29-GV-303', ward: 'Ward 12', status: 'In Service' },
                    ...Array.from({ length: 5 }).map((_, i) => ({
                      id: `V${i + 400}`,
                      name: `AP29-GV-${i + 400}`,
                      ward: `Ward ${13 + i}`,
                      status: i % 3 === 0 ? 'Offline' : 'In Service'
                    }))
                  ].map((v) => (
                    <button 
                      key={v.id} 
                      onClick={() => setSelectedVehicleId(v.id === selectedVehicleId ? null : v.id)}
                      className={`w-full text-left p-2 rounded-lg border transition-all flex items-center gap-3 ${
                        selectedVehicleId === v.id 
                          ? 'bg-emerald-50 border-emerald-200' 
                          : 'bg-white border-transparent hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        v.status === 'In Service' ? 'bg-green-500' : v.status === 'Maintenance' ? 'bg-orange-500' : 'bg-red-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className={`text-[10px] font-bold ${selectedVehicleId === v.id ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {v.name}
                        </div>
                        <div className="text-[8px] text-slate-500 font-mono truncate">{v.ward} • {v.status}</div>
                      </div>
                      {selectedVehicleId === v.id && (
                        <div className="text-[8px] font-bold text-emerald-600 animate-pulse">TRACKING</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      );
      default: return null;
    }
  };

  const [notifications, setNotifications] = useState<{ id: number; message: string; type: 'info' | 'warning' | 'success' }[]>([]);

  useEffect(() => {
    const alertMessages = [
      "New garbage heap detected in Ward 47",
      "Street light repair scheduled for MG Road",
      "Water pipeline leak reported in Suryaraopet",
      "Citizen feedback received: 5 stars for Ward 32",
      "AI detected unauthorized encroachment in Patamata",
      "Municipal van AP29-GV-012 completed its route",
      "Property tax collection target reached 85%",
      "Emergency alert: Heavy rain expected in next 2 hours"
    ];

    const interval = setInterval(() => {
      const randomMsg = alertMessages[Math.floor(Math.random() * alertMessages.length)];
      const newId = Date.now();
      const type = (Math.random() > 0.7 ? 'warning' : 'info') as 'warning' | 'info';
      setNotifications(prev => [{ id: newId, message: randomMsg, type }, ...prev].slice(0, 3));
      
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newId));
      }, 5000);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen flex transition-colors duration-500 ${isEmergencyMode ? 'bg-red-50' : 'bg-[var(--bg)]'} text-slate-900 font-sans selection:bg-blue-500/30 relative overflow-hidden`}>
      {/* Background Watermark */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center z-0">
        <div className="w-[800px] h-[800px] bg-no-repeat bg-center bg-contain" style={{ backgroundImage: 'url("https://vmc.ap.gov.in/images/logo.png")' }} />
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        hidden lg:flex shrink-0 border-r transition-all duration-300 flex-col sticky top-0 h-screen z-50 
        ${isEmergencyMode ? 'bg-white border-red-200' : 'bg-white border-black/5'} 
        backdrop-blur-xl
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-black/5 relative">
          <div className={`w-10 h-10 bg-gradient-to-br ${isEmergencyMode ? 'from-red-600 to-orange-500' : 'from-blue-600 via-emerald-500 to-teal-500'} rounded-xl flex items-center justify-center shadow-lg transition-all shrink-0`}>
            {isEmergencyMode ? <AlertTriangle className="text-white" size={22} /> : <Shield className="text-white" size={22} />}
          </div>
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
              <h1 className="font-bold text-xs tracking-tight text-slate-900 leading-none font-rajdhani uppercase truncate">SMART MUNICIPAL MITRA</h1>
              <span className={`text-[7px] font-mono uppercase tracking-widest block mt-1 ${isEmergencyMode ? 'text-red-600' : 'text-blue-600'}`}>
                {isEmergencyMode ? 'Emergency Active' : 'Smart & Eco Platform'}
              </span>
            </motion.div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-black/10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors z-[60] shadow-sm"
          >
            <ChevronLeft size={14} className={`transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
          {isSidebarOpen && <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Main Menu</div>}
          {filteredNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all group relative overflow-hidden ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <item.icon size={18} className={`${activeTab === item.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} transition-colors shrink-0`} />
              {isSidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-black/5 space-y-4">
          <button
            onClick={() => setIsEmergencyMode(!isEmergencyMode)}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
              isEmergencyMode 
                ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-500/40' 
                : 'bg-slate-50 text-slate-500 border border-black/5 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
            }`}
          >
            <AlertTriangle size={14} className="shrink-0" />
            {isSidebarOpen && (isEmergencyMode ? 'Emergency On' : 'Emergency Mode')}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-black/5 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-40">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-500 hover:text-slate-900">
              <Menu size={20} />
            </button>
          </div>
          
          <div className="hidden lg:block w-48" /> {/* Spacer */}

              <div className="flex flex-col items-center">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em] font-rajdhani">SMART MUNICIPAL MITRA</h2>
                <div className="text-[8px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">Smart & Green Municipal Platform</div>
              </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 font-mono text-[10px] text-blue-600">
              <Clock size={12} />
              {time}
            </div>
            
            <div className="relative">
              <button className="text-slate-500 hover:text-slate-900 transition-colors relative">
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {/* System Alert Popup (Glass Effect) */}
              <AnimatePresence>
                {notifications.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-4 w-72 glass p-4 rounded-2xl z-[100] space-y-3 shadow-xl"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">System Alerts</span>
                      <button onClick={() => setNotifications([])} className="text-[8px] text-blue-600 hover:underline">Clear All</button>
                    </div>
                    {notifications.map(n => (
                      <div key={n.id} className="flex gap-3 items-start p-2 rounded-xl bg-slate-50 border border-black/5">
                        <div className={`p-1.5 rounded-lg ${n.type === 'warning' ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'}`}>
                          {n.type === 'warning' ? <AlertTriangle size={12} /> : <Brain size={12} />}
                        </div>
                        <div className="text-[10px] text-slate-600 leading-tight">{n.message}</div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-black/10">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-bold text-slate-900">Admin User</div>
                <div className="text-[8px] text-slate-400 uppercase font-bold">Vijayawada MC</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white border border-white/10 shadow-lg">
                <User size={16} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          <div className="p-6 max-w-[1600px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-[110] lg:hidden flex flex-col border-r border-black/5 shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between border-b border-black/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                    <Shield size={18} />
                  </div>
                  <h1 className="font-bold text-xs text-slate-900 uppercase font-rajdhani">SMART MITRA</h1>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredNav.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                      activeTab === item.id 
                        ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Municipal Mitra Chatbot */}
      <AIChatBot isEmergencyMode={isEmergencyMode} />
    </div>
  );
}
