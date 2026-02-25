'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, ShieldCheck, AlertCircle, Zap, Upload, X, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { GoogleGenAI } from "@google/genai";

const TACO_CLASSES = [
  { name: 'Plastic Bag', color: '#ef4444' },
  { name: 'Glass Bottle', color: '#0ea5e9' },
  { name: 'Paper', color: '#eab308' },
  { name: 'Metal Can', color: '#22c55e' },
  { name: 'Food Waste', color: '#f97316' },
  { name: 'Cardboard', color: '#8b5cf6' },
  { name: 'Cigarette Butt', color: '#ec4899' },
  { name: 'Styrofoam', color: '#06b6d4' },
  { name: 'Plastic Bottle', color: '#ef4444' },
  { name: 'Newspaper', color: '#84cc16' },
  { name: 'Clothing', color: '#14b8a6' },
  { name: 'Electronics', color: '#a855f7' },
];

interface Detection {
  id: number | string;
  label: string;
  conf: number;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  color: string;
}

export default function AIVerifyScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fps, setFps] = useState(0);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [bestDetection, setBestDetection] = useState<Detection | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'rejected'>('idle');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  useEffect(() => {
    if (uploadedImage) return; // Stop simulation if image is uploaded

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let lastTime = performance.now();
    let frames = 0;
    let animationId: number;

    const draw = (time: number) => {
      frames++;
      if (time - lastTime >= 1000) {
        setFps(frames);
        frames = 0;
        lastTime = time;
      }

      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#f8fafc');
      grad.addColorStop(1, '#f1f5f9');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(0, 200, 0, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < W; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
      }
      for (let i = 0; i < H; i += 40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
      }

      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(0, H);
      ctx.lineTo(200, H * 0.5);
      ctx.lineTo(W - 200, H * 0.5);
      ctx.lineTo(W, H);
      ctx.fill();

      const items = [
        { x: 150, y: 200, icon: '🛍️' },
        { x: 300, y: 180, icon: '🍾' },
        { x: 500, y: 210, icon: '📦' },
        { x: 600, y: 195, icon: '🥫' }
      ];
      ctx.font = '30px serif';
      items.forEach(it => ctx.fillText(it.icon, it.x, it.y));

      if (frame % 60 === 0 && !isVerifying) {
        const newDetections = [];
        const n = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < n; i++) {
          const cl = TACO_CLASSES[Math.floor(Math.random() * TACO_CLASSES.length)];
          const bx = 100 + Math.random() * (W - 300);
          const by = 120 + Math.random() * (H - 200);
          const bw = 80 + Math.random() * 100;
          const bh = 50 + Math.random() * 80;
          const conf = 0.55 + Math.random() * 0.42;
          newDetections.push({ 
            id: Math.random(),
            label: cl.name,
            color: cl.color,
            x: bx, y: by, w: bw, h: bh, conf 
          });
        }
        setDetections(newDetections);
        if (newDetections.length > 0) {
          setBestDetection(newDetections.reduce((a, b) => b.conf > a.conf ? b : a));
        }
      }

      detections.forEach(b => {
        if (b.x === undefined) return;
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(b.x, b.y!, b.w!, b.h!);

        ctx.fillStyle = b.color;
        const s = 10;
        ctx.fillRect(b.x, b.y!, s, 2); ctx.fillRect(b.x, b.y!, 2, s);
        ctx.fillRect(b.x + b.w! - s, b.y!, s, 2); ctx.fillRect(b.x + b.w!, b.y!, 2, s);
        ctx.fillRect(b.x, b.y! + b.h!, s, 2); ctx.fillRect(b.x, b.y! + b.h! - s, 2, s);
        ctx.fillRect(b.x + b.w! - s, b.y! + b.h!, s, 2); ctx.fillRect(b.x + b.w!, b.y! + b.h! - s, 2, s);

        ctx.fillStyle = b.color + 'cc';
        const label = `${b.label} ${(b.conf * 100).toFixed(0)}%`;
        ctx.font = 'bold 10px monospace';
        const tw = ctx.measureText(label).width;
        ctx.fillRect(b.x, b.y! - 20, tw + 10, 20);
        ctx.fillStyle = '#fff';
        ctx.fillText(label, b.x + 5, b.y! - 6);
      });

      const scanY = (frame * 3) % H;
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(W, scanY);
      ctx.stroke();

      const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY);
      scanGrad.addColorStop(0, 'transparent');
      scanGrad.addColorStop(1, 'rgba(0, 255, 0, 0.1)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 20, W, 20);

      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillRect(0, H - 25, W, 25);
      ctx.fillStyle = '#059669';
      ctx.font = '10px monospace';
      ctx.fillText(`SYSTEM_ACTIVE | FPS: ${fps} | ENGINE: WT-YOLOv8 | STATUS: ${verificationStatus.toUpperCase()}`, 15, H - 8);

      frame++;
      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [fps, detections, verificationStatus, isVerifying, uploadedImage]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setUploadedImage(base64);
      setVerificationStatus('verifying');
      setIsVerifying(true);
      setDetections([]);
      setBestDetection(null);

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: {
            parts: [
              { text: "Analyze this image for municipal issues like garbage piles, potholes, broken streetlights, or drainage overflow. If found, identify the primary issue, estimate severity (0.0 to 1.0), and provide a brief description. Format as JSON: { \"issue\": \"string\", \"severity\": number, \"description\": \"string\", \"is_real\": boolean }" },
              { inlineData: { mimeType: file.type, data: base64.split(',')[1] } }
            ]
          },
          config: { responseMimeType: "application/json" }
        });

        const result = JSON.parse(response.text || '{}');
        setAiAnalysis(result.description);
        
        if (result.is_real) {
          setBestDetection({
            id: 'ai-verified',
            label: result.issue,
            conf: result.severity,
            color: '#10b981'
          });
          setVerificationStatus('verified');
        } else {
          setVerificationStatus('rejected');
        }
      } catch (err) {
        console.error("AI Analysis failed:", err);
        setVerificationStatus('rejected');
      } finally {
        setIsVerifying(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileComplaint = async () => {
    if (!bestDetection) return;
    setIsVerifying(true);
    setVerificationStatus('verifying');
    
    try {
      // Get current position if possible
      let lat = 16.5074;
      let lng = 80.6572;

      if (navigator.geolocation) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      }

      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'complaint',
          lat,
          lng,
          label: `AI Verified: ${bestDetection.label}`,
          severity: bestDetection.conf > 0.8 ? 'high' : bestDetection.conf > 0.5 ? 'medium' : 'low',
          status: 'pending',
          metadata: {
            ai_description: aiAnalysis,
            confidence: bestDetection.conf,
            source: 'ai_verify_screen'
          }
        }),
      });

      if (res.ok) {
        setVerificationStatus('verified');
      } else {
        setVerificationStatus('rejected');
      }
    } catch (err) {
      console.error("Failed to file complaint:", err);
      setVerificationStatus('rejected');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold font-rajdhani bg-gradient-to-r from-blue-900 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
          AI Complaint Verification
        </h2>
        <p className="text-[10px] text-blue-600 uppercase tracking-wider font-bold">
          Gemini 3 Flash • Real-time image analysis • Severity scoring • Fake filter
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-100 rounded-xl overflow-hidden border border-black/5 relative aspect-video group">
            {uploadedImage ? (
              <div className="relative w-full h-full">
                <Image src={uploadedImage} alt="Uploaded" fill className="object-contain" />
                <button 
                  onClick={() => { setUploadedImage(null); setAiAnalysis(null); setVerificationStatus('idle'); }}
                  className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
                {isVerifying && (
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                    <Zap size={48} className="text-blue-600 animate-pulse" />
                    <span className="text-sm font-bold text-blue-900 uppercase tracking-widest">Gemini AI Analyzing...</span>
                  </div>
                )}
              </div>
            ) : (
              <>
                <canvas ref={canvasRef} width={800} height={450} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/40 backdrop-blur-sm">
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-blue-600/20">
                    <Upload size={20} />
                    Upload Photo for AI Verification
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>
                <div className="absolute top-4 left-4 bg-white/70 px-3 py-1.5 rounded-lg border border-blue-500/30 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono text-blue-600 font-bold uppercase tracking-widest">Live AI Feed</span>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => { setDetections([]); setBestDetection(null); setVerificationStatus('idle'); setUploadedImage(null); setAiAnalysis(null); }}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Camera size={18} /> Reset Scanner
            </button>
            <button 
              onClick={handleFileComplaint}
              disabled={!bestDetection || isVerifying || verificationStatus === 'verified'}
              className={`font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm ${
                !bestDetection || isVerifying || verificationStatus === 'verified'
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
              }`}
            >
              {isVerifying ? (
                <Zap size={18} className="animate-spin" />
              ) : verificationStatus === 'verified' ? (
                <CheckCircle2 size={18} />
              ) : (
                <ShieldCheck size={18} />
              )}
              {isVerifying ? 'Verifying...' : verificationStatus === 'verified' ? 'Complaint Filed' : 'File Complaint'}
            </button>
          </div>

          <div className="bg-white border border-black/5 rounded-xl p-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">AI Detection Classes (TACO)</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {TACO_CLASSES.map(cl => (
                <div key={cl.name} className="bg-slate-50 border border-black/5 rounded-lg p-2 flex items-center gap-2 group hover:border-emerald-500/30 transition-colors">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cl.color }} />
                  <span className="text-[9px] font-bold text-slate-500 truncate">{cl.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-black/5 rounded-xl p-5 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-4 flex items-center gap-2">
              <Zap size={14} className="text-blue-500" /> AI Analysis Result
            </h3>
            
            {bestDetection ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-slate-900 font-rajdhani">{bestDetection.label} Detected</div>
                  {verificationStatus !== 'idle' && (
                    <div className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${
                      verificationStatus === 'verified' ? 'bg-blue-500/20 text-blue-600' :
                      verificationStatus === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-600 animate-pulse'
                    }`}>
                      {verificationStatus}
                    </div>
                  )}
                </div>
                
                {aiAnalysis && (
                  <p className="text-xs text-slate-600 leading-relaxed italic border-l-2 border-blue-500/30 pl-3">
                    &quot;{aiAnalysis}&quot;
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-slate-500">Severity Level</span>
                    <span className={bestDetection.conf > 0.8 ? 'text-red-500' : 'text-emerald-600'}>
                      {bestDetection.conf > 0.8 ? 'Critical' : 'Medium'}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 opacity-20" />
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${bestDetection.conf * 100}%` }}
                      className="h-full bg-blue-600 relative z-10" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-black/5">
                    <div className="text-[8px] font-bold text-slate-500 uppercase mb-1">Confidence</div>
                    <div className="text-lg font-bold text-blue-600 font-mono">{(bestDetection.conf * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-black/5">
                    <div className="text-[8px] font-bold text-slate-500 uppercase mb-1">Fake Risk</div>
                    <div className={`text-lg font-bold font-mono ${
                      verificationStatus === 'rejected' ? 'text-red-500' : 
                      verificationStatus === 'verified' ? 'text-blue-600' : 'text-yellow-500'
                    }`}>
                      {verificationStatus === 'rejected' ? 'HIGH' : verificationStatus === 'verified' ? 'LOW' : 'CALC...'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-black/5">
                  <div className="flex items-center gap-3 text-[10px]">
                    <AlertCircle size={14} className="text-emerald-400" />
                    <span className="text-slate-500 font-medium">GPS: <span className="text-slate-900 font-mono">16.5074°N, 80.6572°E</span></span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px]">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span className="text-slate-500 font-medium">Category: <span className="text-slate-900">Municipal Waste</span></span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Camera size={32} className="opacity-20" />
                <p className="text-xs font-medium animate-pulse">Scanning for waste...</p>
              </div>
            )}
          </div>

          <div className="bg-white border border-black/5 rounded-xl p-5 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-4 flex items-center gap-2">
              <ShieldCheck size={14} className="text-blue-500" /> Resolution Verification
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="aspect-square relative rounded-lg overflow-hidden border border-black/5">
                  <Image src="https://picsum.photos/seed/before1/300/300" alt="Before" fill className="object-cover grayscale" />
                  <div className="absolute top-1 left-1 bg-red-500/80 text-white text-[7px] font-bold px-1 rounded">BEFORE</div>
                </div>
                <div className="text-[8px] text-slate-500 text-center font-bold uppercase">Reported: 10:42 AM</div>
              </div>
              <div className="space-y-2">
                <div className="aspect-square relative rounded-lg overflow-hidden border border-blue-500/30">
                  <Image src="https://picsum.photos/seed/after1/300/300" alt="After" fill className="object-cover" />
                  <div className="absolute top-1 left-1 bg-blue-500/80 text-white text-[7px] font-bold px-1 rounded">AFTER</div>
                  <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                    <ShieldCheck size={24} className="text-blue-500 opacity-50" />
                  </div>
                </div>
                <div className="text-[8px] text-blue-500 text-center font-bold uppercase">AI Verified: 02:15 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
