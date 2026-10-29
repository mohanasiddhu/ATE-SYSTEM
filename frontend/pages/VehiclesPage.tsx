import React from 'react';
import { VehiclesView } from '../components/VehiclesView.js';
import { initialVehicles, initialViolations } from '../data/mockData.js';
import { Vehicle, Violation } from '../types/index.js';

interface VehiclesPageProps {
  vehicles?: Vehicle[];
  violations?: Violation[];
  onInspectViolation?: (v: Violation) => void;
}

export const VehiclesPage: React.FC<VehiclesPageProps> = ({
  vehicles = initialVehicles,
  violations = initialViolations,
  onInspectViolation = () => {}
}) => {
  return (
    <VehiclesView
      vehicles={vehicles}
      violations={violations}
      onInspectViolation={onInspectViolation}
    />
  );
};

export default VehiclesPage;
