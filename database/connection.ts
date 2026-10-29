/**
 * AI-Driven Smart Traffic Enforcement System
 * Database Connection & Relational Data Access Layer
 */

export interface UserEntity {
  id: number;
  username: string;
  email: string;
  full_name: string;
  hashed_password?: string;
  role: 'ADMIN' | 'SUPER_ADMIN' | 'OFFICER' | 'VIEWER' | 'AUDITOR';
  badge_id?: string;
  department: string;
  is_active: boolean;
  created_at: string;
}

export interface VehicleEntity {
  id: number;
  plate_number: string;
  vehicle_type: 'Car' | 'Motorcycle' | 'Bus' | 'Truck' | 'Auto-Rickshaw' | 'EV';
  make: string;
  model: string;
  vehicle_color: string;
  owner_name: string;
  owner_phone?: string;
  owner_email?: string;
  registration_date?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'STOLEN' | 'IMPOUNDED';
  insurance_status: 'VALID' | 'EXPIRED' | 'PENDING';
  pollution_status: 'VALID' | 'EXPIRED';
  created_at: string;
}

export interface CameraEntity {
  id: number;
  camera_id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  rtsp_url?: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'STREAM_ERROR';
  speed_limit: number;
  traffic_signal_state: 'RED' | 'YELLOW' | 'GREEN' | 'FLASHING';
  junction_name: string;
  fps: number;
  resolution: string;
  model_version: string;
  created_at: string;
}

export interface ViolationEntity {
  id: number;
  violation_id: string;
  vehicle_id?: number | null;
  plate_number: string;
  violation_type: 'SPEEDING' | 'RED_LIGHT' | 'NO_HELMET' | 'WRONG_WAY' | 'STOP_LINE' | 'TRIPLE_RIDING' | 'BUS_LANE_INTRUSION';
  camera_id: string;
  location: string;
  timestamp: string;
  confidence: number;
  detected_speed?: number | null;
  speed_limit?: number | null;
  signal_state?: string;
  evidence_image?: string;
  evidence_video?: string;
  status: 'PENDING_REVIEW' | 'CONFIRMED' | 'REJECTED' | 'FINE_GENERATED' | 'PAID' | 'DISPUTED';
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
  fine_amount: number;
  created_at: string;
}

export interface ChallanEntity {
  id: number;
  challan_id: string;
  violation_id: number;
  plate_number: string;
  amount: number;
  status: 'UNPAID' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'CONTESTED';
  issued_at: string;
  due_date: string;
  payment_reference?: string | null;
  payment_method?: string | null;
  paid_at?: string | null;
  receipt_number?: string | null;
  notice_text?: string;
}

export interface DetectionEventEntity {
  id: number;
  event_id: string;
  camera_id: string;
  vehicle_class: string;
  track_id: number;
  speed_est: number;
  confidence: number;
  bbox_x1: number;
  bbox_y1: number;
  bbox_x2: number;
  bbox_y2: number;
  plate_detected?: string | null;
  timestamp: string;
}

export interface EvidenceEntity {
  id: number;
  evidence_id: string;
  violation_id: number;
  file_path: string;
  file_type: 'IMAGE' | 'VIDEO' | 'PLATE_CROP' | 'METADATA_JSON';
  file_size_bytes?: number;
  sha256_hash: string;
  crop_coordinates?: string;
  watermark_applied: boolean;
  timestamp: string;
  metadata_json?: string;
}

// Relational in-memory store initialized with seed dataset
class RelationalDatabase {
  private users: UserEntity[] = [];
  private vehicles: VehicleEntity[] = [];
  private cameras: CameraEntity[] = [];
  private violations: ViolationEntity[] = [];
  private challans: ChallanEntity[] = [];
  private detectionEvents: DetectionEventEntity[] = [];
  private evidenceVault: EvidenceEntity[] = [];

  constructor() {
    this.initSeeds();
  }

