# GO-BRICS B2B Lead List Cleaner

### **Task Reference: TASK_T03**
**Built for:** GO-BRICS Business Lab — Cohort I  
**Department:** Tech / Sales Operations  
**Participant Submission Document**

---

## 📋 Task Overview
This project delivers a production-grade, secure, on-device B2B Lead List Cleaner designed to solve common lead ingestion bottlenecks faced by the GO-BRICS sales outreach teams. Raw B2B lead lists are frequently plagued by exact duplicates, casing irregularities, missing identifiers, and inconsistent formatting. 

This application parses raw CSV data client-side, automatically processes it against an opinionated set of cleaning rules, displays an interactive before/after auditing comparison, and produces standardized, outreach-ready outputs.

---

## 🛠️ What was Completed in this Task

1. **Vite + React Setup:** Configured a modern React application utilizing Tailwind CSS v4 in the [go-brics-lead-cleaner](file:///c:/Users/krish/OneDrive/Documents/New%20folder/go-brics-lead-cleaner/) subdirectory.
2. **On-Device Data Parsing:** Integrated PapaParse client-side to handle CSV parsing and serialization securely without any external API calls or data leaking.
3. **70-Row Sandbox Sample Data:** Integrated a built-in sandbox dataset consisting of 70 messy Indian business records containing casing errors, duplicate emails, blank fields, and inconsistent phone numbers to facilitate immediate verification.
4. **Multi-Step App Flow:**
   - **Step 1 — Upload Screen:** Drag-and-drop zone with validation constraints, supported by a sandbox loader.
   - **Step 2 — Processing Loader:** A simulated processing screen with animated indicators to enhance user experience.
   - **Step 3 — Results Interface:** Displays stats cards, interactive Issues Logs, side-by-side comparative preview tables, and exporters.
5. **Interactive Issues Log:** A scrollable audit grid classifying and color-coding issues by severity:
   - **Removed (Red):** Excludes rows containing blank company names, duplicate emails, or exact duplicate records.
   - **Flagged (Amber):** Annotates rows missing vital outreach channels (`Email`, `Contact Person`, `Phone`) or displaying duplicate company-contact pairs.
   - **Auto-fixed (Green):** Capitalization fixes, string trims, and phone standardizations.
6. **Cohort Deliverable Exporters:**
   - Client-side download of the cleaned B2B lead CSV file.
   - Client-side download of a customized `Readme.txt` containing participant mapping and runtime metrics.
7. **CI/CD Pipeline Setup:** Configured a GitHub Actions workflow in [deploy.yml](file:///c:/Users/krish/OneDrive/Documents/New%20folder/go-brics-lead-cleaner/.github/workflows/deploy.yml) to compile the React code and deploy the live build to GitHub Pages on every push.

---

## 🧼 Cleaning Rules Applied

The cleaning engine processes raw CSV objects sequentially through the following pipeline:

| Step | Rule Category | Specific Operation | Action Taken |
| :--- | :--- | :--- | :--- |
| **1** | **Duplicate Removal** | Detects exact duplicate rows (all fields case-insensitive match) | Excluded & Logged as `Duplicate` |
| | | Detects duplicate emails (case-insensitive) | Excluded & Logged as `Duplicate Email` |
| | | Detects duplicate Company + Contact combinations | Flagged as `Likely Duplicate` |
| **2** | **Empty Field Handling** | If **Company Name** is empty | Excluded (Incomplete row) |
| | | If **Email** is empty | Flagged (`Missing Email`) in `QC_Status` |
| | | If **Contact Person** is empty | Flagged (`Missing Contact`) in `QC_Status` |
| | | If **Phone** is empty | Flagged (`Missing Phone`) in `QC_Status` |
| **3** | **Formatting Fixes** | **Company Name, Contact Person, Designation, City** | Trimmed & formatted to `Title Case` |
| | | **Email Addresses** | Trimmed & formatted to `lowercase` |
| | | **Phone Numbers** | Standardized Indian numbers to `+91-XXXXX-XXXXX`; stripped spaces & dashes cleanly from international formats |
| **4** | **QC Status Column** | Adds `QC_Status` column to track row quality status | Appended values (e.g. `Clean`, `Missing Email`, `Missing Phone \| Missing Contact`) |

---

## 📊 Proof of Verification (Sample Run Metrics)

Running the cleaning engine on the built-in 70-row sandbox lead dataset produces the following results:

- **Total Rows Ingested:** 70
- **Duplicates Removed:** 9 (5 exact duplicates + 4 email duplicates)
- **Incomplete Rows Removed:** 2 (blank company names)
- **Empty Fields Fixed or Flagged:** 15
- **Clean Output Records:** 59
- **Input Data Quality Score:** 26% (indicates 74% of raw entries required sanitization on arrival)

### Output CSV Format
The exported file contains all original headers plus the new `QC_Status` tracking column. Excluded records (duplicates and blank companies) are filtered out, while flagged items remain in the output to enable sales representatives to perform manual enrichment.

---

## 💻 How to Run Locally

1. Clone or access the directory:
   ```bash
   cd "go-brics-lead-cleaner"
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Boot the local development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to: `http://localhost:5173/`

---

## 🌐 Live Deployment
The application compiles and deploys automatically via GitHub Actions.
Access the live interface here:  
🔗 **[krisshna-16.github.io/T03-go-bricks](https://krisshna-16.github.io/T03-go-bricks/)**
