import { globalPipeline, PipelineOutput, PipelineExecutionOptions } from '../../detection/pipeline.js';
import { db } from '../../database/connection.js';

export class DetectionService {
  public async processLiveStream(cameraId: string, seed?: number): Promise<PipelineOutput> {
    return globalPipeline.processFrame({
      cameraId,
      sourceType: 'live_stream',
      seedIndex: seed
    });
  }

  public async processImage(options: PipelineExecutionOptions): Promise<PipelineOutput> {
    return globalPipeline.processFrame({
      ...options,
      sourceType: 'image_upload'
    });
  }

  public async processVideo(options: PipelineExecutionOptions): Promise<PipelineOutput> {
    return globalPipeline.processFrame({
      ...options,
      sourceType: 'video_file'
    });
  }

  public async performAnpr(plateHint?: string) {
    const ocrEngine = (globalPipeline as any).ocrEngine;
    const transcribed = ocrEngine.transcribe();
    if (plateHint) {
      transcribed.normalizedText = plateHint;
    }
    const vehicle = db.getVehicleByPlate(transcribed.normalizedText);
    return {
      plate: transcribed,
      registeredVehicle: vehicle || null
    };
  }
}

export const detectionService = new DetectionService();
