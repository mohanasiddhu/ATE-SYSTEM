# Raw Dataset Repository

This directory holds unaugmented, raw traffic surveillance footage and image sequences.

## Storage Guidelines
- Ingest camera streams at native resolutions (1080p / 4K).
- Categorize sequences by junction ID and environmental condition:
  - `day_clear/`
  - `day_rain/`
  - `night_urban/`
  - `night_glare/`
- Run data scrubbing scripts before moving raw data to `processed/` to ensure privacy compliance.
