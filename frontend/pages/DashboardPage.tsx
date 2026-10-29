import React from 'react';
import { DashboardView } from '../components/DashboardView.js';
import { initialViolations, initialCameras } from '../data/mockData.js';
import { Violation, Camera } from '../types/index.js';

interface DashboardPageProps {
  violations?: Violation[];
  cameras?: Camera[];
  onNavigateTab?: (tab: any) => void;
  onReviewViolation?: (v: Violation) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  violations = initialViolations,
  cameras = initialCameras,
  onNavigateTab = () => {},
  onReviewViolation = () => {}
}) => {
  return (
    <DashboardView
      violations={violations}
      cameras={cameras}
      onNavigateTab={onNavigateTab}
      onReviewViolation={onReviewViolation}
    />
  );
};

export default DashboardPage;
