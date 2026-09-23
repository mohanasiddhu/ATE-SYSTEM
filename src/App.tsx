import React, { useState } from 'react';
import { RadarLogin } from './components/RadarLogin';
import { TopBar } from './components/TopBar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { LiveMonitoringView } from './components/LiveMonitoringView';
import { ViolationsView } from './components/ViolationsView';
import { VehiclesView } from './components/VehiclesView';
import { CamerasView } from './components/CamerasView';
import { TrafficMapView } from './components/TrafficMapView';
import { AnalyticsView } from './components/AnalyticsView';
import { AIPerformanceView } from './components/AIPerformanceView';
import { EvidenceView } from './components/EvidenceView';
import { FinesView } from './components/FinesView';
import { PaymentsView } from './components/PaymentsView';
import { AlertsView } from './components/AlertsView';
import { ReportsView } from './components/ReportsView';
import { AIModelsView } from './components/AIModelsView';
import { HardwareSimView } from './components/HardwareSimView';
import { AuditLogsView } from './components/AuditLogsView';
import { SystemHealthView } from './components/SystemHealthView';
import { SettingsView } from './components/SettingsView';
import { AboutProjectView } from './components/AboutProjectView';
import { PythonSourceView } from './components/PythonSourceView';
import { PresentationModal } from './components/PresentationModal';

import {
  initialViolations,
  initialVehicles,
  initialCameras,
  initialFines,
  initialPayments,
  initialAlerts,
  initialSensors,
  initialAuditLogs,
} from './data/mockData';
import { User, Violation, Camera, Fine, PaymentRecord, AlertItem, HardwareSensor, AuditLog } from './types';

