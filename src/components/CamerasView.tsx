import React, { useState } from 'react';
import {
  Camera,
  Plus,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Trash2,
  MapPin,
  ExternalLink,
  Activity,
  LayoutGrid,
  List,
  Eye,
  SlidersHorizontal,
  XCircle,
  Wifi,
  Video
} from 'lucide-react';
import { Camera as CameraType } from '../types';

interface CamerasViewProps {
  cameras: CameraType[];
  onAddCamera: (newCam: CameraType) => void;
  onUpdateCamera: (updatedCam: CameraType) => void;
  onDeleteCamera: (id: number) => void;
}

export const CamerasView: React.FC<CamerasViewProps> = ({
  cameras,
  onAddCamera,
  onUpdateCamera,
  onDeleteCamera,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCamForView, setSelectedCamForView] = useState<CameraType | null>(null);
  const [selectedCamForConfig, setSelectedCamForConfig] = useState<CameraType | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Camera Form
  const [newCamId, setNewCamId] = useState<string>('CAM-07');
  const [newName, setNewName] = useState<string>('Airport Ring South Gate');
  const [newLoc, setNewLoc] = useState<string>('Aero Expressway KM 22');
  const [newLat, setNewLat] = useState<number>(17.412);
  const [newLng, setNewLng] = useState<number>(78.431);
  const [newSpeedLimit, setNewSpeedLimit] = useState<number>(60);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: CameraType = {
      id: Date.now(),
      cameraId: newCamId,
      name: newName,
      location: newLoc,
      lat: newLat,
      lng: newLng,
      status: 'ONLINE',
      speedLimit: newSpeedLimit,
      signalState: 'GREEN',
      junctionName: newName,
      vehiclesToday: 0,
      violationsToday: 0,
    };
    onAddCamera(created);
    setShowAddModal(false);
  };

  const cameraThumbnails = [
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5EAF0]">
        <div>
          <h1 className="text-xl font-bold text-[#172033] tracking-tight">
            Camera Network Infrastructure
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Optical edge sensors, optical calibration, speed thresholds and live junction feeds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid / List Toggle */}
          <div className="flex items-center p-1 bg-[#F8FAFC] border border-[#E5EAF0] rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-[#64748B] hover:text-[#172033]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-[#64748B] hover:text-[#172033]'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-3d btn-3d-primary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Camera Node</span>
          </button>
        </div>
      </div>

      {/* CAMERA CARDS (GRID VIEW) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cameras.map((cam, idx) => (
            <div
              key={cam.id}
              className="bg-white border border-[#E5EAF0] hover:border-[#1677FF] rounded-xl overflow-hidden group transition-all flex flex-col justify-between shadow-[0_2px_8px_rgba(15,23,42,0.05)] hover:shadow-[0_4px_16px_rgba(22,119,255,0.08)]"
            >
              {/* Camera Preview */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img
                  src={cameraThumbnails[idx % cameraThumbnails.length]}
                  alt={cam.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />

                {/* Top Status Badge */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-mono z-10">
                  <span className="bg-slate-900/90 text-white font-bold px-2 py-0.5 rounded border border-slate-700">
                    {cam.cameraId}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      cam.status === 'ONLINE'
                        ? 'bg-[#DCFCE7] text-[#16A34A]'
                        : 'bg-[#FEF3C7] text-[#D97706]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {cam.status}
                  </span>
                </div>

                {/* Speed limit overlay bottom */}
                <div className="absolute bottom-2.5 left-2.5 text-xs font-mono bg-black/85 text-amber-300 px-2 py-0.5 rounded border border-slate-700 z-10">
                  Limit: {cam.speedLimit} km/h
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-sm text-[#172033]">{cam.name}</h3>
                  <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#1677FF]" />
                    {cam.location}
                  </p>
                </div>

                {/* Telemetry Stats: Vehicles Today & Violations Today */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5EAF0] text-xs">
                  <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E5EAF0]">
                    <span className="text-[#64748B] text-[10px] block uppercase font-medium">VEHICLES TODAY</span>
                    <span className="font-bold text-[#172033] text-sm">{cam.vehiclesToday || 1420}</span>
                  </div>
                  <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E5EAF0]">
                    <span className="text-[#64748B] text-[10px] block uppercase font-medium">VIOLATIONS TODAY</span>
                    <span className="font-bold text-[#EF4444] text-sm">{cam.violationsToday || 18}</span>
                  </div>
                </div>

                {/* Action Buttons: [View] [Configure] */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setSelectedCamForView(cam)}
                    className="py-1.5 rounded-lg bg-white hover:bg-blue-50 text-[#1677FF] border border-[#1677FF] text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Feed</span>
                  </button>
                  <button
                    onClick={() => setSelectedCamForConfig(cam)}
                    className="py-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#64748B] hover:text-[#172033] border border-[#D9E1EA] text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Configure</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white border border-[#E5EAF0] rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E8EDF3] text-[#64748B] font-semibold">
                <tr>
                  <th className="py-3 px-4">CAMERA ID</th>
                  <th className="py-3 px-4">NODE NAME</th>
                  <th className="py-3 px-4">LOCATION</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">SPEED LIMIT</th>
                  <th className="py-3 px-4">VEHICLES TODAY</th>
                  <th className="py-3 px-4">VIOLATIONS</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EDF3] text-[#172033]">
                {cameras.map((cam) => (
                  <tr key={cam.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#1677FF]">{cam.cameraId}</td>
                    <td className="py-3 px-4 text-[#172033] font-semibold">{cam.name}</td>
                    <td className="py-3 px-4 text-[#64748B]">{cam.location}</td>
                    <td className="py-3 px-4">
                      <span className="text-[#16A34A] font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" /> ONLINE
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#172033] font-bold">{cam.speedLimit} km/h</td>
                    <td className="py-3 px-4 text-[#172033]">{cam.vehiclesToday || 1420}</td>
                    <td className="py-3 px-4 text-[#EF4444] font-bold">{cam.violationsToday || 18}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedCamForView(cam)}
                        className="px-2.5 py-1 rounded-md bg-white hover:bg-blue-50 text-[#1677FF] border border-[#1677FF] text-xs font-semibold cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setSelectedCamForConfig(cam)}
                        className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 text-[#64748B] border border-[#D9E1EA] text-xs font-semibold cursor-pointer"
                      >
                        Configure
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {selectedCamForView && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5EAF0] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#E5EAF0] flex items-center justify-between bg-[#F8FAFC]">
              <div>
                <h3 className="font-bold text-[#172033] text-sm">
                  LIVE CORRIDOR STREAM · {selectedCamForView.cameraId}
                </h3>
                <p className="text-xs text-[#64748B]">{selectedCamForView.name} · {selectedCamForView.location}</p>
              </div>
              <button
                onClick={() => setSelectedCamForView(null)}
                className="p-1 text-[#64748B] hover:text-[#172033]"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-950">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"
                  alt="Camera Live Stream"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/80 text-emerald-400 px-2.5 py-1 rounded font-mono text-xs flex items-center gap-1.5 border border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  30.0 FPS · RTSP / H.264
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-[#E5EAF0] flex justify-end bg-white">
              <button
                onClick={() => setSelectedCamForView(null)}
                className="px-4 py-2 rounded-lg bg-[#F8FAFC] hover:bg-slate-100 text-[#172033] text-xs font-semibold border border-[#D9E1EA] cursor-pointer"
              >
                Close Stream
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIGURE MODAL */}
      {selectedCamForConfig && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5EAF0] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF0]">
              <h3 className="font-bold text-[#172033] text-sm">
                CONFIGURE NODE · {selectedCamForConfig.cameraId}
              </h3>
              <button onClick={() => setSelectedCamForConfig(null)} className="text-[#64748B] hover:text-[#172033]">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#64748B] font-medium block mb-1">Optical Speed Threshold (km/h)</label>
                <input
                  type="number"
                  defaultValue={selectedCamForConfig.speedLimit}
                  onChange={(e) => {
                    selectedCamForConfig.speedLimit = parseInt(e.target.value) || 50;
                  }}
                  className="w-full p-2 bg-white border border-[#D9E1EA] rounded-lg text-[#172033]"
                />
              </div>

              <div>
                <label className="text-[#64748B] font-medium block mb-1">Node Operability Status</label>
                <select
                  defaultValue={selectedCamForConfig.status}
                  onChange={(e) => {
                    selectedCamForConfig.status = e.target.value as any;
                  }}
                  className="w-full p-2 bg-white border border-[#D9E1EA] rounded-lg text-[#172033]"
                >
                  <option value="ONLINE">ONLINE</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="OFFLINE">OFFLINE</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5EAF0] flex justify-end gap-2 text-xs">
              <button
                onClick={() => setSelectedCamForConfig(null)}
                className="btn-3d btn-3d-secondary px-3.5 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateCamera(selectedCamForConfig);
                  setSelectedCamForConfig(null);
                }}
                className="btn-3d btn-3d-primary px-4 py-2 text-xs font-semibold"
              >
                Save Calibration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
