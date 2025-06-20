import User from '../models/user.model.js';
import Asset from '../models/asset.model.js';
import { ErrorHandler } from '../utils/errorHandler.js';

// @desc    Add a new user (Head Admin only)
// @route   POST /api/users
// @access  Protected (Head Admin)
export const addUser = async (req, res, next) => {
  try {
    const { assetId, ...userData } = req.body;
   
    // 1. Create the user
    
    const newUser = new User(userData);
    await newUser.save();
    // 2. Allocate asset if provided
    if (assetId) {
      const asset = await Asset.findById(assetId);

      if (!asset || asset.status !== "available") {
        return res.status(400).json({ message: "Asset not available for allocation" });
      }

      const allocationDate = new Date();

      // ➤ Update asset
      asset.status = "allocated";
      asset.allocatedTo = newUser._id;
      asset.allocationHistory.push({
        user: newUser._id,
        allocatedDate: allocationDate,
        deallocatedDate: null,
      });
      await asset.save();

      // ➤ Update user
      newUser.currentItem.push(asset._id); // assuming currentItem is now an array
      newUser.assignedItems.push({
        asset: asset._id,
        allocatedDate: allocationDate,
        deallocatedDate: null,
      });
      await newUser.save();
    }

    res.status(201).json({
      message: "User created and asset assigned successfully",
      user: newUser,
    });
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    
  }
}

export const getUserById = async (req, res, next) => {
  try {
    
    const { employeeCode } = req.body;

    const user = await User.findOne({ employeeCode })
      .populate("currentItem") // For current allocations
      .populate({
        path: "assignedItems.asset", // For history
        model: "Asset",
      });    
      
      console.log("=== Assigned Items ===");
console.log(user.assignedItems.map(a => ({
  assetId: a.asset?._id,
  deviceName: a.asset?.deviceName,
  model: a.asset?.modelNumber,
})));
      const asset = await Asset.find({ allocatedTo: user._id });
    
    
    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }   
    res.status(200).json({
      success: true,
      user,
      asset,
    });
  }
  catch (error) {
    console.log('Error fetching user by ID:', error);
    
    console.error('Error fetching user:', error);
    next(error);
  }
}

// backend/controllers/userController.js
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

