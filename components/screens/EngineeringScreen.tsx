'use client';

import React, { useState } from 'react';
import { Hammer, Map as MapIcon, CheckCircle2, AlertTriangle, Zap, Activity, Fuel, Fingerprint, Navigation, Layers } from 'lucide-react';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center text-slate-500 font-rajdhani">Initializing Map Engine...</div>
});

const ENG_WORKS = [
  { id: 'WO-2841', type: 'Road Repair', icon: '🛣️', location: 'MG Road, W47', status: 'completed', budget: 65000, spent: 58000, engineer: 'K. Ravi Kumar', steps: ['Survey', 'Dig', 'Repair', 'Seal', 'Inspect'], doneSteps: 5, lat: 16.508, lng: 80.652 },
  { id: 'WO-2842', type: 'Pipeline Replace', icon: '🔧', location: 'Suryaraopet, W32', status: 'progress', budget: 45000, spent: 28000, engineer: 'P. Subbarao', steps: ['Survey', 'Dig', 'Replace', 'Test', 'Close'], doneSteps: 3, lat: 16.520, lng: 80.619 },
  { id: 'WO-2843', type: 'Drain Cleaning', icon: '🚰', location: 'Patamata, W55', status: 'progress', budget: 28000, spent: 12000, engineer: 'S. Murali', steps: ['Survey', 'Clean', 'Flush', 'Inspect'], doneSteps: 2, lat: 16.503, lng: 80.640 },
  { id: 'WO-2844', type: 'Streetlight Install', icon: '💡', location: 'Krishnanagar, W28', status: 'pending', budget: 32000, spent: 0, engineer: 'R. Chandra', steps: ['Procure', 'Install', 'Wire', 'Test'], doneSteps: 0, lat: 16.530, lng: 80.607 },
];

