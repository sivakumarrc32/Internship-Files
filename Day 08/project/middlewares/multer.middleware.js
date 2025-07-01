const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const processProfileImage = async (req, res, next) => {
  if (!req.file) return next();

  const filename = `${Date.now()}.jpg`;
  const outputPath = path.join(__dirname, '../uploads/profile/', filename);

  await sharp(req.file.buffer)
    .resize(400, 400)
    .jpeg({ quality: 90 })
    .toFile(outputPath);

  req.file.filename = filename;
  next();
};

module.exports = { upload, processProfileImage };
