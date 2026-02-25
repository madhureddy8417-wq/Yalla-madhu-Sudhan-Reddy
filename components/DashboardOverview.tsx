'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  Droplets, 
  Lightbulb, 
  Trash2, 
  Plus, 
  Search, 
  Map as MapIcon,
  Camera,
  Cpu,
  Navigation,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Clock,
  User,
  Bell,
  Brain,
  Sparkles,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const STATS = [
  { label: 'Damaged Roads', value: '124', trend: '+12%', up: false, icon: AlertTriangle, color: 'text-red-500', glow: 'shadow-red-500/20' },
  { label: 'Pipe Leakage', value: '42', trend: '-5%', up: true, icon: Droplets, color: 'text-blue-500', glow: 'shadow-blue-500/20' },
  { label: 'Street Lights', value: '89', trend: '+2%', up: false, icon: Lightbulb, color: 'text-yellow-500', glow: 'shadow-yellow-500/20' },
  { label: 'Green Coverage', value: '68%', trend: '+4%', up: true, icon: Sparkles, color: 'text-emerald-500', glow: 'shadow-emerald-500/20' },
];

const HARDWARE = [
  { name: '360° High Resolution Camera', desc: 'Real-time visual processing & object detection', icon: Camera },
  { name: 'Edge AI Processor', desc: 'On-device neural network for instant analysis', icon: Cpu },
  { name: 'GPS Tracking Module', desc: 'Precision location & route optimization', icon: Navigation },
];

const AUTO_DETECTION = [
  { label: 'Garbage Piles', active: true },
  { label: 'Overflow Drains', active: true },
  { label: 'Broken Streetlights', active: true },
  { label: 'Potholes', active: true },
  { label: 'Encroachments', active: true },
];

const CHART_DATA = [
  { name: 'Ward 1', complaints: 45, resolved: 38 },
  { name: 'Ward 2', complaints: 52, resolved: 42 },
  { name: 'Ward 3', complaints: 38, resolved: 35 },
  { name: 'Ward 4', complaints: 65, resolved: 50 },
  { name: 'Ward 5', complaints: 48, resolved: 40 },
];

const PIE_DATA = [
  { name: 'Roads', value: 35 },
  { name: 'Water', value: 25 },
  { name: 'Sanitation', value: 30 },
  { name: 'Lighting', value: 10 },
];

const COLORS = ['#1565C0', '#059669', '#10b981', '#42A5F5'];

const ACTIVITY_LOGS = [
  { id: 'LOG-8821', ward: 'Ward 47', vehicle: 'AP29-GV-101', action: 'Garbage Pile Detected', time: '10:45 AM' },
  { id: 'LOG-8822', ward: 'Ward 32', vehicle: 'AP29-GV-202', action: 'Pothole Geotagged', time: '10:32 AM' },
  { id: 'LOG-8823', ward: 'Ward 55', vehicle: 'AP29-GV-303', action: 'Overflow Drain Alert', time: '10:15 AM' },
  { id: 'LOG-8824', ward: 'Ward 12', vehicle: 'AP29-GV-105', action: 'Illegal Dumping Spotted', time: '09:58 AM' },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-8 pb-12">
      {/* Quick AI Query Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 glass-card p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Brain size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-600">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-rajdhani">Ask Municipal Mitra</h3>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Instant AI Assistance for Municipal Services</p>
              </div>
            </div>
            <div className="relative max-w-3xl">
              <input 
                id="dashboard-ai-input"
                type="text" 
                placeholder="e.g., 'When is the next garbage collection in Ward 10?' or 'How do I pay my water tax?'"
                className="w-full bg-slate-50 border border-black/10 rounded-2xl px-6 py-4 pr-32 text-xs text-slate-900 outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value;
                    if (val.trim()) {
                      window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: val }));
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
              />
              <button 
                onClick={() => {
                  const input = document.getElementById('dashboard-ai-input') as HTMLInputElement;
                  if (input?.value.trim()) {
                    window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: input.value }));
                    input.value = '';
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-105 transition-transform"
              >
                Ask AI
              </button>
            </div>
          </div>
        </motion.div>

        {/* Green Initiative Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform">
            <Sparkles size={100} />
          </div>
          <div className="relative z-10 space-y-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider font-rajdhani">Green Vijayawada</h3>
              <p className="text-[9px] text-emerald-100 uppercase font-bold tracking-widest mt-1">Sustainability Initiative</p>
            </div>
            <div className="pt-2">
              <div className="text-2xl font-bold font-rajdhani">84.2</div>
              <div className="text-[8px] uppercase font-bold text-emerald-100">City Eco-Score</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card p-6 flex flex-col gap-4 relative overflow-hidden group hover:glow-blue transition-all cursor-default ${stat.glow}`}
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${stat.up ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.trend}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 font-rajdhani">{stat.value}</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">{stat.label}</div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon size={80} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons & Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Actions & Hardware */}
        <div className="space-y-8">
          {/* Action Buttons */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <button className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                <Plus size={16} /> Register Complaint
              </button>
              <button className="w-full py-3 border border-black/10 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <Search size={16} /> Track Status
              </button>
              <button className="w-full py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2">
                <MapIcon size={16} /> Live Map View
              </button>
            </div>
          </div>

          {/* Mounted Hardware */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Mounted Hardware</h3>
            <div className="space-y-4">
              {HARDWARE.map((hw, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                    <hw.icon size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{hw.name}</div>
                    <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">{hw.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle: Charts */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bar Chart */}
            <div className="glass-card p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Ward Performance</h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CHART_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px' }}
                      itemStyle={{ fontSize: '10px' }}
                    />
                    <Bar dataKey="complaints" fill="#1565C0" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="resolved" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="glass-card p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Issue Distribution</h3>
              <div className="h-[200px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PIE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-bold text-slate-900 font-rajdhani">470</span>
                  <span className="text-[8px] text-slate-500 uppercase font-bold">Total</span>
                </div>
              </div>
            </div>
          </div>

          {/* Auto Detection Section */}
          <div className="glass-card p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">AI Auto-Detection Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {AUTO_DETECTION.map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-black/5">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <CheckCircle2 className="text-emerald-600" size={16} />
                  </motion.div>
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-black/5 bg-slate-50 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600 flex items-center gap-2">
            <Clock size={14} className="text-blue-600" /> Live Activity Feed
          </h3>
          <span className="text-[8px] bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">Real-time</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/5 text-[9px] uppercase tracking-widest text-slate-400">
                <th className="p-4 font-bold">Log ID</th>
                <th className="p-4 font-bold">Ward</th>
                <th className="p-4 font-bold">Vehicle ID</th>
                <th className="p-4 font-bold">Action Performed</th>
                <th className="p-4 font-bold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {ACTIVITY_LOGS.map((log) => (
                <tr key={log.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-[10px] font-mono text-slate-500">{log.id}</td>
                  <td className="p-4 text-[10px] font-bold text-slate-900">{log.ward}</td>
                  <td className="p-4 text-[10px] text-blue-600 font-bold">{log.vehicle}</td>
                  <td className="p-4 text-[10px] text-slate-600">{log.action}</td>
                  <td className="p-4 text-[10px] font-mono text-slate-400">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
