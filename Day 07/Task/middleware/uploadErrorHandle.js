const multer = require('multer')

const limitEroor = function (err, req, res, next) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        logger.error('File too large. Max 2MB.');
        return res.status(400).json({ 
            code: 400,
            msg: 'File too large. Max 2MB.' 
        });
      }
    }else{
        logger.error(err.message);
        return res.status(400).json({
            code : 400,
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