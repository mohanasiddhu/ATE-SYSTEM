import { db, ViolationEntity } from '../../database/connection.js';

export class ViolationService {
  public getAllViolations() {
    return db.getViolations();
  }

  public getViolationById(id: string) {
    return db.getViolationById(id);
  }

  public updateStatus(id: string, status: ViolationEntity['status'], reviewer: string) {
    return db.updateViolationStatus(id, status, reviewer);
  }
}

export const violationService = new ViolationService();
