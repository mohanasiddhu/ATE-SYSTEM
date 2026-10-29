import React from 'react';
import { Sidebar, NavTab } from '../components/Sidebar.js';
import { TopBar } from '../components/TopBar.js';
import { User } from '../types/index.js';

interface MainLayoutProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentUser: User;
  onLogout: () => void;
  onOpenCompliance: () => void;
  onOpenPaper: () => void;
  onOpenPresentation: () => void;
  pendingViolationsCount: number;
  unreadAlertsCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentTab,
  onTabChange,
  currentUser,
  onLogout,
  onOpenCompliance,
  onOpenPaper,
  onOpenPresentation,
  pendingViolationsCount,
  unreadAlertsCount,
  isCollapsed,
  onToggleCollapse,
  children
}) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0E1A] text-slate-100 antialiased font-sans">
      <Sidebar
        activeTab={currentTab}
        setActiveTab={onTabChange}
        userRole={currentUser.role}
        pendingViolationsCount={pendingViolationsCount}
        unreadAlertsCount={unreadAlertsCount}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          currentUser={currentUser}
          activeTab={currentTab}
          onLogout={onLogout}
          onOpenAlerts={() => onTabChange('alerts')}
          unreadAlertsCount={unreadAlertsCount}
          onLaunchPresentation={onOpenPresentation}
          onOpenPythonCode={() => {}}
          onOpenComplianceModal={onOpenCompliance}
          onOpenIEEEPaper={onOpenPaper}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0B1120]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
