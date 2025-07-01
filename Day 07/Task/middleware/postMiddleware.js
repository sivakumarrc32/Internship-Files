const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const logger = require('../logger/logs'); // Assuming you have a logger setup


const storage = multer.memoryStorage();
const upload = multer({ storage });

const resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const filename = `post-${Date.now()}.jpeg`;
  const filepath = path.join(__dirname,'..','uploads','posts', filename);

  await sharp(req.file.buffer)
    .resize(1000, 1000)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(filepath);

  logger.info(`Image resized and saved to ${filepath}`);

  req.body.image = `http://localhost:3000/uploads/posts/${filename}`;
  next();
};

module.exports = { upload, resizeImage };
