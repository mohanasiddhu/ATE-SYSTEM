import { db } from '../../database/connection.js';

export class EvidenceService {
  public getAllEvidence() {
    return db.getEvidence();
  }

  public getEvidenceByViolation(violationId: number) {
    return db.getEvidenceByViolationId(violationId);
  }
}

export const evidenceService = new EvidenceService();
