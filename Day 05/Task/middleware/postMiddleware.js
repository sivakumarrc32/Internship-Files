const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Ensure folder exists
const uploadPath = path.join(__dirname, '../uploads/posts');
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.memoryStorage();
const upload = multer({ storage });

const resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  const filename = `post-${Date.now()}.jpeg`;
  const filepath = path.join(uploadPath, filename);

  await sharp(req.file.buffer)
    .resize(800, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(filepath);

  req.body.image = `/uploads/posts/${filename}`;
  next();
};

module.exports = { upload, resizeImage };
