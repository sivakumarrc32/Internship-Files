const express = require('express');

module.exports = (models,logger, validate,schemas,authMiddleware,uploadMiddleware) => {
  const router = express.Router();
  const controller = require('../controllers/auth.controller')(models, logger);

  router.post('/register', validate(schemas.registerSchema), controller.register);
  router.post('/login', validate(schemas.loginSchema), controller.login);
  router.get('/users',authMiddleware ,controller.getUsers);
  router.post('/upload',authMiddleware,uploadMiddleware.upload.single('image'),uploadMiddleware.processImage,controller.uploadProfile
);


  return router;
};