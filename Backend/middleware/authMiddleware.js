import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';
import { ApiError } from '../utils/ApiError.js';
export const isProtected = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(new ApiError('Not authorized, token missing', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) {
      return next(new ApiError('No admin found', 404));
    }
    next();
  } catch (error) {
    next(new ApiError('Invalid token', 401));
  }
};

