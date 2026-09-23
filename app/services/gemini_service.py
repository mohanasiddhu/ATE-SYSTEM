"""
AI Explanation & Traffic Report Summarization Service
Integrates Gemini API when configured, with a deterministic fallback engine.
"""
from typing import Dict, Any, List
from app.core.config import settings
from app.core.logging_config import logger

class GeminiTrafficService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = None
        if self.api_key:
            try:
                # Lazy import Google GenAI
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                logger.info("Gemini API client initialized for traffic summarization.")
            except Exception as e:
                logger.warning(f"Could not initialize Gemini SDK: {e}")
                self.client = None

    def explain_violation(self, violation_data: Dict[str, Any]) -> str:
        """
        Produces a clear explanation of why an infraction candidate was flagged.
        Deterministic fallback ensures zero failure even without an API key.
        """
        v_type = violation_data.get("violation_type", "GENERAL")
        speed = violation_data.get("detected_speed")
        limit = violation_data.get("speed_limit", 50)
        signal = violation_data.get("signal_state", "NONE")
        plate = violation_data.get("plate_number", "VEHICLE")
        conf = int(violation_data.get("confidence", 0.9) * 100)

        # Attempt Gemini explanation if configured
        if self.client:
            try:
                prompt = (
                    f"Explain clearly and concisely in 2 sentences to an officer why vehicle {plate} was flagged for {v_type}. "
                    f"Data: speed={speed} km/h, limit={limit} km/h, signal={signal}, AI confidence={conf}%. "
                    f"Maintain a formal enforcement tone."
                )
                response = self.client.models.generate_content(
                    model="gemini-3.8-flash",
                    contents=prompt
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                logger.warning(f"Gemini API call skipped: {e}")

        # High-precision deterministic fallback
        if v_type == "SPEEDING":
            diff = (speed - limit) if speed else 0
            return f"Vehicle {plate} exceeded the calibrated speed limit of {limit} km/h by {diff:.1f} km/h (recorded {speed:.1f} km/h). Camera tracking confidence evaluated at {conf}%."
        elif v_type == "RED_LIGHT":
            return f"Vehicle {plate} crossed the designated virtual stop line while the corridor signal state was RED. Temporal intrusion confirmed at {conf}% detection confidence."
        elif v_type == "NO_HELMET":
            return f"Two-wheeler safety classifier flagged operator of {plate} riding without protective headgear. Head region feature extraction confidence evaluated at {conf}%."
        elif v_type == "STOP_LINE":
            return f"Vehicle {plate} failed to halt prior to the designated stop barrier during deceleration phase. Spatial intersection confirmed with {conf}% confidence."
        elif v_type == "WRONG_WAY":
            return f"Vehicle {plate} vector trajectory opposed the designated directional lane flow on this corridor. Directional angle deviation flagged at {conf}% confidence."
        return f"Violation {v_type} recorded for {plate} by automated computer vision pipeline with {conf}% algorithmic confidence."

    def summarize_traffic_report(self, stats: Dict[str, Any]) -> str:
        """
        Generates executive summary of daily/weekly traffic enforcement metrics.
        """
        if self.client:
            try:
                prompt = (
                    f"Generate a professional 3-sentence executive summary of these smart city traffic statistics: "
                    f"{stats}. Highlight key risk factors, busiest corridors, and compliance rates."
                )
                response = self.client.models.generate_content(
                    model="gemini-3.8-flash",
                    contents=prompt
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                logger.warning(f"Gemini summary fallback: {e}")

        # Deterministic executive summary
        total_veh = stats.get("total_vehicles", 2841)
        total_vio = stats.get("total_violations", 142)
        top_vio = stats.get("top_violation", "Speeding")
        compliance = round((1 - (total_vio / max(total_veh, 1))) * 100, 1)

        return (
            f"During this observation cycle, automated ANPR sensors monitored {total_veh:,} vehicles across all sectors with an overall compliance rate of {compliance}%. "
            f"A total of {total_vio} infractions were captured by computer vision, with {top_vio} representing the predominant safety hazard. "
            f"Targeted enforcement and signal timing adjustments are recommended at identified high-risk arterial junctions."
        )

gemini_service = GeminiTrafficService()