export function App() {
  // Current user state (null means login screen)
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 1,
    username: 'admin',
    fullName: 'Chief Admin Sharma',
    badgeId: 'ADM-8801',
    role: 'ADMIN',
    email: 'admin@traffic-enforce.gov.in',
  });

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // App dataset states
  const [violations, setViolations] = useState<Violation[]>(initialViolations);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [cameras, setCameras] = useState<Camera[]>(initialCameras);
  const [fines, setFines] = useState<Fine[]>(initialFines);
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments);
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [sensors, setSensors] = useState<HardwareSensor[]>(initialSensors);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Modals
  const [selectedViolationForReview, setSelectedViolationForReview] = useState<Violation | null>(null);
  const [activeFineForPayment, setActiveFineForPayment] = useState<Fine | null>(null);
  const [showPresentationModal, setShowPresentationModal] = useState<boolean>(false);
  const [showPythonCodeModal, setShowPythonCodeModal] = useState<boolean>(false);

  // Counts
  const pendingViolationsCount = violations.filter((v) => v.status === 'PENDING_REVIEW').length;
  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;

  // Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // Add audit log
    const log: AuditLog = {
      id: Date.now(),
      action: 'USER_LOGIN',
      actor: user.fullName,
      role: user.role,
      entityId: user.badgeId,
      details: `Successful authenticated command session initiated with role ${user.role}.`,
      timestamp: new Date().toLocaleTimeString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const handleLogout = () => {
    if (currentUser) {
      const log: AuditLog = {
        id: Date.now(),
        action: 'USER_LOGOUT',
        actor: currentUser.fullName,
        role: currentUser.role,
        entityId: currentUser.badgeId,
        details: 'User cleanly signed out of terminal session.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setAuditLogs((prev) => [log, ...prev]);
    }
    setCurrentUser(null);
  };

  // Human Review Decision
  const handleReviewViolation = (violationId: number, decision: 'APPROVE' | 'REJECT', reason?: string) => {
    const targetViolation = violations.find((v) => v.id === violationId);
    if (!targetViolation) return;

    const actorName = currentUser ? currentUser.fullName : 'Officer on Duty';
    const actorRole = currentUser ? currentUser.role : 'TRAFFIC_OFFICER';

    setViolations((prev) =>
      prev.map((v) => {
        if (v.id === violationId) {
          return {
            ...v,
            status: decision === 'APPROVE' ? 'CONFIRMED' : 'REJECTED',
            reviewedBy: `${actorName} (${currentUser?.badgeId || 'POL-01'})`,
            reviewReason: reason || (decision === 'APPROVE' ? 'Corroborated by optical trajectory evidence' : 'Officer discarded candidate'),
          };
        }
        return v;
      })
    );

    // If approved, automatically create a fine
    if (decision === 'APPROVE') {
      const fineId = `CHL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const newFine: Fine = {
        id: Date.now(),
        fineId,
        violationId: targetViolation.id,
        plateNumber: targetViolation.plateNumber,
        amount: targetViolation.fineAmount,
        status: 'UNPAID',
        issuedAt: new Date().toLocaleDateString(),
        dueDate: 'Within 15 Days',
        noticeText: `${targetViolation.violationType} infraction at ${targetViolation.location}.`,
      };
      setFines((prev) => [newFine, ...prev]);

      // Alert
      const alertItem: AlertItem = {
        id: Date.now(),
        title: `Digital Fine Issued: ${fineId}`,
        message: `Challan for ₹${targetViolation.fineAmount} registered for vehicle ${targetViolation.plateNumber}.`,
        severity: 'INFO',
        timestamp: 'Just now',
        isRead: false,
        source: 'Challan Dispatcher',
      };
      setAlerts((prev) => [alertItem, ...prev]);
    }

    // Add Audit Log
    const audit: AuditLog = {
      id: Date.now(),
      action: decision === 'APPROVE' ? 'VIOLATION_APPROVED' : 'VIOLATION_REJECTED',
      actor: actorName,
      role: actorRole,
      entityId: targetViolation.violationId,
      details: `${decision} infraction for vehicle ${targetViolation.plateNumber}. ${reason ? `Reason: ${reason}` : ''}`,
      timestamp: new Date().toLocaleTimeString(),
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Payment Success Handler
  const handlePaymentSuccess = (payment: PaymentRecord) => {
    setPayments((prev) => [payment, ...prev]);

    // Mark Fine as Paid
    setFines((prev) =>
      prev.map((f) => (f.id === payment.fineId ? { ...f, status: 'PAID' } : f))
    );

    // Mark violation as Paid if linked
    const targetFine = fines.find((f) => f.id === payment.fineId);
    if (targetFine) {
      setViolations((prev) =>
        prev.map((v) => (v.id === targetFine.violationId ? { ...v, status: 'PAID' } : v))
      );
    }

    // Add Audit Log
    const log: AuditLog = {
      id: Date.now(),
      action: 'PAYMENT_SETTLED',
      actor: 'Simulated Citizen Gateway',
      role: 'CITIZEN_PAYER',
      entityId: payment.transactionRef,
      details: `Settled fine amount ₹${payment.amount} for plate ${payment.plateNumber} via ${payment.method}.`,
      timestamp: new Date().toLocaleTimeString(),
    };
    setAuditLogs((prev) => [log, ...prev]);

    // Create Alert
    const alertItem: AlertItem = {
      id: Date.now(),
      title: 'Payment Cleared',
      message: `Challan paid for vehicle ${payment.plateNumber}. Transaction: ${payment.transactionRef}.`,
      severity: 'INFO',
      timestamp: 'Just now',
      isRead: false,
      source: 'Payment Gateway',
    };
    setAlerts((prev) => [alertItem, ...prev]);
  };

  // Ingestion AI Detection Trigger Handler
  const handleViolationCaptured = (newViolation: Violation) => {
    setViolations((prev) => [newViolation, ...prev]);

    // Increment camera stats
    setCameras((prev) =>
      prev.map((c) =>
        c.cameraId === newViolation.cameraId
          ? { ...c, violationsToday: c.violationsToday + 1, vehiclesToday: c.vehiclesToday + 1 }
          : c
      )
    );

    // High severity alert
    const newAlert: AlertItem = {
      id: Date.now(),
      title: `Critical Infraction: ${newViolation.violationType}`,
      message: `Vehicle ${newViolation.plateNumber} recorded at ${newViolation.location} (${newViolation.detectedSpeed || 0} km/h).`,
      severity: 'HIGH',
      timestamp: 'Just now',
      isRead: false,
      source: newViolation.cameraId,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Hardware State Override Handler
  const handleToggleSensorStatus = (id: string, status: 'ONLINE' | 'OFFLINE' | 'FAULT') => {
    setSensors((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );

    if (status === 'FAULT') {
      const faultAlert: AlertItem = {
        id: Date.now(),
        title: `Hardware Fault: ${id}`,
        message: `Diagnostic test reported loss of CAN-Bus synchronization on sensor ${id}.`,
        severity: 'CRITICAL',
        timestamp: 'Just now',
        isRead: false,
        source: 'Hardware Diagnostics',
      };
      setAlerts((prev) => [faultAlert, ...prev]);
    }
  };

  // Camera Management
  const handleAddCamera = (newCam: Camera) => {
    setCameras((prev) => [...prev, newCam]);
    const log: AuditLog = {
      id: Date.now(),
      action: 'CAMERA_PROVISIONED',
      actor: currentUser?.fullName || 'Admin',
      role: currentUser?.role || 'ADMIN',
      entityId: newCam.cameraId,
      details: `Registered camera node ${newCam.name} at coordinates (${newCam.lat}, ${newCam.lng}).`,
      timestamp: new Date().toLocaleTimeString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const handleUpdateCamera = (updatedCam: Camera) => {
    setCameras((prev) => prev.map((c) => (c.id === updatedCam.id ? updatedCam : c)));
  };

  const handleDeleteCamera = (id: number) => {
    const cam = cameras.find((c) => c.id === id);
    setCameras((prev) => prev.filter((c) => c.id !== id));
    if (cam) {
      const log: AuditLog = {
        id: Date.now(),
        action: 'CAMERA_DECOMMISSIONED',
        actor: currentUser?.fullName || 'Admin',
        role: currentUser?.role || 'ADMIN',
        entityId: cam.cameraId,
        details: `Decommissioned optical sensor node ${cam.name}.`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setAuditLogs((prev) => [log, ...prev]);
    }
  };

  // If unauthenticated, show Radar Login
  if (!currentUser) {
    return (
      <RadarLogin
        onLogin={handleLogin}
        onPresentationMode={() => setShowPresentationModal(true)}
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#F5F7FA] text-[#172033] font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={currentUser.role}
        pendingViolationsCount={pendingViolationsCount}
        unreadAlertsCount={unreadAlertsCount}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <TopBar
          currentUser={currentUser}
          activeTab={activeTab}
          onLogout={handleLogout}
          onOpenAlerts={() => setActiveTab('alerts')}
          unreadAlertsCount={unreadAlertsCount}
          onLaunchPresentation={() => setShowPresentationModal(true)}
          onOpenPythonCode={() => setShowPythonCodeModal(true)}
        />

        {/* View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              violations={violations}
              cameras={cameras}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onReviewViolation={(v) => setSelectedViolationForReview(v)}
            />
          )}

          {activeTab === 'live-monitoring' && (
            <LiveMonitoringView
              cameras={cameras}
              onViolationCaptured={handleViolationCaptured}
            />
          )}

          {activeTab === 'violations' && (
            <ViolationsView
              violations={violations}
              onReview={handleReviewViolation}
              selectedForReview={selectedViolationForReview}
              onCloseReviewModal={() => setSelectedViolationForReview(null)}
              onOpenReviewModal={(v) => setSelectedViolationForReview(v)}
            />
          )}

          {activeTab === 'vehicles' && (
            <VehiclesView
              vehicles={vehicles}
              violations={violations}
              onInspectViolation={(v) => {
                setActiveTab('violations');
                setSelectedViolationForReview(v);
              }}
            />
          )}

          {activeTab === 'cameras' && (
            <CamerasView
              cameras={cameras}
              onAddCamera={handleAddCamera}
              onUpdateCamera={handleUpdateCamera}
              onDeleteCamera={handleDeleteCamera}
            />
          )}

          {activeTab === 'traffic-map' && <TrafficMapView cameras={cameras} />}

          {activeTab === 'analytics' && <AnalyticsView violations={violations} />}

          {activeTab === 'ai-performance' && <AIPerformanceView />}

          {activeTab === 'evidence' && (
            <EvidenceView
              violations={violations}
              onInspectViolation={(v) => {
                setActiveTab('violations');
                setSelectedViolationForReview(v);
              }}
            />
          )}

          {activeTab === 'fines' && (
            <FinesView
              fines={fines}
              onOpenPaymentModal={(fine) => {
                setActiveFineForPayment(fine);
                setActiveTab('payments');
              }}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentsView
              payments={payments}
              activeFineForPayment={activeFineForPayment}
              onClosePaymentModal={() => setActiveFineForPayment(null)}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsView
              alerts={alerts}
              onMarkRead={(id) =>
                setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)))
              }
              onClearAll={() =>
                setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })))
              }
            />
          )}

          {activeTab === 'reports' && <ReportsView violations={violations} />}

          {activeTab === 'ai-models' && <AIModelsView />}

          {activeTab === 'hardware-sim' && (
            <HardwareSimView
              sensors={sensors}
              onToggleSensorStatus={handleToggleSensorStatus}
            />
          )}

          {activeTab === 'audit-logs' && <AuditLogsView logs={auditLogs} />}

          {activeTab === 'system-health' && <SystemHealthView />}

          {activeTab === 'settings' && <SettingsView />}

          {activeTab === 'about' && (
            <AboutProjectView onOpenPythonCode={() => setShowPythonCodeModal(true)} />
          )}
        </main>
      </div>

      {/* OVERLAY MODALS */}
      {showPresentationModal && (
        <PresentationModal
          onClose={() => setShowPresentationModal(false)}
          onNavigateToTab={(tab) => setActiveTab(tab)}
        />
      )}

      {showPythonCodeModal && (
        <PythonSourceView onClose={() => setShowPythonCodeModal(false)} />
      )}
    </div>
  );
}

export default App;
