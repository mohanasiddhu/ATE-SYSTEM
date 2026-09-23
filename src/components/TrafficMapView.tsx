import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Camera, MapPin, Radio, ShieldAlert, Layers } from 'lucide-react';
import { Camera as CameraType } from '../types';

interface TrafficMapViewProps {
  cameras: CameraType[];
}

export const TrafficMapView: React.FC<TrafficMapViewProps> = ({ cameras }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(cameras[0] || null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet map centered at central corridor
      const map = L.map(mapContainerRef.current, {
        center: [17.435, 78.405],
        zoom: 12,
        zoomControl: true,
      });

      // CartoDB Positron (Clean Light theme map tiles)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Add High-Risk Heatmap Zones
    const riskZones = [
      { lat: 17.4399, lng: 78.3908, radius: 1200, color: '#ef4444', label: 'MG Road Speeding Zone (Risk 86)' },
      { lat: 17.4482, lng: 78.3742, radius: 950, color: '#f59e0b', label: 'Ring Road Signal Incursion (Risk 74)' },
      { lat: 17.4504, lng: 78.3809, radius: 800, color: '#1677ff', label: 'Hitec City Intersection (Risk 62)' },
    ];

    riskZones.forEach((z) => {
      L.circle([z.lat, z.lng], {
        color: z.color,
        fillColor: z.color,
        fillOpacity: 0.18,
        radius: z.radius,
        weight: 1.5,
      })
        .bindTooltip(z.label, { className: 'text-xs' })
        .addTo(map);
    });

    // Add Camera Pins
    cameras.forEach((c) => {
      const color = c.status === 'ONLINE' ? '#16a34a' : c.status === 'MAINTENANCE' ? '#f59e0b' : '#ef4444';

      const marker = L.circleMarker([c.lat, c.lng], {
        radius: 9,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.95,
      }).addTo(map);

      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; font-size: 12px; color: #172033; padding: 4px;">
          <strong style="color: #1677ff;">${c.cameraId} · ${c.name}</strong><br/>
          <span style="color: #64748b;">${c.location}</span><br/>
          <div style="margin-top: 6px; border-top: 1px solid #e5eaf0; padding-top: 4px;">
            <span>Speed Limit: <b>${c.speedLimit} km/h</b></span><br/>
            <span>Status: <b style="color: ${color};">${c.status}</b></span><br/>
            <span>Vehicles Today: <b>${c.vehiclesToday}</b></span>
          </div>
        </div>
      `;
      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setSelectedCamera(c);
      });
    });

    return () => {
      // Keep map alive
    };
  }, [cameras]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-base text-[#172033]">
            Geospatial Traffic & Sensor Radar Map
          </h2>
          <p className="text-xs text-[#64748B]">
            Real-Time Node Geolocation, Corridor Density & Risk Hotspot Overlays
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
            <span className="text-[#172033]">Camera Online</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <span className="text-[#172033]">Maintenance</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            <span className="text-[#172033]">High Risk Zone</span>
          </div>
        </div>
      </div>

      {/* Map + Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] overflow-hidden relative h-[560px]">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        {/* Selected Camera Details */}
        <div className="bg-white rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5EAF0]">
            <Radio className="w-4 h-4 text-[#1677FF] animate-pulse" />
            <h3 className="font-bold text-sm text-[#172033]">
              Corridor Telemetry
            </h3>
          </div>

          {selectedCamera ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E5EAF0]">
                <span className="text-[#1677FF] font-bold block mb-1">
                  {selectedCamera.cameraId} · {selectedCamera.name}
                </span>
                <p className="text-[#64748B] text-[11px]">{selectedCamera.location}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B]">Node Status</span>
                  <span className="text-[#16A34A] font-bold">{selectedCamera.status}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B]">Speed Limit</span>
                  <span className="text-[#172033] font-bold">{selectedCamera.speedLimit} km/h</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B]">Signal State</span>
                  <span className="text-[#EF4444] font-bold">{selectedCamera.signalState}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B]">Vehicles Today</span>
                  <span className="text-[#1677FF] font-bold">{selectedCamera.vehiclesToday}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#64748B]">Violations Today</span>
                  <span className="text-[#EF4444] font-bold">{selectedCamera.violationsToday}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E5EAF0] text-[11px] text-[#64748B]">
                GPS Lat: {selectedCamera.lat.toFixed(4)}, Lng: {selectedCamera.lng.toFixed(4)}
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#64748B]">
              Select any camera marker on the map to inspect live metrics.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
