import { db, CameraEntity } from '../../database/connection.js';

export class CameraService {
  public getAllCameras() {
    return db.getCameras();
  }

  public getCameraById(id: string) {
    return db.getCameraById(id);
  }

  public setStatus(id: string, status: CameraEntity['status']) {
    return db.updateCameraStatus(id, status);
  }
}

export const cameraService = new CameraService();
