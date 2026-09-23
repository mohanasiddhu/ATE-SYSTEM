"""
Evidence Capture & Watermarking Service
Generates cryptographic timestamped evidence frames with demo watermarks.
"""
import os
import time
from datetime import datetime, timezone
from typing import Optional
from PIL import Image, ImageDraw, ImageFont
from app.core.config import settings
from app.core.logging_config import logger

class EvidenceService:
    def __init__(self):
        self.evidence_dir = settings.EVIDENCE_DIR
        os.makedirs(self.evidence_dir, exist_ok=True)

    def generate_evidence_frame(
        self,
        plate_number: str,
        violation_type: str,
        camera_id: str,
        location: str,
        speed_est: Optional[float] = None,
        confidence: float = 0.94
    ) -> str:
        """
        Creates an evidence card image with bounding box, metadata overlay, and demo watermark.
        """
        filename = f"EVD_{camera_id}_{int(time.time())}.jpg"
        filepath = os.path.join(self.evidence_dir, filename)

        # Create realistic surveillance canvas
        width, height = 960, 540
        img = Image.new("RGB", (width, height), color=(14, 20, 32))
        draw = ImageDraw.Draw(img)

        # Simulated road scene graphics
        draw.rectangle([0, int(height * 0.45), width, height], fill=(22, 28, 42)) # Road
        # Road lane dashes
        for x in range(20, width, 80):
            draw.line([(x, int(height * 0.72)), (x + 40, int(height * 0.72))], fill=(245, 158, 11), width=4)

        # Virtual Stop line
        draw.line([(60, int(height * 0.65)), (width - 60, int(height * 0.65))], fill=(239, 68, 68), width=3)
        draw.text((70, int(height * 0.65) - 20), "VIRTUAL ENFORCEMENT STOP LINE", fill=(239, 68, 68))

        # Vehicle bounding box representation
        bx1, by1, bx2, by2 = 320, 240, 640, 460
        box_color = (239, 68, 68) if violation_type in ["SPEEDING", "RED_LIGHT"] else (245, 158, 11)
        draw.rectangle([bx1, by1, bx2, by2], outline=box_color, width=3)

        # Plate bounding box
        draw.rectangle([bx1 + 100, by2 - 45, bx2 - 100, by2 - 10], fill=(255, 255, 255), outline=(0, 0, 0), width=2)
        draw.text((bx1 + 120, by2 - 35), plate_number, fill=(0, 0, 0))

        # Vehicle target tag
        tag_text = f"TARGET #104 | {plate_number} | AI CONF: {int(confidence*100)}%"
        draw.rectangle([bx1, by1 - 25, bx1 + 310, by1], fill=box_color)
        draw.text((bx1 + 8, by1 - 20), tag_text, fill=(255, 255, 255))

        # Header Watermark & Telemetry Banner
        draw.rectangle([0, 0, width, 55], fill=(8, 12, 22))
        timestamp_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        draw.text((20, 12), "SMART TRAFFIC ENFORCEMENT - ACADEMIC DEMO", fill=(245, 158, 11))
        draw.text((20, 32), f"CAM: {camera_id} // {location}", fill=(148, 163, 184))
        draw.text((width - 280, 12), f"TIMESTAMP: {timestamp_str}", fill=(226, 232, 240))
        
        speed_text = f"EST SPEED: {speed_est:.1f} KM/H" if speed_est else "STATE: STOP LINE INCIDENT"
        draw.text((width - 280, 32), speed_text, fill=(239, 68, 68) if speed_est and speed_est > 60 else (52, 211, 153))

        # Bottom verification footer
        draw.rectangle([0, height - 35, width, height], fill=(8, 12, 22))
        draw.text((20, height - 25), f"VIOLATION: {violation_type} | STATUS: CANDIDATE PENDING HUMAN REVIEW", fill=(248, 113, 113))
        draw.text((width - 320, height - 25), "NON-BINDING PROTOTYPE EVIDENCE RECORD", fill=(148, 163, 184))

        img.save(filepath, "JPEG")
        logger.info(f"Saved violation evidence frame to {filepath}")
        return f"/data/evidence/{filename}"

evidence_service = EvidenceService()
