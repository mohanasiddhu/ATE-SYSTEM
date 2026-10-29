import { Router } from 'express';
import { loginHandler, getCurrentUserHandler } from '../controllers/authController.js';
import {
  liveDetectionHandler,
  imageDetectionHandler,
  videoDetectionHandler,
  anprHandler
} from '../controllers/detectionController.js';
import {
  getViolationsHandler,
  getViolationByIdHandler,
  updateViolationStatusHandler,
  getChallansHandler,
  getChallanByIdHandler,
  payChallanHandler,
  getCamerasHandler,
  getCameraByIdHandler,
  updateCameraStatusHandler,
  getEvidenceHandler,
  getDashboardStatsHandler,
  generateReportHandler,
  getVehiclesHandler,
  getVehicleByPlateHandler,
  getUsersHandler
} from '../controllers/resourceControllers.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const apiRouter = Router();

// 1. Authentication
apiRouter.post('/auth/login', loginHandler);
apiRouter.get('/auth/me', authMiddleware, getCurrentUserHandler);

// 2. Users
apiRouter.get('/users', authMiddleware, getUsersHandler);

// 3. Vehicles
apiRouter.get('/vehicles', authMiddleware, getVehiclesHandler);
apiRouter.get('/vehicles/:plate', authMiddleware, getVehicleByPlateHandler);

// 4. Cameras
apiRouter.get('/cameras', getCamerasHandler);
apiRouter.get('/cameras/:id', getCameraByIdHandler);
apiRouter.patch('/cameras/:id/status', authMiddleware, updateCameraStatusHandler);

// 5. Detection Pipeline Endpoints
apiRouter.post('/live-detection', liveDetectionHandler);
apiRouter.post('/image-detection', imageDetectionHandler);
apiRouter.post('/video-detection', videoDetectionHandler);
apiRouter.post('/anpr', anprHandler);

// 6. Violations
apiRouter.get('/violations', getViolationsHandler);
apiRouter.get('/violations/:id', getViolationByIdHandler);
apiRouter.patch('/violations/:id/status', authMiddleware, updateViolationStatusHandler);

// 7. Challans (e-Fines)
apiRouter.get('/challans', getChallansHandler);
apiRouter.get('/challans/:id', getChallanByIdHandler);
apiRouter.post('/challans/:id/pay', payChallanHandler);

// 8. Evidence Vault
apiRouter.get('/evidence', getEvidenceHandler);

// 9. Dashboard Statistics
apiRouter.get('/dashboard/stats', getDashboardStatsHandler);

// 10. Reports
apiRouter.get('/reports', generateReportHandler);
apiRouter.post('/reports/generate', generateReportHandler);
