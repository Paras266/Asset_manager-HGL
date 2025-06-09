import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';
import { ErrorHandler } from '../utils/errorHandler.js';

export const isProtected = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(new ErrorHandler('Not authorized, token missing', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) {
      return next(new ErrorHandler('No admin found', 404));
    }
    next();
  } catch (error) {
    next(new ErrorHandler('Invalid token', 401));
  }
};

