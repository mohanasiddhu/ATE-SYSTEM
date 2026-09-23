import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload,
  Video,
  Image as ImageIcon,
  Camera as CameraIcon,
  Play,
  Pause,
  RotateCcw,
  Download,
  FileText,
  AlertTriangle,
  Sparkles,
  Clock,
  Eye,
  Zap,
  CheckCircle2,
  Sliders,
  Filter,
  ArrowRight,
  Info
} from 'lucide-react';
import { Camera, Violation, DetectionInputMode, DetectionJob, DetectedItem, TimelineEvent, EvidenceRecord } from '../types';
import { SAMPLE_PRESETS, DEMO_EVALUATION_METRICS, SampleMedia } from '../data/detectionSamples';
import { DetectionCharts } from './DetectionCharts';
import { detectVehiclesAndPlatesFromImage } from '../services/aiDetectionService';

interface LiveMonitoringViewProps {
  cameras: Camera[];
  onViolationCaptured: (violation: Violation) => void;
}

export const LiveMonitoringView: React.FC<LiveMonitoringViewProps> = ({
  cameras,
  onViolationCaptured,
}) => {
  // Input Mode
  const [inputMode, setInputMode] = useState<DetectionInputMode>('VIDEO');

  // Video State
  const [videoSrc, setVideoSrc] = useState<string>(SAMPLE_PRESETS[0].url);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sample-video-highway');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileValidationError, setFileValidationError] = useState<string | null>(null);

  // Video Player Controls State
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [useSimulator, setUseSimulator] = useState<boolean>(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  // Ingestion Pipeline State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<number>(82);
  const [processingStage, setProcessingStage] = useState<string>('License plate recognition');
  const [processingFrame, setProcessingFrame] = useState<{ current: number; total: number }>({ current: 248, total: 600 });
  const [processingTimeElapsed, setProcessingTimeElapsed] = useState<number>(18.4);

  // Image Processing State
  const [imageProcessed, setImageProcessed] = useState<boolean>(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(SAMPLE_PRESETS[1].url);

  // Display Filters
  const [filterMode, setFilterMode] = useState<'ALL' | 'VIOLATIONS' | 'COMPLIANT'>('ALL');
  const [showPlateBoxes, setShowPlateBoxes] = useState<boolean>(true);

  // Webcam State
  const [webcamActive, setWebcamActive] = useState<boolean>(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);

  // Active Detections & Data
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>(SAMPLE_PRESETS[0].detectedItems);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(SAMPLE_PRESETS[0].timeline);
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>(SAMPLE_PRESETS[0].evidence);

  // Processing History
  const [jobsHistory, setJobsHistory] = useState<DetectionJob[]>([
    {
      id: 'JOB-901',
      fileName: 'highway_corridor_sample.mp4',
      fileType: 'video',
      uploadDate: 'Today, 06:40 AM',
      processingTime: '18.4s',
      objectsDetected: 42,
      violationsCount: 7,
      platesCount: 31,
      avgConfidence: 0.914,
      status: 'COMPLETED',
    },
    {
      id: 'JOB-902',
      fileName: 'washington_st_junction.jpg',
      fileType: 'image',
      uploadDate: 'Today, 06:15 AM',
      processingTime: '1.4s',
      objectsDetected: 6,
      violationsCount: 1,
      platesCount: 6,
      avgConfidence: 0.952,
      status: 'COMPLETED',
    },
  ]);

  // Model Evaluation Benchmark State
  const [showEvaluationMetrics, setShowEvaluationMetrics] = useState<boolean>(false);
  const [evaluatingBenchmark, setEvaluatingBenchmark] = useState<boolean>(false);

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const simOffsetRef = useRef<number>(0);

  // Aggregated Stats
  const totalObjects = detectedItems.length;
  const vehicleCounts = {
    cars: detectedItems.filter((d) => d.type === 'Car').length,
    buses: detectedItems.filter((d) => d.type === 'Bus').length,
    trucks: detectedItems.filter((d) => d.type === 'Truck').length,
    motorcycles: detectedItems.filter((d) => d.type === 'Motorcycle').length,
    bicycles: detectedItems.filter((d) => d.type === 'Bicycle').length,
  };
  const totalVehicles =
    vehicleCounts.cars +
    vehicleCounts.buses +
    vehicleCounts.trucks +
    vehicleCounts.motorcycles +
    vehicleCounts.bicycles;

  const totalPlates = detectedItems.filter((d) => !!d.plateNumber).length;
  const recognizedPlates = detectedItems.filter(
    (d) => !!d.plateNumber && (d.plateConfidence || 0) >= 0.85
  ).length;

  const totalViolations = detectedItems.filter((d) => !!d.violation).length;
  const compliantCount = detectedItems.filter((d) => !d.violation).length;

  const avgConfidence =
    detectedItems.reduce((acc, curr) => acc + curr.confidence, 0) /
    (detectedItems.length || 1);

  const violationCounts = {
    speeding: detectedItems.filter((d) => d.violation?.toLowerCase().includes('speed')).length,
    redLight: detectedItems.filter((d) => d.violation?.toLowerCase().includes('red')).length,
    noHelmet: detectedItems.filter((d) => d.violation?.toLowerCase().includes('helmet')).length,
    wrongWay: detectedItems.filter((d) => d.violation?.toLowerCase().includes('wrong')).length,
    stopLine: detectedItems.filter((d) => d.violation?.toLowerCase().includes('lane')).length,
  };

  const confidenceBuckets = [
    { range: '95-100%', count: detectedItems.filter((d) => d.confidence >= 0.95).length },
    { range: '90-94%', count: detectedItems.filter((d) => d.confidence >= 0.9 && d.confidence < 0.95).length },
    { range: '85-89%', count: detectedItems.filter((d) => d.confidence >= 0.85 && d.confidence < 0.9).length },
    { range: '80-84%', count: detectedItems.filter((d) => d.confidence >= 0.8 && d.confidence < 0.85).length },
    { range: '<80%', count: detectedItems.filter((d) => d.confidence < 0.8).length },
  ];

  const fpsHistory = [28.4, 29.1, 30.0, 29.8, 30.2, 29.5, 30.0, 29.9, 30.1];
  const frameDetections = [8, 11, 14, 12, 15, 13, 14, 16, 14];
  const avgConfidenceHistory = [0.91, 0.93, 0.92, 0.94, 0.91, 0.95, 0.93, 0.92, 0.94];

  // Helper: Draw Annotated Bounding Boxes
  // USER MANDATE: Red BB for violations, Green BB for compliant, Number plate detected even without violation
  const renderAnnotatedBoundingBoxes = useCallback((
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    items: DetectedItem[],
    selectedId: string | null,
    showPlates: boolean,
    fMode: 'ALL' | 'VIOLATIONS' | 'COMPLIANT'
  ) => {
    items.forEach((item) => {
      const isViolation = !!item.violation;
      if (fMode === 'VIOLATIONS' && !isViolation) return;
      if (fMode === 'COMPLIANT' && isViolation) return;

      const [bx, by, bw, bh] = item.bbox;
      const vx = (bx / 100) * canvasWidth;
      const vy = (by / 100) * canvasHeight;
      const vw = (bw / 100) * canvasWidth;
      const vh = (bh / 100) * canvasHeight;

      const isSelected = selectedId === item.id;
      const mainColor = isViolation ? '#ef4444' : '#10b981';
      const bgColor = isViolation ? 'rgba(239, 68, 68, 0.18)' : 'rgba(16, 185, 129, 0.14)';

      // 1. VEHICLE BOUNDING BOX
      ctx.fillStyle = bgColor;
      ctx.fillRect(vx, vy, vw, vh);

      ctx.strokeStyle = mainColor;
      ctx.lineWidth = isSelected ? 3.5 : 2;
      ctx.strokeRect(vx, vy, vw, vh);

      // Corner reticles
      const tick = 8;
      ctx.fillStyle = mainColor;
      ctx.fillRect(vx - 2, vy - 2, tick, 3);
      ctx.fillRect(vx - 2, vy - 2, 3, tick);
      ctx.fillRect(vx + vw - tick + 2, vy - 2, tick, 3);
      ctx.fillRect(vx + vw - 1, vy - 2, 3, tick);
      ctx.fillRect(vx - 2, vy + vh - 1, tick, 3);
      ctx.fillRect(vx - 2, vy + vh - tick + 2, 3, tick);
      ctx.fillRect(vx + vw - tick + 2, vy + vh - 1, tick, 3);
      ctx.fillRect(vx + vw - 1, vy + vh - tick + 2, 3, tick);

      // Vehicle Tag Header
      const vehLabel = `${item.type.toUpperCase()} #${item.trackingId || item.id} (${(item.confidence * 100).toFixed(0)}%)`;
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      const textMetrics = ctx.measureText(vehLabel);
      const tagW = Math.max(70, textMetrics.width + 12);
      const tagH = 18;

      ctx.fillStyle = isViolation ? '#dc2626' : '#059669';
      ctx.fillRect(vx, Math.max(0, vy - tagH), tagW, tagH);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(vehLabel, vx + 6, Math.max(14, vy - 6));

      // 2. NUMBER PLATE BOUNDING BOX
      // Detect number plate EVEN IF THERE IS NO VIOLATION
      if (showPlates && item.plateNumber) {
        let px = vx + vw * 0.35;
        let py = vy + vh * 0.78;
        let pw = Math.max(38, vw * 0.3);
        let ph = Math.max(16, vh * 0.16);

        if (item.plateBbox) {
          px = (item.plateBbox[0] / 100) * canvasWidth;
          py = (item.plateBbox[1] / 100) * canvasHeight;
          pw = (item.plateBbox[2] / 100) * canvasWidth;
          ph = (item.plateBbox[3] / 100) * canvasHeight;
        }

        const plateColor = isViolation ? '#ef4444' : '#10b981';
        const plateBg = isViolation ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.22)';

        ctx.fillStyle = plateBg;
        ctx.fillRect(px, py, pw, ph);

        ctx.strokeStyle = plateColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(px, py, pw, ph);

        // Plate Tag Banner
        const plateConf = item.plateConfidence ? `${(item.plateConfidence * 100).toFixed(0)}%` : '96%';
        const plateTag = isViolation
          ? `[LP: VIOLATION] ${item.plateNumber} (${plateConf})`
          : `[LP: DETECTED] ${item.plateNumber} (${plateConf})`;

        ctx.font = 'bold 9px JetBrains Mono, monospace';
        const pMetrics = ctx.measureText(plateTag);
        const pTagW = Math.max(pw, pMetrics.width + 10);
        const pTagH = 16;

        ctx.fillStyle = isViolation ? '#b91c1c' : '#047857';
        ctx.fillRect(px, py + ph + 2, pTagW, pTagH);

        ctx.fillStyle = '#ffffff';
        ctx.fillText(plateTag, px + 5, py + ph + 13);
      }
    });
  }, []);

  // 1. VIDEO SIMULATOR CANVAS RENDERER
  const drawSimulatorTraffic = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const roadTop = height * 0.15;
    const roadBottom = height * 0.92;
    const roadHeight = roadBottom - roadTop;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, roadTop, width, roadHeight);

    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, roadTop);
    ctx.lineTo(width, roadTop);
    ctx.stroke();

    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, roadBottom);
    ctx.lineTo(width, roadBottom);
    ctx.stroke();

    const numLanes = 4;
    const laneHeight = roadHeight / numLanes;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([24, 20]);
    simOffsetRef.current = (simOffsetRef.current - 4) % 44;
    ctx.lineDashOffset = simOffsetRef.current;

    for (let l = 1; l < numLanes; l++) {
      const y = roadTop + l * laneHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    const radarZoneX = width * 0.45;
    ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
    ctx.fillRect(radarZoneX - 40, roadTop, 80, roadHeight);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(radarZoneX - 40, roadTop, 80, roadHeight);

    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 9px JetBrains Mono, monospace';
    ctx.fillText('SPEED TRAP SENSOR GATE', radarZoneX - 35, roadTop - 6);

    const vehicles = [
      {
        id: 'TRK-104',
        type: 'Car' as const,
        color: '#38bdf8',
        speed: 84.5,
        lane: 0,
        baseX: (time * 110) % (width + 200) - 100,
        plate: 'MH-12-DE-4021',
        conf: 0.96,
        isViolation: true,
        violation: 'SPEEDING (84.5 km/h in 50 zone)',
        w: 90,
        h: 46,
      },
      {
        id: 'TRK-105',
        type: 'Truck' as const,
        color: '#f59e0b',
        speed: 46.2,
        lane: 3,
        baseX: (time * 55) % (width + 300) - 200,
        plate: 'TS-07-JK-8819',
        conf: 0.94,
        isViolation: false,
        w: 120,
        h: 52,
      },
      {
        id: 'TRK-108',
        type: 'Motorcycle' as const,
        color: '#ef4444',
        speed: 48.0,
        lane: 1,
        baseX: (time * 85) % (width + 150) - 80,
        plate: 'KA-03-MN-1120',
        conf: 0.91,
        isViolation: true,
        violation: 'NO_HELMET (Rider Helmet Incursion)',
        w: 64,
        h: 36,
      },
      {
        id: 'TRK-112',
        type: 'Car' as const,
        color: '#60a5fa',
        speed: 51.4,
        lane: 2,
        baseX: (time * 70) % (width + 220) - 120,
        plate: 'DL-01-AX-9920',
        conf: 0.95,
        isViolation: false,
        w: 86,
        h: 44,
      },
    ];

    const simItems: DetectedItem[] = vehicles.map((v) => {
      const x = v.baseX;
      const y = roadTop + v.lane * laneHeight + (laneHeight - v.h) / 2;

      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(x + 4, y + 4, v.w, v.h);
      ctx.fillStyle = v.color;
      ctx.fillRect(x, y, v.w, v.h);

      ctx.fillStyle = '#0f172a';
      if (v.type === 'Car' || v.type === 'Truck') {
        ctx.fillRect(x + v.w * 0.2, y + 4, v.w * 0.25, v.h - 8);
        ctx.fillRect(x + v.w * 0.55, y + 4, v.w * 0.3, v.h - 8);
      } else {
        ctx.beginPath();
        ctx.arc(x + v.w * 0.45, y + v.h / 2, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#fef08a';
      ctx.fillRect(x + v.w - 3, y + 3, 3, 7);
      ctx.fillRect(x + v.w - 3, y + v.h - 10, 3, 7);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x, y + 3, 3, 7);
      ctx.fillRect(x, y + v.h - 10, 3, 7);
      ctx.restore();

      return {
        id: v.id,
        timestamp: '00:01',
        type: v.type,
        confidence: v.conf,
        bbox: [(x / width) * 100, (y / height) * 100, (v.w / width) * 100, (v.h / height) * 100],
        trackingId: v.id,
        plateNumber: v.plate,
        plateConfidence: 0.95,
        plateBbox: [
          ((x + v.w * 0.4) / width) * 100,
          ((y + v.h * 0.75) / height) * 100,
          ((v.w * 0.35) / width) * 100,
          ((v.h * 0.2) / height) * 100,
        ],
        speed: v.speed,
        violation: v.violation,
      };
    });

    renderAnnotatedBoundingBoxes(ctx, width, height, simItems, selectedVehicleId, showPlateBoxes, filterMode);

    ctx.fillStyle = 'rgba(10, 15, 29, 0.85)';
    ctx.fillRect(10, 10, 370, 24);
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.fillText('● HIGHWAY SIMULATOR STREAM · RED: VIOLATION | GREEN: OK', 18, 26);
  }, [selectedVehicleId, showPlateBoxes, filterMode, renderAnnotatedBoundingBoxes]);

  // 2. VIDEO OVERLAY RENDERER (FOR REAL VIDEO)
  const drawVideoOverlay = useCallback((canvas: HTMLCanvasElement | null, time: number) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (useSimulator) {
      canvas.width = 800;
      canvas.height = 450;
      drawSimulatorTraffic(ctx, canvas.width, canvas.height, time);
      return;
    }

    const video = videoRef.current;
    canvas.width = video?.videoWidth || 800;
    canvas.height = video?.videoHeight || 450;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dynamicItems = detectedItems.map((item, index) => {
      const [origX, origY, origW, origH] = item.bbox;
      const driftX = ((time * 3 + index * 12) % 30) - 15;
      const shiftedBbox: [number, number, number, number] = [
        Math.max(0, Math.min(90, origX + driftX)),
        origY,
        origW,
        origH,
      ];

      let shiftedPlateBbox = item.plateBbox;
      if (shiftedPlateBbox) {
        shiftedPlateBbox = [
          Math.max(0, Math.min(95, shiftedPlateBbox[0] + driftX)),
          shiftedPlateBbox[1],
          shiftedPlateBbox[2],
          shiftedPlateBbox[3],
        ];
      }

      return {
        ...item,
        bbox: shiftedBbox,
        plateBbox: shiftedPlateBbox,
      };
    });

    renderAnnotatedBoundingBoxes(ctx, canvas.width, canvas.height, dynamicItems, selectedVehicleId, showPlateBoxes, filterMode);

    ctx.fillStyle = 'rgba(10, 15, 29, 0.75)';
    ctx.fillRect(10, 10, 310, 24);
    ctx.fillStyle = '#06b6d4';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('● AI INFERENCE HUD · RED: VIOLATION | GREEN: OK', 18, 26);
  }, [detectedItems, selectedVehicleId, useSimulator, showPlateBoxes, filterMode, drawSimulatorTraffic, renderAnnotatedBoundingBoxes]);

  // Video Animation Loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (useSimulator && isVideoPlaying) {
        setCurrentTime((prev) => {
          const next = prev + dt;
          return next > 30 ? 0 : next;
        });
      }

      if (videoCanvasRef.current) {
        drawVideoOverlay(videoCanvasRef.current, currentTime);
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [drawVideoOverlay, isVideoPlaying, useSimulator, currentTime]);

  // Image Canvas Renderer
  const renderImageAnnotations = useCallback(() => {
    const canvas = imageCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imagePreviewUrl;
    img.onload = () => {
      canvas.width = img.naturalWidth || 800;
      canvas.height = img.naturalHeight || 450;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      renderAnnotatedBoundingBoxes(ctx, canvas.width, canvas.height, detectedItems, selectedVehicleId, showPlateBoxes, filterMode);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(10, 10, 360, 26);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.fillText('● YOLOv8 & ANPR OCR HUD · RED BB: VIOLATION | GREEN BB: OK', 18, 27);
    };
  }, [imagePreviewUrl, detectedItems, selectedVehicleId, showPlateBoxes, filterMode, renderAnnotatedBoundingBoxes]);

  useEffect(() => {
    if (inputMode === 'IMAGE') {
      renderImageAnnotations();
    }
  }, [inputMode, renderImageAnnotations]);

  // Select Preset
  const handleSelectPreset = (preset: SampleMedia) => {
    setSelectedPresetId(preset.id);
    setDetectedItems(preset.detectedItems);
    setTimelineEvents(preset.timeline);
    setEvidenceList(preset.evidence);
    setUploadedFile(null);
    setFileValidationError(null);
    setUseSimulator(false);
    setSelectedVehicleId(null);

    if (preset.type === 'video') {
      setInputMode('VIDEO');
      setVideoSrc(preset.url);
      setCurrentTime(0);
      setIsVideoPlaying(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.pause();
      }
    } else {
      setInputMode('IMAGE');
      setImagePreviewUrl(preset.url);
      setImageProcessed(true);
    }
  };

  // Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileValidationError(null);

    const validVideoExts = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.ogg'];
    const validImageExts = ['.jpg', '.jpeg', '.png', '.webp'];

    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    const isVideoFile = validVideoExts.includes(fileExt) || file.type.startsWith('video/');
    const isImageFile = validImageExts.includes(fileExt) || file.type.startsWith('image/');

    if (inputMode === 'VIDEO' && !isVideoFile) {
      setFileValidationError(`Invalid file format "${fileExt}". Please upload a video file (.mp4, .avi, .mov, .webm).`);
      return;
    }

    if (inputMode === 'IMAGE' && !isImageFile) {
      setFileValidationError(`Invalid file format "${fileExt}". Please upload an image file (.jpg, .png, .webp).`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUploadedFile(file);
    setUseSimulator(false);

    if (inputMode === 'VIDEO') {
      setVideoSrc(objectUrl);
      setCurrentTime(0);
      setIsVideoPlaying(false);
      handleProcessCustomUpload('video', file.name);
    } else {
      setImagePreviewUrl(objectUrl);
      setImageProcessed(false);
      handleProcessCustomUpload('image', file.name);
    }
  };

  // Simulate Processing Workflow (Section 16: Clean White Card Processing Screen)
  const handleProcessCustomUpload = (type: 'video' | 'image', fileName: string) => {
    setIsProcessing(true);
    setProcessingProgress(20);
    setProcessingStage('Ingesting frame stream & optical normalization...');
    setProcessingFrame({ current: 60, total: 600 });

    setTimeout(() => {
      setProcessingProgress(48);
      setProcessingStage('Detecting vehicles with YOLOv8 neural model...');
      setProcessingFrame({ current: 142, total: 600 });
    }, 600);

    setTimeout(() => {
      setProcessingProgress(82);
      setProcessingStage('License plate recognition');
      setProcessingFrame({ current: 248, total: 600 });
    }, 1300);

    setTimeout(() => {
      setProcessingProgress(100);
      setProcessingStage('Synthesizing telemetry & generating violation dossiers...');
      setProcessingFrame({ current: 600, total: 600 });
      setIsProcessing(false);
      if (type === 'image') setImageProcessed(true);

      const newJob: DetectionJob = {
        id: `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
        fileName,
        fileType: type,
        uploadDate: 'Just now',
        processingTime: type === 'video' ? '18.4s' : '1.4s',
        objectsDetected: 42,
        violationsCount: 7,
        platesCount: 31,
        avgConfidence: 0.914,
        status: 'COMPLETED',
      };
      setJobsHistory((prev) => [newJob, ...prev]);
    }, 2000);
  };

  // Play / Pause Video
  const handleTogglePlay = () => {
    if (useSimulator) {
      setIsVideoPlaying(!isVideoPlaying);
      return;
    }

    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsVideoPlaying(true);
      }
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (videoRef.current && !useSimulator) {
      videoRef.current.currentTime = time;
    }
  };

  const handleTimelineClick = (t: TimelineEvent) => {
    handleSeek(t.seconds);
    if (t.relatedObjectId) {
      setSelectedVehicleId(t.relatedObjectId);
    }
  };

  const handleDownloadCSV = () => {
    const rows = [
      ['Object ID', 'Frame', 'Type', 'Confidence', 'Tracking ID', 'Plate Number', 'Speed (km/h)', 'Violation', 'Bounding Box Color'],
      ...detectedItems.map((d) => [
        d.id,
        d.timestamp,
        d.type,
        `${(d.confidence * 100).toFixed(1)}%`,
        d.trackingId,
        d.plateNumber || 'N/A',
        d.speed ? `${d.speed} km/h` : 'N/A',
        d.violation || 'NONE',
        d.violation ? 'RED (Violation)' : 'GREEN (Compliant)',
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `traffic_detection_summary_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle Webcam
  const handleToggleWebcam = async () => {
    if (webcamActive) {
      setWebcamActive(false);
      if (webcamVideoRef.current && webcamVideoRef.current.srcObject) {
        const stream = webcamVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
        webcamVideoRef.current.srcObject = null;
      }
    } else {
      setWebcamError(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (webcamVideoRef.current) {
          webcamVideoRef.current.srcObject = stream;
          webcamVideoRef.current.play();
        }
        setWebcamActive(true);
      } catch (err: any) {
        setWebcamError('Camera hardware access unavailable or denied. Showing simulated camera stream.');
        setWebcamActive(true);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER (Section 15) */}
      <div className="pb-1">
        <h1 className="text-xl font-bold text-[#172033] tracking-tight">
          AI Traffic Detection
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Analyze traffic using video, images or live camera.
        </p>
      </div>

      {/* 2. THREE CLEAN CARDS (Section 15) */}
      {/* White with subtle borders, on hover: slight blue border, subtle shadow, small upward movement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Upload Video */}
        <div
          onClick={() => {
            setInputMode('VIDEO');
            handleSelectPreset(SAMPLE_PRESETS[0]);
          }}
          className={`p-6 rounded-xl border bg-white cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 hover:border-[#1677FF] hover:shadow-[0_4px_16px_rgba(22,119,255,0.08)] ${
            inputMode === 'VIDEO'
              ? 'border-[#1677FF] ring-2 ring-[#1677FF]/10 shadow-[0_2px_8px_rgba(22,119,255,0.08)]'
              : 'border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]'
          }`}
        >
          <div className="text-2xl mb-3">📹</div>
          <h3 className="text-base font-bold text-[#172033]">
            Upload Video
          </h3>
          <p className="text-xs text-[#64748B] mt-1">
            Analyze traffic footage
          </p>
          <div className="mt-5 pt-3 border-t border-[#E5EAF0] text-xs font-semibold text-[#1677FF] flex items-center justify-between">
            <span>Select Video</span>
            <span>→</span>
          </div>
        </div>

        {/* Card 2: Upload Image */}
        <div
          onClick={() => {
            setInputMode('IMAGE');
            handleSelectPreset(SAMPLE_PRESETS[1]);
          }}
          className={`p-6 rounded-xl border bg-white cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 hover:border-[#1677FF] hover:shadow-[0_4px_16px_rgba(22,119,255,0.08)] ${
            inputMode === 'IMAGE'
              ? 'border-[#1677FF] ring-2 ring-[#1677FF]/10 shadow-[0_2px_8px_rgba(22,119,255,0.08)]'
              : 'border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]'
          }`}
        >
          <div className="text-2xl mb-3">🖼</div>
          <h3 className="text-base font-bold text-[#172033]">
            Upload Image
          </h3>
          <p className="text-xs text-[#64748B] mt-1">
            Analyze traffic image
          </p>
          <div className="mt-5 pt-3 border-t border-[#E5EAF0] text-xs font-semibold text-[#1677FF] flex items-center justify-between">
            <span>Select Image</span>
            <span>→</span>
          </div>
        </div>

        {/* Card 3: Webcam */}
        <div
          onClick={() => {
            setInputMode('WEBCAM');
            handleToggleWebcam();
          }}
          className={`p-6 rounded-xl border bg-white cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 hover:border-[#1677FF] hover:shadow-[0_4px_16px_rgba(22,119,255,0.08)] ${
            inputMode === 'WEBCAM'
              ? 'border-[#1677FF] ring-2 ring-[#1677FF]/10 shadow-[0_2px_8px_rgba(22,119,255,0.08)]'
              : 'border-[#E5EAF0] shadow-[0_2px_8px_rgba(15,23,42,0.04)]'
          }`}
        >
          <div className="text-2xl mb-3">📷</div>
          <h3 className="text-base font-bold text-[#172033]">
            Webcam
          </h3>
          <p className="text-xs text-[#64748B] mt-1">
            Live traffic detection
          </p>
          <div className="mt-5 pt-3 border-t border-[#E5EAF0] text-xs font-semibold text-[#1677FF] flex items-center justify-between">
            <span>Start Camera</span>
            <span>→</span>
          </div>
        </div>
      </div>

      {/* 3. SECTION 16: AI PROCESSING SCREEN (WHITE CARD, NOT BLACK!) */}
      {isProcessing && (
        <div className="bg-white border border-[#E5EAF0] rounded-xl p-8 shadow-[0_4px_20px_rgba(15,23,42,0.06)] max-w-2xl mx-auto my-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center animate-spin">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#172033]">
                  Analyzing traffic...
                </h3>
                <p className="text-xs text-[#64748B]">
                  Detecting vehicles
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-[#1677FF] font-mono">
              {processingProgress}%
            </span>
          </div>

          {/* Clean Progress Bar */}
          <div className="w-full bg-[#F1F5F9] rounded-full h-3 overflow-hidden">
            <div
              className="bg-[#1677FF] h-3 rounded-full transition-all duration-300"
              style={{ width: `${processingProgress}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 text-xs border-t border-[#E5EAF0]">
            <div>
              <span className="text-[#64748B] block font-medium">Current stage:</span>
              <span className="font-semibold text-[#172033] mt-0.5 block">
                {processingStage}
              </span>
            </div>
            <div>
              <span className="text-[#64748B] block font-medium">Current frame:</span>
              <span className="font-mono font-semibold text-[#172033] mt-0.5 block">
                {processingFrame.current} / {processingFrame.total}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. SECTION 17: RESULTS PAGE (FOUR KPI CARDS & TWO-COLUMN VIEW) */}
      <div className="space-y-6">
        {/* Results Title */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div>
            <h2 className="text-lg font-bold text-[#172033] tracking-tight">
              AI Detection Results
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Multi-object classification, number plate ANPR, and safety violation tagging
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-[#D9E1EA] hover:bg-slate-50 text-[#172033] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#1677FF]" />
              <span>Download CSV</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-lg bg-[#1677FF] hover:bg-[#0958d9] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* Four Section 17 KPI Cards:
            Vehicles Detected: 42
            Violations: 7
            License Plates: 31
            Average Confidence: 91.4% */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-[#E5EAF0] p-5 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
            <span className="text-xs font-semibold uppercase text-[#64748B] tracking-wider block">
              Vehicles Detected
            </span>
            <div className="text-3xl font-bold text-[#172033] mt-2">
              42
            </div>
            <span className="text-xs text-[#1677FF] font-medium mt-1 block">
              Cars, Trucks, Bikes
            </span>
          </div>

          <div className="bg-white border border-[#E5EAF0] p-5 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
            <span className="text-xs font-semibold uppercase text-[#64748B] tracking-wider block">
              Violations
            </span>
            <div className="text-3xl font-bold text-[#EF4444] mt-2">
              7
            </div>
            <span className="text-xs text-[#EF4444] font-medium mt-1 block">
              Red bounding box flagged
            </span>
          </div>

          <div className="bg-white border border-[#E5EAF0] p-5 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
            <span className="text-xs font-semibold uppercase text-[#64748B] tracking-wider block">
              License Plates
            </span>
            <div className="text-3xl font-bold text-[#172033] mt-2">
              31
            </div>
            <span className="text-xs text-[#16A34A] font-medium mt-1 block">
              Recognized via ANPR OCR
            </span>
          </div>

          <div className="bg-white border border-[#E5EAF0] p-5 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
            <span className="text-xs font-semibold uppercase text-[#64748B] tracking-wider block">
              Average Confidence
            </span>
            <div className="text-3xl font-bold text-[#1677FF] mt-2">
              91.4%
            </div>
            <span className="text-xs text-[#64748B] font-medium mt-1 block">
              YOLOv8 neural confidence
            </span>
          </div>
        </div>

        {/* BOUNDING BOX RULES LEGEND BAR */}
        <div className="bg-white border border-[#E5EAF0] p-4 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.05)] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-[#172033] flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#1677FF]" />
              Bounding Box Rules:
            </span>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-[#EF4444]">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#EF4444]" />
              <span className="font-bold">RED BB</span>
              <span className="text-[#64748B]">= Traffic Violation</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[#16A34A]">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#16A34A]" />
              <span className="font-bold">GREEN BB</span>
              <span className="text-[#64748B]">= Compliant Vehicle</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#1677FF]">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#1677FF]" />
              <span className="font-bold">[LP] TAG</span>
              <span className="text-[#64748B]">= License Plate Read</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPlateBoxes(!showPlateBoxes)}
              className={`px-3 py-1 rounded-md border text-xs font-medium cursor-pointer transition-colors ${
                showPlateBoxes
                  ? 'bg-blue-50 border-blue-200 text-[#1677FF]'
                  : 'bg-white border-[#D9E1EA] text-[#64748B]'
              }`}
            >
              {showPlateBoxes ? '✓ Plate Tags: ON' : 'Plate Tags: OFF'}
            </button>

            <div className="flex items-center rounded-lg bg-[#F1F5F9] border border-[#E5EAF0] p-0.5">
              {(['ALL', 'VIOLATIONS', 'COMPLIANT'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    filterMode === mode
                      ? mode === 'VIOLATIONS'
                        ? 'bg-[#EF4444] text-white shadow-xs'
                        : mode === 'COMPLIANT'
                        ? 'bg-[#16A34A] text-white shadow-xs'
                        : 'bg-[#1677FF] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#172033]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. TWO-COLUMN LAYOUT: ORIGINAL INPUT vs AI PROCESSED RESULT (Section 17) */}
        <div className="bg-white border border-[#E5EAF0] p-6 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.05)] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5EAF0]">
            <div>
              <h3 className="text-base font-bold text-[#172033]">
                Side-by-Side Ingestion & AI Verification
              </h3>
              <p className="text-xs text-[#64748B]">
                Original input footage compared with real-time neural network detection overlays
              </p>
            </div>

            {/* Hidden File Picker */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept={
                inputMode === 'VIDEO'
                  ? '.mp4,.avi,.mov,.mkv,.webm,.ogg,video/*'
                  : '.jpg,.jpeg,.png,.webp,image/*'
              }
              className="hidden"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#172033] border border-[#D9E1EA] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#1677FF]" />
                <span>Upload Custom {inputMode === 'VIDEO' ? 'Video' : 'Image'}</span>
              </button>

              {inputMode === 'VIDEO' && (
                <button
                  onClick={() => {
                    setUseSimulator(true);
                    setIsVideoPlaying(true);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    useSimulator
                      ? 'bg-blue-50 border-blue-300 text-[#1677FF]'
                      : 'bg-white border-[#D9E1EA] text-[#64748B] hover:text-[#172033]'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-[#1677FF]" />
                  <span>Simulator Stream</span>
                </button>
              )}
            </div>
          </div>

          {/* Validation error */}
          {fileValidationError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-[#EF4444] text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{fileValidationError}</span>
            </div>
          )}

          {/* THE TWO COLUMNS: LEFT: ORIGINAL INPUT | RIGHT: AI PROCESSED RESULT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* COLUMN 1: ORIGINAL INPUT */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#172033] uppercase">
                  Original Input
                </span>
                <span className="text-[#64748B] font-mono">Raw Sensor Stream</span>
              </div>

              {/* Video or Image Container: camera footage remains naturally dark */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner">
                {inputMode === 'VIDEO' ? (
                  <>
                    <video
                      ref={videoRef}
                      src={videoSrc}
                      playsInline
                      muted={isMuted}
                      loop
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 text-[10px] font-mono text-white bg-black/60 px-2 py-0.5 rounded">
                      RGB FEED 1080p
                    </div>
                  </>
                ) : (
                  <img
                    src={imagePreviewUrl}
                    alt="Original Input"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* COLUMN 2: AI PROCESSED RESULT */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1677FF] uppercase">
                  AI Processed Result
                </span>
                <span className="text-[#16A34A] font-semibold text-[11px]">
                  RED: Violation | GREEN: Compliant
                </span>
              </div>

              {/* Processed Container with Annotated Canvas: footage dark, bounding box crisp */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner">
                {inputMode === 'VIDEO' ? (
                  <>
                    <canvas
                      ref={videoCanvasRef}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-2 right-2 text-[10px] font-mono text-[#38bdf8] bg-black/70 px-2 py-0.5 rounded">
                      YOLOv8 + ANPR Active
                    </div>
                  </>
                ) : (
                  <canvas
                    ref={imageCanvasRef}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Video Player Scrubber & Timeline Bar if in Video Mode */}
          {inputMode === 'VIDEO' && (
            <div className="pt-3 border-t border-[#E5EAF0] space-y-3">
              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={handleTogglePlay}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1677FF] hover:bg-[#0958d9] text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isVideoPlaying ? 'Pause Stream' : 'Play Stream'}</span>
                </button>

                <span className="font-mono text-xs text-[#172033] font-semibold">
                  {Math.floor(currentTime / 60).toString().padStart(2, '0')}:
                  {Math.floor(currentTime % 60).toString().padStart(2, '0')}
                </span>

                <input
                  type="range"
                  min="0"
                  max={duration || 30}
                  step="0.1"
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="w-full accent-[#1677FF] cursor-pointer h-2 bg-[#E2E8F0] rounded-lg appearance-none"
                />

                <span className="font-mono text-xs text-[#64748B]">
                  {Math.floor(duration / 60).toString().padStart(2, '0')}:
                  {Math.floor(duration % 60).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Chronological Timeline */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-[#64748B] font-semibold shrink-0">Infraction markers:</span>
                {timelineEvents.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTimelineClick(t)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg border text-left transition-colors cursor-pointer ${
                      Math.abs(currentTime - t.seconds) < 2
                        ? 'bg-blue-50 border-[#1677FF] text-[#1677FF] font-semibold'
                        : 'bg-white border-[#E5EAF0] text-[#64748B] hover:text-[#172033]'
                    }`}
                  >
                    <span className="font-bold text-[#EF4444] mr-1">{t.timestamp}</span>
                    <span>{t.description.split('(')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 6. AI PERFORMANCE CHARTS (CHART.JS) */}
        <div className="bg-white border border-[#E5EAF0] p-6 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.05)] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#E5EAF0]">
            <div>
              <h3 className="text-base font-bold text-[#172033] tracking-wide">
                AI Performance Graphs & Ingestion Analytics
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Graphical distributions of vehicle classes, confidence intervals, and frame throughput
              </p>
            </div>

            <button
              onClick={() => {
                setEvaluatingBenchmark(true);
                setTimeout(() => {
                  setEvaluatingBenchmark(false);
                  setShowEvaluationMetrics(true);
                }, 1000);
              }}
              disabled={evaluatingBenchmark}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>{evaluatingBenchmark ? 'Computing Benchmark...' : 'Run Model Evaluation (Demo Dataset)'}</span>
            </button>
          </div>

          <DetectionCharts
            vehicleCounts={vehicleCounts}
            violationCounts={violationCounts}
            confidenceBuckets={confidenceBuckets}
            fpsHistory={fpsHistory}
            frameDetections={frameDetections}
            avgConfidenceHistory={avgConfidenceHistory}
            showEvaluationMetrics={showEvaluationMetrics}
            evaluationMetrics={
              showEvaluationMetrics
                ? {
                    precision: DEMO_EVALUATION_METRICS.precision,
                    recall: DEMO_EVALUATION_METRICS.recall,
                    f1Score: DEMO_EVALUATION_METRICS.f1Score,
                    map50: DEMO_EVALUATION_METRICS.map50,
                    map50_95: DEMO_EVALUATION_METRICS.map50_95,
                  }
                : undefined
            }
          />
        </div>

        {/* 7. DETECTION SUMMARY TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table 1: Objects Detected with Plate Details */}
          <div className="bg-white border border-[#E5EAF0] p-5 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.05)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#172033] tracking-wide">
                Detected Vehicles & Number Plates
              </h3>
              <span className="text-xs font-semibold text-[#1677FF]">
                {detectedItems.length} Targets Segmented
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E8EDF3] text-[#64748B] font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">VEHICLE</th>
                    <th className="py-2.5 px-3">NUMBER PLATE</th>
                    <th className="py-2.5 px-3">STATUS</th>
                    <th className="py-2.5 px-3">BB COLOR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EDF3]">
                  {detectedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F8FAFC]">
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-[#172033]">{item.type}</span>
                        <span className="text-[#64748B] text-[11px] block">{item.trackingId}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-[#172033]">{item.plateNumber || 'Pending OCR'}</span>
                        <span className="text-[#64748B] text-[11px] block">
                          Confidence: {((item.plateConfidence || item.confidence) * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {item.violation ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#EF4444] text-[11px] font-semibold">
                            {item.violation.split(' ')[0]}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#16A34A] text-[11px] font-semibold">
                            Compliant
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        {item.violation ? (
                          <span className="inline-flex items-center gap-1.5 text-[#EF4444] font-semibold text-xs">
                            <span className="w-2.5 h-2.5 rounded-xs bg-[#EF4444]" />
                            RED BB
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[#16A34A] font-semibold text-xs">
                            <span className="w-2.5 h-2.5 rounded-xs bg-[#16A34A]" />
                            GREEN BB
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Violations Breakdown */}
          <div className="bg-white border border-[#E5EAF0] p-5 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.05)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#172033] tracking-wide">
                Traffic Violations Breakdown (Flagged in Red)
              </h3>
              <span className="text-xs font-semibold text-[#EF4444]">
                {totalViolations} Infractions Active
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E8EDF3] text-[#64748B] font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">VIOLATION TYPE</th>
                    <th className="py-2.5 px-3">COUNT</th>
                    <th className="py-2.5 px-3">ENFORCEMENT ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EDF3]">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#EF4444]">Speeding Infraction</td>
                    <td className="py-2.5 px-3 font-bold">{violationCounts.speeding}</td>
                    <td className="py-2.5 px-3 text-[#64748B]">Automated E-Challan ₹2,000</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#F59E0B]">Red Light Crossing</td>
                    <td className="py-2.5 px-3 font-bold">{violationCounts.redLight}</td>
                    <td className="py-2.5 px-3 text-[#64748B]">Notice to Owner ₹1,000</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#1677FF]">No Protective Helmet</td>
                    <td className="py-2.5 px-3 font-bold">{violationCounts.noHelmet}</td>
                    <td className="py-2.5 px-3 text-[#64748B]">Section 129 Fine ₹500</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#8B5CF6]">Corridor / Bus Lane Intrusion</td>
                    <td className="py-2.5 px-3 font-bold">{violationCounts.stopLine}</td>
                    <td className="py-2.5 px-3 text-[#64748B]">Dedicated Transit Lane Fine ₹1,500</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 8. EVIDENCE DOSSIERS & OFFICER REVIEW */}
        <div className="bg-white border border-[#E5EAF0] p-6 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.05)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF0]">
            <div>
              <h3 className="text-base font-bold text-[#172033] tracking-wide">
                Automated Evidence Dossiers & Officer Review Status
              </h3>
              <p className="text-xs text-[#64748B]">
                Photographic evidence extracted during optical video/image ingestion with OCR crops
              </p>
            </div>
            <span className="text-xs font-semibold text-[#1677FF]">
              {evidenceList.length} Case Dossiers Generated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {evidenceList.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-xl bg-white border border-[#E5EAF0] flex flex-col sm:flex-row gap-4 hover:border-[#1677FF] transition-all text-xs"
              >
                <img
                  src={ev.imageUrl}
                  alt="Evidence"
                  className="w-full sm:w-36 h-28 object-cover rounded-lg border border-[#E5EAF0] shrink-0"
                />

                <div className="flex-1 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#EF4444]">{ev.violationType}</span>
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                          ev.status === 'CONFIRMED'
                            ? 'bg-[#DCFCE7] text-[#16A34A]'
                            : ev.status === 'REJECTED'
                            ? 'bg-[#FEE2E2] text-[#EF4444]'
                            : 'bg-[#FEF3C7] text-[#D97706]'
                        }`}
                      >
                        {ev.status}
                      </span>
                    </div>
                    <p className="text-[#172033] font-bold mt-1">
                      Plate: <span className="text-[#1677FF]">{ev.plateNumber}</span> ({ev.vehicleType})
                    </p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Frame #{ev.frameNumber} · {ev.timestamp} · Source: {ev.source}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#E5EAF0]">
                    <button
                      onClick={() => {
                        setEvidenceList((prev) =>
                          prev.map((e) => (e.id === ev.id ? { ...e, status: 'CONFIRMED' } : e))
                        );
                        onViolationCaptured({
                          id: Date.now(),
                          violationId: `VIO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
                          plateNumber: ev.plateNumber,
                          vehicleType: ev.vehicleType,
                          violationType: ev.violationType as any,
                          cameraId: 'CAM-02',
                          location: ev.source,
                          timestamp: 'Just now',
                          confidence: ev.confidence,
                          detectedSpeed: ev.violationType === 'SPEEDING' ? 84.5 : undefined,
                          speedLimit: 50,
                          signalState: 'NONE',
                          evidenceImage: ev.imageUrl,
                          status: 'CONFIRMED',
                          fineAmount: 2000,
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#DCFCE7] hover:bg-[#bbf7d0] text-[#16A34A] text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Confirm & Issue Fine
                    </button>

                    <button
                      onClick={() => {
                        setEvidenceList((prev) =>
                          prev.map((e) => (e.id === ev.id ? { ...e, status: 'REJECTED' } : e))
                        );
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#FEE2E2] hover:bg-[#fecaca] text-[#EF4444] text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 9. PROCESSING HISTORY LEDGER */}
        <div className="bg-white border border-[#E5EAF0] p-6 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.05)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF0]">
            <div>
              <h3 className="text-base font-bold text-[#172033] tracking-wide">
                Processing History & Ingestion Log
              </h3>
              <p className="text-xs text-[#64748B]">
                Audit trail of uploaded video and image batches processed by the edge model
              </p>
            </div>
            <span className="text-xs font-semibold text-[#1677FF]">{jobsHistory.length} Batches Logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E8EDF3] text-[#64748B] font-semibold">
                <tr>
                  <th className="py-2.5 px-3">JOB ID</th>
                  <th className="py-2.5 px-3">FILE NAME</th>
                  <th className="py-2.5 px-3">FORMAT</th>
                  <th className="py-2.5 px-3">UPLOAD TIME</th>
                  <th className="py-2.5 px-3">INFERENCE DURATION</th>
                  <th className="py-2.5 px-3">OBJECTS</th>
                  <th className="py-2.5 px-3">VIOLATIONS</th>
                  <th className="py-2.5 px-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EDF3]">
                {jobsHistory.map((job) => (
                  <tr key={job.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-2.5 px-3 font-semibold text-[#172033]">{job.id}</td>
                    <td className="py-2.5 px-3 font-medium text-[#1677FF]">{job.fileName}</td>
                    <td className="py-2.5 px-3 uppercase text-[#64748B]">{job.fileType}</td>
                    <td className="py-2.5 px-3 text-[#64748B]">{job.uploadDate}</td>
                    <td className="py-2.5 px-3 text-[#172033] font-mono">{job.processingTime}</td>
                    <td className="py-2.5 px-3 text-[#172033]">{job.objectsDetected}</td>
                    <td className="py-2.5 px-3 text-[#EF4444] font-semibold">{job.violationsCount}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] text-[11px] font-semibold">
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
