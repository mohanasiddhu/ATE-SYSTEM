"""
AI-Driven Smart Traffic Enforcement System - Logging Configuration
"""
import logging
import sys

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] [%(name)s]: %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    logger = logging.getLogger("smart_traffic")
    logger.info("Initializing Smart Traffic Enforcement Core Engine")
    return logger

logger = setup_logging()
