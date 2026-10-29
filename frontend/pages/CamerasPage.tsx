import React from 'react';
import { CamerasView } from '../components/CamerasView.js';
import { initialCameras } from '../data/mockData.js';
import { Camera } from '../types/index.js';

interface CamerasPageProps {
  cameras?: Camera[];
  onAddCamera?: (newCam: Camera) => void;
  onUpdateCamera?: (cam: Camera) => void;
  onDeleteCamera?: (id: number) => void;
}

export const CamerasPage: React.FC<CamerasPageProps> = ({
  cameras = initialCameras,
  onAddCamera = () => {},
  onUpdateCamera = () => {},
  onDeleteCamera = () => {}
}) => {
  return (
    <CamerasView
      cameras={cameras}
      onAddCamera={onAddCamera}
      onUpdateCamera={onUpdateCamera}
      onDeleteCamera={onDeleteCamera}
    />
  );
};

export default CamerasPage;
