import React from 'react';
import {
  LayoutDashboard,
  ScanEye,
  Camera,
  Map,
  AlertOctagon,
  Car,
  BarChart3,
  Cpu,
  FileCheck2,
  FileText,
  CreditCard,
  Bell,
  FileSpreadsheet,
  Sliders,
  History,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  Target
} from 'lucide-react';
import { UserRole } from '../types';

export type NavTab =
  | 'dashboard'
  | 'live-monitoring'
  | 'cameras'
  | 'traffic-map'
  | 'violations'
  | 'vehicles'
  | 'analytics'
  | 'ai-performance'
  | 'evidence'
  | 'fines'
  | 'payments'
  | 'alerts'
  | 'reports'
  | 'ai-models'
  | 'hardware-sim'
  | 'audit-logs'
  | 'system-health'
  | 'settings'
  | 'about';

interface NavGroup {
  name: string;
  items: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    badge?: string;
    critical?: boolean;
  }[];
}

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  userRole: UserRole;
  pendingViolationsCount: number;
  unreadAlertsCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  pendingViolationsCount,
  unreadAlertsCount,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navGroups: NavGroup[] = [
    {
      name: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      name: 'MONITORING',
      items: [
        { id: 'live-monitoring', label: 'Live Detection', icon: ScanEye },
        { id: 'cameras', label: 'Cameras', icon: Camera },
        { id: 'traffic-map', label: 'Traffic Map', icon: Map },
      ],
    },
    {
      name: 'INTELLIGENCE',
      items: [
        {
          id: 'violations',
          label: 'Violations',
          icon: AlertOctagon,
          count: pendingViolationsCount > 0 ? pendingViolationsCount : undefined,
          critical: pendingViolationsCount > 0,
        },
        { id: 'vehicles', label: 'Vehicles & ANPR', icon: Car },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'ai-performance', label: 'AI Performance', icon: Target },
      ],
    },
    {
      name: 'OPERATIONS',
      items: [
        { id: 'evidence', label: 'Evidence', icon: FileCheck2 },
        { id: 'fines', label: 'Fines', icon: FileText },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        {
          id: 'alerts',
          label: 'Alerts',
          icon: Bell,
          count: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
        },
        { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
      ],
    },
    {
      name: 'SYSTEM',
      items: [
        { id: 'ai-models', label: 'AI Models', icon: Cpu },
        { id: 'hardware-sim', label: 'Hardware', icon: Sliders },
        { id: 'audit-logs', label: 'Audit Logs', icon: History },
        { id: 'system-health', label: 'System Health', icon: Activity },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`bg-white border-r border-[#E5EAF0] flex flex-col shrink-0 select-none z-30 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-[#E5EAF0] flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1677FF] shadow-xs">
              <ScanEye className="w-5 h-5 text-[#1677FF]" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#172033] tracking-tight flex items-center gap-1.5">
                <span>Traffic AI</span>
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              </div>
              <p className="text-[11px] text-[#64748B] font-medium leading-none mt-0.5">
                Smart Traffic Intelligence
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1677FF]">
              <ScanEye className="w-5 h-5 text-[#1677FF]" />
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`p-1.5 rounded-lg text-[#64748B] hover:text-[#172033] hover:bg-slate-100 transition-colors ${
            isCollapsed ? 'hidden' : 'block'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group) => (
          <div key={group.name} className="space-y-1">
            {!isCollapsed ? (
              <div className="px-3 pb-1 text-[11px] font-semibold uppercase text-[#94A3B8] tracking-wider">
                {group.name}
              </div>
            ) : (
              <div className="w-full h-px bg-[#E5EAF0] my-2" />
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all group ${
                    isActive
                      ? 'bg-[#EFF6FF] text-[#1677FF] font-semibold shadow-xs'
                      : 'text-[#475569] hover:text-[#172033] hover:bg-slate-50 font-normal'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-[#1677FF]'
                          : 'text-[#64748B] group-hover:text-[#172033]'
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </div>

                  {!isCollapsed && item.count !== undefined && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                        item.critical
                          ? 'bg-rose-50 text-[#EF4444] border border-rose-200'
                          : 'bg-blue-50 text-[#1677FF] border border-blue-200'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Footer / Expand Button for Collapsed */}
      <div className="p-3 border-t border-[#E5EAF0] bg-white">
        {isCollapsed ? (
          <button
            onClick={onToggleCollapse}
            title="Expand Sidebar"
            className="w-full py-2 flex items-center justify-center text-[#64748B] hover:text-[#172033] hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="px-2 py-1.5 flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-medium">Traffic AI Enterprise</span>
            <span className="text-[#16A34A] flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" /> Online
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