  private initSeeds() {
    this.users = [
      {
        id: 1,
        username: 'officer_sharma',
        email: 'rajesh.sharma@traffic.gov.in',
        full_name: 'Insp. Rajesh Sharma',
        role: 'OFFICER',
        badge_id: 'DL-TP-4091',
        department: 'Traffic Enforcement Unit A',
        is_active: true,
        created_at: new Date('2026-01-10T08:00:00Z').toISOString()
      },
      {
        id: 2,
        username: 'admin_verma',
        email: 'sunita.verma@traffic.gov.in',
        full_name: 'Dr. Sunita Verma',
        role: 'ADMIN',
        badge_id: 'DL-HQ-0012',
        department: 'Command & Control Operations',
        is_active: true,
        created_at: new Date('2026-01-05T08:00:00Z').toISOString()
      },
      {
        id: 3,
        username: 'analyst_mehta',
        email: 'amit.mehta@traffic.gov.in',
        full_name: 'Amit Mehta',
        role: 'VIEWER',
        badge_id: 'DL-AN-8921',
        department: 'Traffic Analytics Bureau',
        is_active: true,
        created_at: new Date('2026-02-01T08:00:00Z').toISOString()
      }
    ];

    this.vehicles = [
      {
        id: 1,
        plate_number: 'DL 01 AB 1234',
        vehicle_type: 'Car',
        make: 'Hyundai',
        model: 'Creta SX',
        vehicle_color: 'Polar White',
        owner_name: 'Aarav Malhotra',
        owner_phone: '+91 98112 34567',
        owner_email: 'aarav.m@example.com',
        registration_date: '2022-04-15',
        status: 'ACTIVE',
        insurance_status: 'VALID',
        pollution_status: 'VALID',
        created_at: new Date('2026-01-01').toISOString()
      },
      {
        id: 2,
        plate_number: 'MH 12 CD 5678',
        vehicle_type: 'Car',
        make: 'Tata',
        model: 'Nexon EV',
        vehicle_color: 'Daytona Grey',
        owner_name: 'Priya Deshmukh',
        owner_phone: '+91 98223 45678',
        owner_email: 'priya.d@example.com',
        registration_date: '2023-01-20',
        status: 'ACTIVE',
        insurance_status: 'VALID',
        pollution_status: 'VALID',
        created_at: new Date('2026-01-01').toISOString()
      },
      {
        id: 3,
        plate_number: 'KA 05 MC 4589',
        vehicle_type: 'Motorcycle',
        make: 'Royal Enfield',
        model: 'Classic 350',
        vehicle_color: 'Stealth Black',
        owner_name: 'Karthik Raman',
        owner_phone: '+91 98450 12345',
        owner_email: 'karthik.r@example.com',
        registration_date: '2021-08-10',
        status: 'ACTIVE',
        insurance_status: 'EXPIRED',
        pollution_status: 'VALID',
        created_at: new Date('2026-01-01').toISOString()
      },
      {
        id: 4,
        plate_number: 'HR 26 DQ 5555',
        vehicle_type: 'Car',
        make: 'BMW',
        model: '330i M Sport',
        vehicle_color: 'Portimao Blue',
        owner_name: 'Vikramaditya Rao',
        owner_phone: '+91 99100 99999',
        owner_email: 'vikram.rao@example.com',
        registration_date: '2023-11-05',
        status: 'ACTIVE',
        insurance_status: 'VALID',
        pollution_status: 'VALID',
        created_at: new Date('2026-01-01').toISOString()
      },
      {
        id: 5,
        plate_number: 'UP 16 Z 9999',
        vehicle_type: 'Car',
        make: 'Toyota',
        model: 'Fortuner 4x4',
        vehicle_color: 'Super White',
        owner_name: 'Raghvendra Yadav',
        owner_phone: '+91 98188 77777',
        owner_email: 'raghav.y@example.com',
        registration_date: '2020-03-12',
        status: 'ACTIVE',
        insurance_status: 'VALID',
        pollution_status: 'EXPIRED',
        created_at: new Date('2026-01-01').toISOString()
      },
      {
        id: 6,
        plate_number: 'TN 07 BE 3456',
        vehicle_type: 'Bus',
        make: 'Ashok Leyland',
        model: 'Viking City Bus',
        vehicle_color: 'Green-White',
        owner_name: 'Metropolitan Transport Corp',
        owner_phone: '+91 44 2345 6789',
        owner_email: 'fleet@mtc.gov.in',
        registration_date: '2019-06-22',
        status: 'ACTIVE',
        insurance_status: 'VALID',
        pollution_status: 'VALID',
        created_at: new Date('2026-01-01').toISOString()
      }
    ];

    this.cameras = [
      {
        id: 1,
        camera_id: 'CAM-01',
        name: 'Connaught Place Outer Circle North',
        location: 'Connaught Place Outer Circle North Gate, New Delhi',
        latitude: 28.6315,
        longitude: 77.2167,
        rtsp_url: 'rtsp://stream.traffic.gov.in/live/cam01',
        status: 'ONLINE',
        speed_limit: 50,
        traffic_signal_state: 'GREEN',
        junction_name: 'Connaught Place North',
        fps: 30.0,
        resolution: '1920x1080',
        model_version: 'YOLOv8x-Traffic-2.4',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        camera_id: 'CAM-02',
        name: 'AIIMS Flyover Northbound High-Speed Zone',
        location: 'AIIMS Flyover Express Lane, Ring Road, New Delhi',
        latitude: 28.5672,
        longitude: 77.2100,
        rtsp_url: 'rtsp://stream.traffic.gov.in/live/cam02',
        status: 'ONLINE',
        speed_limit: 60,
        traffic_signal_state: 'GREEN',
        junction_name: 'Ring Road AIIMS Section',
        fps: 30.0,
        resolution: '1920x1080',
        model_version: 'YOLOv8x-Traffic-2.4',
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        camera_id: 'CAM-03',
        name: 'ITO Junction Eastbound Intersection',
        location: 'ITO Crossing, Vikas Marg Intercept, New Delhi',
        latitude: 28.6289,
        longitude: 77.2410,
        rtsp_url: 'rtsp://stream.traffic.gov.in/live/cam03',
        status: 'ONLINE',
        speed_limit: 40,
        traffic_signal_state: 'RED',
        junction_name: 'ITO Central Junction',
        fps: 30.0,
        resolution: '1920x1080',
        model_version: 'YOLOv8x-Traffic-2.4',
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        camera_id: 'CAM-04',
        name: 'DND Flyway Toll Plaza Sector 15A',
        location: 'Delhi-Noida Direct Flyway, Entry Gantry #4',
        latitude: 28.5830,
        longitude: 77.3005,
        rtsp_url: 'rtsp://stream.traffic.gov.in/live/cam04',
        status: 'ONLINE',
        speed_limit: 70,
        traffic_signal_state: 'GREEN',
        junction_name: 'DND Toll Gantry',
        fps: 30.0,
        resolution: '1920x1080',
        model_version: 'YOLOv8x-Traffic-2.4',
        created_at: new Date().toISOString()
      },
      {
        id: 5,
        camera_id: 'CAM-05',
        name: 'Karol Bagh Market Crossing',
        location: 'Arya Samaj Road Junction, Karol Bagh',
        latitude: 28.6517,
        longitude: 77.1906,
        rtsp_url: 'rtsp://stream.traffic.gov.in/live/cam05',
        status: 'OFFLINE',
        speed_limit: 30,
        traffic_signal_state: 'YELLOW',
        junction_name: 'Karol Bagh Market Intercept',
        fps: 25.0,
        resolution: '1280x720',
        model_version: 'YOLOv8x-Traffic-2.4',
        created_at: new Date().toISOString()
      }
    ];

    this.violations = [
      {
        id: 1,
        violation_id: 'VIOL-2026-0081',
        vehicle_id: 1,
        plate_number: 'DL 01 AB 1234',
        violation_type: 'SPEEDING',
        camera_id: 'CAM-02',
        location: 'AIIMS Flyover Northbound High-Speed Zone',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        confidence: 0.96,
        detected_speed: 78.4,
        speed_limit: 60,
        signal_state: 'NONE',
        evidence_image: '/outputs/evidence/evidence_VIOL-2026-0081.jpg',
        status: 'PENDING_REVIEW',
        fine_amount: 1000,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 2,
        violation_id: 'VIOL-2026-0082',
        vehicle_id: 3,
        plate_number: 'KA 05 MC 4589',
        violation_type: 'NO_HELMET',
        camera_id: 'CAM-01',
        location: 'Connaught Place Outer Circle North',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        confidence: 0.94,
        detected_speed: 38.0,
        speed_limit: 50,
        signal_state: 'NONE',
        evidence_image: '/outputs/evidence/evidence_VIOL-2026-0082.jpg',
        status: 'CONFIRMED',
        reviewed_by: 'Insp. Rajesh Sharma',
        reviewed_at: new Date(Date.now() - 3600000 * 3).toISOString(),
        fine_amount: 1000,
        created_at: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 3,
        violation_id: 'VIOL-2026-0083',
        vehicle_id: 2,
        plate_number: 'MH 12 CD 5678',
        violation_type: 'RED_LIGHT',
        camera_id: 'CAM-03',
        location: 'ITO Junction Eastbound Intersection',
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
        confidence: 0.98,
        detected_speed: 42.5,
        speed_limit: 40,
        signal_state: 'RED',
        evidence_image: '/outputs/evidence/evidence_VIOL-2026-0083.jpg',
        status: 'CONFIRMED',
        reviewed_by: 'Insp. Rajesh Sharma',
        reviewed_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        fine_amount: 1500,
        created_at: new Date(Date.now() - 3600000 * 6).toISOString()
      },
      {
        id: 4,
        violation_id: 'VIOL-2026-0084',
        vehicle_id: 4,
        plate_number: 'HR 26 DQ 5555',
        violation_type: 'SPEEDING',
        camera_id: 'CAM-04',
        location: 'DND Flyway Toll Plaza Sector 15A',
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
        confidence: 0.97,
        detected_speed: 94.2,
        speed_limit: 70,
        signal_state: 'NONE',
        evidence_image: '/outputs/evidence/evidence_VIOL-2026-0084.jpg',
        status: 'FINE_GENERATED',
        reviewed_by: 'Insp. Rajesh Sharma',
        fine_amount: 2000,
        created_at: new Date(Date.now() - 3600000 * 8).toISOString()
      },
      {
        id: 5,
        violation_id: 'VIOL-2026-0085',
        vehicle_id: 5,
        plate_number: 'UP 16 Z 9999',
        violation_type: 'STOP_LINE',
        camera_id: 'CAM-03',
        location: 'ITO Junction Eastbound Intersection',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        confidence: 0.91,
        detected_speed: 15.0,
        speed_limit: 40,
        signal_state: 'RED',
        evidence_image: '/outputs/evidence/evidence_VIOL-2026-0085.jpg',
        status: 'PAID',
        reviewed_by: 'Dr. Sunita Verma',
        fine_amount: 500,
        created_at: new Date(Date.now() - 3600000 * 12).toISOString()
      }
    ];

    this.challans = [
      {
        id: 1,
        challan_id: 'CHALLAN-2026-0041',
        violation_id: 2,
        plate_number: 'KA 05 MC 4589',
        amount: 1000,
        status: 'UNPAID',
        issued_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        due_date: new Date(Date.now() + 86400000 * 30).toISOString(),
        notice_text: 'Violation of Section 129 Motor Vehicles Act: Riding two-wheeler without protective headgear.'
      },
      {
        id: 2,
        challan_id: 'CHALLAN-2026-0042',
        violation_id: 3,
        plate_number: 'MH 12 CD 5678',
        amount: 1500,
        status: 'UNPAID',
        issued_at: new Date(Date.now() - 3600000 * 6).toISOString(),
        due_date: new Date(Date.now() + 86400000 * 30).toISOString(),
        notice_text: 'Violation of Section 184 Motor Vehicles Act: Disobeying mandatory red traffic signal.'
      },
      {
        id: 3,
        challan_id: 'CHALLAN-2026-0043',
        violation_id: 4,
        plate_number: 'HR 26 DQ 5555',
        amount: 2000,
        status: 'UNPAID',
        issued_at: new Date(Date.now() - 3600000 * 8).toISOString(),
        due_date: new Date(Date.now() + 86400000 * 30).toISOString(),
        notice_text: 'Violation of Section 183(2) Motor Vehicles Act: Driving vehicle in excess of designated speed limit (94.2 km/h in 70 km/h zone).'
      },
      {
        id: 4,
        challan_id: 'CHALLAN-2026-0044',
        violation_id: 5,
        plate_number: 'UP 16 Z 9999',
        amount: 500,
        status: 'PAID',
        issued_at: new Date(Date.now() - 3600000 * 12).toISOString(),
        due_date: new Date(Date.now() + 86400000 * 30).toISOString(),
        payment_reference: 'UPI/20260925/892104812',
        payment_method: 'DEMO_UPI',
        paid_at: new Date(Date.now() - 3600000 * 10).toISOString(),
        receipt_number: 'REC-2026-89210',
        notice_text: 'Violation of Stop Line regulations at signalized intersection.'
      }
    ];

    this.detectionEvents = [
      {
        id: 1,
        event_id: 'EVT-00101',
        camera_id: 'CAM-02',
        vehicle_class: 'car',
        track_id: 101,
        speed_est: 78.4,
        confidence: 0.96,
        bbox_x1: 210.0,
        bbox_y1: 340.0,
        bbox_x2: 480.0,
        bbox_y2: 560.0,
        plate_detected: 'DL 01 AB 1234',
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        event_id: 'EVT-00102',
        camera_id: 'CAM-01',
        vehicle_class: 'motorcycle',
        track_id: 102,
        speed_est: 38.0,
        confidence: 0.94,
        bbox_x1: 520.0,
        bbox_y1: 280.0,
        bbox_x2: 640.0,
        bbox_y2: 450.0,
        plate_detected: 'KA 05 MC 4589',
        timestamp: new Date().toISOString()
      }
    ];

    this.evidenceVault = [
      {
        id: 1,
        evidence_id: 'EVD-2026-0081',
        violation_id: 1,
        file_path: '/outputs/evidence/evidence_VIOL-2026-0081.jpg',
        file_type: 'IMAGE',
        file_size_bytes: 245100,
        sha256_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        crop_coordinates: '210,340,480,560',
        watermark_applied: true,
        timestamp: new Date().toISOString(),
        metadata_json: JSON.stringify({ camera_id: 'CAM-02', speed_kmh: 78.4, limit_kmh: 60, plate: 'DL 01 AB 1234' })
      }
    ];
  }

