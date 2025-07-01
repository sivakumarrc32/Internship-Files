const multer = require('multer');
const path =require('path');
const sharp = require('sharp');
const logger =require('../logger/logs')
exports.fileUpload = async(req, res) =>{

    try {
        if (!req.file) {
          logger.error('No file uploaded');
          return res.status(400).json({ 
            code : 400,
            message: 'No file uploaded' });
        }
    
        const inputPath = req.file.path;
        const outputFilename = 'resized-' + req.file.originalname;
        const outputPath = path.join(__dirname,"../upload",'resized', outputFilename);
    
        // Resize the image
        await sharp(inputPath)
          .resize(300, 300)
          .toFile(outputPath);
    
          res.status(200).json({
          message: 'Image uploaded and resized successfully',
          original: inputPath,
          resized: outputPath
        });
        logger.info(`Image uploaded and resized successfully: ${outputPath}`);
    
      } catch (error) {
        logger.error(`Image processing failed: ${error.message}`);
        return res.status(400).json({ message: 'Image processing failed' });
      }
};


exports.filesUploads =async (req, res) =>{

    try {
        if (!req.files || req.files.length === 0) {
          logger.warn('No files uploaded');
          return res.status(400).json({ message: 'No files uploaded' });
        }
    
        const resizedPaths = [];
    
        // Create an array of promises manually using forEach
        const tasks = [];
    
        req.files.forEach((file) => {
          const inputPath = file.path;
          const outputFilename = 'resized-' + file.originalname;
          const outputPath = path.join(__dirname,"../upload",'resized', outputFilename);
    
          const task = sharp(inputPath)
            .resize(800, 800)
            .toFile(outputPath)
            .then(() => {
              resizedPaths.push(outputPath);
            });
    
          tasks.push(task);
        });
    
        // Wait for all resizing tasks to complete
        await Promise.all(tasks);
    
        res.status(200).json
        ({
          code: 200,
          message: 'image uploaded and resized successfully',
          resizedImages: resizedPaths
        });
        logger.info(`Images uploaded and resized successfully: ${resizedPaths.join(', ')}`);
    
      } catch (error) {
        logger.error(`Image processing failed: ${error.message}`);
        return res.status(500).json({ message: 'Image processing failed' });
      }
}

exports.uploadProfileImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      logger.warn('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const outputFilename = 'profile-' + Date.now() + path.extname(file.originalname);
    const outputPath = path.join("upload",'profile', outputFilename);

    // Resize and save
    await sharp(file.path)
      .resize(300, 300)
      .toFile(outputPath);

    res.status(200).json
    ({
      code: 200,
      message: 'Profile image uploaded successfully!',
      imageUrl: `http://localhost:3000/${outputPath}` 
    });

  } catch (err) {
    logger.error(`Profile image processing failed: ${err.message}`);
    console.error(err);
    return res.status(500).json({ message: 'Image processing failed' });
  }
};
