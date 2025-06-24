import Asset from '../models/asset.model.js';
import { sendMail } from '../utils/sendMail.js';
import { ErrorHandler } from '../utils/errorHandler.js';
import User from '../models/user.model.js';
import XLSX from "xlsx";
import fs from "fs";

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
    console.error('Error adding asset:', error);
    next(error);
  }
};

// ✅ Get All Assets
export const getAllAssets = async (req, res, next) => {
  try {
    const assets = await Asset.find()
      .populate('allocatedTo', 'username email department designation')
      .populate('allocationHistory', 'username email department designation');

    res.status(200).json({
      success: true,
      count: assets.length,
      assets,
    });
  } catch (error) {
    console.log('Error fetching assets:', error);
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
      .populate({
        path: 'allocationHistory.user',
        select: 'username email designation',
      });

    if (!asset) {
      return next(new ErrorHandler('Asset not found', 404));
    }


    res.status(200).json({
      success: true,
      message: 'Asset fetched successfully',
      data: asset,
    });
  } catch (error) {
    console.log('Error fetching asset by serial number:', error);

    next(error);
  }
};


// controllers/assetController.js

export const getAvailableAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ status: "available" });
    res.status(200).json({ data: assets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch assets" });
  }
};



export const getAllocatedAssets = async (req, res, next) => {
  try {
    const assets = await Asset.find({ status: 'allocated' }).populate(
      'allocatedTo',
      'username email department contactNumber designation employeeCode'
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
export const deallocateAsset = async (req, res, next) => {
  try {
    const { userId, assetId } = req.body;

    const user = await User.findById(userId);
    const asset = await Asset.findById(assetId);

    if (!user || !asset) {
      return next(new ErrorHandler("User or Asset not found", 404));
    }

    const deallocationDate = new Date();

    // ➤ Remove from user's currentItem
    user.currentItem = user.currentItem.filter(
      (itemId) => itemId.toString() !== assetId
    );

    // ➤ Update user's assignedItems history
    const userHistoryEntry = user.assignedItems.find(
      (entry) =>
        entry.asset.toString() === assetId &&
        entry.deallocatedDate === null
    );
    if (userHistoryEntry) {
      userHistoryEntry.deallocatedDate = deallocationDate;
    }

    await user.save();

    // ➤ Update asset's allocationHistory
    const assetHistoryEntry = asset.allocationHistory.find(
      (entry) =>
        entry.user.toString() === userId &&
        entry.deallocatedDate === null
    );
    if (assetHistoryEntry) {
      assetHistoryEntry.deallocatedDate = deallocationDate;
    }

    // ➤ Update asset status
    asset.allocatedTo = null;
    asset.status = "available";
    await asset.save();

    const subject = "Asset Deallocation Notification - Haldyn Glass";
    const text = `Dear ${user.username},

An asset has been deallocated successfully .

Details:
- Device Name: ${asset.deviceName}
- Serial Number: ${asset.serialNumber}
- Model Number: ${asset.modelNumber}
- Deallocate On: ${deallocationDate.toLocaleDateString()}

Please ensure the asset is as it was time of allocation . If anything found we will contact you.

Regards,
Haldyn Glass IT Team
`;

    await sendMail(user.email, subject, text);

    res.status(200).json({
      success: true,
      message: "Asset deallocated successfully",
    });
  } catch (error) {
    console.log("Error deallocating asset:", error);
    next(error);
  }
};



export const allocateAsset = async (req, res, next) => {
  const { userId, assetId } = req.body;

  if (!userId || !assetId) {
    return res.status(400).json({ message: "User ID and Asset ID are required" });
  }

  try {
    const asset = await Asset.findById(assetId);
    const user = await User.findById(userId);

    if (!asset || !user) {
      return res.status(404).json({ message: "User or Asset not found" });
    }

    if (asset.status === "allocated") {
      return res.status(400).json({ message: "Asset is already allocated" });
    }

    const allocationDate = new Date();

    // ➤ Update Asset
    asset.status = "allocated";
    asset.allocatedTo = user._id;
    asset.allocationHistory.push({
      user: user._id,
      allocatedDate: allocationDate,
      deallocatedDate: null,
    });
    await asset.save();

    // ➤ Update User
    if (!user.currentItem.includes(asset._id)) {
      user.currentItem.push(asset._id);
    }
    user.assignedItems.push({
      asset: asset._id,
      allocatedDate: allocationDate,
      deallocatedDate: null,
    });
    await user.save();

    const subject = "Asset Allocation Notification - Haldyn Glass";
    const text = `Dear ${user.username},

An asset has been successfully assigned to you.

Details:
- Device Name: ${asset.deviceName}
- Serial Number: ${asset.serialNumber}
- Model Number: ${asset.modelNumber}
- Assigned On: ${allocationDate.toLocaleDateString()}

Please ensure the asset is used responsibly. Contact the IT department for any issues or clarifications.

Regards,
Haldyn Glass IT Team
`;

    await sendMail(user.email, subject, text);

    res.status(200).json({ message: "Asset allocated successfully" });
  } catch (error) {
    console.error("Allocation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const updateAsset = async (req, res) => {
  try {
    const assetId = req.params.id;

    // Prevent user-related fields from being updated
    const {
      allocatedTo,
      previousUsers,
      _id,
      __v,
      createdAt,
      updatedAt,
      ...updateFields
    } = req.body;

    // Update asset
    const updatedAsset = await Asset.findByIdAndUpdate(
      assetId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedAsset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    res.json({ success: true, message: 'Asset updated successfully', data: updatedAsset });
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteAsset = async (req, res) => {
  try {
    const { assetId } = req.params;

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    const userId = asset.allocatedTo;

    // If asset is allocated, we need to clean up references from the user
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        // 1. Remove asset from user's currentItem[]
        user.currentItem = user.currentItem.filter(
          (itemId) => itemId.toString() !== assetId
        );

        // 2. Set deallocatedDate in user's assignedItems[]
        user.assignedItems = user.assignedItems.map((entry) => {
          if (
            entry.asset.toString() === assetId &&
            !entry.deallocatedDate
          ) {
            return {
              ...entry.toObject(),
              deallocatedDate: new Date(),
            };
          }
          return entry;
        });

        await user.save();
      }
    }

    // 3. Update asset's allocationHistory to add deallocatedDate
    asset.allocationHistory = asset.allocationHistory.map((entry) => {
      if (
        entry.user.toString() === userId?.toString() &&
        !entry.deallocatedDate
      ) {
        return {
          ...entry.toObject(),
          deallocatedDate: new Date(),
        };
      }
      return entry;
    });

    // 4. Clear allocation info from asset before deletion
    asset.status = "available";
    asset.allocatedTo = null;

    await asset.deleteOne(); // Remove asset from DB

    return res.status(200).json({ message: "Asset deleted successfully" });
  } catch (err) {
    console.error("Error deleting asset:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

