export class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
  
      // Capture stack trace excluding constructor call
      Error.captureStackTrace(this, this.constructor);
    }
  }