  // Users
  getUsers(): UserEntity[] {
    return this.users.map(u => ({ ...u, hashed_password: '[REDACTED]' }));
  }

  getUserByUsername(username: string): UserEntity | undefined {
    return this.users.find(u => u.username === username);
  }

  // Vehicles
  getVehicles(): VehicleEntity[] {
    return this.vehicles;
  }

  getVehicleByPlate(plate: string): VehicleEntity | undefined {
    const clean = plate.replace(/\s+/g, '').toUpperCase();
    return this.vehicles.find(v => v.plate_number.replace(/\s+/g, '').toUpperCase() === clean);
  }

  addVehicle(vehicle: Omit<VehicleEntity, 'id' | 'created_at'>): VehicleEntity {
    const newVehicle: VehicleEntity = {
      ...vehicle,
      id: this.vehicles.length + 1,
      created_at: new Date().toISOString()
    };
    this.vehicles.push(newVehicle);
    return newVehicle;
  }

  // Cameras
  getCameras(): CameraEntity[] {
    return this.cameras;
  }

  getCameraById(cameraId: string): CameraEntity | undefined {
    return this.cameras.find(c => c.camera_id === cameraId);
  }

  updateCameraStatus(cameraId: string, status: CameraEntity['status']): CameraEntity | undefined {
    const cam = this.cameras.find(c => c.camera_id === cameraId);
    if (cam) {
      cam.status = status;
    }
    return cam;
  }

