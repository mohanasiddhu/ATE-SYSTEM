import { Request, Response } from 'express';
import { violationService } from '../services/violationService.js';
import { challanService } from '../services/challanService.js';
import { cameraService } from '../services/cameraService.js';
import { evidenceService } from '../services/evidenceService.js';
import { reportService } from '../services/reportService.js';
import { db } from '../../database/connection.js';

// Violations
export async function getViolationsHandler(_req: Request, res: Response): Promise<void> {
  res.json({ success: true, data: violationService.getAllViolations() });
}

export async function getViolationByIdHandler(req: Request, res: Response): Promise<void> {
  const violation = violationService.getViolationById(req.params.id);
  if (!violation) {
    res.status(404).json({ success: false, error: 'Violation not found' });
    return;
  }
  res.json({ success: true, data: violation });
}

export async function updateViolationStatusHandler(req: Request, res: Response): Promise<void> {
  const { status, reviewer } = req.body;
  const updated = violationService.updateStatus(req.params.id, status, reviewer || 'Officer');
  res.json({ success: true, data: updated });
}

// Challans
export async function getChallansHandler(_req: Request, res: Response): Promise<void> {
  res.json({ success: true, data: challanService.getAllChallans() });
}

export async function getChallanByIdHandler(req: Request, res: Response): Promise<void> {
  const challan = challanService.getChallanById(req.params.id);
  if (!challan) {
    res.status(404).json({ success: false, error: 'Challan not found' });
    return;
  }
  res.json({ success: true, data: challan });
}

export async function payChallanHandler(req: Request, res: Response): Promise<void> {
  const { paymentMethod } = req.body;
  const paid = challanService.payChallan(req.params.id, paymentMethod);
  if (!paid) {
    res.status(404).json({ success: false, error: 'Challan not found' });
    return;
  }
  res.json({ success: true, data: paid, message: 'Challan paid successfully' });
}

// Cameras
export async function getCamerasHandler(_req: Request, res: Response): Promise<void> {
  res.json({ success: true, data: cameraService.getAllCameras() });
}

export async function getCameraByIdHandler(req: Request, res: Response): Promise<void> {
  const cam = cameraService.getCameraById(req.params.id);
  if (!cam) {
    res.status(404).json({ success: false, error: 'Camera not found' });
    return;
  }
  res.json({ success: true, data: cam });
}

export async function updateCameraStatusHandler(req: Request, res: Response): Promise<void> {
  const { status } = req.body;
  const updated = cameraService.setStatus(req.params.id, status);
  res.json({ success: true, data: updated });
}

// Evidence
export async function getEvidenceHandler(_req: Request, res: Response): Promise<void> {
  res.json({ success: true, data: evidenceService.getAllEvidence() });
}

// Dashboard Statistics
export async function getDashboardStatsHandler(_req: Request, res: Response): Promise<void> {
  res.json({ success: true, data: db.getDashboardStats() });
}

// Reports
export async function generateReportHandler(_req: Request, res: Response): Promise<void> {
  const report = reportService.generateDailySummary();
  res.json({ success: true, data: report });
}

// Vehicles
export async function getVehiclesHandler(_req: Request, res: Response): Promise<void> {
  res.json({ success: true, data: db.getVehicles() });
}

export async function getVehicleByPlateHandler(req: Request, res: Response): Promise<void> {
  const vehicle = db.getVehicleByPlate(req.params.plate);
  if (!vehicle) {
    res.status(404).json({ success: false, error: 'Vehicle not found' });
    return;
  }
  res.json({ success: true, data: vehicle });
}

// Users
export async function getUsersHandler(_req: Request, res: Response): Promise<void> {
  res.json({ success: true, data: db.getUsers() });
}
