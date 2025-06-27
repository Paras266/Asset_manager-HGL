import { ErrorHandler} from '../utils/errorHandler.js';
import Admin from '../models/admin.model.js';
import jwt from 'jsonwebtoken';
import cloudinary from '../utils/cloudinary.js';

// utility for send token in cookie
const sendToken = (admin, statusCode, res) => {
    const token = jwt.sign({ id: admin._id , email:admin.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    
  
    // Set cookie options
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // only https in prod
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
  
    res
      .status(statusCode)
      .cookie('token', token, options)
      .json({
        success: true,
        message: 'Login successful',
        data : {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      });
  };


export const verifyAdminCode = async (req, res , next) => {
    const { registrationCode } = await req.body;

  
    if (registrationCode !== process.env.REGISTRATION_CODE) {
      return next(new ErrorHandler('Invalid Acces Code', 401));

    }

    res.status(200).json({ success: true, message: 'Code verified' });
};

// POST /api/admin/register
export const registerAdmin = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      role,
      headCode
    } = req.body;

    // Step 1: Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return next(new ErrorHandler('Admin already exists', 400));
    }

    // Step 2: Determine final role
    let finalRole = 'admin';
    if (role === 'head-admin') {
      if (headCode === process.env.HEADADMIN_CODE) {
        finalRole = 'head-admin';
      } else {
        return next(new ErrorHandler('Invalid head-admin code', 401));
      }
    }
console.log(req.file);

    // Step 3: Handle profile image upload to Cloudinary
    let profileImageUrl = "";
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "Uploads",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      profileImageUrl = result.secure_url;
    }

    // Step 4: Create new admin
    const newAdmin = new Admin({
      username,
      email,
      password,
      role: finalRole,
      profileImage: profileImageUrl
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: `Admin registered successfully as '${finalRole}'`,
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
        profileImage: newAdmin.profileImage
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
};

// POST /api/admin/login
export const loginAdmin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return next(new ErrorHandler('Email and password are required', 400));
      }
  
      const admin = await Admin.findOne({ email });
      if (!admin || !(await admin.matchPassword(password))) {
        return next(new ErrorHandler('Invalid email or password', 401));
      }
  
      sendToken(admin, 200, res);
    } catch (error) {
      next(error);
    }
  };

// GET /api/admin/logout

export const logoutAdmin = (req, res) => {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });
  
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  };

// GET /api/admin/profile
export const getAdminProfile = async (req, res, next) => {
    try {
      const admin = await Admin.findById(req.admin._id).select('-password');
  
      if (!admin) {
        return next(new ErrorHandler('Admin not found', 404));
      }
  
      res.status(200).json({
        success: true,
        data: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          profileImage : admin.profileImage
        },
      });
    } catch (error) {
      next(error);
    }
  }








