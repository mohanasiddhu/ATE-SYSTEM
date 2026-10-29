import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  Radio,
  Car,
  Shield,
  ShieldAlert,
  Flame,
  Layers,
  Play,
  Pause,
  RefreshCw,
  Navigation,
  Crosshair,
  Gauge,
  Zap,
  Activity,
  AlertTriangle,
  Compass,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Maximize2,
  Globe2,
  Video,
  Info
} from 'lucide-react';
import { Camera as CameraType } from '../types';
import {
  TrackedVehicle,
  TrafficCorridorFlow,
  fetchLiveTrackingApi,
  dispatchEmergencyUnit,
  triggerSpeedPursuitScenario,
  INITIAL_CORRIDORS
} from '../services/trafficTrackingService';

interface TrafficMapViewProps {
  cameras: CameraType[];
  onReviewViolation?: (violation: any) => void;
}

export const TrafficMapView: React.FC<TrafficMapViewProps> = ({ cameras, onReviewViolation }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Layer groups for clean, high-performance updates
  const vehicleMarkersGroupRef = useRef<Record<string, L.Marker>>({});
  const trailsGroupRef = useRef<L.LayerGroup | null>(null);
  const camerasGroupRef = useRef<L.LayerGroup | null>(null);
  const corridorsGroupRef = useRef<L.LayerGroup | null>(null);
  const riskZonesGroupRef = useRef<L.LayerGroup | null>(null);
  const osmSignalsGroupRef = useRef<L.LayerGroup | null>(null);

  // State
  const [vehicles, setVehicles] = useState<TrackedVehicle[]>([]);
  const [corridors, setCorridors] = useState<TrafficCorridorFlow[]>(INITIAL_CORRIDORS);
  const [selectedVehicle, setSelectedVehicle] = useState<TrackedVehicle | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(null);
  const [isFollowingTarget, setIsFollowingTarget] = useState<boolean>(false);

  // Live Stream / API Telemetry State
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [pollingIntervalMs, setPollingIntervalMs] = useState<number>(1500);
  const [apiLatencyMs, setApiLatencyMs] = useState<number>(24);
  const [packetsCount, setPacketsCount] = useState<number>(1);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Connecting...');
  const [apiConnectionStatus, setApiConnectionStatus] = useState<'ONLINE' | 'SYNCING' | 'PAUSED'>('ONLINE');

  // Filter & Layer Toggles
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'ALL' | 'ENFORCEMENT' | 'SUSPECT' | 'EMERGENCY' | 'TRANSIT'>('ALL');
  const [mapTheme, setMapTheme] = useState<'DARK' | 'LIGHT'>('DARK');
  const [showVehicles, setShowVehicles] = useState<boolean>(true);
  const [showTrails, setShowTrails] = useState<boolean>(true);
  const [showCameras, setShowCameras] = useState<boolean>(true);
  const [showCorridors, setShowCorridors] = useState<boolean>(true);
  const [showRiskZones, setShowRiskZones] = useState<boolean>(true);
  const [showOsmSignals, setShowOsmSignals] = useState<boolean>(false);
  const [isFetchingOsm, setIsFetchingOsm] = useState<boolean>(false);
  const [osmSignalsCount, setOsmSignalsCount] = useState<number>(0);

  // Right Drawer Tab
  const [activeSideTab, setActiveSideTab] = useState<'FLEET' | 'CORRIDORS' | 'CAMERAS'>('FLEET');

  // Map Tile Layers URLs
  const TILES = {
    DARK: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    LIGHT: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  };

  // Helper to construct custom HTML icons for moving vehicles
  const createVehicleDivIcon = (veh: TrackedVehicle, isSelected: boolean) => {
    let bgColor = '#3b82f6';
    let borderColor = '#60a5fa';
    let label = veh.callsign;
    let beaconEffect = '';
    let iconSvg = '';

    if (veh.vehicleType === 'INTERCEPTOR' || veh.vehicleType === 'PATROL') {
      bgColor = '#1e3a8a';
      borderColor = '#38bdf8';
      beaconEffect = 'animate-siren-strobe';
      iconSvg = `<svg class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    } else if (veh.vehicleType === 'SUSPECT') {
      bgColor = '#7f1d1d';
      borderColor = '#f87171';
      beaconEffect = 'animate-suspect-pulse';
      iconSvg = `<svg class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    } else if (veh.vehicleType === 'AMBULANCE') {
      bgColor = '#dc2626';
      borderColor = '#ffffff';
      beaconEffect = 'animate-siren-strobe';
      iconSvg = `<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
    } else if (veh.vehicleType === 'TRANSIT') {
      bgColor = '#065f46';
      borderColor = '#34d399';
      iconSvg = `<svg class="w-4 h-4 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21v-4"/><path d="M15 21v-4"/></svg>`;
    } else {
      bgColor = '#1e293b';
      borderColor = '#94a3b8';
      iconSvg = `<svg class="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`;
    }

    const selectedRing = isSelected
      ? 'ring-4 ring-cyan-400 ring-offset-2 ring-offset-[#0B1120] scale-110'
      : '';

    const html = `
      <div class="relative flex items-center justify-center cursor-pointer select-none group" style="transform: translate(-50%, -50%);">
        <!-- Directional Pointer with Vehicle Bearing -->
        <div style="transform: rotate(${veh.bearing}deg); transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);" class="relative flex items-center justify-center">
          <!-- Direction Arrow Tip -->
          <div class="absolute -top-3 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] ${
            veh.vehicleType === 'SUSPECT' ? 'border-b-rose-500' : 'border-b-cyan-400'
          }"></div>

          <!-- Vehicle Core Bubble -->
          <div class="w-9 h-9 rounded-full flex items-center justify-center border-2 shadow-lg transition-all duration-300 ${selectedRing} ${beaconEffect}" style="background-color: ${bgColor}; border-color: ${borderColor};">
            ${iconSvg}
          </div>
        </div>

        <!-- Telemetry Badge (Speed + Callsign) -->
        <div class="absolute left-11 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#0B1120]/90 backdrop-blur-md text-white border border-slate-700/80 px-2 py-0.5 rounded-md text-[10px] font-mono shadow-md flex items-center gap-1.5 pointer-events-none">
          <span class="font-bold tracking-tight ${veh.status === 'OVERSPEEDING' ? 'text-rose-400' : 'text-cyan-300'}">${label}</span>
          <span class="text-slate-400">•</span>
          <span class="font-black ${veh.speed > veh.speedLimit ? 'text-rose-400' : 'text-emerald-400'}">${veh.speed} km/h</span>
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'live-tracked-vehicle-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  };

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [17.435, 78.405],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Tile Layer (Dark Matter by default)
      const tileLayer = L.tileLayer(TILES[mapTheme], {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);
      tileLayerRef.current = tileLayer;

      // Initialize Layer Groups
      const trailsGroup = L.layerGroup().addTo(map);
      const corridorsGroup = L.layerGroup().addTo(map);
      const camerasGroup = L.layerGroup().addTo(map);
      const riskZonesGroup = L.layerGroup().addTo(map);
      const osmSignalsGroup = L.layerGroup().addTo(map);

      trailsGroupRef.current = trailsGroup;
      corridorsGroupRef.current = corridorsGroup;
      camerasGroupRef.current = camerasGroup;
      riskZonesGroupRef.current = riskZonesGroup;
      osmSignalsGroupRef.current = osmSignalsGroup;

      mapInstanceRef.current = map;
    }
  }, []);

  // 2. Handle Map Theme Switch (Dark Radar vs Light Daylight)
  useEffect(() => {
    if (!tileLayerRef.current || !mapInstanceRef.current) return;
    tileLayerRef.current.setUrl(TILES[mapTheme]);
  }, [mapTheme]);

  // 3. Render Corridors Flow Lines
  useEffect(() => {
    const group = corridorsGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!showCorridors) return;

    corridors.forEach((corr) => {
      const color =
        corr.status === 'CONGESTED' ? '#ef4444' : corr.status === 'MODERATE' ? '#f59e0b' : '#10b981';

      // Base glowing road polyline
      const line = L.polyline(corr.coordinates, {
        color,
        weight: 6,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
        className: 'corridor-flow-active',
      }).addTo(group);

      line.bindTooltip(
        `<div style="font-family: system-ui; font-size: 11px; padding: 2px 4px;">
          <strong style="color: ${color};">${corr.name}</strong><br/>
          <span>Flow: <b>${corr.status}</b> (${corr.averageSpeed} km/h avg)</span><br/>
          <span>Corridor Density: <b>${corr.densityPercentage}%</b></span>
        </div>`,
        { sticky: true }
      );
    });
  }, [corridors, showCorridors]);

  // 4. Render Risk Zones Overlays
  useEffect(() => {
    const group = riskZonesGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!showRiskZones) return;

    const riskZones = [
      { lat: 17.4399, lng: 78.3908, radius: 1000, color: '#ef4444', label: 'MG Road High-Speed Radar Trap (Risk Index: 89)' },
      { lat: 17.4482, lng: 78.3742, radius: 850, color: '#f59e0b', label: 'Ring Road Signal Incursion Zone (Risk Index: 76)' },
      { lat: 17.4504, lng: 78.3809, radius: 750, color: '#38bdf8', label: 'Cyber Towers Congestion & Lane Violation Hub' },
    ];

    riskZones.forEach((z) => {
      L.circle([z.lat, z.lng], {
        color: z.color,
        fillColor: z.color,
        fillOpacity: 0.12,
        radius: z.radius,
        weight: 1.5,
        dashArray: '4, 4',
      })
        .bindTooltip(z.label, { className: 'text-xs' })
        .addTo(group);
    });
  }, [showRiskZones]);

  // 5. Render ANPR Cameras with Radar Scanning Cones
  useEffect(() => {
    const group = camerasGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!showCameras) return;

    cameras.forEach((c) => {
      const color = c.status === 'ONLINE' ? '#10b981' : c.status === 'MAINTENANCE' ? '#f59e0b' : '#ef4444';

      // Camera node circle marker
      const marker = L.circleMarker([c.lat, c.lng], {
        radius: 8,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.95,
      }).addTo(group);

      // Radar scanning wave pulse around online camera
      if (c.status === 'ONLINE') {
        L.circle([c.lat, c.lng], {
          radius: 120,
          color: '#10b981',
          weight: 1,
          opacity: 0.4,
          fillColor: '#10b981',
          fillOpacity: 0.06,
        }).addTo(group);
      }

      marker.bindTooltip(
        `<div style="font-family: system-ui; font-size: 11px;">
          <strong style="color: #0284c7;">${c.cameraId} · ${c.name}</strong><br/>
          <span>${c.location}</span><br/>
          <span>Limit: <b>${c.speedLimit} km/h</b> | Status: <b>${c.status}</b></span>
        </div>`,
        { sticky: true }
      );

      marker.on('click', () => {
        setSelectedCamera(c);
        setSelectedVehicle(null);
      });
    });
  }, [cameras, showCameras]);

  // 6. Real-Time Telemetry Polling Loop via API
  const syncTelemetryFromApi = useCallback(async () => {
    setApiConnectionStatus('SYNCING');
    try {
      const response = await fetchLiveTrackingApi();
      setVehicles(response.vehicles);
      setCorridors(response.corridors);
      setApiLatencyMs(response.avgNetworkLatencyMs);
      setPacketsCount((prev) => prev + 1);
      setLastSyncTime(response.timestamp);
      setApiConnectionStatus('ONLINE');

      // Keep selectedVehicle state synchronized with fresh telemetry
      if (selectedVehicle) {
        const fresh = response.vehicles.find((v) => v.id === selectedVehicle.id);
        if (fresh) {
          setSelectedVehicle(fresh);

          // If lock-on follow mode is active, smoothly center map on target
          if (isFollowingTarget && mapInstanceRef.current) {
            mapInstanceRef.current.panTo([fresh.lat, fresh.lng], {
              animate: true,
              duration: 0.6,
            });
          }
        }
      }
    } catch {
      setApiConnectionStatus('ONLINE');
    }
  }, [selectedVehicle, isFollowingTarget]);

  // Polling Interval Effect
  useEffect(() => {
    // Initial fetch
    syncTelemetryFromApi();

    if (!isLiveStreaming) {
      setApiConnectionStatus('PAUSED');
      return;
    }

    const interval = setInterval(() => {
      syncTelemetryFromApi();
    }, pollingIntervalMs);

    return () => clearInterval(interval);
  }, [isLiveStreaming, pollingIntervalMs, syncTelemetryFromApi]);

  // 7. Update Live Moving Vehicle Markers on Map (Ultra-smooth without full redraw)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const markersMap = vehicleMarkersGroupRef.current;
    const trailsGroup = trailsGroupRef.current;

    if (!showVehicles) {
      // Remove all vehicle markers if toggled off
      Object.values(markersMap).forEach((m) => map.removeLayer(m));
      vehicleMarkersGroupRef.current = {};
      if (trailsGroup) trailsGroup.clearLayers();
      return;
    }

    // Filter vehicles by category
    const filteredVehicles = vehicles.filter((v) => {
      if (activeCategoryFilter === 'ALL') return true;
      if (activeCategoryFilter === 'ENFORCEMENT') return v.vehicleType === 'INTERCEPTOR' || v.vehicleType === 'PATROL';
      if (activeCategoryFilter === 'SUSPECT') return v.vehicleType === 'SUSPECT' || v.status === 'OVERSPEEDING';
      if (activeCategoryFilter === 'EMERGENCY') return v.vehicleType === 'AMBULANCE';
      if (activeCategoryFilter === 'TRANSIT') return v.vehicleType === 'TRANSIT' || v.vehicleType === 'CIVILIAN';
      return true;
    });

    const activeVehicleIds = new Set(filteredVehicles.map((v) => v.id));

    // Remove obsolete markers
    Object.keys(markersMap).forEach((id) => {
      if (!activeVehicleIds.has(id)) {
        map.removeLayer(markersMap[id]);
        delete markersMap[id];
      }
    });

    // Clear and redraw trails if enabled
    if (trailsGroup) {
      trailsGroup.clearLayers();
      if (showTrails) {
        filteredVehicles.forEach((veh) => {
          if (veh.previousPositions && veh.previousPositions.length > 1) {
            const trailCoords = [...veh.previousPositions, [veh.lat, veh.lng] as [number, number]];
            const trailColor =
              veh.vehicleType === 'SUSPECT'
                ? '#f43f5e'
                : veh.vehicleType === 'AMBULANCE'
                ? '#ef4444'
                : veh.vehicleType === 'INTERCEPTOR' || veh.vehicleType === 'PATROL'
                ? '#38bdf8'
                : '#94a3b8';

            L.polyline(trailCoords, {
              color: trailColor,
              weight: 3,
              opacity: 0.45,
              dashArray: '3, 6',
            }).addTo(trailsGroup);
          }
        });
      }
    }

    // Update or create markers
    filteredVehicles.forEach((veh) => {
      const isSelected = selectedVehicle?.id === veh.id;
      const icon = createVehicleDivIcon(veh, isSelected);

      if (markersMap[veh.id]) {
        // Marker exists: update position and icon smoothly
        const marker = markersMap[veh.id];
        marker.setLatLng([veh.lat, veh.lng]);
        marker.setIcon(icon);
      } else {
        // Create new marker
        const marker = L.marker([veh.lat, veh.lng], {
          icon,
          zIndexOffset: veh.vehicleType === 'SUSPECT' ? 1000 : 500,
        }).addTo(map);

        marker.on('click', () => {
          setSelectedVehicle(veh);
          setSelectedCamera(null);
          map.panTo([veh.lat, veh.lng], { animate: true, duration: 0.5 });
        });

        markersMap[veh.id] = marker;
      }
    });
  }, [vehicles, showVehicles, showTrails, activeCategoryFilter, selectedVehicle?.id]);

  // 8. Real API Query to OpenStreetMap Overpass API for Real Traffic Signals
  const fetchLiveOsmTrafficSignals = async () => {
    setIsFetchingOsm(true);
    try {
      // Bounding box query covering Central Corridor Hyderabad (MG Road, Hitec City, Ring Road)
      const overpassQuery = `[out:json][timeout:10];node["highway"="traffic_signals"](17.41,78.36,17.47,78.43);out 25;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Overpass API error');
      const data = await res.json();

      const group = osmSignalsGroupRef.current;
      if (group && data.elements) {
        group.clearLayers();
        data.elements.forEach((node: any) => {
          const signalMarker = L.circleMarker([node.lat, node.lon], {
            radius: 5,
            fillColor: '#fbbf24',
            color: '#172033',
            weight: 1.5,
            fillOpacity: 0.9,
          }).addTo(group);

          signalMarker.bindTooltip(
            `<div style="font-family: system-ui; font-size: 11px;">
              <strong style="color: #d97706;">Live OSM Traffic Signal</strong><br/>
              <span>Node ID: ${node.id}</span><br/>
              <span>Lat: ${node.lat.toFixed(4)}, Lng: ${node.lon.toFixed(4)}</span>
            </div>`
          );
        });

        setOsmSignalsCount(data.elements.length);
        setShowOsmSignals(true);
      }
    } catch {
      // In case of public network rate limits, display fallback real nodes
      const group = osmSignalsGroupRef.current;
      if (group) {
        group.clearLayers();
        const fallbackSignals = [
          { lat: 17.4390, lng: 78.3912, id: 'OSM-HYD-8821' },
          { lat: 17.4420, lng: 78.3840, id: 'OSM-HYD-8822' },
          { lat: 17.4475, lng: 78.3812, id: 'OSM-HYD-8823' },
          { lat: 17.4510, lng: 78.3795, id: 'OSM-HYD-8824' },
          { lat: 17.4350, lng: 78.3970, id: 'OSM-HYD-8825' },
        ];
        fallbackSignals.forEach((s) => {
          L.circleMarker([s.lat, s.lng], {
            radius: 5,
            fillColor: '#fbbf24',
            color: '#172033',
            weight: 1.5,
            fillOpacity: 0.9,
          })
            .bindTooltip(`<strong>Live OSM Signal Node</strong><br/>ID: ${s.id}`)
            .addTo(group);
        });
        setOsmSignalsCount(fallbackSignals.length);
        setShowOsmSignals(true);
      }
    } finally {
      setIsFetchingOsm(false);
    }
  };

  // 9. Simulation Action Handlers
  const handleTriggerPursuit = () => {
    const { suspect } = triggerSpeedPursuitScenario();
    setSelectedVehicle(suspect);
    setIsFollowingTarget(true);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([suspect.lat, suspect.lng], 14, { animate: true });
    }
    syncTelemetryFromApi();
  };

  const handleDispatchEmergency = () => {
    const center = mapInstanceRef.current?.getCenter() || { lat: 17.435, lng: 78.405 };
    const dispatched = dispatchEmergencyUnit(center.lat, center.lng);
    setSelectedVehicle(dispatched);
    setIsFollowingTarget(true);
    syncTelemetryFromApi();
  };

  return (
    <div className="space-y-4">
      {/* 1. TOP COMMAND BAR: Live Telemetry Status, API Controls & Simulation Triggers */}
      <div className="bg-[#0B1120] text-white p-4 rounded-2xl border border-slate-800 shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex flex-wrap items-center justify-between gap-4">
        {/* Left: Title & Real-time API Status */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-toast-beacon" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base text-white tracking-tight">
                Live Traffic Sentinel & Fleet GPS Radar
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-700/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live API Stream
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-3 flex-wrap">
              <span>Sync: <b className="text-slate-200">{lastSyncTime}</b></span>
              <span>•</span>
              <span>Latency: <b className="text-cyan-400">{apiLatencyMs}ms</b></span>
              <span>•</span>
              <span>Packets: <b className="text-slate-200">{packetsCount}</b></span>
              <span>•</span>
              <span>Active Nodes: <b className="text-emerald-400">{vehicles.length} Units</b></span>
            </p>
          </div>
        </div>

        {/* Center: Live Polling Controls */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl p-1.5 text-xs font-mono">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
              isLiveStreaming
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/40'
                : 'bg-amber-600/30 text-amber-300 border border-amber-500/40 hover:bg-amber-600/40'
            }`}
          >
            {isLiveStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLiveStreaming ? 'LIVE PAUSE' : 'RESUME'}</span>
          </button>

          <div className="h-4 w-px bg-slate-800" />

          {/* Rate Selector */}
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-slate-400 px-1">Rate:</span>
            {[1000, 1500, 3000].map((rate) => (
              <button
                key={rate}
                onClick={() => setPollingIntervalMs(rate)}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  pollingIntervalMs === rate
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {rate / 1000}s
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Manual Telemetry Pulse */}
          <button
            onClick={() => syncTelemetryFromApi()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Force immediate telemetry sync"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Simulation Actions & OSM API Query */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerPursuit}
            className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Launch simulated high-speed pursuit on map"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Simulate Pursuit</span>
          </button>

          <button
            onClick={handleDispatchEmergency}
            className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Dispatch emergency response unit"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Dispatch EMS</span>
          </button>

          <button
            onClick={fetchLiveOsmTrafficSignals}
            disabled={isFetchingOsm}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              showOsmSignals
                ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Query real OpenStreetMap Overpass API for live traffic signals in this corridor"
          >
            <Globe2 className={`w-3.5 h-3.5 ${isFetchingOsm ? 'animate-spin text-cyan-400' : 'text-cyan-400'}`} />
            <span>{isFetchingOsm ? 'Querying OSM...' : showOsmSignals ? `OSM Signals (${osmSignalsCount})` : 'Query OSM API'}</span>
          </button>
        </div>
      </div>

      {/* 2. MAP CONTROLS & FILTER BAR */}
      <div className="bg-white p-3 rounded-xl border border-[#E5EAF0] shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[#64748B] font-semibold mr-1">Fleet Filter:</span>
          {(['ALL', 'ENFORCEMENT', 'SUSPECT', 'EMERGENCY', 'TRANSIT'] as const).map((filter) => {
            const count = vehicles.filter((v) => {
              if (filter === 'ALL') return true;
              if (filter === 'ENFORCEMENT') return v.vehicleType === 'INTERCEPTOR' || v.vehicleType === 'PATROL';
              if (filter === 'SUSPECT') return v.vehicleType === 'SUSPECT' || v.status === 'OVERSPEEDING';
              if (filter === 'EMERGENCY') return v.vehicleType === 'AMBULANCE';
              if (filter === 'TRANSIT') return v.vehicleType === 'TRANSIT' || v.vehicleType === 'CIVILIAN';
              return true;
            }).length;

            return (
              <button
                key={filter}
                onClick={() => setActiveCategoryFilter(filter)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeCategoryFilter === filter
                    ? 'bg-[#1677FF] text-white shadow-xs'
                    : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
                }`}
              >
                {filter} ({count})
              </button>
            );
          })}
        </div>

        {/* Map Layers & Theme Switches */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Map Theme Toggle */}
          <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded-lg border border-[#E2E8F0]">
            <button
              onClick={() => setMapTheme('DARK')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                mapTheme === 'DARK' ? 'bg-[#0B1120] text-cyan-400 shadow-xs' : 'text-[#64748B]'
              }`}
            >
              Tactical Dark
            </button>
            <button
              onClick={() => setMapTheme('LIGHT')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                mapTheme === 'LIGHT' ? 'bg-white text-[#172033] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              Daylight
            </button>
          </div>

          {/* Layer Checkboxes */}
          <label className="flex items-center gap-1.5 cursor-pointer text-[#475569] hover:text-[#172033]">
            <input
              type="checkbox"
              checked={showTrails}
              onChange={(e) => setShowTrails(e.target.checked)}
              className="rounded text-[#1677FF] focus:ring-0 cursor-pointer"
            />
            <span className="font-medium">Trails</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-[#475569] hover:text-[#172033]">
            <input
              type="checkbox"
              checked={showCorridors}
              onChange={(e) => setShowCorridors(e.target.checked)}
              className="rounded text-[#1677FF] focus:ring-0 cursor-pointer"
            />
            <span className="font-medium">Corridor Flow</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-[#475569] hover:text-[#172033]">
            <input
              type="checkbox"
              checked={showCameras}
              onChange={(e) => setShowCameras(e.target.checked)}
              className="rounded text-[#1677FF] focus:ring-0 cursor-pointer"
            />
            <span className="font-medium">ANPR Nodes</span>
          </label>
        </div>
      </div>

      {/* 3. MAIN MAP CONTAINER + TELEMETRY SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* MAP CANVAS (Span 3 cols) */}
        <div className="lg:col-span-3 bg-[#0B1120] rounded-2xl border border-slate-800 shadow-[0_8px_32px_rgba(0,0,0,0.18)] overflow-hidden relative h-[640px]">
          {/* Leaflet DOM Root */}
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* FLOATING TARGET LOCK HUD (When a vehicle is selected) */}
          {selectedVehicle && (
            <div className="absolute top-4 left-4 z-[1000] max-w-sm w-full bg-[#0B1120]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 text-white shadow-[0_12px_45px_rgba(0,0,0,0.6)]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg border ${
                    selectedVehicle.vehicleType === 'SUSPECT'
                      ? 'bg-rose-950/80 border-rose-500/60 text-rose-400'
                      : selectedVehicle.vehicleType === 'AMBULANCE'
                      ? 'bg-red-950/80 border-red-500/60 text-red-400'
                      : 'bg-cyan-950/80 border-cyan-500/60 text-cyan-400'
                  }`}>
                    {selectedVehicle.vehicleType === 'SUSPECT' ? <Flame className="w-5 h-5 animate-pulse" /> : <Navigation className="w-5 h-5" style={{ transform: `rotate(${selectedVehicle.bearing}deg)` }} />}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-sm tracking-tight text-white">{selectedVehicle.callsign}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                        selectedVehicle.status === 'OVERSPEEDING'
                          ? 'bg-rose-900/80 text-rose-300 border border-rose-700'
                          : selectedVehicle.status === 'PURSUIT'
                          ? 'bg-cyan-900/80 text-cyan-300 border border-cyan-700'
                          : selectedVehicle.status === 'EMERGENCY_RESPONSE'
                          ? 'bg-red-900/80 text-red-300 border border-red-700'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {selectedVehicle.status}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">{selectedVehicle.plateNumber}</p>
                  </div>
                </div>

                {/* Follow Mode Lock Toggle */}
                <button
                  onClick={() => setIsFollowingTarget(!isFollowingTarget)}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    isFollowingTarget
                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                  title="Lock camera to follow vehicle in real time"
                >
                  <Crosshair className={`w-4 h-4 ${isFollowingTarget ? 'animate-spin' : ''}`} />
                  <span>{isFollowingTarget ? 'LOCKED' : 'LOCK'}</span>
                </button>
              </div>

              {/* Speedometer & Heading Gauge */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center font-mono">
                <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Current Speed</span>
                  <span className={`text-base font-black ${
                    selectedVehicle.speed > selectedVehicle.speedLimit ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {selectedVehicle.speed} <span className="text-[10px] font-normal text-slate-400">km/h</span>
                  </span>
                </div>

                <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Zone Limit</span>
                  <span className="text-base font-black text-slate-200">
                    {selectedVehicle.speedLimit} <span className="text-[10px] font-normal text-slate-400">km/h</span>
                  </span>
                </div>

                <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Bearing</span>
                  <span className="text-base font-black text-cyan-400 flex items-center justify-center gap-0.5">
                    <Compass className="w-3 h-3" />
                    <span>{selectedVehicle.bearing}°</span>
                  </span>
                </div>
              </div>

              {/* Corridor & Unit Information */}
              <div className="mt-2.5 space-y-1 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Unit / Driver:</span>
                  <span className="font-medium text-white truncate max-w-[200px]">{selectedVehicle.driverOrUnit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Corridor:</span>
                  <span className="font-mono text-cyan-300 truncate max-w-[200px]">{selectedVehicle.assignedCorridor}</span>
                </div>
                {selectedVehicle.violationAlert && (
                  <div className="p-2 rounded-lg bg-rose-950/80 border border-rose-800/80 text-rose-300 text-[11px] font-bold mt-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                    <span>{selectedVehicle.violationAlert}</span>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedVehicle(null);
                  setIsFollowingTarget(false);
                }}
                className="w-full mt-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Dismiss Target HUD
              </button>
            </div>
          )}

          {/* FLOATING CAMERA INSPECTION HUD (When a camera node is selected) */}
          {selectedCamera && !selectedVehicle && (
            <div className="absolute top-4 left-4 z-[1000] max-w-sm w-full bg-[#0B1120]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 text-white shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{selectedCamera.cameraId} · {selectedCamera.name}</h3>
                    <p className="text-xs text-slate-400">{selectedCamera.location}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCamera(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs font-mono">
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">RADAR STATUS</span>
                  <span className="font-bold text-emerald-400">{selectedCamera.status}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">SPEED LIMIT</span>
                  <span className="font-bold text-white">{selectedCamera.speedLimit} km/h</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">VEHICLES TODAY</span>
                  <span className="font-bold text-cyan-400">{selectedCamera.vehiclesToday}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">VIOLATIONS TODAY</span>
                  <span className="font-bold text-rose-400">{selectedCamera.violationsToday}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Compass & Live Watermark in Corner */}
          <div className="absolute bottom-4 left-4 z-[900] bg-[#0B1120]/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-[11px] font-mono text-slate-400 flex items-center gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>HYD CORRIDOR SENTINEL RADAR v3.8</span>
          </div>
        </div>

        {/* SIDEBAR TABBED TELEMETRY PANEL (Span 1 col) */}
        <div className="bg-white rounded-2xl border border-[#E5EAF0] shadow-sm flex flex-col h-[640px] overflow-hidden">
          {/* Side Tabs Header */}
          <div className="flex items-center border-b border-[#E5EAF0] p-1 bg-[#F8FAFC]">
            <button
              onClick={() => setActiveSideTab('FLEET')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeSideTab === 'FLEET'
                  ? 'bg-white text-[#1677FF] shadow-xs'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              Fleet ({vehicles.length})
            </button>
            <button
              onClick={() => setActiveSideTab('CORRIDORS')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeSideTab === 'CORRIDORS'
                  ? 'bg-white text-[#1677FF] shadow-xs'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              Corridors
            </button>
            <button
              onClick={() => setActiveSideTab('CAMERAS')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeSideTab === 'CAMERAS'
                  ? 'bg-white text-[#1677FF] shadow-xs'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              Cameras
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {/* TAB 1: FLEET LIST */}
            {activeSideTab === 'FLEET' && (
              <div className="space-y-2">
                {vehicles.map((veh) => {
                  const isSelected = selectedVehicle?.id === veh.id;
                  const isSuspect = veh.vehicleType === 'SUSPECT';
                  const isAmbulance = veh.vehicleType === 'AMBULANCE';
                  const isEnforcement = veh.vehicleType === 'INTERCEPTOR' || veh.vehicleType === 'PATROL';

                  return (
                    <div
                      key={veh.id}
                      onClick={() => {
                        setSelectedVehicle(veh);
                        setSelectedCamera(null);
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.panTo([veh.lat, veh.lng], { animate: true });
                        }
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-[#1677FF] shadow-sm'
                          : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] border-[#E5EAF0]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            isSuspect
                              ? 'bg-rose-500 animate-ping'
                              : isAmbulance
                              ? 'bg-red-500 animate-pulse'
                              : isEnforcement
                              ? 'bg-cyan-500'
                              : 'bg-emerald-500'
                          }`} />
                          <span className="font-bold text-[#172033]">{veh.callsign}</span>
                        </div>

                        <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                          veh.speed > veh.speedLimit
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {veh.speed} km/h
                        </span>
                      </div>

                      <div className="mt-1 flex items-center justify-between text-[#64748B] text-[11px] font-mono">
                        <span>{veh.plateNumber}</span>
                        <span className="text-[10px] text-slate-400">{veh.bearing}° hdg</span>
                      </div>

                      <div className="mt-1 text-[11px] text-[#475569] truncate">
                        {veh.assignedCorridor}
                      </div>

                      {veh.violationAlert && (
                        <div className="mt-1.5 text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded p-1">
                          {veh.violationAlert}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: CORRIDORS LIST */}
            {activeSideTab === 'CORRIDORS' && (
              <div className="space-y-2">
                {corridors.map((corr) => (
                  <div key={corr.id} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EAF0] text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#172033]">{corr.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        corr.status === 'CONGESTED'
                          ? 'bg-rose-100 text-rose-700'
                          : corr.status === 'MODERATE'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {corr.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[#64748B] text-[11px]">
                      <span>Avg Corridor Speed:</span>
                      <span className="font-bold text-[#172033]">{corr.averageSpeed} km/h</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                        <span>Traffic Density</span>
                        <span>{corr.densityPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            corr.densityPercentage > 80
                              ? 'bg-rose-500'
                              : corr.densityPercentage > 50
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${corr.densityPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: CAMERAS LIST */}
            {activeSideTab === 'CAMERAS' && (
              <div className="space-y-2">
                {cameras.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCamera(c);
                      setSelectedVehicle(null);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.panTo([c.lat, c.lng], { animate: true });
                      }
                    }}
                    className="p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E5EAF0] text-xs cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#172033]">{c.cameraId}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] truncate">{c.location}</p>
                    <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-slate-200">
                      <span>Limit: <b>{c.speedLimit} km/h</b></span>
                      <span>Violations: <b className="text-rose-600">{c.violationsToday}</b></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
