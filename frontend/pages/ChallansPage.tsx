import React from 'react';
import { FinesView } from '../components/FinesView.js';
import { initialFines } from '../data/mockData.js';
import { Fine } from '../types/index.js';

interface ChallansPageProps {
  fines?: Fine[];
  onOpenPaymentModal?: (fine: Fine) => void;
}

export const ChallansPage: React.FC<ChallansPageProps> = ({
  fines = initialFines,
  onOpenPaymentModal = () => {}
}) => {
  return <FinesView fines={fines} onOpenPaymentModal={onOpenPaymentModal} />;
};

export default ChallansPage;
