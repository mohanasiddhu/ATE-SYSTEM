import { db } from '../../database/connection.js';

export class ChallanService {
  public getAllChallans() {
    return db.getChallans();
  }

  public getChallanById(id: string) {
    return db.getChallanById(id);
  }

  public payChallan(id: string, paymentMethod = 'DEMO_UPI') {
    return db.payChallan(id, paymentMethod);
  }
}

export const challanService = new ChallanService();
