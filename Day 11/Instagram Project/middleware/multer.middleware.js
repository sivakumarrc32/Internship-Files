// middleware/multer.middleware.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/media',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = upload;
