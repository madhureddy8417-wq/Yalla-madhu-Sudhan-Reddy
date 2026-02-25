'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, ClipboardList, CheckCircle2, Star, MapPin, User, Wallet, BarChart3, Truck } from 'lucide-react';

const WARDS_DATA = [
  { name: 'Ajit Singh Nagar', id: 'W47', score: 87, complaints: 284, resolved: 247, pending: 13, budget: 18.4, used: 16.2, rating: 4.6, officer: 'K. Venkata Rao', lat: 16.5074, lng: 80.6572, color: '#22c55e' },
  { name: 'Suryaraopet', id: 'W32', score: 81, complaints: 312, resolved: 258, pending: 20, budget: 22.1, used: 19.8, rating: 4.3, officer: 'S. Ramakrishna', lat: 16.5192, lng: 80.6208, color: '#3b82f6' },
  { name: 'Patamata', id: 'W55', score: 63, complaints: 342, resolved: 218, pending: 56, budget: 24.6, used: 22.8, rating: 3.4, officer: 'B. Srinivasa Rao', lat: 16.5011, lng: 80.6436, color: '#f97316' },
  { name: 'Krishnanagar', id: 'W28', score: 71, complaints: 267, resolved: 198, pending: 27, budget: 19.2, used: 17.4, rating: 3.8, officer: 'T. Narayana Rao', lat: 16.5289, lng: 80.6050, color: '#eab308' },
  { name: 'Kanaka Durga Nagar', id: 'W61', score: 74, complaints: 243, resolved: 186, pending: 19, budget: 16.8, used: 15.1, rating: 3.9, officer: 'M. Lakshmi Devi', lat: 16.5140, lng: 80.6320, color: '#8b5cf6' },
];