export default function EngineeringScreen() {
  const [showHeatmap, setShowHeatmap] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold font-rajdhani bg-gradient-to-r from-emerald-900 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Engineering Update Maps
        </h2>
        <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-bold">
          Civil works • Before/After photos • Real-time map status • Budget tracking • Drainage | Roads | Pipelines
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-black/5 flex items-center justify-between bg-slate-50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <MapIcon size={14} /> Works Map — Vijayawada
              </h3>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                    showHeatmap ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-black/5'
                  }`}
                >
                  <Layers size={12} />
                  {showHeatmap ? 'Heatmap Active' : 'Show Heatmap'}
                </button>
                <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-bold">12 Active</span>
              </div>
            </div>
            <div className="aspect-[21/9] bg-emerald-50 relative">
              <LeafletMap showHeatmap={showHeatmap} engineeringWorks={ENG_WORKS} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-500" /> Pothole Clusters
              </h3>
              <div className="space-y-3">
                {[
                  { area: 'MG Road Sector 4', count: 12, severity: 'High' },
                  { area: 'Benz Circle Flyover', count: 8, severity: 'Medium' },
                  { area: 'Autonagar Gate', count: 15, severity: 'Critical' },
                ].map((c) => (
                  <div key={c.area} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-black/5">
                    <span className="text-[10px] font-bold text-slate-700">{c.area}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-900">{c.count} pts</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        c.severity === 'Critical' ? 'bg-red-100 text-red-600' : 
                        c.severity === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>{c.severity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
                <MapIcon size={14} className="text-emerald-600" /> Damage Heatmap
              </h3>
              <div className="aspect-video bg-slate-50 rounded-xl border border-black/5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-yellow-500/5 to-transparent" />
                <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest z-10">Road Health: 64%</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {ENG_WORKS.map((w) => (
              <div key={w.id} className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-black/5 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{w.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{w.type} — {w.location}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{w.id} • 👷 {w.engineer}</div>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase tracking-widest ${
                    w.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                    w.status === 'progress' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {w.status}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between gap-2 mb-6">
                    {w.steps.map((step, i) => (
                      <div key={step} className="flex-1 flex flex-col items-center gap-2 relative">
                        {i < w.steps.length - 1 && (
                          <div className={`absolute top-3 left-1/2 w-full h-0.5 ${i < w.doneSteps - 1 ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                        )}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 ${
                          i < w.doneSteps ? 'bg-emerald-500 text-white' : i === w.doneSteps && w.status === 'progress' ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-100 text-slate-400 border border-black/5'
                        }`}>
                          {i < w.doneSteps ? '✓' : i + 1}
                        </div>
                        <span className="text-[8px] font-bold text-slate-500 uppercase">{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-[10px]">
                    <div className="bg-slate-50 p-2 rounded-lg border border-black/5">
                      <div className="text-slate-500 uppercase font-bold text-[8px] mb-1">Budget</div>
                      <div className="text-slate-900 font-bold">₹{w.budget.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-black/5">
                      <div className="text-slate-500 uppercase font-bold text-[8px] mb-1">Spent</div>
                      <div className="text-orange-600 font-bold">₹{w.spent.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-black/5">
                      <div className="text-slate-500 uppercase font-bold text-[8px] mb-1">Remaining</div>
                      <div className="text-emerald-600 font-bold">₹{(w.budget - w.spent).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
              <Hammer size={14} className="text-emerald-600" /> Works Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Completed', value: 5, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'In Progress', value: 4, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Pending', value: 2, color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'Total Budget', value: '₹84L', color: 'text-emerald-700', bg: 'bg-emerald-50' },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} p-4 rounded-xl border border-black/5 shadow-sm`}>
                  <div className={`text-xl font-bold font-rajdhani ${s.color}`}>{s.value}</div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
              <Zap size={14} className="text-emerald-500" /> AI Resource Reallocation
            </h3>
            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-emerald-500/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-slate-900 uppercase">Recommendation</span>
                  <span className="text-[8px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded font-bold">HIGH IMPACT</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-relaxed">
                  Move <span className="text-slate-900 font-bold">2 vehicles</span> from <span className="text-emerald-600">Ajit Singh Nagar</span> to <span className="text-orange-600">Patamata</span>.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-3/4" />
                  </div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase">75% Efficiency Gain</span>
                </div>
              </div>
              <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg transition-all shadow-lg shadow-emerald-600/20 uppercase tracking-widest">
                Approve Reallocation
              </button>
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
              <Activity size={14} className="text-emerald-600" /> Technology & Monitoring
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-black/5">
                <Navigation size={16} className="text-emerald-600" />
                <div>
                  <div className="text-[10px] font-bold text-slate-900 uppercase">GPS Tracking</div>
                  <div className="text-[8px] text-slate-500">Real-time route monitoring active</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-black/5">
                <Fuel size={16} className="text-orange-600" />
                <div>
                  <div className="text-[10px] font-bold text-slate-900 uppercase">Fuel Monitoring</div>
                  <div className="text-[8px] text-slate-500">Based on km usage (Accuracy: 98%)</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-black/5">
                <Fingerprint size={16} className="text-emerald-600" />
                <div>
                  <div className="text-[10px] font-bold text-slate-900 uppercase">Biometric Attendance</div>
                  <div className="text-[8px] text-slate-500">Driver & Helper tracking synced</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
              <Activity size={14} className="text-emerald-600" /> Real-time Sensor Health
            </h3>
            <div className="space-y-3">
              {[
                { label: 'GPS Trackers', status: '98%', color: 'text-emerald-600' },
                { label: 'AI Cameras', status: '94%', color: 'text-emerald-600' },
                { label: 'Drain Sensors', status: '82%', color: 'text-blue-600' },
              ].map((s) => (
                <div key={s.label} className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-500">{s.label}</span>
                  <span className={s.color}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-600" /> Compliance Audit
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Photo Verification', status: '98%', color: 'text-emerald-600' },
                { label: 'GPS Geotagging', status: '100%', color: 'text-emerald-600' },
                { label: 'Budget Adherence', status: '92%', color: 'text-blue-600' },
                { label: 'Timeline Accuracy', status: '84%', color: 'text-orange-600' },
              ].map((a) => (
                <div key={a.label} className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-500">{a.label}</span>
                  <span className={a.color}>{a.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
