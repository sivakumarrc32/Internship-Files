const multer = require('multer')

const limitEroor = function (err, req, res, next) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ msg: 'File too large. Max 2MB.' });
      }
    }else{
        return res.status(400).json({
            message : err.message
        })
    }
}

const fileFilter =(req,file,cb)=>{
    const allowedTypes = /jpeg|jpg|png/;
    const isAllowed =allowedTypes.test(file.mimetype);
    if(isAllowed){
        cb(null,true)
    }else{
        cb(new Error("Only JPEG | JPG | PNG are Allowed"),false)
    }
}

module.exports ={  fileFilter, limitEroor};