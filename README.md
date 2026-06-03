# GO-BRICS B2B Lead List Cleaner

An automated, high-fidelity web application built using **React, Tailwind CSS, and PapaParse** to clean, format, and audit messy B2B lead list CSV files.

## Features

- **Automated De-duplication:** Excludes exact duplicate rows and case-insensitive email duplicates.
- **Empty Field Flagging:** Identifies and flags missing critical fields (`Email`, `Contact Person`, `Phone`) in a newly appended `QC_Status` column.
- **Auto-formatting Engine:** 
  - Standardizes company names, contact names, designations, and cities to Title Case.
  - Formats Indian mobile numbers to `+91-XXXXX-XXXXX`.
  - Normalizes email addresses to lowercase.
- **Before / After Comparison:** Side-by-side scrolling data tables comparing the raw input against clean output.
- **Interactive Issues Log:** A live audit trail classifying issues by severity (Removed, Flagged, Auto-fixed).
- **Client-Side Export:** Exporter for the cleaned CSV file and a dynamically generated proof-of-completion `Readme.txt`.

## Getting Started

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173/` in your browser.

## Built for
- **Cohort:** GO-BRICS Business Lab Cohort I
- **Task Reference:** TASK_T03
