// controllers/importController.js
import XLSX from 'xlsx';
import User from '../models/user.model.js';
import Asset from '../models/asset.model.js';



// Utility to convert Excel header keys to camelCase
const toCamelCase = str =>
  str.replace(/([A-Z])/g, (match, p1, offset) =>
    offset === 0 ? p1.toLowerCase() : p1
  );

const normalizeKeys = (obj) => {
  const newObj = {};
  for (const key in obj) {
    const newKey = toCamelCase(key);
    newObj[newKey] = obj[key];
  }
  return newObj;
};

export const importUsers = async (req, res) => {
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
      const user = normalizeKeys(row); // Convert PascalCase to camelCase

      const {
        username,
        email,
        department,
        employeeCode,
        designation,
        roleInCompany,
        dateOfJoining,
        dateOfBirth,
        location,
        permanentAddress,
        presentAddress,
        contactNumber,
        reportingPerson,
      } = user;

      if (!employeeCode || !username || !email) continue;

      const updateData = {
        username,
        email,
        department,
        designation,
        roleInCompany,
        location,
        permanentAddress,
        presentAddress,
        contactNumber,
        reportingPerson,
      };

      if (dateOfJoining) updateData.dateOfJoining = new Date(dateOfJoining);
      if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);

      const existing = await User.findOne({ employeeCode });

      if (existing) {
        await User.findOneAndUpdate({ employeeCode }, { $set: updateData });
      } else {
        await User.create({ employeeCode, ...updateData });
      }
    }

    res.status(200).json({ success: true, message: 'Users imported successfully' });
  } catch (error) {
    console.error('❌ Import Error:', error);
    res.status(500).json({ success: false, message: 'Failed to import users', error: error.message });
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