  // Violations
  getViolations(): (ViolationEntity & { vehicle?: VehicleEntity; camera?: CameraEntity })[] {
    return this.violations.map(v => ({
      ...v,
      vehicle: this.vehicles.find(veh => veh.id === v.vehicle_id),
      camera: this.cameras.find(cam => cam.camera_id === v.camera_id)
    }));
  }

  getViolationById(id: string): ViolationEntity | undefined {
    return this.violations.find(v => v.violation_id === id);
  }

  addViolation(violation: Omit<ViolationEntity, 'id' | 'created_at'>): ViolationEntity {
    const newViolation: ViolationEntity = {
      ...violation,
      id: this.violations.length + 1,
      created_at: new Date().toISOString()
    };
    this.violations.unshift(newViolation);
    return newViolation;
  }

  updateViolationStatus(id: string, status: ViolationEntity['status'], reviewer?: string): ViolationEntity | undefined {
    const viol = this.violations.find(v => v.violation_id === id);
    if (viol) {
      viol.status = status;
      if (reviewer) {
        viol.reviewed_by = reviewer;
        viol.reviewed_at = new Date().toISOString();
      }
    }
    return viol;
  }

  // Challans
  getChallans(): ChallanEntity[] {
    return this.challans;
  }

  getChallanById(id: string): ChallanEntity | undefined {
    return this.challans.find(c => c.challan_id === id);
  }

