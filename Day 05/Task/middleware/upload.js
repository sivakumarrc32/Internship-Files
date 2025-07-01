const multer = require('multer')
const path =require('path')
const {v4:uuidv4} = require('uuid');
const { fileFilter } = require('./uploadErrorHandle');

const fileSize = 5*1024*1024;


const storage =multer.diskStorage({
    destination: (req,file,cb)=>{
        const dir = path.join(__dirname, '../upload');
        cb(null,dir);
    },
    filename: (req,file,cb)=> {
        const ext = path.extname(file.originalname);
        const newName = `${uuidv4()}${ext}`;
        cb(null,newName)
    }
})

exports.upload = multer({
    storage: storage,
    limits:{
        fileSize: fileSize
    },
    fileFilter : fileFilter
})