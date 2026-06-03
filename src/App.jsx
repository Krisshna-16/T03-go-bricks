import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { 
  Database, 
  UploadCloud, 
  RefreshCw, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Trash2, 
  Info, 
  FileSpreadsheet,
  Check,
  User
} from 'lucide-react';

// ==========================================
// 55-ROW MESSY SAMPLE B2B LEAD DATASET
// ==========================================
const SAMPLE_LEAD_DATA = [
  { "Company Name": "Isha Life Distributors", "Contact Person": "Rohit Sharma", "Designation": "Founder", "Email": "rohit@ishalife.com", "Phone": "+91 98765 43210", "City": "Mumbai", "LinkedIn": "https://linkedin.com/rohit", "Source": "Website" },
  { "Company Name": "Isha Life Distributors", "Contact Person": "Rohit Sharma", "Designation": "Founder", "Email": "rohit@ishalife.com", "Phone": "+91 98765 43210", "City": "Mumbai", "LinkedIn": "https://linkedin.com/rohit", "Source": "Website" }, // Exact duplicate 1
  { "Company Name": "Patanjali Retail Hub", "Contact Person": "Amit Patel", "Designation": "Category Manager", "Email": "amit@patanjalihub.co.in", "Phone": "+91-91234-56789", "City": "Delhi", "LinkedIn": "", "Source": "Ref" },
  { "Company Name": "Patanjali Retail Hub", "Contact Person": "Amit Patel", "Designation": "Category Manager", "Email": "amit@patanjalihub.co.in", "Phone": "+91-91234-56789", "City": "Delhi", "LinkedIn": "", "Source": "Ref" }, // Exact duplicate 2
  { "Company Name": "ArogyaWell Pvt Ltd", "Contact Person": "priya nair", "Designation": "Procurement Head", "Email": "info@arogyawell.com", "Phone": "+91 (98234) 56789", "City": "Bangalore", "LinkedIn": "", "Source": "" },
  { "Company Name": "ArogyaWell Pvt Ltd", "Contact Person": "priya nair", "Designation": "Procurement Head", "Email": "info@arogyawell.com", "Phone": "+91 (98234) 56789", "City": "Bangalore", "LinkedIn": "", "Source": "" }, // Exact duplicate 3
  { "Company Name": "Om Shanti Exports", "Contact Person": "Vikram Singh", "Designation": "Director", "Email": "contact@omshantiexports.com", "Phone": "098345-67890", "City": "Jaipur", "LinkedIn": "", "Source": "" },
  { "Company Name": "Om Shanti Exports", "Contact Person": "Vikram Singh", "Designation": "Director", "Email": "contact@omshantiexports.com", "Phone": "098345-67890", "City": "Jaipur", "LinkedIn": "", "Source": "" }, // Exact duplicate 4
  { "Company Name": "Vedic Bazaar", "Contact Person": "Sonal Gupta", "Designation": "Wellness Buyer", "Email": "sonal@vedicbazaar.in", "Phone": "+919876123456", "City": "Pune", "LinkedIn": "", "Source": "" },
  { "Company Name": "Vedic Bazaar", "Contact Person": "Sonal Gupta", "Designation": "Wellness Buyer", "Email": "sonal@vedicbazaar.in", "Phone": "+919876123456", "City": "Pune", "LinkedIn": "", "Source": "" }, // Exact duplicate 5
  { "Company Name": "NatureCure Distributors", "Contact Person": "Rajesh Kumar", "Designation": "Owner", "Email": "rajesh@naturecure.in", "Phone": "9876543211", "City": "Ahmedabad", "LinkedIn": "", "Source": "" },
  { "Company Name": "NatureCure Ahmedabad", "Contact Person": "R. Kumar", "Designation": "MD", "Email": "rajesh@naturecure.in", "Phone": "9876543211", "City": "Ahmedabad", "LinkedIn": "", "Source": "" }, // Email duplicate 1
  { "Company Name": "Himalaya Wellness Retail", "Contact Person": "Kavita Rao", "Designation": "Purchase Manager", "Email": "kavita@himalayaretail.com", "Phone": "+91 87654 32109", "City": "Bangalore", "LinkedIn": "", "Source": "" },
  { "Company Name": "Himalaya Wellness Bangalore", "Contact Person": "Kavita Rao", "Designation": "Buyer", "Email": "kavita@himalayaretail.com", "Phone": "+91 87654 32109", "City": "Bangalore", "LinkedIn": "", "Source": "" }, // Email duplicate 2
  { "Company Name": "Organic India Corp", "Contact Person": "Sanjay Mehta", "Designation": "Director", "Email": "sanjay@organicindia.co.in", "Phone": "+91 76543 21098", "City": "Chennai", "LinkedIn": "", "Source": "" },
  { "Company Name": "Organic India Chennai", "Contact Person": "S. Mehta", "Designation": "Owner", "Email": "sanjay@organicindia.co.in", "Phone": "+91 76543 21098", "City": "Chennai", "LinkedIn": "", "Source": "" }, // Email duplicate 3
  { "Company Name": "Baidyanath Pharma", "Contact Person": "Devendra Sharma", "Designation": "Procurement Head", "Email": "devendra@baidyanathpharma.com", "Phone": "+91 65432 10987", "City": "Kolkata", "LinkedIn": "", "Source": "" },
  { "Company Name": "Baidyanath Kolkata Hub", "Contact Person": "D. Sharma", "Designation": "Category Manager", "Email": "devendra@baidyanathpharma.com", "Phone": "+91 65432 10987", "City": "Kolkata", "LinkedIn": "", "Source": "" }, // Email duplicate 4
  { "Company Name": "Charak Herbal Care", "Contact Person": "Anil Joshi", "Designation": "Founder", "Email": "", "Phone": "9876543212", "City": "Mumbai", "LinkedIn": "", "Source": "" }, // Missing email 1
  { "Company Name": "Dabur Wellness Agency", "Contact Person": "Sunita Sharma", "Designation": "Wellness Buyer", "Email": "", "Phone": "9876543213", "City": "Delhi", "LinkedIn": "", "Source": "" }, // Missing email 2
  { "Company Name": "Kerala Ayurveda Studio", "Contact Person": "Lakshmi Kutty", "Designation": "Owner", "Email": "", "Phone": "9876543214", "City": "Kochi", "LinkedIn": "", "Source": "" }, // Missing email 3
  { "Company Name": "Sri Sri Tattva Distributor", "Contact Person": "Gopal Das", "Designation": "Procurement Head", "Email": "", "Phone": "9876543215", "City": "Bangalore", "LinkedIn": "", "Source": "" }, // Missing email 4
  { "Company Name": "Zandu Wellness Corner", "Contact Person": "Manisha Sen", "Designation": "Wellness Buyer", "Email": "", "Phone": "9876543216", "City": "Kolkata", "LinkedIn": "", "Source": "" }, // Missing email 5
  { "Company Name": "Vicco Lab Products", "Contact Person": "Jayesh Vyas", "Designation": "Director", "Email": "", "Phone": "9876543217", "City": "Pune", "LinkedIn": "", "Source": "" }, // Missing email 6
  { "Company Name": "Hamdard Wellness Clinic", "Contact Person": "", "Designation": "MD", "Email": "buyer@hamdardwellness.in", "Phone": "+91 99887 76655", "City": "Hyderabad", "LinkedIn": "", "Source": "" }, // Missing Contact 1
  { "Company Name": "Organic Soul Co", "Contact Person": "", "Designation": "Owner", "Email": "procurement@organicsoul.co.in", "Phone": "+91 88776 65544", "City": "Gurgaon", "LinkedIn": "", "Source": "" }, // Missing Contact 2
  { "Company Name": "AyurHerbals Supplier", "Contact Person": "", "Designation": "Purchase Manager", "Email": "sales@ayurherbals.in", "Phone": "+91 77665 54433", "City": "Jaipur", "LinkedIn": "", "Source": "" }, // Missing Contact 3
  { "Company Name": "Holy Basil Gifting", "Contact Person": "", "Designation": "Category Manager", "Email": "corporate@holybasil.in", "Phone": "+91 66554 43322", "City": "Surat", "LinkedIn": "", "Source": "" }, // Missing Contact 4
  { "Company Name": "Divya Pharmacy Outlet", "Contact Person": "Suresh Kumar", "Designation": "Founder", "Email": "suresh@divyaoutlet.in", "Phone": "", "City": "Haridwar", "LinkedIn": "", "Source": "" }, // Missing Phone 1
  { "Company Name": "Biotique Retail Partners", "Contact Person": "Divya Rawat", "Designation": "Wellness Buyer", "Email": "divya@biotiquehub.in", "Phone": "", "City": "Delhi", "LinkedIn": "", "Source": "" }, // Missing Phone 2
  { "Company Name": "Khadi India Craft", "Contact Person": "Mohan Lal", "Designation": "Category Manager", "Email": "mohan@khadicrafts.in", "Phone": "", "City": "Jaipur", "LinkedIn": "", "Source": "" }, // Missing Phone 3
  { "Company Name": "", "Contact Person": "Prakash Raj", "Designation": "Purchase Manager", "Email": "prakash@wellnesspharma.com", "Phone": "+91 98765 11111", "City": "Hyderabad", "LinkedIn": "", "Source": "" }, // Blank Company 1
  { "Company Name": "", "Contact Person": "Nidhi Shah", "Designation": "Owner", "Email": "nidhi@giftingexperts.in", "Phone": "+91 98765 22222", "City": "Mumbai", "LinkedIn": "", "Source": "" }, // Blank Company 2
  { "Company Name": "WELLNESS INDIA PVT LTD", "Contact Person": "sharma ROHIT", "Designation": "OWNER", "Email": "rohit@wellnessindia.in", "Phone": "+91 98765 33333", "City": "mumbai", "LinkedIn": "", "Source": "" }, // Capitalization 1
  { "Company Name": "AROGYA HERBALS", "Contact Person": "deepak verma", "Designation": "PROCUREMENT HEAD", "Email": "deepak@arogyaherbals.in", "Phone": "+91 98765 44444", "City": "delhi", "LinkedIn": "", "Source": "" }, // Capitalization 2
  { "Company Name": "isha life Distributors", "Contact Person": "RAHUL SEN", "Designation": "Director", "Email": "rahul@ishalife.com", "Phone": "+91 98765 55555", "City": "bangalore", "LinkedIn": "", "Source": "" }, // Capitalization 3
  { "Company Name": "VEDIC BAZAAR", "Contact Person": "preeti gupta", "Designation": "Category Manager", "Email": "preeti@vedicbazaar.in", "Phone": "+91 98765 66666", "City": "pune", "LinkedIn": "", "Source": "" }, // Capitalization 4
  { "Company Name": "PATANJALI RETAIL HUB", "Contact Person": "sandeep sharma", "Designation": "Wellness Buyer", "Email": "sandeep@patanjalihub.co.in", "Phone": "+91 98765 77777", "City": "delhi", "LinkedIn": "", "Source": "" }, // Capitalization 5
  { "Company Name": "NATURECURE DISTRIBUTORS", "Contact Person": "Megha Saxena", "Designation": "Procurement Head", "Email": "megha@naturecure.in", "Phone": "+91 98765 88888", "City": "ahmedabad", "LinkedIn": "", "Source": "" }, // Capitalization 6
  { "Company Name": "YOGA SHALA MUMBAI", "Contact Person": "kiran rao", "Designation": "Founder", "Email": "kiran@yogashala.in", "Phone": "+91 98765 99999", "City": "mumbai", "LinkedIn": "", "Source": "" }, // Capitalization 7
  { "Company Name": "SPIRITUAL GOODS DISTRIBUTORS", "Contact Person": "anil mehta", "Designation": "Category Manager", "Email": "anil@spiritualgoods.in", "Phone": "+91 98765 00000", "City": "chennai", "LinkedIn": "", "Source": "" }, // Capitalization 8
  { "Company Name": "VLCC Health Care", "Contact Person": "Vandana Luthra", "Designation": "Director", "Email": "vandana@vlcc.com", "Phone": "91 98765 43210", "City": "Delhi", "LinkedIn": "", "Source": "" }, // Messy Phone 1
  { "Company Name": "Kaya Clinic India", "Contact Person": "Harish Chandra", "Designation": "Purchase Manager", "Email": "harish@kayaclinic.in", "Phone": "098765-43210", "City": "Mumbai", "LinkedIn": "", "Source": "" }, // Messy Phone 2
  { "Company Name": "VLCC Wellness Clinic", "Contact Person": "Sunita Nair", "Designation": "Category Manager", "Email": "sunita@vlcc.com", "Phone": "+91 (98765) 43210", "City": "Bangalore", "LinkedIn": "", "Source": "" }, // Messy Phone 3
  { "Company Name": "Kama Ayurveda Outlet", "Contact Person": "Rakesh Sen", "Designation": "Owner", "Email": "rakesh@kamaayurveda.co.in", "Phone": "+91-98765-43210", "City": "Jaipur", "LinkedIn": "", "Source": "" }, // Messy Phone 4
  { "Company Name": "Forest Essentials Retail", "Contact Person": "Nisha Gupta", "Designation": "Wellness Buyer", "Email": "nisha@forestessentials.in", "Phone": "+91 (11) 2345-6789", "City": "Delhi", "LinkedIn": "", "Source": "" }, // Messy Phone 5
  { "Company Name": "Organic Wellness Co", "Contact Person": "Ritu Roy", "Designation": "MD", "Email": "BUYER@WELLNESSCO.IN", "Phone": "+91 98989 89898", "City": "Kolkata", "LinkedIn": "", "Source": "" }, // Upper Case Email 1
  { "Company Name": "Patanjali Wellness Hub", "Contact Person": "Manoj Joshi", "Designation": "Category Manager", "Email": "MANOJ@PATANJALIHUB.CO.IN", "Phone": "+91 87878 78787", "City": "Pune", "LinkedIn": "", "Source": "" }, // Upper Case Email 2
  { "Company Name": "Isha Yoga Center Shop", "Contact Person": "Pooja Hegde", "Designation": "Founder", "Email": "POOJA@ISHAYOGA.COM", "Phone": "+91 76767 67676", "City": "Coimbatore", "LinkedIn": "", "Source": "" }, // Upper Case Email 3
  { "Company Name": "Blue Earth Corp", "Contact Person": "Anita Deshmukh", "Designation": "Owner", "Email": "anita@blueearth.in", "Phone": "+91-98765-01234", "City": "Mumbai", "LinkedIn": "", "Source": "" }, // Clean 1
  { "Company Name": "Green Leaf Herbals", "Contact Person": "Vijay Rangan", "Designation": "Category Manager", "Email": "vijay@greenleaf.in", "Phone": "+91-98765-02345", "City": "Chennai", "LinkedIn": "", "Source": "" }, // Clean 2
  { "Company Name": "Soulful Yoga Studio", "Contact Person": "Namrata Pai", "Designation": "Owner", "Email": "namrata@soulfulyoga.in", "Phone": "+91-98765-03456", "City": "Pune", "LinkedIn": "", "Source": "" }, // Clean 3
  { "Company Name": "Wellness Gifting Solutions", "Contact Person": "Ajay Khurana", "Designation": "MD", "Email": "ajay@wellnessgifting.in", "Phone": "+91-98765-04567", "City": "Delhi", "LinkedIn": "", "Source": "" }, // Clean 4
  { "Company Name": "Sacred Herbs Retail", "Contact Person": "Neha Kapoor", "Designation": "Purchase Manager", "Email": "neha@sacredherbs.in", "Phone": "+91-98765-05678", "City": "Bangalore", "LinkedIn": "", "Source": "" }, // Clean 5
  { "Company Name": "Health & Bloom Pharma", "Contact Person": "Suresh Nair", "Designation": "Founder", "Email": "suresh@healthbloom.in", "Phone": "+91-98765-06789", "City": "Kochi", "LinkedIn": "", "Source": "" } // Clean 6
];

