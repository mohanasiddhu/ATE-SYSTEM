/**
 * Backend Configuration Module
 */

export const backendConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  jwtSecret: process.env.JWT_SECRET || 'traffic-system-jwt-super-secret-key-demo',
  tokenExpiryHours: 24,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  directories: {
    outputs: './outputs',
    evidence: './outputs/evidence',
    crops: './outputs/crops',
    reports: './outputs/reports',
    videos: './outputs/videos',
    uploads: './backend/uploads'
  },
  ai: {
    vehicleWeights: './ai_models/weights/yolov8n.pt',
    plateWeights: './ai_models/weights/yolov8n-license-plate.pt',
    minConfidence: 0.85
  }
};
