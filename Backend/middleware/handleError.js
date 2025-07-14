// middleware/ApiError.js  (or inside your catch block)
import { ApiError } from '../utils/ApiError.js';

export const handleError = (err, req, res, next) => {
  // ------------- 1) Handle your custom errors -----------------
  console.log('Error occurred:', err);
  
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // ------------- 2) Handle Mongoose validation errors ---------
  if (err.name === 'ValidationError') {
    
    // Collect all field‑specific messages into one string
    // Create a simple, user-friendly error message for each field
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));

    return res.status(400).json({
      success: false,
      message: errors.length > 1 ? 'Validation failed' : errors[0].message,
      errors // array of { field, message }
    });
  }
  if (err.code === 11000) {
  const field = Object.keys(err.keyValue)[0];
  return res.status(400).json({
    success: false,
    message: `Duplicate value for ${field}: ${err.keyValue[field]}`,
    field: field,
  });
}


  // ------------- 3) Fallback: unknown / server error ----------
  console.error('Unhandled error:', err);
  return res.status(500).json({
    success: false,
    message: 'Server error',
  });
};

