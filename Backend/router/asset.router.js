import express from 'express';
import {
  addAsset,
  allocateAsset,
  deallocateAsset,
  getAllAssets,
  getAllocatedAssets,
  getAssetBySerialNumber,
  getAvailableAssets,
  getDamagedAssets,
  getRepairAssets,
  updateAsset ,
  deleteAsset
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
assetrouter.put('/deallocate', isProtected, deallocateAsset);
assetrouter.put('/allocate', isProtected, allocateAsset);
assetrouter.put('/update/:id', isProtected, updateAsset);
assetrouter.delete("/delete/:assetId", deleteAsset);
export default assetrouter;
