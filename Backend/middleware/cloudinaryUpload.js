import multer from 'multer';
import path from "path";

const storage = multer.memoryStorage();

const cloudinaryUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp" , ".pdf"].includes(ext)) {
      return cb(new Error("Only image and pdf files allowed"), false);
    }
    cb(null, true);
  },
});


export default cloudinaryUpload;
