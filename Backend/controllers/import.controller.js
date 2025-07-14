// controllers/importController.js
import XLSX from 'xlsx';
import User from '../models/user.model.js';
import Asset from '../models/asset.model.js';
import { ApiError } from '../utils/ApiError.js';



// Utility to convert Excel header keys to camelCase
function parseExcelDate(excelDateValue) {
  if (typeof excelDateValue === 'number') {
    // Excel serial date (days since 1900-01-01)
    return new Date(Math.round((excelDateValue - 25569) * 86400 * 1000));
  } else if (excelDateValue instanceof Date) {
    return excelDateValue;
  } else if (typeof excelDateValue === 'object' && excelDateValue !== null && 'y' in excelDateValue) {
    // Excel-formatted date object
    return new Date(excelDateValue.y, excelDateValue.m, excelDateValue.d);
  } else {
    return null;
  }
}



// Normalize headers to camelCase (e.g., 'Employee Code' → 'employeeCode')
const parseRow = (rawRow) => {
  const row = {};
  for (const key in rawRow) {
    const normalizedKey = key.trim().toLowerCase().replace(/\s+/g, '');

    switch (normalizedKey) {
      case 'employeecode':
      case 'employee code':
        row.employeeCode = rawRow[key]?.toString();
        break;

      case 'username':
        row.username = rawRow[key];
        break;

      case 'email':
        row.email = rawRow[key];
        break;

      case 'department':
        row.department = rawRow[key];
        break;

      case 'designation':
        row.designation = rawRow[key];
        break;

      case 'companyrole':
      case 'company role':
        row.companyRole = rawRow[key];
        break;

      case 'location':
        row.location = rawRow[key];
        break;

      case 'permanentaddress':
      case 'permanent address':
        row.permanentAddress = rawRow[key];
        break;

      case 'presentaddress':
      case 'present address':
        row.presentAddress = rawRow[key];
        break;

      case 'contactnumber':
      case 'contact number':
        row.contactNumber = rawRow[key];
        break;

      case 'reportingperson':
      case 'reporting person':
        row.reportingPerson = rawRow[key];
        break;

      case 'dateofbirth':
      case 'date of birth':
        row.dateOfBirth = parseExcelDate(rawRow[key]);
        break;

      case 'dateofjoining':
      case 'date of joining':
        row.dateOfJoining = parseExcelDate(rawRow[key]);
        break;

      default:
        break;
    }
  }

  return row;
};


export const importUsers = async (req, res , next) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'No file uploaded or file is empty' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[1]]; // Sheet2
    const rawData = XLSX.utils.sheet_to_json(sheet);

    if (!rawData || rawData.length === 0) {
      return res.status(400).json({ error: 'Excel sheet is empty' });
    }

    for (const rawRow of rawData) {
      const row = parseRow(rawRow);
      const {
        username,
        email,
        department,
        employeeCode,
        designation,
        companyRole,
        dateOfJoining,
        dateOfBirth,
        location,
        permanentAddress,
        presentAddress,
        contactNumber,
        reportingPerson,
      } = row;
        
      console.log("rawRow",row);
      
      // Skip row if required fields are missing
       

      const userData = {
        username: String(username).trim(),
        email: email?.trim() || undefined,
        department: department?.trim(),
        designation: designation?.trim(),
        companyRole: String(companyRole)?.trim(),
        employeeCode: String(employeeCode).trim().toUpperCase(),
        dateOfJoining: parseExcelDate(dateOfJoining),
        dateOfBirth: parseExcelDate(dateOfBirth),
        location: location?.trim(),
        permanentAddress: permanentAddress?.trim(),
        presentAddress: presentAddress?.trim(),
        contactNumber: contactNumber ? Number(contactNumber) : undefined,
        reportingPerson: reportingPerson?.trim(),
      };
         console.log("userData",userData);
         
      try {
        const existing = await User.findOne({ employeeCode: userData.employeeCode });

        if (existing) {
          await User.findOneAndUpdate(
            { employeeCode: userData.employeeCode },
            { $set: userData }
          );
        } else {
          await User.create(userData);
        }
      } catch (innerErr) {
        console.error(`Error processing row for employeeCode ${employeeCode}:`, innerErr.message);
        // Optionally collect and return skipped entries

      }
    }

    return res.status(200).json({ success: true, message: 'Users imported successfully' });
  } catch (error) {
    console.error('Import Error:', error);
     next(error)
    
  }
};





export const importAssets = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'No file uploaded or file is empty' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    if (!rawData || rawData.length === 0) {
      return res.status(400).json({ error: 'Excel sheet is empty' });
    }

    for (const row of rawData) {
      const asset = normalizeKeys(row); // Convert PascalCase to camelCase

      if (!asset.serialNumber) continue;

      await Asset.findOneAndUpdate(
        { serialNumber: asset.serialNumber },
        { $set: asset },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ success: true, message: 'Assets imported successfully' });
  } catch (error) {
    console.error('Asset import failed:', error);
    res.status(500).json({ success: false, message: 'Failed to import assets', error: error.message });
  }
};
