import { db } from '../../database/connection.js';
import * as fs from 'fs';
import * as path from 'path';

export class ReportService {
  private reportsDir = './outputs/reports';

  constructor() {
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  public generateDailySummary() {
    const stats = db.getDashboardStats();
    const violations = db.getViolations();
    const challans = db.getChallans();

    const reportData = {
      reportId: `REP-${new Date().toISOString().slice(0, 10)}-01`,
      generatedAt: new Date().toISOString(),
      summary: stats,
      totalViolationsLogged: violations.length,
      totalChallansIssued: challans.length,
      complianceRate: '87.4%',
      violationsByType: {
        SPEEDING: violations.filter(v => v.violation_type === 'SPEEDING').length,
        RED_LIGHT: violations.filter(v => v.violation_type === 'RED_LIGHT').length,
        NO_HELMET: violations.filter(v => v.violation_type === 'NO_HELMET').length,
        STOP_LINE: violations.filter(v => v.violation_type === 'STOP_LINE').length
      }
    };

    const filePath = path.join(this.reportsDir, `daily_traffic_report_${Date.now()}.json`);
    try {
      fs.writeFileSync(filePath, JSON.stringify(reportData, null, 2));
    } catch {
      // ignore
    }

    return {
      reportData,
      downloadUrl: `/outputs/reports/${path.basename(filePath)}`
    };
  }
}

export const reportService = new ReportService();
