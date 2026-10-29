#!/usr/bin/env python3
"""
AI Traffic Enforcement System - Inference Execution Script
Runs multi-class vehicle detection, ByteTrack tracking, and ANPR on sample inputs.
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from detection.pipeline import PythonEnforcementPipeline
    pipeline = PythonEnforcementPipeline()
    result = pipeline.process_frame("CAM-01")
    print(f"✅ AI Inference executed successfully!")
    print(f"Camera ID: {result['camera_id']}")
    print(f"Vehicles Tracked: {len(result['tracked_vehicles'])}")
    print(f"Violations Flagged: {len(result['violations'])}")
    print(f"Evidence Artifacts: {len(result['evidence'])}")
except Exception as e:
    print(f"Inference simulation notice: {e}")
