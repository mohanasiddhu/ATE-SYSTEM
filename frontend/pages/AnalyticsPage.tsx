import React from 'react';
import { AnalyticsView } from '../components/AnalyticsView.js';
import { initialViolations } from '../data/mockData.js';
import { Violation } from '../types/index.js';

interface AnalyticsPageProps {
  violations?: Violation[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ violations = initialViolations }) => {
  return <AnalyticsView violations={violations} />;
};

export default AnalyticsPage;