  addChallan(challan: Omit<ChallanEntity, 'id'>): ChallanEntity {
    const newChallan: ChallanEntity = {
      ...challan,
      id: this.challans.length + 1
    };
    this.challans.unshift(newChallan);
    return newChallan;
  }

  payChallan(challanId: string, paymentMethod = 'DEMO_UPI'): ChallanEntity | undefined {
    const ch = this.challans.find(c => c.challan_id === challanId);
    if (ch) {
      ch.status = 'PAID';
      ch.payment_method = paymentMethod;
      ch.paid_at = new Date().toISOString();
      ch.payment_reference = `PAY/${new Date().getFullYear()}/${Math.floor(100000000 + Math.random() * 900000000)}`;
      ch.receipt_number = `REC-${Math.floor(10000 + Math.random() * 90000)}`;

      // Also update linked violation
      const linkedViol = this.violations.find(v => v.id === ch.violation_id);
      if (linkedViol) {
        linkedViol.status = 'PAID';
      }
    }
    return ch;
  }

  // Detection Events
  getDetectionEvents(limit = 50): DetectionEventEntity[] {
    return this.detectionEvents.slice(0, limit);
  }

  addDetectionEvent(event: Omit<DetectionEventEntity, 'id' | 'timestamp'>): DetectionEventEntity {
    const newEvt: DetectionEventEntity = {
      ...event,
      id: this.detectionEvents.length + 1,
      timestamp: new Date().toISOString()
    };
    this.detectionEvents.unshift(newEvt);
    return newEvt;
  }

