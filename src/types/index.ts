export type UserRole = 'ADMIN' | 'OFFICER' | 'VIEWER';

export interface User {
  id?: number;
  username: string;
  fullName: string;
  role: UserRole;
  badgeId: string;
  email: string;
}

export interface Vehicle {
  id: number;
  plateNumber: string;
  vehicleType: string;
  ownerName: string;
  vehicleColor: string;
  registrationDate: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'STOLEN';
  insuranceStatus: 'VALID' | 'EXPIRED';
  pollutionStatus: 'VALID' | 'EXPIRED';
}

export type ViolationType = 'SPEEDING' | 'RED_LIGHT' | 'NO_HELMET' | 'STOP_LINE' | 'WRONG_WAY';
export type ViolationStatus = 'PENDING_REVIEW' | 'CONFIRMED' | 'REJECTED' | 'FINE_GENERATED' | 'PAID';

export interface Violation {
  id: number;
  violationId: string;
  plateNumber: string;
  vehicleType: string;
  violationType: ViolationType;
  cameraId: string;
  location: string;
  timestamp: string;
  confidence: number;
  detectedSpeed?: number;
  speedLimit?: number;
  signalState: 'RED' | 'YELLOW' | 'GREEN' | 'NONE';
  evidenceImage: string;
  status: ViolationStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  fineAmount: number;
}

export interface Fine {
  id: number;
  fineId: string;
  violationId: number;
  plateNumber: string;
  amount: number;
  status: 'UNPAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  issuedAt: string;
  dueDate: string;
  paymentReference?: string;
  noticeText: string;
}

export interface PaymentRecord {
  id: string;
  fineId: number;
  transactionRef: string;
  amount: number;
  method: string;
  paidAt: string;
  receiptNumber: string;
  plateNumber: string;
}

export interface Camera {
  id: number;
  cameraId: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  speedLimit: number;
  signalState: 'RED' | 'YELLOW' | 'GREEN';
  junctionName: string;
  vehiclesToday: number;
  violationsToday: number;
}

export interface AlertItem {
  id: number;
  alertId?: string;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'HIGH' | 'WARNING' | 'INFO';
  source: string;
  timestamp: string;
  isRead: boolean;
}

export interface AuditLogItem {
  id: number;
  username?: string;
  actor?: string;
  role?: string;
  action: string;
  description?: string;
  details?: string;
  entityId?: string;
  timestamp: string;
  ipAddress?: string;
}

export type AuditLog = AuditLogItem;

export interface HardwareSensor {
  id: string;
  name: string;
  location: string;
  type: 'RADAR' | 'SIGNAL' | 'INDUCTIVE_LOOP' | 'ANPR_CAMERA';
  status: 'ONLINE' | 'OFFLINE' | 'FAULT';
  reading: string;
  lastPing: string;
}

// New Types for Multi-Input AI Detection Pipeline
export type DetectionInputMode = 'VIDEO' | 'IMAGE' | 'WEBCAM';

export interface DetectionJob {
  id: string;
  fileName: string;
  fileType: 'video' | 'image' | 'webcam';
  uploadDate: string;
  processingTime: string;
  objectsDetected: number;
  violationsCount: number;
  platesCount: number;
  avgConfidence: number;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
}

export interface DetectedItem {
  id: string;
  frameIndex?: number;
  timestamp: string;
  type: 'Car' | 'Bus' | 'Truck' | 'Motorcycle' | 'Bicycle';
  confidence: number;
  bbox: [number, number, number, number]; // x, y, width, height (percentage 0-100)
  trackingId: string;
  plateNumber?: string;
  plateConfidence?: number;
  plateBbox?: [number, number, number, number]; // x, y, width, height (percentage 0-100) for the number plate
  speed?: number;
  violation?: string;
}

export interface TimelineEvent {
  timestamp: string;
  seconds: number;
  description: string;
  type: 'VEHICLE' | 'PLATE' | 'SPEEDING' | 'RED_LIGHT' | 'NO_HELMET' | 'STOP_LINE';
  relatedObjectId?: string;
}

export interface EvidenceRecord {
  id: string;
  frameNumber: number;
  timestamp: string;
  vehicleId: string;
  vehicleType: string;
  plateNumber: string;
  violationType: string;
  confidence: number;
  source: string;
  imageUrl: string;
  status: 'PENDING REVIEW' | 'CONFIRMED' | 'REJECTED';
}

export interface ModelTrainingConfig {
  dataset: string;
  backbone: 'yolov8n' | 'yolov8s' | 'yolov8m';
  epochs: number;
  batchSize: number;
  learningRate: number;
  imgSize: number;
  optimizer: 'AdamW' | 'SGD';
  autoAnchor: boolean;
}

export interface TrainingProgressState {
  epoch: number;
  totalEpochs: number;
  progress: number;
  boxLoss: number;
  clsLoss: number;
  dflLoss: number;
  mAP50: number;
  mAP50_95: number;
  precision: number;
  recall: number;
  status: 'IDLE' | 'TRAINING' | 'COMPLETED';
}