// ==========================================
// UTILITY FUNCTIONS FOR CLEANING LOGIC
// ==========================================

// Standardize text to Title Case
function toTitleCase(str) {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Standardize phone numbers (+91-XXXXX-XXXXX for Indian, clean up for others)
function standardizePhone(phone) {
  if (!phone) return '';
  const trimmed = phone.trim();
  
  // Strip all characters except digits and leading '+'
  let digits = trimmed.replace(/[^\d+]/g, '');
  
  // Extract trailing digits
  let coreDigits = digits;
  if (digits.startsWith('+91')) {
    coreDigits = digits.slice(3);
  } else if (digits.startsWith('91') && digits.length > 10) {
    coreDigits = digits.slice(2);
  } else if (digits.startsWith('0') && digits.length === 11) {
    coreDigits = digits.slice(1);
  }
  
  // If we have a 10 digit mobile starting with valid Indian mobile digits (6, 7, 8, 9)
  if (coreDigits.length === 10 && /^[6-9]\d{9}$/.test(coreDigits)) {
    return `+91-${coreDigits.slice(0, 5)}-${coreDigits.slice(5)}`;
  }
  
  // Non-Indian format: clean up and return digits
  if (digits.startsWith('+')) {
    return '+' + digits.slice(1).replace(/\+/g, '');
  }
  return digits.replace(/\+/g, '');
}

function App() {
  const [step, setStep] = useState(1); // 1 = Upload, 2 = Processing, 3 = Results
  const [rawRows, setRawRows] = useState([]);
  const [cleanedRows, setCleanedRows] = useState([]);
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({});
  const [columnsPresent, setColumnsPresent] = useState([]);
  const [missingExpectedColumns, setMissingExpectedColumns] = useState([]);
  const [participantName, setParticipantName] = useState('');
  
  const fileInputRef = useRef(null);

  // Expected B2B fields for case-insensitive matching
  const expectedFields = [
    'Company Name',
    'Contact Person',
    'Designation',
    'Email',
    'Phone',
    'City',
    'LinkedIn',
    'Source'
  ];

  // ==========================================
  // CSV PARSING & DATA INGESTION
  // ==========================================
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        processRawData(results.data);
      },
      error: (err) => {
        alert('Failed to parse CSV file: ' + err.message);
      }
    });
  };

  const loadSampleDataset = () => {
    // Deep copy sample dataset to avoid reference issues
    const data = JSON.parse(JSON.stringify(SAMPLE_LEAD_DATA));
    processRawData(data);
  };

  const processRawData = (data) => {
    if (!data || data.length === 0) {
      alert('The CSV file is empty or formatted incorrectly.');
      return;
    }

    setRawRows(data);
    setStep(2); // Go to Processing loader screen

    // Run clean algorithm with 1s UX delay
    setTimeout(() => {
      cleanLeadData(data);
      setStep(3); // Go to Results screen
    }, 1200);
  };

  // ==========================================
  // CORE CLEANING LOGIC ALGORITHM
  // ==========================================

  const cleanLeadData = (data) => {
    // 1. Identify which expected columns are present (case-insensitive)
    const firstRowKeys = Object.keys(data[0] || {});
    const columnsPresentInFile = [];
    const missingCols = [];
    
    expectedFields.forEach(field => {
      const matchedKey = firstRowKeys.find(
        key => key.trim().toLowerCase() === field.toLowerCase()
      );
      if (matchedKey) {
        columnsPresentInFile.push({
          original: matchedKey,
          standardizedKey: field
        });
      } else {
        missingCols.push(field);
      }
    });

    setColumnsPresent(columnsPresentInFile.map(c => c.original));
    setMissingExpectedColumns(missingCols);

    const hasCol = (standardKey) => {
      return columnsPresentInFile.some(c => c.standardizedKey === standardKey);
    };

    const issuesLog = [];
    const processed = [];
    
    // Duplicate trackers
    const seenExactRows = new Set();
    const seenEmails = new Set();
    const seenCompanyContacts = new Set();
    
    let duplicatesRemovedCount = 0;
    let emptyFieldsFlaggedCount = 0;
    let autoFixedCount = 0;
    let cleanOnArrivalCount = 0;

    data.forEach((rawRow, idx) => {
      const rowNum = idx + 1;
      
      // Map the raw row keys to a standardized internal object format
      const row = {};
      columnsPresentInFile.forEach(col => {
        row[col.standardizedKey] = rawRow[col.original] || '';
      });

      // Maintain any original columns that are not in the expected list
      firstRowKeys.forEach(k => {
        const isExpected = columnsPresentInFile.some(c => c.original === k);
        if (!isExpected) {
          row[k] = rawRow[k] || '';
        }
      });

      // Temporary variables for this row
      let isRemoved = false;
      let removeReason = '';
      const qcFlags = [];
      let isAutoFixed = false;

      // 1. DUPLICATE REMOVAL
      
      // Exact duplicate row check (all standardized fields identical)
      const serializedRow = expectedFields
        .filter(f => hasCol(f))
        .map(f => String(row[f] || '').trim().toLowerCase())
        .join('|||');

      if (seenExactRows.has(serializedRow)) {
        isRemoved = true;
        removeReason = 'Duplicate Removed';
        duplicatesRemovedCount++;
        issuesLog.push({
          rowNum,
          companyName: row['Company Name'] || '[Blank]',
          issueType: 'Duplicate',
          action: 'Removed',
          details: 'Exact duplicate row'
        });
        
        // Push duplicate row to raw comparison trace, marked as removed
        processed.push({
          ...row,
          QC_Status: 'Duplicate Removed',
          _isRemoved: true
        });
        return;
      }
      seenExactRows.add(serializedRow);

      // Incomplete company check (blank Company Name)
      if (hasCol('Company Name') && (!row['Company Name'] || String(row['Company Name']).trim() === '')) {
        isRemoved = true;
        removeReason = 'Incomplete — Removed from clean output';
        emptyFieldsFlaggedCount++;
        issuesLog.push({
          rowNum,
          companyName: '[Blank]',
          issueType: 'Blank Company Name',
          action: 'Removed',
          details: 'Row excluded due to missing Company Name'
        });
        
        processed.push({
          ...row,
          QC_Status: 'Incomplete — Removed from clean output',
          _isRemoved: true
        });
        return;
      }

      // Duplicate email check (case-insensitive)
      if (hasCol('Email') && row['Email'] && String(row['Email']).trim() !== '') {
        const emailLower = String(row['Email']).trim().toLowerCase();
        if (seenEmails.has(emailLower)) {
          isRemoved = true;
          removeReason = 'Duplicate Removed';
          duplicatesRemovedCount++;
          issuesLog.push({
            rowNum,
            companyName: row['Company Name'] || '[Blank]',
            issueType: 'Duplicate Email',
            action: 'Removed',
            details: `Duplicate email: ${emailLower}`
          });
          
          processed.push({
            ...row,
            QC_Status: 'Duplicate Removed',
            _isRemoved: true
          });
          return;
        }
        seenEmails.add(emailLower);
      }

      // Duplicate company + contact name combination
      if (hasCol('Company Name') && hasCol('Contact Person') && row['Company Name'] && row['Contact Person']) {
        const compContactKey = `${String(row['Company Name']).trim().toLowerCase()}|||${String(row['Contact Person']).trim().toLowerCase()}`;
        if (seenCompanyContacts.has(compContactKey)) {
          qcFlags.push('Likely Duplicate');
          issuesLog.push({
            rowNum,
            companyName: row['Company Name'],
            issueType: 'Likely Duplicate',
            action: 'Flagged',
            details: `Duplicate Company & Contact: "${row['Company Name']}" & "${row['Contact Person']}"`
          });
        }
        seenCompanyContacts.add(compContactKey);
      }

      // 2. EMPTY FIELD HANDLING
      if (hasCol('Email') && (!row['Email'] || String(row['Email']).trim() === '')) {
        qcFlags.push('Missing Email');
        emptyFieldsFlaggedCount++;
        issuesLog.push({
          rowNum,
          companyName: row['Company Name'],
          issueType: 'Missing Email',
          action: 'Flagged',
          details: 'Email field is empty'
        });
      }

      if (hasCol('Contact Person') && (!row['Contact Person'] || String(row['Contact Person']).trim() === '')) {
        qcFlags.push('Missing Contact');
        emptyFieldsFlaggedCount++;
        issuesLog.push({
          rowNum,
          companyName: row['Company Name'],
          issueType: 'Missing Contact',
          action: 'Flagged',
          details: 'Contact Person is empty'
        });
      }

      if (hasCol('Phone') && (!row['Phone'] || String(row['Phone']).trim() === '')) {
        qcFlags.push('Missing Phone');
        emptyFieldsFlaggedCount++;
        issuesLog.push({
          rowNum,
          companyName: row['Company Name'],
          issueType: 'Missing Phone',
          action: 'Flagged',
          details: 'Phone field is empty'
        });
      }

      // 3. FORMATTING FIXES (auto-fix and log)
      const cleanedRow = { ...row };
      
      // Format Company Name (Trim & Title Case)
      if (hasCol('Company Name') && row['Company Name']) {
        const trimmed = String(row['Company Name']).trim();
        const titleCased = toTitleCase(trimmed);
        if (trimmed !== row['Company Name'] || titleCased !== trimmed) {
          cleanedRow['Company Name'] = titleCased;
          isAutoFixed = true;
          issuesLog.push({
            rowNum,
            companyName: titleCased,
            issueType: 'Formatting Fixed',
            action: 'Auto-fixed',
            details: `Company Name formatting: "${row['Company Name']}" -> "${titleCased}"`
          });
        }
      }

      // Format Contact Person (Trim & Title Case)
      if (hasCol('Contact Person') && row['Contact Person']) {
        const trimmed = String(row['Contact Person']).trim();
        const titleCased = toTitleCase(trimmed);
        if (trimmed !== row['Contact Person'] || titleCased !== trimmed) {
          cleanedRow['Contact Person'] = titleCased;
          isAutoFixed = true;
          issuesLog.push({
            rowNum,
            companyName: cleanedRow['Company Name'] || row['Company Name'],
            issueType: 'Formatting Fixed',
            action: 'Auto-fixed',
            details: `Contact Person formatting: "${row['Contact Person']}" -> "${titleCased}"`
          });
        }
      }

      // Format Designation (Trim & Title Case)
      if (hasCol('Designation') && row['Designation']) {
        const trimmed = String(row['Designation']).trim();
        const titleCased = toTitleCase(trimmed);
        if (trimmed !== row['Designation'] || titleCased !== trimmed) {
          cleanedRow['Designation'] = titleCased;
          isAutoFixed = true;
          issuesLog.push({
            rowNum,
            companyName: cleanedRow['Company Name'] || row['Company Name'],
            issueType: 'Formatting Fixed',
            action: 'Auto-fixed',
            details: `Designation formatting: "${row['Designation']}" -> "${titleCased}"`
          });
        }
      }

      // Format Email (Trim & Lowercase)
      if (hasCol('Email') && row['Email']) {
        const trimmed = String(row['Email']).trim();
        const lowercased = trimmed.toLowerCase();
        if (trimmed !== row['Email'] || lowercased !== trimmed) {
          cleanedRow['Email'] = lowercased;
          isAutoFixed = true;
          issuesLog.push({
            rowNum,
            companyName: cleanedRow['Company Name'] || row['Company Name'],
            issueType: 'Formatting Fixed',
            action: 'Auto-fixed',
            details: `Email casing standardized: "${row['Email']}" -> "${lowercased}"`
          });
        }
      }

      // Format City (Trim & Title Case)
      if (hasCol('City') && row['City']) {
        const trimmed = String(row['City']).trim();
        const titleCased = toTitleCase(trimmed);
        if (trimmed !== row['City'] || titleCased !== trimmed) {
          cleanedRow['City'] = titleCased;
          isAutoFixed = true;
          issuesLog.push({
            rowNum,
            companyName: cleanedRow['Company Name'] || row['Company Name'],
            issueType: 'Formatting Fixed',
            action: 'Auto-fixed',
            details: `City formatting: "${row['City']}" -> "${titleCased}"`
          });
        }
      }

      // Format Phone (Trim & Standardize)
      if (hasCol('Phone') && row['Phone']) {
        const trimmed = String(row['Phone']).trim();
        const standardized = standardizePhone(trimmed);
        if (trimmed !== row['Phone'] || standardized !== trimmed) {
          cleanedRow['Phone'] = standardized;
          isAutoFixed = true;
          issuesLog.push({
            rowNum,
            companyName: cleanedRow['Company Name'] || row['Company Name'],
            issueType: 'Formatting Fixed',
            action: 'Auto-fixed',
            details: `Phone standardized: "${row['Phone']}" -> "${standardized}"`
          });
        }
      }

      if (isAutoFixed) {
        autoFixedCount++;
      }

      // QC Status compilation
      if (qcFlags.length > 0) {
        cleanedRow.QC_Status = qcFlags.join(' | ');
      } else {
        cleanedRow.QC_Status = 'Clean';
        if (!isAutoFixed && qcFlags.length === 0) {
          cleanOnArrivalCount++;
        }
      }

      processed.push({
        ...cleanedRow,
        _isRemoved: false
      });
    });

    // Cleaned output (only kept rows)
    const finalOutput = processed
      .filter(r => !r._isRemoved)
      .map(r => {
        const { _isRemoved, ...cleanData } = r;
        return cleanData;
      });

    setCleanedRows(finalOutput);
    setIssues(issuesLog);

    // Calculate dynamic stats
    const totalRowsReceived = data.length;
    const finalCleanCount = finalOutput.length;
    const dataQualityScore = Math.round((cleanOnArrivalCount / totalRowsReceived) * 100);

    setStats({
      totalRows: totalRowsReceived,
      duplicatesRemoved: duplicatesRemovedCount,
      emptyFieldsFlagged: emptyFieldsFlaggedCount,
      cleanOutputCount: finalCleanCount,
      qualityScore: isNaN(dataQualityScore) ? 0 : dataQualityScore
    });
  };

  // ==========================================
  // EXPORT / DOWNLOAD FUNCTIONS
  // ==========================================

  const handleDownloadCSV = () => {
    if (cleanedRows.length === 0) return;
    
    // We parse back to original column capitalization and keep QC_Status at the end
    const csvContent = Papa.unparse(cleanedRows);
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `go-brics-cleaned-leads-${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadReadme = () => {
    const creator = participantName.trim() || 'GO-BRICS Participant';
    const readmeText = `------------------------------------------------------------
GO-BRICS B2B Lead List Cleaner — Readme
Tool: GO-BRICS B2B Lead Cleaner v1.0
Built for: GO-BRICS Business Lab — Task T03
Department: Tech

WHAT THIS TOOL DOES
This tool takes a raw B2B lead list in CSV format and automatically cleans it by:
- Removing duplicate entries (exact duplicates and duplicate emails)
- Flagging rows with missing critical fields (email, contact person, phone)
- Auto-fixing formatting issues: whitespace, capitalisation, email casing, phone number standardisation
- Adding a QC_Status column to every row so the sales team knows which entries need follow-up

INPUT FORMAT
The tool expects a CSV file with these columns:
Company Name, Contact Person, Designation, Email, Phone, City, LinkedIn (optional), Source (optional)
Column names are matched case-insensitively.

HOW TO USE
1. Open the tool in any browser
2. Upload your CSV file using the drag-and-drop zone or file picker
3. The tool will process and clean your data automatically
4. Review the cleaning summary and issues log
5. Download the cleaned CSV for use by the Sales team

OUTPUT
The cleaned CSV contains all original columns plus one new column: QC_Status
Rows marked "Clean" are ready to use immediately.
Rows marked with flags need human review before outreach.
Duplicate rows are removed entirely from the clean output.

CLEANING RULES APPLIED
1. Exact duplicate rows: removed (first occurrence kept)
2. Duplicate emails: second occurrence removed
3. Missing company name: row excluded from clean output
4. Missing email/contact/phone: row kept but flagged in QC_Status
5. Company/contact names: trimmed and converted to Title Case
6. Emails: trimmed and converted to lowercase
7. Phone numbers: standardised — Indian numbers to +91-XXXXX-XXXXX format
8. City: trimmed and converted to Title Case

PROOF OF DATA QUALITY
This readme and the cleaning summary exported with the tool together constitute the documentation required for GO-BRICS Task T03 proof submission.

CLEANING RUN STATISTICS:
- Total rows received: ${stats.totalRows || 0}
- Duplicates removed: ${stats.duplicatesRemoved || 0}
- Empty fields fixed/flagged: ${stats.emptyFieldsFlagged || 0}
- Rows in final clean output: ${stats.cleanOutputCount || 0}
- Input data quality score: ${stats.qualityScore || 0}%

Built by: ${creator}
Programme: GO-BRICS Business Lab Cohort I
Task Reference: TASK_T03
------------------------------------------------------------`;

    const blob = new Blob([readmeText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'Readme.txt');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartOver = () => {
    setRawRows([]);
    setCleanedRows([]);
    setIssues([]);
    setStats({});
    setColumnsPresent([]);
    setMissingExpectedColumns([]);
    setStep(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  // ==========================================
  // RENDER INTERFACES
  // ==========================================

  return (
    <div className="min-h-screen bg-black text-white matrix-bg flex flex-col items-center py-8 px-4 selection:bg-brand-green selection:text-black">
      
      {/* HEADER SECTION */}
      <header className="w-full max-w-6xl mb-8 flex flex-col md:flex-row items-center justify-between border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="bg-brand-green/10 p-2 rounded-lg border border-brand-green/30 box-glow transition-all duration-300">
            <Database className="w-8 h-8 text-brand-green glow-green" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans text-white">
              GO-BRICS <span className="text-brand-green glow-green">B2B Lead Cleaner</span>
            </h1>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              TASK INTELLIGENCE SYSTEM • v1.0
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 border border-zinc-800 px-3 py-1.5 rounded-full bg-zinc-950 font-mono text-xs text-zinc-400">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse" />
          GO-BRICS LABS COHORT I
        </div>
      </header>

      {/* STEP 1 — UPLOAD SCREEN */}
      {step === 1 && (
        <main className="w-full max-w-3xl flex-1 flex flex-col justify-center py-10">
          <div className="text-center mb-8">
            <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              Upload your raw B2B lead list and we'll automatically clean it — removing duplicates, fixing formatting, and flagging incomplete entries.
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center">
            {/* Visual background accents */}
            <div className="absolute -top-16 -left-16 w-32 h-32 bg-brand-green/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-brand-green/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Drag & Drop zone */}
            <div 
              onClick={triggerFileSelect}
              className="w-full border-2 border-dashed border-zinc-800 hover:border-brand-green bg-black/60 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".csv" 
                className="hidden" 
              />
              <div className="bg-zinc-900 group-hover:bg-brand-green/10 p-4 rounded-full border border-zinc-800 group-hover:border-brand-green/30 group-hover:scale-110 transition-all duration-300 mb-4">
                <UploadCloud className="w-10 h-10 text-zinc-400 group-hover:text-brand-green" />
              </div>
              <p className="text-base text-zinc-300 font-semibold mb-1 group-hover:text-white transition-colors duration-200">
                Drop your B2B Lead List CSV here
              </p>
              <p className="text-xs text-zinc-500 font-mono">
                Supports standard .csv format only
              </p>
            </div>

            <div className="w-full flex items-center justify-between my-6">
              <span className="h-[1px] bg-zinc-800 flex-1" />
              <span className="text-xs font-mono text-zinc-500 uppercase px-4">or use sandbox mode</span>
              <span className="h-[1px] bg-zinc-800 flex-1" />
            </div>

            {/* Use Sample Dataset */}
            <button
              onClick={loadSampleDataset}
              className="w-full py-4 border border-brand-green/50 text-brand-green hover:bg-brand-green/10 hover:text-white rounded-lg font-bold font-sans tracking-wide transition-all duration-300 active:scale-[0.98]"
            >
              Use Sample Dataset
            </button>
            <p className="text-[11px] text-zinc-500 font-mono text-center mt-3">
              Loads 55 messy Indian business records with duplicates, casing issues, and blank fields.
            </p>
          </div>
        </main>
      )}

      {/* STEP 2 — PROCESSING SCREEN */}
      {step === 2 && (
        <main className="w-full max-w-md flex-1 flex flex-col items-center justify-center py-20 text-center">
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-zinc-900 border-t-brand-green rounded-full animate-spin" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black p-2 rounded-full">
              <Database className="w-6 h-6 text-brand-green animate-pulse" />
            </div>
          </div>
          
          <h2 className="text-xl font-bold font-sans tracking-wider mb-2">
            Cleaning your data<span className="dot-blink-1">.</span><span className="dot-blink-2">.</span><span className="dot-blink-3">.</span>
          </h2>
          <p className="text-zinc-500 font-mono text-xs max-w-xs">
            Parsing structures • Removing duplicates • Auto-formatting fields • Compiling QC logs
          </p>
        </main>
      )}

      {/* STEP 3 — RESULTS SCREEN */}
      {step === 3 && (
        <main className="w-full max-w-6xl flex-1 flex flex-col gap-8 pb-16">
          
          {/* SECTION A — CLEANING SUMMARY STATS */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            {/* Stat Card: Total Received */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-5 flex flex-col justify-between">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                Rows Ingested
              </span>
              <div>
                <span className="text-3xl font-extrabold text-white">
                  {stats.totalRows}
                </span>
                <span className="text-xs text-zinc-400 font-mono block mt-1">Raw rows read</span>
              </div>
            </div>

            {/* Stat Card: Duplicates Removed */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-5 flex flex-col justify-between">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                Duplicates Removed
              </span>
              <div>
                <span className={`text-3xl font-extrabold ${stats.duplicatesRemoved > 0 ? 'text-red-500' : 'text-white'}`}>
                  {stats.duplicatesRemoved}
                </span>
                <span className="text-xs text-zinc-400 font-mono block mt-1">Rows excluded</span>
              </div>
            </div>

            {/* Stat Card: Flagged / Fixed */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-5 flex flex-col justify-between">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                Flags / Auto-fixes
              </span>
              <div>
                <span className={`text-3xl font-extrabold ${stats.emptyFieldsFlagged > 0 ? 'text-amber-500' : 'text-white'}`}>
                  {stats.emptyFieldsFlagged}
                </span>
                <span className="text-xs text-zinc-400 font-mono block mt-1">Fields resolved</span>
              </div>
            </div>

            {/* Stat Card: Final Count */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-5 flex flex-col justify-between">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                Clean Output
              </span>
              <div>
                <span className="text-3xl font-extrabold text-brand-green glow-green">
                  {stats.cleanOutputCount}
                </span>
                <span className="text-xs text-zinc-400 font-mono block mt-1">Clean records</span>
              </div>
            </div>

            {/* Stat Card: Data Quality Score */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-5 flex flex-col justify-between col-span-2 md:col-span-1">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                Quality Score
              </span>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-brand-green glow-green">
                    {stats.qualityScore}%
                  </span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-brand-green h-full rounded-full" 
                    style={{ width: `${stats.qualityScore}%` }}
                  />
                </div>
              </div>
            </div>

          </section>

          {/* Missing column note if any */}
          {missingExpectedColumns.length > 0 && (
            <div className="bg-zinc-950/60 border border-amber-500/20 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
                  Skipped steps due to missing columns
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  The following expected B2B columns were missing from the file: <span className="font-mono text-amber-300">{missingExpectedColumns.join(', ')}</span>. Duplicate matching and auto-formatting checks for these attributes were skipped.
                </p>
              </div>
            </div>
          )}

          {/* SECTION D — DOWNLOAD + README CONFIG (Moved to top of logs for convenience) */}
          <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex-1 w-full">
              <h3 className="text-lg font-bold font-sans mb-1 flex items-center gap-2">
                <FileSpreadsheet className="text-brand-green w-5 h-5" /> Download Prepared Lead List
              </h3>
              <p className="text-sm text-zinc-400 mb-4 md:mb-0">
                Generate dynamic deliverables formatted for sales outreach and cohort proof submissions.
              </p>
            </div>
            
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              
              {/* Creator Name Input */}
              <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                <User className="w-4 h-4 text-zinc-500 mr-2" />
                <input 
                  type="text" 
                  placeholder="Participant Name" 
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  className="bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none w-40"
                />
              </div>

              {/* Download CSV */}
              <button
                onClick={handleDownloadCSV}
                className="bg-brand-green text-black font-extrabold hover:bg-brand-green/80 rounded-lg px-6 py-3 flex items-center justify-center gap-2 tracking-wide font-sans text-sm transition-all duration-200 active:scale-95"
              >
                <Download className="w-4 h-4" /> Download Cleaned CSV
              </button>

              {/* Download Readme */}
              <button
                onClick={handleDownloadReadme}
                className="bg-zinc-900 border border-zinc-800 text-white font-bold hover:bg-zinc-800 hover:border-zinc-700 rounded-lg px-5 py-3 flex items-center justify-center gap-2 text-sm transition-all duration-200 active:scale-95"
              >
                <FileText className="w-4 h-4 text-zinc-400" /> Download Readme.txt
              </button>

              {/* Start Over */}
              <button
                onClick={handleStartOver}
                className="border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg p-3 flex items-center justify-center transition-all duration-200"
                title="Start Over"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

            </div>
          </section>

          {/* SECTION B — ISSUES FOUND LOG */}
          <section className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex flex-col h-[400px]">
            <div className="bg-zinc-900/60 border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wider font-sans">
                Issues Log ({issues.length} records processed)
              </h3>
              <span className="font-mono text-xs text-zinc-500">
                RED: Removed • ORANGE: Flagged • GREEN: Auto-fixed
              </span>
            </div>
            
            <div className="flex-1 overflow-auto">
              {issues.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 font-mono text-xs">
                  <CheckCircle className="w-8 h-8 text-brand-green mb-2" />
                  NO ISSUES IDENTIFIED • RAW DATA WAS PRISTINE
                </div>
              ) : (
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead className="bg-black text-zinc-400 border-b border-zinc-900 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 font-semibold w-16">Row</th>
                      <th className="px-6 py-3 font-semibold">Company Name</th>
                      <th className="px-6 py-3 font-semibold">Issue Type</th>
                      <th className="px-6 py-3 font-semibold">Action Taken</th>
                      <th className="px-6 py-3 font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/40">
                    {issues.map((issue, idx) => {
                      let badgeStyle = '';
                      let rowStyle = '';

                      if (issue.action === 'Removed') {
                        badgeStyle = 'bg-red-950 text-red-400 border-red-900/50';
                        rowStyle = 'hover:bg-red-950/10';
                      } else if (issue.action === 'Flagged') {
                        badgeStyle = 'bg-amber-950 text-amber-400 border-amber-900/50';
                        rowStyle = 'hover:bg-amber-950/10';
                      } else {
                        badgeStyle = 'bg-emerald-950 text-emerald-400 border-emerald-900/50';
                        rowStyle = 'hover:bg-emerald-950/10';
                      }

                      return (
                        <tr key={idx} className={`transition-all duration-150 ${rowStyle}`}>
                          <td className="px-6 py-3.5 text-zinc-500 font-semibold">{issue.rowNum}</td>
                          <td className="px-6 py-3.5 text-zinc-200 font-semibold">{issue.companyName}</td>
                          <td className="px-6 py-3.5 text-zinc-400">{issue.issueType}</td>
                          <td className="px-6 py-3.5">
                            <span className={`inline-flex px-2 py-0.5 border rounded-full text-[10px] font-bold ${badgeStyle}`}>
                              {issue.action}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-zinc-500 font-mono text-[11px]">{issue.details}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* SECTION C — BEFORE VS AFTER PREVIEW */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Raw Data Preview (First 10 Rows) */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex flex-col h-[350px]">
              <div className="bg-zinc-900/60 border-b border-zinc-900 px-5 py-3 flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider font-sans text-zinc-400">
                  Raw Input (First 10 Rows)
                </h3>
                <span className="bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded font-mono text-[10px]">
                  Uncleaned Sample
                </span>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[700px]">
                  <thead className="bg-black text-zinc-500 border-b border-zinc-900 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-2.5">Company Name</th>
                      <th className="px-4 py-2.5">Contact Person</th>
                      <th className="px-4 py-2.5">Designation</th>
                      <th className="px-4 py-2.5">Email</th>
                      <th className="px-4 py-2.5">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/30">
                    {rawRows.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="hover:bg-zinc-900/30">
                        <td className="px-4 py-2.5 text-zinc-300 font-semibold truncate max-w-[150px]" title={row['Company Name'] || '[Empty]'}>
                          {row['Company Name'] || <span className="text-red-500/60 font-semibold">[Blank]</span>}
                        </td>
                        <td className="px-4 py-2.5 text-zinc-400 truncate max-w-[120px]">{row['Contact Person'] || '[Empty]'}</td>
                        <td className="px-4 py-2.5 text-zinc-400 truncate max-w-[120px]">{row['Designation'] || '[Empty]'}</td>
                        <td className="px-4 py-2.5 text-zinc-400 truncate max-w-[150px]">{row['Email'] || '[Empty]'}</td>
                        <td className="px-4 py-2.5 text-zinc-400 truncate max-w-[120px]">{row['Phone'] || '[Empty]'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cleaned Data Preview (First 10 Rows) */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex flex-col h-[350px]">
              <div className="bg-zinc-900/60 border-b border-zinc-900 px-5 py-3 flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider font-sans text-brand-green">
                  Cleaned Output (First 10 Rows)
                </h3>
                <span className="bg-brand-green/10 text-brand-green border border-brand-green/30 px-2 py-0.5 rounded font-mono text-[10px] glow-green">
                  QC Checked
                </span>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[800px]">
                  <thead className="bg-black text-zinc-500 border-b border-zinc-900 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-2.5">Company Name</th>
                      <th className="px-4 py-2.5">Contact Person</th>
                      <th className="px-4 py-2.5">Designation</th>
                      <th className="px-4 py-2.5">Email</th>
                      <th className="px-4 py-2.5">Phone</th>
                      <th className="px-4 py-2.5">QC Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/30">
                    {cleanedRows.slice(0, 10).map((row, idx) => {
                      let statusBadge = '';
                      if (row.QC_Status === 'Clean') {
                        statusBadge = 'text-brand-green bg-brand-green/5 border border-brand-green/20';
                      } else {
                        statusBadge = 'text-amber-400 bg-amber-950/20 border border-amber-900/50';
                      }

                      return (
                        <tr key={idx} className="hover:bg-zinc-900/30">
                          <td className="px-4 py-2.5 text-white font-semibold truncate max-w-[150px]" title={row['Company Name']}>
                            {row['Company Name']}
                          </td>
                          <td className="px-4 py-2.5 text-zinc-300 truncate max-w-[120px]">{row['Contact Person'] || <span className="text-zinc-600">[Blank]</span>}</td>
                          <td className="px-4 py-2.5 text-zinc-300 truncate max-w-[120px]">{row['Designation'] || <span className="text-zinc-600">[Blank]</span>}</td>
                          <td className="px-4 py-2.5 text-zinc-300 truncate max-w-[150px]">{row['Email'] || <span className="text-zinc-600">[Blank]</span>}</td>
                          <td className="px-4 py-2.5 text-zinc-300 truncate max-w-[120px]">{row['Phone'] || <span className="text-zinc-600">[Blank]</span>}</td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold ${statusBadge}`}>
                              {row.QC_Status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </section>

        </main>
      )}

      {/* FOOTER */}
      <footer className="w-full max-w-6xl mt-auto border-t border-zinc-900 pt-6 text-center text-[10px] text-zinc-600 font-mono flex flex-col md:flex-row items-center justify-between">
        <p>© 2026 GO-BRICS TECH DIVISION. ALL RIGHTS RESERVED.</p>
        <p className="mt-2 md:mt-0">SECURE ON-DEVICE DE-DUPLICATION • COHORT LAB SUBMISSION SPEC-T03</p>
      </footer>
    </div>
  );
}

export default App;
