import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Code,
  Play,
  X,
  User as UserIcon
} from 'lucide-react';
import { User as UserType } from '../types';
import { NavTab } from './Sidebar';

interface TopBarProps {
  currentUser: UserType;
  activeTab: NavTab;
  onLogout: () => void;
  onOpenAlerts: () => void;
  unreadAlertsCount: number;
  onLaunchPresentation: () => void;
  onOpenPythonCode: () => void;
  onGlobalSearch?: (query: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentUser,
  activeTab,
  onLogout,
  onOpenAlerts,
  unreadAlertsCount,
  onLaunchPresentation,
  onOpenPythonCode,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format tab label and breadcrumb
  const getTabDetails = (tab: NavTab): { title: string; category: string } => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Dashboard', category: 'Overview' };
      case 'live-monitoring':
        return { title: 'Live Detection', category: 'Monitoring' };
      case 'cameras':
        return { title: 'Cameras', category: 'Monitoring' };
      case 'traffic-map':
        return { title: 'Traffic Map', category: 'Monitoring' };
      case 'violations':
        return { title: 'Violations', category: 'Intelligence' };
      case 'vehicles':
        return { title: 'Vehicles & ANPR', category: 'Intelligence' };
      case 'analytics':
        return { title: 'Analytics', category: 'Intelligence' };
      case 'ai-performance':
        return { title: 'AI Performance', category: 'Intelligence' };
      case 'evidence':
        return { title: 'Evidence', category: 'Operations' };
      case 'fines':
        return { title: 'Fines', category: 'Operations' };
      case 'payments':
        return { title: 'Payments', category: 'Operations' };
      case 'alerts':
        return { title: 'Alerts', category: 'Operations' };
      case 'reports':
        return { title: 'Reports', category: 'Operations' };
      case 'ai-models':
        return { title: 'AI Models', category: 'System' };
      case 'hardware-sim':
        return { title: 'Hardware', category: 'System' };
      case 'audit-logs':
        return { title: 'Audit Logs', category: 'System' };
      case 'system-health':
        return { title: 'System Health', category: 'System' };
      case 'settings':
        return { title: 'Settings', category: 'System' };
      default:
        return { title: 'Traffic AI', category: 'Intelligence' };
    }
  };

  const { title, category } = getTabDetails(activeTab);

  return (
    <header className="h-16 px-6 bg-white border-b border-[#E5EAF0] flex items-center justify-between z-20 shrink-0 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
      {/* Left: Breadcrumb & Page title */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium mb-0.5">
          <span>Traffic AI</span>
          <span>/</span>
          <span className="text-[#172033] font-medium">{category}</span>
        </div>
        <h1 className="text-lg font-bold text-[#172033] leading-tight tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right: Search, System status, Notifications, Profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Search box */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plates, cameras, violations..."
            className="w-56 lg:w-72 pl-9 pr-8 py-2 bg-white border border-[#D9E1EA] rounded-lg text-sm text-[#172033] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-[#94A3B8] hover:text-[#172033]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* System status: ● All Systems Operational (green) */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-semibold text-[#16A34A] bg-[#DCFCE7]/60 px-3 py-1.5 rounded-full border border-[#BBF7D0]">
          <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
          <span>All Systems Operational</span>
        </div>

        {/* 3D Quick Action Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={onLaunchPresentation}
            className="btn-3d btn-3d-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
            title="Interactive Step-by-Step Walkthrough"
          >
            <Play className="w-3 h-3 text-[#F59E0B]" />
            <span>Walkthrough</span>
          </button>
          <button
            onClick={onOpenPythonCode}
            className="btn-3d btn-3d-primary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
            title="Inspect YOLOv8 + EasyOCR Python Engine"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Python Code</span>
          </button>
        </div>

        {/* Notifications Icon Button */}
        <button
          onClick={onOpenAlerts}
          className="relative btn-3d-icon w-9 h-9 text-[#64748B] hover:text-[#172033]"
          title="Alerts & Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
          )}
        </button>

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-[#1677FF] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser.fullName
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-[#172033] leading-tight">
                {currentUser.fullName}
              </div>
              <div className="text-[11px] text-[#64748B]">
                {currentUser.role === 'ADMIN' ? 'Chief Admin' : 'Admin'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] hidden sm:block" />
          </button>

          {/* User Menu Dropdown Panel */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5EAF0] rounded-xl shadow-[0_4px_16px_rgba(15,23,42,0.08)] py-2 z-50 text-xs">
              <div className="px-3.5 py-2.5 border-b border-[#E5EAF0]">
                <div className="font-semibold text-[#172033]">{currentUser.fullName}</div>
                <div className="text-[11px] text-[#64748B] mt-0.5">{currentUser.email}</div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLaunchPresentation();
                  }}
                  className="w-full px-3.5 py-2 text-left text-[#475569] hover:text-[#1677FF] hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Play className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Interactive Walkthrough</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenPythonCode();
                  }}
                  className="w-full px-3.5 py-2 text-left text-[#475569] hover:text-[#1677FF] hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Code className="w-3.5 h-3.5 text-[#1677FF]" />
                  <span>Python Source Code</span>
                </button>
              </div>

              <div className="pt-1 border-t border-[#E5EAF0]">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full px-3.5 py-2 text-left text-[#EF4444] hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
