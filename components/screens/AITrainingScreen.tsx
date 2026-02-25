'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Brain, Play, RotateCcw, Database, Cpu, Activity, ListChecks } from 'lucide-react';
import Image from 'next/image';

interface LogEntry {
  text: string;
  time: string;
}

export default function AITrainingScreen() {
  const [curEpoch, setCurEpoch] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [metrics, setMetrics] = useState({ map50: 0, prec: 0, rec: 0, loss: 0 });
  const [logs, setLogs] = useState<LogEntry[]>([
    { text: 'SMART MUNICIPAL MITRA AI Training System v2.0', time: '10:00:00' },
    { text: 'Datasets: TACO | RDD2020 | NPD', time: '10:00:00' },
    { text: 'Ready to train...', time: '10:00:00' }
  ]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (text: string) => {
    const time = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setLogs(prev => [...prev, { text, time }]);
  };

  useEffect(() => {
    if (!isTraining) return;

    const interval = setInterval(() => {
      setCurEpoch(prev => {
        if (prev >= 100) {
          setIsTraining(false);
          addLog('✅ Training completed successfully.');
          return 100;
        }
        const next = prev + 1;
        const progress = next / 100;
        
        setMetrics({
          map50: Math.min(0.918, progress * 0.8 + Math.random() * 0.04),
          prec: Math.min(0.945, progress * 0.85 + Math.random() * 0.03),
          rec: Math.min(0.912, progress * 0.78 + Math.random() * 0.04),
          loss: Math.max(0.042, 1.2 * (1 - progress * 0.9) + Math.random() * 0.05)
        });

        if (next % 10 === 0) {
          addLog(`Epoch ${next}/100 | mAP50:${(progress * 0.8).toFixed(3)} | Loss:${(1.2 * (1 - progress * 0.9)).toFixed(3)}`);
        }

        return next;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isTraining]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const startTraining = () => {
    setCurEpoch(0);
    setIsTraining(true);
    setLogs([]);
    addLog('🚀 Initializing training pipeline...');
    addLog('Loading datasets...');
    addLog('TACO: 1,500 images loaded');
    addLog('RDD2020: 26,336 images loaded');
    addLog('Asphalt Damage Dataset: 18,345 images loaded');
    addLog('Municipal Issues (PDF): 40 categorized photos loaded');
    addLog('Field Data: 4 recent user uploads integrated');
    addLog('Starting YOLOv8s training...');
  };

  const trainingDatasets = [
    { name: 'Asphalt Damage', icon: '🏗️', desc: 'RetinaNet Research Dataset', stats: ['18,345 images', '45,435 instances', '5 classes'] },
    { name: 'TACO Dataset', icon: '🌮', desc: 'Trash Annotations in Context', stats: ['1,500+ images', '60 classes', 'COCO format'] },
    { name: 'RDD2020 Dataset', icon: '🛣️', desc: 'Road Damage Detection', stats: ['26,336 images', '4 damage types', 'India: 9,053'] },
    { name: 'Municipal Issues', icon: '📋', desc: 'Categorized Photo Dataset', stats: ['40 photos', '4 categories', 'Manual labels'] },
  ];

  const fieldPhotos = [
    { url: 'https://picsum.photos/seed/road1/400/300', label: 'Pothole (D40)' },
    { url: 'https://picsum.photos/seed/pipe1/400/300', label: 'Pipe Leak' },
    { url: 'https://picsum.photos/seed/drain1/400/300', label: 'Drainage' },
    { url: 'https://picsum.photos/seed/garbage1/400/300', label: 'Garbage' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold font-rajdhani bg-gradient-to-r from-emerald-900 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
          AI Model Training — Full Pipeline
        </h2>
        <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-bold">
          Asphalt + TACO + RDD2020 + Municipal Datasets • YOLOv8s • Live training metrics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-rajdhani">
                  <Brain size={16} className="text-emerald-600" /> Training Progress
                </h3>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  {isTraining ? `Training YOLOv8s | ${curEpoch}/100 epochs` : 'Ready to train'}
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={startTraining}
                  disabled={isTraining}
                  className={`px-4 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2 transition-all ${
                    isTraining ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                  }`}
                >
                  {isTraining ? <Activity size={14} className="animate-pulse" /> : <Play size={14} />}
                  {isTraining ? 'Training...' : 'Start Training'}
                </button>
                <button 
                  onClick={() => { setCurEpoch(0); setIsTraining(false); setLogs([{ text: 'Pipeline reset.', time: new Date().toLocaleTimeString('en-IN', { hour12: false }) }]); }}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-500 p-2 rounded-xl border border-black/5 transition-all"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold font-mono">
                  <span className="text-slate-500">Epoch {curEpoch}/100</span>
                  <span className="text-emerald-600">ETA: {isTraining ? Math.round((100 - curEpoch) * 0.3) : '--'}s</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${curEpoch}%` }} className="h-full bg-gradient-to-r from-emerald-600 to-teal-400" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'mAP50', value: metrics.map50.toFixed(3), color: 'text-emerald-600' },
                  { label: 'Precision', value: metrics.prec.toFixed(3), color: 'text-blue-600' },
                  { label: 'Recall', value: metrics.rec.toFixed(3), color: 'text-orange-600' },
                  { label: 'Box Loss', value: metrics.loss.toFixed(3), color: 'text-red-600' },
                ].map((m) => (
                  <div key={m.label} className="bg-slate-50 p-4 rounded-xl border border-black/5 text-center">
                    <div className={`text-lg font-bold font-mono ${m.color}`}>{m.value}</div>
                    <div className="text-[8px] font-bold text-slate-500 uppercase mt-1">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 rounded-xl border border-black/5 p-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                  <Database size={12} /> Training Data Samples
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  {fieldPhotos.map((photo, i) => (
                    <div key={i} className="aspect-square relative rounded-lg overflow-hidden border border-black/10 group">
                      <Image 
                        src={photo.url} 
                        alt={photo.label}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                        <span className="text-[8px] font-bold text-white uppercase">{photo.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-black/5 bg-slate-50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <ListChecks size={14} /> Training Log
              </h3>
            </div>
            <div className="p-4 h-48 overflow-y-auto font-mono text-[10px] space-y-1 no-scrollbar bg-slate-900">
              {logs.map((log, i) => (
                <div key={i} className={log.text.includes('✅') ? 'text-emerald-400' : log.text.includes('🚀') ? 'text-blue-400' : 'text-slate-400'}>
                  <span className="text-slate-600 mr-2">[{log.time}]</span>
                  {log.text}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {trainingDatasets.map((ds) => (
            <div key={ds.name} className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{ds.icon}</span>
                <div>
                  <div className="text-sm font-bold text-slate-900">{ds.name}</div>
                  <div className="text-[9px] text-slate-500 font-bold">{ds.desc}</div>
                </div>
                <span className="ml-auto bg-emerald-100 text-emerald-600 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Active</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ds.stats.map(s => (
                  <span key={s} className="bg-slate-50 text-slate-500 text-[8px] font-bold px-2 py-1 rounded border border-black/5">{s}</span>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
              <Cpu size={14} className="text-emerald-600" /> Hardware Status
            </h3>
            <div className="space-y-3">
              {[
                { label: 'GPU Utilization', value: isTraining ? 84 : 2, color: 'bg-emerald-500' },
                { label: 'VRAM Usage', value: isTraining ? 72 : 12, color: 'bg-blue-500' },
                { label: 'Temp', value: isTraining ? 68 : 42, color: 'bg-orange-500' },
              ].map((h) => (
                <div key={h.label} className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-bold">
                    <span className="text-slate-500">{h.label}</span>
                    <span className="text-slate-900">{h.value}%</span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div animate={{ width: `${h.value}%` }} className={`h-full ${h.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
