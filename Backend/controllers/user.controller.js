import User from '../models/user.model.js';
import { ErrorHandler } from '../utils/errorHandler.js';

// @desc    Add a new user (Head Admin only)
// @route   POST /api/users
// @access  Protected (Head Admin)
export const addUser = async (req, res, next) => {
  try {
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
      address,
      contactNumber,
      reportingPerson,
    } = req.body;

    // Check if email or employeeCode already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { employeeCode }],
    });

    if (existingUser) {
      return next(new ErrorHandler('User with same email or employee code already exists', 409));
    }

    // Create new user (no asset assigned here)
    const user = await User.create({
      username,
      email,
      department,
      employeeCode,
      designation,
      roleInCompany,
      dateOfJoining,
      dateOfBirth,
      location,
      address,
      contactNumber,
      reportingPerson,
    });

    res.status(201).json({
      success: true,
      message: 'User added successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};
