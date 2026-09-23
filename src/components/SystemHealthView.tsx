import React from 'react';
import {
  Activity,
  CheckCircle2,
  Cpu,
  Database,
  HardDrive,
  Radio,
  Server,
  Zap
} from 'lucide-react';

export const SystemHealthView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-base text-[#172033]">
            Platform Infrastructure & Subsystem Telemetry
          </h2>
          <p className="text-xs text-[#64748B]">
            Real-time Heartbeats, Compute Resource Utilization & Ingestion Pipeline Health
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#16A34A] text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span>ALL CLUSTERS OPERATIONAL · 99.98% UPTIME</span>
        </div>
      </div>

      {/* Top 4 Hardware Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="uppercase text-[11px] font-semibold">CPU Utilization</span>
            <Cpu className="w-4 h-4 text-[#1677FF]" />
          </div>
          <p className="text-2xl font-bold text-[#172033]">28.4%</p>
          <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
            <div className="bg-[#1677FF] h-2 rounded-full" style={{ width: '28%' }} />
          </div>
          <span className="text-[11px] text-[#64748B] block">8 vCPUs (Intel Xeon E5-2686)</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="uppercase text-[11px] font-semibold">Memory (RAM)</span>
            <Server className="w-4 h-4 text-[#16A34A]" />
          </div>
          <p className="text-2xl font-bold text-[#172033]">1.82 GB / 8 GB</p>
          <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
            <div className="bg-[#16A34A] h-2 rounded-full" style={{ width: '23%' }} />
          </div>
          <span className="text-[11px] text-[#16A34A] font-medium block">Low pressure · Buffer healthy</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="uppercase text-[11px] font-semibold">Evidence Storage</span>
            <HardDrive className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <p className="text-2xl font-bold text-[#172033]">14.6 GB / 250 GB</p>
          <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
            <div className="bg-[#F59E0B] h-2 rounded-full" style={{ width: '6%' }} />
          </div>
          <span className="text-[11px] text-[#64748B] block">94.1% Disk Capacity Available</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] space-y-2">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="uppercase text-[11px] font-semibold">Database Latency</span>
            <Database className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <p className="text-2xl font-bold text-[#172033]">1.8 ms</p>
          <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
            <div className="bg-[#8B5CF6] h-2 rounded-full" style={{ width: '12%' }} />
          </div>
          <span className="text-[11px] text-[#16A34A] font-medium block">SQLite / PostgreSQL Indexed</span>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-xl border border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.05)] p-5 space-y-4">
        <h3 className="font-bold text-sm text-[#172033] uppercase">
          Microservices & Pipeline Nodes
        </h3>

        <div className="space-y-2 text-xs">
          {[
            { name: 'FastAPI Backend Engine', port: '8000', status: 'HEALTHY', latency: '2.4 ms', role: 'RESTful API & Auth Provider' },
            { name: 'YOLOv8 Computer Vision Daemon', port: 'Worker-01', status: 'HEALTHY', latency: '18.2 ms', role: 'Vehicle Detection & Trajectory Tracking' },
            { name: 'EasyOCR ANPR Pipeline', port: 'Worker-02', status: 'HEALTHY', latency: '22.0 ms', role: 'Plate Bounding Box & HSRP Text Recognition' },
            { name: 'Sensor Telemetry Ingester', port: 'Worker-03', status: 'HEALTHY', latency: '5.1 ms', role: 'Speed Radar & Stop Line Sensor Gateway' },
            { name: 'Cryptographic Challan Dispatcher', port: 'Queue-01', status: 'HEALTHY', latency: '12.4 ms', role: 'Digital Notice & Payment Hash Engine' },
          ].map((srv, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E5EAF0] flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
                <div>
                  <span className="font-semibold text-[#172033]">{srv.name}</span>
                  <p className="text-[11px] text-[#64748B]">{srv.role} ({srv.port})</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="text-[#64748B]">Latency: <strong className="text-[#1677FF]">{srv.latency}</strong></span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] font-semibold text-[11px]">
                  {srv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