  // Evidence
  getEvidence(): EvidenceEntity[] {
    return this.evidenceVault;
  }

  getEvidenceByViolationId(violationId: number): EvidenceEntity | undefined {
    return this.evidenceVault.find(e => e.violation_id === violationId);
  }

  addEvidence(evidence: Omit<EvidenceEntity, 'id' | 'timestamp'>): EvidenceEntity {
    const newEv: EvidenceEntity = {
      ...evidence,
      id: this.evidenceVault.length + 1,
      timestamp: new Date().toISOString()
    };
    this.evidenceVault.unshift(newEv);
    return newEv;
  }

  // Dashboard Aggregation
  getDashboardStats() {
    const totalVehiclesDetected = this.detectionEvents.length + 1420;
    const activeCameras = this.cameras.filter(c => c.status === 'ONLINE').length;
    const detectedLicensePlates = this.vehicles.length + 840;
    const totalViolations = this.violations.length;
    const totalChallans = this.challans.length;
    const unpaidChallans = this.challans.filter(c => c.status === 'UNPAID').length;
    const totalRevenue = this.challans
      .filter(c => c.status === 'PAID')
      .reduce((acc, curr) => acc + curr.amount, 0);

    return {
      totalVehiclesDetected,
      activeCameras,
      totalCameras: this.cameras.length,
      detectedLicensePlates,
      violations: totalViolations,
      challans: totalChallans,
      unpaidChallans,
      totalRevenue,
      recentViolations: this.violations.slice(0, 5),
      systemStatus: 'ONLINE_ACTIVE',
      aiModelAccuracy: 98.4
    };
  }
}

export const db = new RelationalDatabase();
