// middleware/post.middleware.js
const multer = require('multer');

const storage = multer.memoryStorage();

const postUpload = multer({
    storage: storage,
    fileFilter(req, file, cb) {
        if (
            file.mimetype.startsWith('image/') ||
            file.mimetype.startsWith('video/')
        ) {
            cb(null, true);
        } else {
            cb(new Error('Please upload an image or video file'));
        }
    }
});

module.exports = postUpload;
