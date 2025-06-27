import User from '../models/user.model.js';
import Asset from '../models/asset.model.js';
import { ErrorHandler } from '../utils/errorHandler.js';
import { sendMail } from "../utils/sendMail.js"; // your mail utility

export const addUser = async (req, res, next) => {
  try {
    const { assetId,  ...userData } = req.body;
     const {email, employeeCode} = req.body  // here we destructer email and employeecode differetnly so we can dont lose data from userdata
    // ✅ Step 1: Check if user already exists by email or employeeCode
    const existingUser = await User.findOne({
      $or: [{ email }, { employeeCode }]
    });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email or employee code already exists" });
    }

    let asset;
    const allocationDate = new Date();

    // ✅ Step 2: If asset is provided, check availability
    if (assetId) {
      asset = await Asset.findById(assetId);
      if (!asset || asset.status !== "available") {
        return res.status(400).json({ message: "Asset not available for allocation" });
      }
    }

    // ✅ Step 3: Create user but don't save yet
    const newUser = new User(userData);

    // ✅ Step 4: If asset exists, set allocation fields
    if (asset) {
      newUser.currentItem.push(asset._id);
      newUser.assignedItems.push({
        asset: asset._id,
        allocatedDate: allocationDate,
        deallocatedDate: null
      });

      asset.status = "allocated";
      asset.allocatedTo = newUser._id; // will work after user is saved
      asset.allocationHistory.push({
        user: newUser._id,
        allocatedDate: allocationDate,
        deallocatedDate: null
      });
    }

    // ✅ Step 5: Save the user now
    await newUser.save();

    // ✅ Step 6: Save asset only if applicable
    if (asset) {
      asset.allocatedTo = newUser._id; // now user._id exists
      await asset.save();
    }


    // ✅ Step 7: Send email based on asset condition
    let subject = "";
    let text = "";

    if (asset) {
      subject = `Asset Allocated - ${asset.deviceType}`;
      text = `Dear ${newUser.username},

Your account has been created, and you have been assigned a company asset:

🔹 Device Name: ${asset.deviceName}
🔹 Type: ${asset.deviceType}
🔹 Serial Number: ${asset.serialNumber}
🔹 Allocation Date: ${allocationDate.toDateString()}

Please keep this information secure. Contact IT for any issues.

Regards,  
Haldyn Glass IT Team`;
    } else {
      subject = `Welcome to Haldyn Glass`;
      text = `Dear ${newUser.username},

Your user profile has been successfully created in our Asset Management System.

Currently, no asset has been assigned to you. You will be notified when an asset is allocated.

Regards,  
Haldyn Glass IT Team`;
    }

    // ✅ Send email
    await sendMail(newUser.email, subject, text);

    return res.status(201).json({
      success: true,
      message: "User added successfully",
      user: newUser
    });

  } catch (err) {
    console.error("Error adding user:", err);
    return res.status(500).json({ message: "Server error" });
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
    ErrorHandler(error, req, res, next);
    console.error('Error fetching users:', error);
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

