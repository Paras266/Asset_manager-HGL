import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload folder exists
const uploadDir = "Uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =  file.originalname + "-" + Math.round(Math.random()*10);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
   
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // optional
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".xlsx" && ext !== ".xls") {
      return cb(new Error("Only Excel files are allowed"), false);
    }
    cb(null, true);
  },
});
