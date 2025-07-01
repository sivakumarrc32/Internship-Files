const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');


const storage = multer.memoryStorage();
const upload = multer({ storage });

const resizeImage = async (req, res, next) => {
  if (!req.file) return next()
  const filename = `post-${Date.now()}.jpeg`;
  const filepath = path.join(__dirname,'..','uploads','posts', filename);

  await sharp(req.file.buffer)
    .resize(1000, 1000)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(filepath);

  req.body.image = `/uploads/posts/${filename}`;
  next();
};

module.exports = { upload, resizeImage };
