const express = require('express');

module.exports = (User,logger, validate,database,authMiddleware,uploadMiddleware) => {
  const router = express.Router();
  const controller = require('../controllers/auth.controller')(User, logger);
  const { registerSchema, loginSchema } = database;

  router.post('/register', validate(registerSchema), controller.register);
  router.post('/login', validate(loginSchema), controller.login);
  router.get('/users',authMiddleware ,controller.getUsers);
  router.post('/upload',authMiddleware,uploadMiddleware.upload.single('image'),uploadMiddleware.processImage,controller.uploadProfile
);


  return router;
};