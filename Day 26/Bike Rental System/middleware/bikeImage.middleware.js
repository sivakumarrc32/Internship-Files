const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter(req,file,cb){
        if(!file.mimetype.startsWith('image/')){
            return cb(new Error('Please upload an image file'));
        }
        cb(null,true)
    }
})
module.exports = upload ;
