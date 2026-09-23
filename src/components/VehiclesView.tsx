import React, { useState } from 'react';
import {
  Car,
  Search,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Clock,
  ExternalLink,
  Calendar,
  User as UserIcon,
  CreditCard,
  X,
  Filter,
  CheckCircle2,
  AlertOctagon,
  ChevronRight,
  Shield,
  Layers
} from 'lucide-react';
import { Vehicle, Violation } from '../types';

interface VehiclesViewProps {
  vehicles: Vehicle[];
  violations: Violation[];
  onInspectViolation: (v: Violation) => void;
}

export const VehiclesView: React.FC<VehiclesViewProps> = ({
  vehicles,
  violations,
  onInspectViolation,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || v.vehicleType === filterType;
    const matchesStatus = filterStatus === 'ALL' || v.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getVehicleViolations = (plate: string) => {
    return violations.filter(
      (v) => v.plateNumber.replace(/\s+/g, '-').toUpperCase() === plate.replace(/\s+/g, '-').toUpperCase()
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5EAF0]">
        <div>
          <h1 className="text-xl font-bold text-[#172033] tracking-tight">
            Vehicles & ANPR Registry
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Automated Number Plate Recognition dossier, ownership profiling and full infraction lifecycle.
          </p>
        </div>
        <div className="text-xs font-semibold text-[#1677FF] bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
          Tracked Vehicles: <strong>{vehicles.length}</strong>
        </div>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="bg-white border border-[#E5EAF0] rounded-xl p-4 shadow-[0_2px_8px_rgba(15,23,42,0.05)] flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search license plate..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#D9E1EA] rounded-lg text-xs text-[#172033] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1677FF] transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-[#D9E1EA] text-[#172033] rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
          >
            <option value="ALL">All Vehicle Types</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Heavy Bus">Heavy Bus</option>
            <option value="Commercial Truck">Commercial Truck</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-[#D9E1EA] text-[#172033] rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="STOLEN">STOLEN</option>
          </select>
        </div>
      </div>

      {/* Vehicle Table */}
      <div className="bg-white border border-[#E5EAF0] rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E8EDF3] text-[#64748B] font-semibold">
              <tr>
                <th className="py-3 px-4">LICENSE PLATE</th>
                <th className="py-3 px-4">VEHICLE TYPE</th>
                <th className="py-3 px-4">REGISTERED OWNER</th>
                <th className="py-3 px-4">COLOR</th>
                <th className="py-3 px-4">REG. DATE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">INFRACTIONS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EDF3] text-[#172033]">
              {filteredVehicles.map((vehicle) => {
                const vehicleViolations = getVehicleViolations(vehicle.plateNumber);
                return (
                  <tr
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className="hover:bg-[#F8FAFC] cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#1677FF]">
                      {vehicle.plateNumber}
                    </td>
                    <td className="py-3 px-4 text-[#172033] font-medium">{vehicle.vehicleType}</td>
                    <td className="py-3 px-4 text-[#64748B]">{vehicle.ownerName}</td>
                    <td className="py-3 px-4 text-[#64748B]">{vehicle.vehicleColor}</td>
                    <td className="py-3 px-4 text-[#64748B]">{vehicle.registrationDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          vehicle.status === 'ACTIVE'
                            ? 'bg-[#DCFCE7] text-[#16A34A]'
                            : vehicle.status === 'SUSPENDED'
                            ? 'bg-[#FEF3C7] text-[#D97706]'
                            : 'bg-[#FEE2E2] text-[#EF4444]'
                        }`}
                      >
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {vehicleViolations.length > 0 ? (
                        <span className="text-[11px] font-bold text-[#EF4444]">
                          {vehicleViolations.length} Flagged
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#16A34A] font-medium">0 Violations</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVehicle(vehicle);
                        }}
                        className="px-3 py-1 rounded-lg bg-white hover:bg-blue-50 text-[#1677FF] border border-[#1677FF] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        View Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SIDE DRAWER */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white border-l border-[#E5EAF0] h-full overflow-y-auto p-6 space-y-6 animate-in slide-in-from-right duration-200 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E5EAF0]">
                <div>
                  <div className="text-xs text-[#1677FF] font-semibold uppercase tracking-wider">
                    Vehicle Dossier
                  </div>
                  <h2 className="text-xl font-bold font-mono text-[#172033] tracking-wide mt-0.5">
                    {selectedVehicle.plateNumber}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="p-1.5 rounded-lg text-[#64748B] hover:text-[#172033] hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Vehicle Particulars Card */}
              <div className="bg-[#F8FAFC] border border-[#E5EAF0] rounded-xl p-5 space-y-3 text-xs">
                <div className="text-[#172033] font-bold uppercase text-[11px] pb-2 border-b border-[#E5EAF0]">
                  Registration Details
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[#64748B] block text-[10px] uppercase font-semibold">OWNER NAME</span>
                    <span className="text-[#172033] font-semibold text-xs">{selectedVehicle.ownerName}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px] uppercase font-semibold">VEHICLE TYPE</span>
                    <span className="text-[#172033] font-semibold text-xs">{selectedVehicle.vehicleType}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px] uppercase font-semibold">COLOR</span>
                    <span className="text-[#172033] text-xs">{selectedVehicle.vehicleColor}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px] uppercase font-semibold">REGISTRATION STATUS</span>
                    <span className="text-[#16A34A] font-semibold text-xs">{selectedVehicle.status}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px] uppercase font-semibold">INSURANCE</span>
                    <span className="text-[#16A34A] text-xs">{selectedVehicle.insuranceStatus}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px] uppercase font-semibold">EMISSION/POLLUTION</span>
                    <span className="text-[#16A34A] text-xs">{selectedVehicle.pollutionStatus}</span>
                  </div>
                </div>
              </div>

              {/* TIMELINE */}
              <div className="bg-[#F8FAFC] border border-[#E5EAF0] rounded-xl p-5 space-y-3">
                <div className="text-[#172033] font-bold uppercase text-[11px] pb-2 border-b border-[#E5EAF0]">
                  Enforcement Lifecycle Timeline
                </div>

                <div className="relative pl-6 space-y-4 text-xs before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5EAF0]">
                  {/* Step 1: Detected */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#1677FF] ring-4 ring-white" />
                    <div className="font-semibold text-[#172033]">1. Detected & Tracked</div>
                    <div className="text-[11px] text-[#64748B]">Captured by YOLOv8x optical centroid corridor tracker</div>
                  </div>

                  {/* Step 2: Violation */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#EF4444] ring-4 ring-white" />
                    <div className="font-semibold text-[#172033]">2. Infraction Flagged</div>
                    <div className="text-[11px] text-[#64748B]">Optical sensor corroborated speeding / stop line incursion</div>
                  </div>

                  {/* Step 3: Reviewed */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#F59E0B] ring-4 ring-white" />
                    <div className="font-semibold text-[#172033]">3. Officer Reviewed</div>
                    <div className="text-[11px] text-[#64748B]">Corroborated by optical trajectory evidence under statutory review</div>
                  </div>

                  {/* Step 4: Fine */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#8B5CF6] ring-4 ring-white" />
                    <div className="font-semibold text-[#172033]">4. Digital Fine Generated</div>
                    <div className="text-[11px] text-[#64748B]">Statutory e-Challan registered with payment reference</div>
                  </div>

                  {/* Step 5: Payment */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#16A34A] ring-4 ring-white" />
                    <div className="font-semibold text-[#172033]">5. Citizen Payment</div>
                    <div className="text-[11px] text-[#64748B]">Settled via simulated gateway or pending clearing</div>
                  </div>
                </div>
              </div>

              {/* Violation History */}
              <div className="bg-[#F8FAFC] border border-[#E5EAF0] rounded-xl p-5 space-y-3">
                <div className="text-[#172033] font-bold uppercase text-[11px] pb-2 border-b border-[#E5EAF0]">
                  Infraction History ({getVehicleViolations(selectedVehicle.plateNumber).length})
                </div>

                {getVehicleViolations(selectedVehicle.plateNumber).length === 0 ? (
                  <p className="text-xs text-[#64748B] py-2">
                    No historical infractions recorded for this vehicle.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {getVehicleViolations(selectedVehicle.plateNumber).map((v) => (
                      <div
                        key={v.id}
                        onClick={() => {
                          setSelectedVehicle(null);
                          onInspectViolation(v);
                        }}
                        className="p-3 rounded-lg bg-white border border-[#E5EAF0] hover:border-[#1677FF] cursor-pointer flex items-center justify-between text-xs transition-colors shadow-2xs"
                      >
                        <div>
                          <div className="text-[#EF4444] font-semibold">{v.violationType}</div>
                          <div className="text-[11px] text-[#64748B]">{v.location} · {v.timestamp}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[#172033] font-bold">₹{v.fineAmount}</div>
                          <div className="text-[11px] text-[#1677FF] font-medium">Inspect →</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5EAF0]">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#172033] text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
