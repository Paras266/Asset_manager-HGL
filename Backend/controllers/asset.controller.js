import Asset from '../models/asset.model.js';
import { ErrorHandler } from '../utils/errorHandler.js';

// ✅ Add Asset
export const addAsset = async (req, res, next) => {
  try {
    const assetData = req.body;

    // Check for duplicate serial number
    const existingAsset = await Asset.findOne({ serialNumber: assetData.serialNumber });
    if (existingAsset) {
      return next(new ErrorHandler('Asset with this serial number already exists', 400));
    }

    const newAsset = await Asset.create(assetData);

    res.status(201).json({
      success: true,
      message: 'Asset added successfully',
      asset: newAsset,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get All Assets
export const getAllAssets = async (req, res, next) => {
  try {
    const assets = await Asset.find()
      .populate('allocatedTo', 'username email department designation')
      .populate('previousUsers', 'username email department designation');

    res.status(200).json({
      success: true,
      count: assets.length,
      assets,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get Asset by Serial Number
export const getAssetBySerialNumber = async (req, res, next) => {
  try {
    const { serialNumber } = req.body;

    if (!serialNumber) {
      return next(new ErrorHandler('Serial number is required', 400));
    }

    const asset = await Asset.findOne({ serialNumber })
      .populate('allocatedTo', 'username email designation')
      .populate('previousUsers', 'username email designation');

    if (!asset) {
      return next(new ErrorHandler('Asset not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Asset fetched successfully',
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};


export const getAvailableAssets = async (req, res, next) => {
    try {
      const assets = await Asset.find({ status: 'available' });
  
      if (assets.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No available assets found',
          data: [],
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Available assets fetched successfully',
        count: assets.length,
        data: assets,
      });
    } catch (error) {
      next(error);
    }
  };


export const getAllocatedAssets = async (req, res, next) => {
    try {
      const assets = await Asset.find({ status: 'allocated' }).populate(
        'allocatedTo',
        'username email department'
      );
  
      if (assets.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No allocated assets found',
          data: [],
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Allocated assets fetched successfully',
        count: assets.length,
        data: assets,
      });
    } catch (error) {
      next(error);
    }
  };
  

export const getRepairAssets = async (req, res, next) => {
    try {
      const assets = await Asset.find({ status: 'repair' });
  
      if (assets.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No assets under repair found',
          data: [],
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Assets under repair fetched successfully',
        count: assets.length,
        data: assets,
      });
    } catch (error) {
      next(error);
    }
  };
  

export const getDamagedAssets = async (req, res, next) => {
    try {
      const assets = await Asset.find({ status: 'damaged' });
  
      if (assets.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No damaged assets found',
          data: [],
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Damaged assets fetched successfully',
        count: assets.length,
        data: assets,
      });
    } catch (error) {
      next(error);
    }
  };
  
  