export default function WardDashboardScreen() {
  const [activeWard, setActiveWard] = useState(0);
  const w = WARDS_DATA[activeWard];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold font-rajdhani bg-gradient-to-r from-emerald-900 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Ward-wise Dashboard
        </h2>
        <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-bold">
          Vijayawada Municipal Corporation • Live cleanliness scores • Budget tracking • Hotspot maps
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {WARDS_DATA.map((ward, i) => (
          <button
            key={ward.id}
            onClick={() => setActiveWard(i)}
            className={`px-4 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border ${
              activeWard === i 
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20' 
                : 'bg-white border-black/5 text-slate-500 hover:border-emerald-500/30'
            }`}
          >
            {ward.id}: {ward.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Cleanliness Score', value: `${w.score}/100`, icon: Trophy, color: w.score > 80 ? 'text-emerald-600' : 'text-yellow-600' },
          { label: 'Total Complaints', value: w.complaints, icon: ClipboardList, color: 'text-emerald-600' },
          { label: 'Resolved', value: `${w.resolved} (${Math.round(w.resolved/w.complaints*100)}%)`, icon: CheckCircle2, color: 'text-emerald-600' },
          { label: 'Citizen Rating', value: w.rating, icon: Star, color: 'text-yellow-600' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-black/5 rounded-xl p-4 shadow-sm">
            <kpi.icon className="text-slate-400 mb-2" size={18} />
            <div className={`text-xl font-bold font-rajdhani ${kpi.color}`}>{kpi.value}</div>
            <div className="text-[9px] text-slate-500 font-bold uppercase mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-black/5 flex items-center justify-between bg-slate-50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <MapPin size={14} /> {w.name} Hotspot Map
            </h3>
          </div>
          <div className="aspect-video bg-emerald-50 relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Roads */}
              <line x1="0" y1="100" x2="400" y2="100" stroke="#cbd5e1" strokeWidth="8" />
              <line x1="200" y1="0" x2="200" y2="200" stroke="#cbd5e1" strokeWidth="6" />

              {/* Hotspots */}
              <motion.circle 
                cx="120" cy="70" r="20" fill="rgba(239,68,68,0.2)" 
                animate={{ r: [20, 25, 20] }} transition={{ duration: 2, repeat: Infinity }}
              />
              <circle cx="120" cy="70" r="4" fill="#ef4444" />
              <text x="120" y="60" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">GARBAGE</text>

              <motion.circle 
                cx="280" cy="130" r="15" fill="rgba(59,130,246,0.2)" 
                animate={{ r: [15, 20, 15] }} transition={{ duration: 2.5, repeat: Infinity }}
              />
              <circle cx="280" cy="130" r="4" fill="#3b82f6" />
              <text x="280" y="120" textAnchor="middle" fill="#3b82f6" fontSize="8" fontWeight="bold">PIPE LEAK</text>

              {/* Current Location */}
              <circle cx="200" cy="100" r="6" fill="#fff" stroke="#10b981" strokeWidth="2" />
            </svg>
            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md p-2 rounded-lg border border-black/5 text-[8px] font-mono text-slate-500">
              ZONE: {w.lat}°N {w.lng}°E
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
              <Truck size={14} className="text-emerald-600" /> Ward Vehicle Fleet
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'CLAP Autos', value: 12, icon: '🚛' },
                { label: 'Compactors', value: 4, icon: '🚚' },
                { label: 'Skip Loaders', value: 2, icon: '🏗️' },
              ].map((v) => (
                <div key={v.label} className="bg-slate-50 p-3 rounded-xl border border-black/5 text-center">
                  <div className="text-lg mb-1">{v.icon}</div>
                  <div className="text-sm font-bold text-slate-900 font-rajdhani">{v.value}</div>
                  <div className="text-[7px] font-bold text-slate-500 uppercase leading-tight">{v.label}</div>
                </div>
              ))}
            </div>
            <p className="text-[8px] text-slate-500 italic mt-3">
              * Vehicles assigned based on ward population and waste volume.
            </p>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
              <Wallet size={14} className="text-emerald-600" /> Budget Tracking
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase">Allocated</div>
                  <div className="text-xl font-bold text-slate-900 font-rajdhani">₹{w.budget}L</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-bold text-slate-500 uppercase">Utilised</div>
                  <div className="text-xl font-bold text-orange-600 font-rajdhani">₹{w.used}L</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(w.used/w.budget)*100}%` }}
                    className={`h-full ${w.used/w.budget > 0.9 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                  />
                </div>
                <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
                  <span>Remaining: ₹{(w.budget - w.used).toFixed(1)}L</span>
                  <span>{Math.round((w.used/w.budget)*100)}% Used</span>
                </div>
              </div>

              <div className="pt-4 border-t border-black/5 flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-medium">Pending Work Est.</span>
                <span className="text-[10px] text-red-600 font-bold">₹{(w.pending * 0.8).toFixed(1)}L</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
              <BarChart3 size={14} className="text-emerald-600" /> Issue Source Analysis
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className="text-slate-500">Citizen Reported</span>
                <span className="text-slate-900">142</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} className="h-full bg-emerald-500" />
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className="text-slate-500">AI Auto-Detected</span>
                <span className="text-emerald-600">170</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '55%' }} className="h-full bg-emerald-600" />
              </div>
              <p className="text-[9px] text-slate-500 italic mt-2">
                * AI detection identifies 20% more issues before citizens report them.
              </p>
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
              <Star size={14} className="text-emerald-600" /> Citizen Sentiment
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">😊</div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Positive</div>
                    <div className="text-[8px] text-slate-500 uppercase">68% of feedback</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-emerald-600 font-rajdhani">↑ 12%</div>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500" style={{ width: '68%' }} />
                <div className="h-full bg-yellow-500" style={{ width: '22%' }} />
                <div className="h-full bg-red-500" style={{ width: '10%' }} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-[8px] font-bold uppercase tracking-widest text-center">
                <div className="text-emerald-600">Happy</div>
                <div className="text-yellow-600">Neutral</div>
                <div className="text-red-600">Angry</div>
              </div>
              <p className="text-[9px] text-slate-500 italic mt-2">
                * Sentiment analyzed from 1,240 citizen comments using NLP.
              </p>
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
              <User size={14} className="text-emerald-600" /> Ward Officer
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100">
                <User size={24} />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{w.officer}</div>
                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{w.id} — {w.name}</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-2 rounded-lg border border-black/5">
                <div className="text-[8px] font-bold text-slate-500 uppercase">Pending</div>
                <div className="text-xs font-bold text-red-600">{w.pending} Cases</div>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-black/5">
                <div className="text-[8px] font-bold text-slate-500 uppercase">Status</div>
                <div className="text-xs font-bold text-emerald-600">ON TRACK</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
