'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, Circle, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation } from 'lucide-react';

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const createVehicleIcon = (type: string, status: string, isSelected: boolean) => {
  const iconUrl = type === 'clap' 
    ? 'https://cdn-icons-png.flaticon.com/512/2554/2554978.png' 
    : type === 'compactor' 
      ? 'https://cdn-icons-png.flaticon.com/512/1048/1048314.png' 
      : 'https://cdn-icons-png.flaticon.com/512/2554/2554896.png';
  
  const statusColor = status === 'In Service' ? '#22c55e' : status === 'Maintenance' ? '#f97316' : '#ef4444';
  
  return L.divIcon({
    className: 'custom-vehicle-icon',
    html: `
      <div class="relative flex items-center justify-center ${isSelected ? 'animate-marker-float' : ''}">
        <div class="absolute w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl"></div>
        <div class="absolute w-12 h-12 rounded-full border-2 border-dashed ${isSelected ? 'border-blue-500 animate-spin' : 'border-transparent'}" style="animation-duration: 8s"></div>
        <img src="${iconUrl}" class="relative w-7 h-7 z-10 drop-shadow-lg" />
        <div class="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${status === 'In Service' ? 'bg-green-500' : status === 'Maintenance' ? 'bg-orange-500' : 'bg-red-500'}"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const createComplaintIcon = (severity: string) => {
  const color = severity === 'high' ? '#ef4444' : severity === 'medium' ? '#f97316' : '#3b82f6';
  return L.divIcon({
    className: 'custom-complaint-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 rounded-full animate-ping opacity-20" style="background-color: ${color}"></div>
        <div class="w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white/50" style="background-color: ${color}">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

L.Marker.prototype.options.icon = DefaultIcon;

interface MarkerData {
  id: number;
  type: 'vehicle' | 'complaint' | 'flood' | 'work';
  lat: number;
  lng: number;
  label?: string;
  status?: string;
  severity?: string;
  metadata?: any;
  created_at?: string;
}

interface Vehicle {
  id: string;
  type: 'clap' | 'compactor' | 'skip';
  name: string;
  route: [number, number][];
  currentIndex: number;
  pos: [number, number];
  status: 'In Service' | 'Maintenance' | 'Offline';
}

const VEHICLE_ROUTES: Record<string, [number, number][]> = {
  'T101': [
    [16.5067, 80.6465],
    [16.5100, 80.6500],
    [16.5150, 80.6550],
    [16.5200, 80.6600],
    [16.5250, 80.6650],
  ],
  'V202': [
    [16.5000, 80.6400],
    [16.4950, 80.6450],
    [16.4900, 80.6500],
    [16.4850, 80.6550],
    [16.4800, 80.6600],
  ],
  'T303': [
    [16.5200, 80.6300],
    [16.5250, 80.6350],
    [16.5300, 80.6400],
    [16.5350, 80.6450],
    [16.5400, 80.6500],
  ],
};

function MapEvents({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface LeafletMapProps {
  selectedVehicleId?: string | null;
  onVehicleSelect?: (id: string | null) => void;
  showHeatmap?: boolean;
  engineeringWorks?: any[];
}

export default function LeafletMap({ selectedVehicleId, onVehicleSelect, showHeatmap, engineeringWorks }: LeafletMapProps) {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 'C101', type: 'clap', name: 'CLAP Auto 101', route: VEHICLE_ROUTES['T101'], currentIndex: 0, pos: VEHICLE_ROUTES['T101'][0], status: 'In Service' },
    { id: 'M202', type: 'compactor', name: 'Compactor 202', route: VEHICLE_ROUTES['V202'], currentIndex: 0, pos: VEHICLE_ROUTES['V202'][0], status: 'In Service' },
    { id: 'S303', type: 'skip', name: 'Skip Loader 303', route: VEHICLE_ROUTES['T303'], currentIndex: 0, pos: VEHICLE_ROUTES['T303'][0], status: 'In Service' },
  ]);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // AI Detection History Mock Data
  const AI_HISTORY: Record<string, { type: string; time: string; location: string }[]> = {
    'C101': [
      { type: 'Garbage Pile', time: '09:15', location: 'Benz Circle' },
      { type: 'Overflow Drain', time: '09:45', location: 'MG Road' },
    ],
    'M202': [
      { type: 'Unauthorized Encroachment', time: '08:30', location: 'Governorpet' },
    ],
    'S303': [
      { type: 'Broken Street Light', time: '10:05', location: 'Patamata' },
    ],
  };

  // Fly to selected vehicle
  useEffect(() => {
    if (selectedVehicleId) {
      const vehicle = vehicles.find(v => v.id === selectedVehicleId);
      if (vehicle) {
        mapRef.current?.flyTo(vehicle.pos, 15);
      }
    }
  }, [selectedVehicleId, vehicles]);

  // Fetch existing markers
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const res = await fetch('/api/locations');
        if (res.ok) {
          const data = await res.json();
          setMarkers(data);
        }
      } catch (err) {
        console.error('Failed to fetch markers:', err);
      }
    };
    fetchMarkers();
  }, []);

  // Vehicle Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          // Only move if in service
          if (v.status !== 'In Service') return v;

          const nextIndex = (v.currentIndex + 1) % v.route.length;
          
          // Randomly change status occasionally
          let nextStatus: 'In Service' | 'Maintenance' | 'Offline' = v.status;
          const rand = Math.random();
          if (rand > 0.95) {
            nextStatus = Math.random() > 0.5 ? 'Maintenance' : 'Offline';
          } else if (rand < 0.05 && v.status !== 'In Service') {
            nextStatus = 'In Service';
          }

          return {
            ...v,
            currentIndex: nextIndex,
            pos: v.route[nextIndex],
            status: nextStatus,
          };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleMapClick = async (lat: number, lng: number) => {
    try {
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'complaint',
          lat, 
          lng,
          label: 'User Reported Garbage',
          severity: 'medium',
          metadata: { source: 'map_click' }
        }),
      });

      if (res.ok) {
        const newMarker = await res.json();
        setMarkers((prev) => [newMarker, ...prev]);
      }
    } catch (err) {
      console.error('Failed to save marker:', err);
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPos([latitude, longitude]);
        mapRef.current?.flyTo([latitude, longitude], 15);
      },
      (err) => setError(`Location denied: ${err.message}`)
    );
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-black/5 shadow-2xl bg-slate-50">
      <MapContainer
        center={[16.5067, 80.6465]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEvents onMapClick={handleMapClick} />

        {/* Flood Risk Heatmap */}
        {showHeatmap && (
          <>
            <Circle 
              center={[16.5067, 80.6465]} 
              radius={500} 
              pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }} 
            >
              <Popup>High Flood Risk Zone</Popup>
            </Circle>
            <Circle 
              center={[16.5150, 80.6600]} 
              radius={800} 
              pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.15 }} 
            >
              <Popup>Medium Flood Risk Zone</Popup>
            </Circle>
            {/* Simulated Damage Heatmap */}
            <Circle 
              center={[16.5250, 80.6450]} 
              radius={400} 
              pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.3, weight: 0 }} 
            />
            <Circle 
              center={[16.5200, 80.6300]} 
              radius={600} 
              pathOptions={{ color: 'yellow', fillColor: 'yellow', fillOpacity: 0.2, weight: 0 }} 
            />
          </>
        )}

        {/* User Location */}
        {userPos && (
          <Marker position={userPos}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Vehicle Markers */}
        {vehicles.map((v) => (
          <React.Fragment key={v.id}>
            <CircleMarker 
              center={v.pos} 
              radius={18} 
              pathOptions={{ 
                color: v.status === 'In Service' ? '#22c55e' : v.status === 'Maintenance' ? '#f97316' : '#ef4444',
                fillColor: v.status === 'In Service' ? '#22c55e' : v.status === 'Maintenance' ? '#f97316' : '#ef4444',
                fillOpacity: 0.2,
                weight: 1.5
              }} 
            />
            <Marker 
              position={v.pos} 
              icon={createVehicleIcon(v.type, v.status, selectedVehicleId === v.id)}
              opacity={v.status === 'In Service' ? 1 : 0.7}
              eventHandlers={{
                click: () => onVehicleSelect?.(v.id),
              }}
            >
              <Popup>
                <div className="text-slate-900 min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold">{v.name}</p>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      v.status === 'In Service' ? 'bg-green-500/20 text-green-600' :
                      v.status === 'Maintenance' ? 'bg-orange-500/20 text-orange-600' :
                      'bg-red-500/20 text-red-600'
                    }`}>
                      {v.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase mb-3">{v.type} • AP29-GV-{v.id.slice(-3)}</p>
                  
                  <div className="border-t border-slate-100 pt-2">
                    <p className="text-[9px] font-bold uppercase text-slate-400 mb-2">AI Detection History</p>
                    <div className="space-y-2">
                      {(AI_HISTORY[v.id] || []).map((h, i) => (
                        <div key={i} className="flex items-start gap-2 bg-slate-50 p-1.5 rounded">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1" />
                          <div>
                            <p className="text-[9px] font-bold text-slate-700">{h.type}</p>
                            <p className="text-[8px] text-slate-500">{h.time} • {h.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

        {/* Route Lines */}
        {vehicles.map((v, idx) => (
          <Polyline 
            key={v.id} 
            positions={v.route} 
            color={selectedVehicleId === v.id ? "#3b82f6" : "#94a3b8"} 
            weight={selectedVehicleId === v.id ? 4 : 2} 
            opacity={selectedVehicleId === v.id ? 0.8 : 0.3} 
            dashArray={selectedVehicleId === v.id ? "" : "5, 5"} 
          />
        ))}

        {/* Engineering Works */}
        {engineeringWorks?.map((w) => (
          <Marker 
            key={w.id} 
            position={[w.lat, w.lng]} 
            icon={L.divIcon({
              className: 'custom-work-icon',
              html: `
                <div class="relative flex items-center justify-center">
                  <div class="absolute w-8 h-8 rounded-full bg-blue-500/20 animate-pulse"></div>
                  <div class="w-6 h-6 rounded-lg bg-white border border-blue-500 flex items-center justify-center text-[10px] shadow-lg">
                    ${w.icon}
                  </div>
                </div>
              `,
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            })}
          >
            <Popup>
              <div className="text-slate-900 min-w-[180px]">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold">{w.type}</p>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    w.status === 'completed' ? 'bg-green-500/20 text-green-600' :
                    w.status === 'progress' ? 'bg-blue-500/20 text-blue-600' :
                    'bg-orange-500/20 text-orange-600'
                  }`}>
                    {w.status}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 uppercase mb-2">{w.location} • {w.id}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px]">
                    <span className="text-slate-400">Engineer</span>
                    <span className="font-bold">{w.engineer}</span>
                  </div>
                  <div className="flex justify-between text-[9px]">
                    <span className="text-slate-400">Budget</span>
                    <span className="font-bold">₹{w.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={createComplaintIcon(m.severity || 'medium')}>
            <Popup>
              <div className="text-slate-900 min-w-[150px]">
                <p className="font-bold text-sm">{m.label || 'Municipal Issue'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    m.severity === 'high' ? 'bg-red-100 text-red-600' : 
                    m.severity === 'medium' ? 'bg-orange-100 text-orange-600' : 
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {m.severity}
                  </span>
                  <span className="text-[9px] font-bold uppercase text-slate-400">
                    {m.status}
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                  <p>ID: {m.id}</p>
                  <p>Type: {m.type}</p>
                  <p>Reported: {new Date(m.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Overlay UI */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={handleLocate}
          className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg shadow-lg transition-all flex items-center gap-2 text-sm font-semibold"
        >
          <Navigation size={16} />
          Locate Me
        </button>
        
        <div className="bg-white/90 backdrop-blur-md p-3 rounded-lg border border-black/5 text-[10px] text-slate-600 max-w-[150px] shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-red-500 rounded-full opacity-50" />
            <span>High Flood Risk</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Planned Route</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Image src="https://cdn-icons-png.flaticon.com/512/2554/2554978.png" width={12} height={12} alt="CLAP" />
            <span>CLAP Auto</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Image src="https://cdn-icons-png.flaticon.com/512/1048/1048314.png" width={12} height={12} alt="Compactor" />
            <span>Compactor</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Image src="https://cdn-icons-png.flaticon.com/512/2554/2554896.png" width={12} height={12} alt="Skip" />
            <span>Skip Loader</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Image src="https://cdn-icons-png.flaticon.com/512/565/565547.png" width={12} height={12} alt="Complaint" />
            <span>Complaint</span>
          </div>
          <div className="mt-2 pt-2 border-t border-black/5 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>In Service</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span>Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span>Offline</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-red-500/90 text-white px-4 py-2 rounded-lg text-xs font-medium animate-bounce">
          {error}
        </div>
      )}

      <div className="absolute bottom-4 right-4 z-[1000] bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-black/5 text-[10px] text-slate-500 shadow-lg">
        Tap map to add garbage complaint
      </div>
    </div>
  );
}
