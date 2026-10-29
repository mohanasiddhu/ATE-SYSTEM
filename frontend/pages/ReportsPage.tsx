import React from 'react';
import { ReportsView } from '../components/ReportsView.js';
import { initialViolations } from '../data/mockData.js';
import { Violation } from '../types/index.js';

interface ReportsPageProps {
  violations?: Violation[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ violations = initialViolations }) => {
  return <ReportsView violations={violations} />;
};

export default ReportsPage;
