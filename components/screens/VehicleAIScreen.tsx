'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, BarChart3, ListChecks, Clock, ShieldCheck, Fuel, Fingerprint } from 'lucide-react';

interface LogEntry {
  id: number;
  time: string;
  type: string;
  location: string;
  status: string;
}

export default function VehicleAIScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState({
    detections: 0,
    autoFiled: 0,
    budget: 0,
    km: 0,
    speed: 18,
    fuel: 87,
    capacity: 34,
    biometric: 'Verified'
  });
  const [log, setLog] = useState<LogEntry[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let animationId: number;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.5);
      sky.addColorStop(0, '#bae6fd');
      sky.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H * 0.5);

      // Road
      const road = ctx.createLinearGradient(0, H * 0.5, 0, H);
      road.addColorStop(0, '#94a3b8');
      road.addColorStop(1, '#64748b');
      ctx.fillStyle = road;
      ctx.fillRect(0, H * 0.5, W, H * 0.5);

      // Perspective lines
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, H * 0.5);
        ctx.lineTo(W * 0.5 + (x - W * 0.5) * 2.5, H);
        ctx.stroke();
      }

      // Center lines
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2;
      ctx.setLineDash([20, 15]);
      ctx.beginPath();
      ctx.moveTo(W * 0.5, H * 0.5);
      ctx.lineTo(W * 0.5, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Detection simulation
      if (frame % 80 === 0 && Math.random() < 0.6) {
        const types = [
          { icon: '🗑️', label: 'Garbage Heap', color: '#22c55e' },
          { icon: '🕳️', label: 'Pothole', color: '#ef4444' },
          { icon: '💧', label: 'Pipe Leak', color: '#3b82f6' }
        ];
        const t = types[Math.floor(Math.random() * types.length)];
        const bx = 100 + Math.random() * (W - 300);
        const by = H * 0.55 + Math.random() * (H * 0.3);
        const bw = 100 + Math.random() * 150;
        const bh = 60 + Math.random() * 100;
        
        ctx.strokeStyle = t.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(bx, by, bw, bh);
        
        ctx.fillStyle = t.color + 'cc';
        ctx.fillRect(bx, by - 25, 120, 25);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(t.label, bx + 5, by - 8);

        const budEst = Math.floor(2000 + Math.random() * 8000);
        setStats(prev => ({
          ...prev,
          detections: prev.detections + 1,
          autoFiled: prev.autoFiled + 1,
          budget: prev.budget + budEst
        }));

        setLog(prev => [{
          id: Math.random(),
          type: t.label,
          location: 'Main Road, Ward 47',
          status: 'Auto-Filed',
          time: new Date().toLocaleTimeString('en-IN', { hour12: false })
        }, ...prev.slice(0, 9)]);
      }

      // 360 Scan effect
      const scanX = (Math.sin(frame * 0.05) * 0.5 + 0.5) * W;
      ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
      ctx.fillRect(scanX - 2, 0, 4, H);

      frame++;
      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        speed: Math.round(12 + Math.random() * 20),
        fuel: Math.max(20, prev.fuel - 0.05),
        km: prev.km + 0.01,
        capacity: Math.min(100, prev.capacity + 0.1)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold font-rajdhani bg-gradient-to-r from-slate-900 via-blue-700 to-cyan-700 bg-clip-text text-transparent">
          360° AI Vehicle Detection System
        </h2>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
          CLAP Autos • Compactors • Skip Loaders • GPS Tracking • Fuel Monitoring • Biometric Attendance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 rounded-xl overflow-hidden border border-black/10 relative aspect-video shadow-lg">
            <canvas ref={canvasRef} width={800} height={450} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 flex gap-2">
              <span className="bg-slate-900/80 px-2 py-1 rounded border border-white/10 text-[9px] font-mono text-cyan-400">360° ACTIVE</span>
              <span className="bg-slate-900/80 px-2 py-1 rounded border border-white/10 text-[9px] font-mono text-green-400">AP29-GV-007</span>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { label: 'Detections', value: stats.detections, color: 'text-red-600' },
              { label: 'Auto-Filed', value: stats.autoFiled, color: 'text-green-600' },
              { label: 'Est. Budget', value: `₹${(stats.budget / 1000).toFixed(1)}k`, color: 'text-cyan-600' },
              { label: 'KM Covered', value: stats.km.toFixed(1), color: 'text-yellow-600' },
              { label: 'Speed', value: `${stats.speed} km/h`, color: 'text-lime-600' },
              { label: 'Fuel', value: `${Math.round(stats.fuel)}%`, color: 'text-orange-600' },
              { label: 'Biometric', value: stats.biometric, color: 'text-blue-600' },
            ].map((s, i) => (
              <div key={i} className="bg-white border border-black/5 rounded-xl p-3 text-center shadow-sm">
                <div className={`text-lg font-bold font-rajdhani ${s.color}`}>{s.value}</div>
                <div className="text-[8px] font-bold text-slate-500 uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-black/5 rounded-xl p-5 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <Clock size={14} className="text-blue-600" /> Daily Operation Cycle
            </h3>
            <div className="space-y-4">
              {[
                { time: '05:00 - 06:00', task: 'RFID Scan & Departure', status: 'Completed' },
                { time: '06:00 - 11:00', task: 'Route Collection (500+ Houses)', status: 'In Progress' },
                { time: '11:00 - 13:00', task: 'Waste Segregation & Disposal', status: 'Pending' },
              ].map((cycle, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-1 h-10 bg-slate-100 rounded-full relative flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full border-2 border-white ${cycle.status === 'Completed' ? 'bg-green-600' : cycle.status === 'In Progress' ? 'bg-blue-600 animate-pulse' : 'bg-slate-300'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{cycle.time}</div>
                    <div className="text-[10px] font-medium text-slate-900 truncate">{cycle.task}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-xl p-5 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <ShieldCheck size={14} className="text-cyan-600" /> Tech Monitoring
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-black/5 flex flex-col items-center gap-2">
                <Fuel size={16} className="text-orange-600" />
                <div className="text-center">
                  <div className="text-[10px] font-bold text-slate-900">Fuel Monitor</div>
                  <div className="text-[8px] text-slate-500">KM Usage Based</div>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-black/5 flex flex-col items-center gap-2">
                <Fingerprint size={16} className="text-blue-600" />
                <div className="text-center">
                  <div className="text-[10px] font-bold text-slate-900">Biometrics</div>
                  <div className="text-[8px] text-slate-500">Driver & Helper</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-xl p-5 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <MapPin size={14} className="text-lime-600" /> Live GPS Track
            </h3>
            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-black/5 font-mono text-[11px] space-y-1">
                <div className="flex justify-between"><span className="text-slate-500">Lat</span><span className="text-lime-600 font-bold">16.5074°N</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Lng</span><span className="text-lime-600 font-bold">80.6572°E</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Heading</span><span className="text-yellow-600 font-bold">182°</span></div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Route Covered', value: 65, color: 'bg-green-600' },
                  { label: 'Fuel Remaining', value: stats.fuel, color: 'bg-yellow-600' },
                  { label: 'Collection Cap', value: stats.capacity, color: 'bg-orange-600' },
                ].map((p) => (
                  <div key={p.label} className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider">
                      <span className="text-slate-500">{p.label}</span>
                      <span className="text-slate-900">{Math.round(p.value)}%</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${p.value}%` }}
                        className={`h-full ${p.color}`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-xl overflow-hidden flex flex-col h-[300px] shadow-sm">
            <div className="p-4 border-b border-black/5 flex items-center justify-between bg-slate-50">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <ListChecks size={14} /> Auto-Detection Log
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-2">
              {log.map((entry) => (
                <div key={entry.id} className="bg-slate-50 p-2 rounded-lg border border-black/5 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-slate-900">{entry.type}</div>
                    <div className="text-[8px] text-slate-500 font-mono">{entry.location} • {entry.time}</div>
                  </div>
                  <div className="text-[8px] font-bold text-blue-600 uppercase">{entry.status}</div>
                </div>
              ))}
              {log.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 opacity-50">
                  <BarChart3 size={24} />
                  <p className="text-[10px] font-medium">Waiting for detections...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
