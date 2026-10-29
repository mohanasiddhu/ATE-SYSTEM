import React from 'react';
import { ViolationsView } from '../components/ViolationsView.js';
import { initialViolations } from '../data/mockData.js';
import { Violation } from '../types/index.js';

interface ViolationsPageProps {
  violations?: Violation[];
  onReview?: (violationId: number, decision: 'APPROVE' | 'REJECT', reason?: string) => void;
  selectedForReview?: Violation | null;
  onOpenReviewModal?: (v: Violation) => void;
  onCloseReviewModal?: () => void;
}

export const ViolationsPage: React.FC<ViolationsPageProps> = ({
  violations = initialViolations,
  onReview = () => {},
  selectedForReview = null,
  onOpenReviewModal = () => {},
  onCloseReviewModal = () => {}
}) => {
  return (
    <ViolationsView
      violations={violations}
      onReview={onReview}
      selectedForReview={selectedForReview}
      onOpenReviewModal={onOpenReviewModal}
      onCloseReviewModal={onCloseReviewModal}
    />
  );
};

export default ViolationsPage;
