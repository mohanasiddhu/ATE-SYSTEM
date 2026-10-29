import React from 'react';
import { LiveMonitoringView } from '../components/LiveMonitoringView.js';
import { initialCameras } from '../data/mockData.js';
import { Camera, Violation } from '../types/index.js';

interface LiveMonitoringPageProps {
  cameras?: Camera[];
  onViolationCaptured?: (v: Violation) => void;
}

export const LiveMonitoringPage: React.FC<LiveMonitoringPageProps> = ({
  cameras = initialCameras,
  onViolationCaptured = () => {}
}) => {
  return <LiveMonitoringView cameras={cameras} onViolationCaptured={onViolationCaptured} />;
};

export default LiveMonitoringPage;
