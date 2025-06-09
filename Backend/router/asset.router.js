import express from 'express';
import {
  addAsset,
  getAllAssets,
  getAllocatedAssets,
  getAssetBySerialNumber,
  getAvailableAssets,
  getDamagedAssets,
  getRepairAssets,

} from '../controllers/asset.controller.js';

import { isProtected } from '../middleware/authMiddleware.js';

const assetrouter = express.Router();

// 👇 Any admin can access these routes
assetrouter.post('/add', isProtected, addAsset);
assetrouter.get('/getAssets',isProtected, getAllAssets);
assetrouter.post('/getAssetsBySerialno',isProtected, getAssetBySerialNumber);
assetrouter.get('/getAvailableAssets',isProtected, getAvailableAssets);
assetrouter.get('/getAllocatedAssets',isProtected, getAllocatedAssets);
assetrouter.get('/getRepairAssets', isProtected, getRepairAssets);
assetrouter.get('/getDamagedAssets', isProtected, getDamagedAssets);
export default assetrouter;
