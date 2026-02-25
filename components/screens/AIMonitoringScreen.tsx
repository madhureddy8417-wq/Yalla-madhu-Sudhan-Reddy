'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Brain, 
  Trash2, 
  Navigation, 
  TrendingUp, 
  Activity, 
  BarChart3, 
  Map as MapIcon,
  Zap,
  CheckCircle2,
  AlertCircle,
  Fuel,
  Timer
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
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const DETECTION_DATA = [
  { name: 'Ward 47', garbage: 45, potholes: 12, lights: 8 },
  { name: 'Ward 32', garbage: 38, potholes: 15, lights: 5 },
  { name: 'Ward 55', garbage: 52, potholes: 8, lights: 12 },
  { name: 'Ward 28', garbage: 30, potholes: 20, lights: 4 },
  { name: 'Ward 61', garbage: 41, potholes: 10, lights: 7 },
  { name: 'Ward 18', garbage: 28, potholes: 5, lights: 3 },
];

const OPTIMIZATION_TREND = [
  { time: '06:00', fuel: 100, coverage: 20 },
  { time: '08:00', fuel: 92, coverage: 45 },
  { time: '10:00', fuel: 85, coverage: 70 },
  { time: '12:00', fuel: 78, coverage: 85 },
  { time: '14:00', fuel: 70, coverage: 95 },
  { time: '16:00', fuel: 65, coverage: 100 },
];

const CONFIDENCE_DATA = [
  { name: 'Garbage', value: 94 },
  { name: 'Potholes', value: 88 },
  { name: 'Lights', value: 91 },
  { name: 'Drains', value: 85 },
];

const COLORS = ['#3b82f6', '#10b981', '#0ea5e9', '#14b8a6'];

export default function AIMonitoringScreen() {
  const [liveDetections, setLiveDetections] = useState<any[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const types = ['Garbage Pile', 'Pothole', 'Broken Light', 'Overflow Drain'];
      const wards = ['Ward 47', 'Ward 32', 'Ward 55', 'Ward 28'];
      const newDetection = {
        id: Math.random(),
        type: types[Math.floor(Math.random() * types.length)],
        ward: wards[Math.floor(Math.random() * wards.length)],
        confidence: (85 + Math.random() * 14).toFixed(1),
        time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      };
      setLiveDetections(prev => [newDetection, ...prev.slice(0, 5)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold font-rajdhani bg-gradient-to-r from-emerald-900 via-emerald-700 to-teal-700 bg-clip-text text-transparent">
            AI Monitoring & Optimization Dashboard
          </h2>
          <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-bold">
            Real-time Neural Network Insights • Green Route Efficiency • Automated Issue Detection
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">AI Core Active</span>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Brain size={14} className="text-blue-600" />
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">YOLOv8s Optimized</span>
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total AI Detections', value: '1,284', trend: '+12%', icon: Trash2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Route Efficiency', value: '94.2%', trend: '+8.5%', icon: Navigation, color: 'text-emerald-600', bg: 'bg-emerald-600/10' },
          { label: 'Fuel Saved (Est.)', value: '420L', trend: '+15%', icon: Fuel, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Avg. Response Time', value: '14m', trend: '-22%', icon: Timer, color: 'text-emerald-600', bg: 'bg-emerald-600/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 relative overflow-hidden group"
          >
            <div className={`absolute -right-4 -top-4 w-16 h-16 ${stat.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />
            <div className="relative z-10 flex items-start justify-between">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-blue-600' : 'text-emerald-600'} flex items-center gap-1`}>
                <TrendingUp size={10} /> {stat.trend}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-slate-900 font-rajdhani">{stat.value}</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detection Trends Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-rajdhani">Garbage Detection Trends</h3>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Ward-wise AI Detection Breakdown</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-[8px] text-slate-500 font-bold uppercase">Garbage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-[8px] text-slate-500 font-bold uppercase">Potholes</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DETECTION_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(0,0,0,0.3)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="rgba(0,0,0,0.3)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                />
                <Bar dataKey="garbage" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="potholes" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Confidence Pie Chart */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-rajdhani mb-6">AI Model Confidence</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CONFIDENCE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CONFIDENCE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {CONFIDENCE_DATA.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <div className="text-[10px] font-bold text-slate-500 uppercase">{item.name}</div>
                <div className="text-[10px] font-bold text-slate-900 ml-auto">{item.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Optimization Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-rajdhani mb-8">Route Optimization Insights</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={OPTIMIZATION_TREND}>
                <defs>
                  <linearGradient id="colorFuel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(0,0,0,0.3)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="rgba(0,0,0,0.3)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="fuel" stroke="#3b82f6" fillOpacity={1} fill="url(#colorFuel)" />
                <Line type="monotone" dataKey="coverage" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live AI Detection Stream */}
        <div className="glass-card flex flex-col h-[400px]">
          <div className="p-5 border-b border-black/5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-rajdhani flex items-center gap-2">
              <Zap size={16} className="text-blue-500" /> Live AI Stream
            </h3>
            <span className="text-[8px] bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full font-bold animate-pulse">MONITORING</span>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
            {liveDetections.map((d) => (
              <motion.div 
                key={d.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-50 border border-black/5 p-3 rounded-xl flex flex-col gap-2 group hover:bg-slate-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    d.type.includes('Garbage') ? 'bg-green-500/10 text-green-600' : 
                    d.type.includes('Pothole') ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'
                  }`}>
                    <Activity size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold text-slate-900 truncate">{d.type}</div>
                      <div className="text-[8px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-black/5">{d.time}</div>
                    </div>
                    <div className="text-[8px] text-slate-500 uppercase font-bold">{d.ward}</div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[7px] font-bold uppercase tracking-widest">
                    <span className="text-slate-400">AI Confidence Score</span>
                    <span className="text-cyan-600">{d.confidence}%</span>
                  </div>
                  <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${d.confidence}%` }}
                      className="h-full bg-cyan-500"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
            {liveDetections.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 opacity-50">
                <Brain size={32} />
                <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting Detections...</p>
              </div>
            )}
          </div>
          <div className="p-4 bg-slate-50 border-t border-black/5">
            <button className="w-full py-2 bg-white hover:bg-slate-50 border border-black/10 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-widest transition-all shadow-sm">
              View Full History Log
            </button>
          </div>
        </div>
      </div>

      {/* Optimization Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600">
            <Navigation size={20} />
          </div>
          <h3 className="text-sm font-bold text-emerald-900 font-rajdhani uppercase tracking-wider">Green Route Optimization</h3>
          <p className="text-[10px] text-emerald-700 leading-relaxed">
            AI has optimized 24 routes today, reducing average travel distance by 18.4km per vehicle and lowering carbon footprint.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600">
            <CheckCircle2 size={12} /> 100% Eco-Friendly Routes
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-600">
            <Zap size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-rajdhani uppercase tracking-wider">Detection Accuracy</h3>
          <p className="text-[10px] text-slate-600 leading-relaxed">
            Current model (YOLOv8s) is performing at 92.4% mAP50 accuracy across all municipal categories.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600">
            <Activity size={12} /> Model Health: Excellent
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-600">
            <AlertCircle size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-rajdhani uppercase tracking-wider">Critical Hotspots</h3>
          <p className="text-[10px] text-slate-600 leading-relaxed">
            AI has identified 14 high-priority garbage accumulation zones requiring immediate attention.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-red-600">
            <AlertCircle size={12} /> Action Required: Ward 55
          </div>
        </div>
      </div>
    </div>
  );
}
