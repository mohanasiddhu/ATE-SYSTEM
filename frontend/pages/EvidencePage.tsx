import React from 'react';
import { EvidenceView } from '../components/EvidenceView.js';
import { initialViolations } from '../data/mockData.js';
import { Violation } from '../types/index.js';

interface EvidencePageProps {
  violations?: Violation[];
  onInspectViolation?: (v: Violation) => void;
}

export const EvidencePage: React.FC<EvidencePageProps> = ({
  violations = initialViolations,
  onInspectViolation = () => {}
}) => {
  return <EvidenceView violations={violations} onInspectViolation={onInspectViolation} />;
};

export default EvidencePage;
