const express = require('express');
const route = express.Router();
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { fileUpload, filesUploads, uploadProfileImage } = require('../controllers/uploadcontrol');


route.post('/upload/file',upload.single("image"),fileUpload); 
route.post('/upload/files',upload.array("images",10),filesUploads)
route.post("/upload/profile",upload.single("profile"),auth,uploadProfileImage)

module.exports = route;