'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Cloud, Droplets, Wind, Zap, AlertTriangle, Users, BarChart3, Trash2 } from 'lucide-react';

const FORECAST = [
  { day: 'Sat', icon: '⛅', high: 30, low: 22, rain: 20, risk: 'Low' },
  { day: 'Sun', icon: '🌧️', high: 26, low: 20, rain: 80, risk: 'High' },
  { day: 'Mon', icon: '⛈️', high: 24, low: 19, rain: 90, risk: 'Critical' },
  { day: 'Tue', icon: '🌦️', high: 27, low: 21, rain: 50, risk: 'Medium' },
  { day: 'Wed', icon: '☀️', high: 32, low: 23, rain: 5, risk: 'Low' },
];

export default function DataIntelScreen() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold font-rajdhani bg-gradient-to-r from-emerald-900 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Data Intelligence & 5-Day Forecast
        </h2>
        <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-bold">
          IMD weather integration • Flood prediction • AI insights • Waste overflow forecast • Staff deployment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Weather Card */}
          <div className="bg-white border border-black/5 rounded-2xl p-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-4">
              <span className="bg-emerald-100 text-emerald-600 text-[9px] font-bold px-2 py-1 rounded border border-emerald-200">IMD DATA</span>
            </div>
            <div className="flex items-center gap-6 mb-8">
              <div className="text-6xl">⛅</div>
              <div>
                <div className="text-4xl font-bold font-rajdhani text-slate-900">28°C</div>
                <div className="text-sm text-slate-600 font-medium">Vijayawada, AP • Partly Cloudy</div>
                <div className="flex gap-4 mt-2 text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1"><Droplets size={12} /> 72%</span>
                  <span className="flex items-center gap-1"><Wind size={12} /> 18 km/h</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {FORECAST.map((d) => (
                <div key={d.day} className="text-center space-y-2 group">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.day}</div>
                  <div className="text-2xl group-hover:scale-110 transition-transform">{d.icon}</div>
                  <div className="text-[10px] font-bold text-slate-900">{d.high}°/{d.low}°</div>
                  <div className="text-[9px] font-bold text-emerald-600">💧{d.rain}%</div>
                  <div className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                    d.risk === 'Critical' ? 'bg-red-100 text-red-600' : 
                    d.risk === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {d.risk}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
              <Zap size={14} className="text-emerald-600" /> AI Predictive Insights
            </h3>
            <div className="space-y-3">
              {[
                { level: 'critical', color: 'border-red-500 bg-red-50', msg: '🚨 Monday heavy rain (90%) — Pre-deploy drain cleaning teams in Patamata & W55' },
                { level: 'high', color: 'border-orange-500 bg-orange-50', msg: '⚠️ Sunday predicted flood risk at Krishna River basin — Alert Ward 68, 72' },
                { level: 'medium', color: 'border-yellow-500 bg-yellow-50', msg: '📊 Garbage generation increases 40% after weekend — Scale up vehicles Monday' },
                { level: 'low', color: 'border-emerald-500 bg-emerald-50', msg: '✅ Wednesday clear weather — ideal for road repair works in W47, W32' },
              ].map((i, idx) => (
                <div key={idx} className={`p-3 border-l-4 rounded-r-xl text-[11px] font-bold leading-relaxed ${i.color} text-slate-700`}>
                  {i.msg}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-500" /> Flood Risk Assessment
            </h3>
            <div className="space-y-4">
              {[
                { area: 'Krishna River Basin', risk: 72, c: 'bg-red-500' },
                { area: 'Patamata Low Zone', risk: 58, c: 'bg-orange-500' },
                { area: 'Penamaluru', risk: 45, c: 'bg-yellow-500' },
                { area: 'Ajit Singh Nagar', risk: 18, c: 'bg-emerald-500' },
              ].map((f) => (
                <div key={f.area} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-500">{f.area}</span>
                    <span className="text-slate-900">{f.risk}%</span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${f.risk}%` }} className={`h-full ${f.c}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
              <Trash2 size={14} className="text-emerald-600" /> Waste Generation Prediction
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Predicted for Monday</div>
                <div className="text-xl font-bold text-slate-900 font-rajdhani">420 Tons</div>
              </div>
              <div className="h-24 flex items-end gap-1 px-2">
                {[40, 60, 45, 70, 85, 90, 65].map((h, i) => (
                  <div key={i} className="flex-1 bg-emerald-500/10 rounded-t-sm relative group">
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${h}%` }} 
                      className={`absolute bottom-0 left-0 right-0 rounded-t-sm ${i === 5 ? 'bg-emerald-500' : 'bg-emerald-500/40'}`} 
                    />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[8px] font-bold text-white bg-black px-1 rounded transition-opacity">
                      {h}t
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase px-1">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
              <Cloud size={14} className="text-emerald-600" /> 24h Flood Risk Forecast
            </h3>
            <div className="h-32 flex items-end gap-2 px-2">
              {[
                { time: '00:00', risk: 20 },
                { time: '04:00', risk: 25 },
                { time: '08:00', risk: 45 },
                { time: '12:00', risk: 78 },
                { time: '16:00', risk: 92 },
                { time: '20:00', risk: 65 },
              ].map((r, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-emerald-500/5 rounded-t-lg relative group h-24 flex items-end">
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${r.risk}%` }} 
                      className={`w-full rounded-t-lg transition-colors ${r.risk > 70 ? 'bg-red-500' : r.risk > 40 ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                    />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[8px] font-bold text-white bg-black px-1 rounded transition-opacity">
                      {r.risk}%
                    </div>
                  </div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase">{r.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
              <Users size={14} className="text-emerald-600" /> Staff Deployment
            </h3>
            <p className="text-[10px] text-slate-500 mb-4">AI-recommended deployment for Sunday rain:</p>
            <div className="space-y-3">
              {[
                { dept: 'Drainage', cur: 12, rec: 24 },
                { dept: 'Sanitation', cur: 20, rec: 30 },
                { dept: 'Civil', cur: 8, rec: 15 },
              ].map((s) => (
                <div key={s.dept} className="flex justify-between items-center text-[11px] border-b border-black/5 pb-2">
                  <span className="text-slate-700 font-bold">{s.dept}</span>
                  <div className="flex items-center gap-2 font-bold">
                    <span className="text-slate-400">{s.cur}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-emerald-600">{s.rec}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
              <BarChart3 size={14} className="text-emerald-600" /> Category Heatmap
            </h3>
            <div className="aspect-square bg-slate-50 rounded-xl border border-black/5 flex items-center justify-center">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Heatmap Visualization</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
