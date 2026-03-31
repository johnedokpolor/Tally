import multer from "multer";
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only Image Files are Allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limit: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export default upload;
