const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const processImage = async (req, res, next) => {
  if (!req.file) return next();

  const filename = `${Date.now()}.jpg`;
  // Ensure the directory exists
  const dir = path.join(__dirname, '../public/profile');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filepath = path.join(__dirname, '../public/profile', filename);

  await sharp(req.file.buffer)
    .resize(600, 600)
    .jpeg({ quality: 90 })
    .toFile(filepath);

  req.file.filename = filename;
  next();
};

module.exports = { upload, processImage };