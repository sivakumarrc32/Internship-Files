const express = require('express');
const userController = require('../controllers/user.controller');

module.exports = ({ logger, auth, multer }) => {
  const router = express.Router();
  const controller = userController({ logger });

  router.post(
    '/upload-profile',
    auth,
    multer.upload.single('profile'),
    multer.processProfileImage,
    controller.updateProfilePic
  );

  return router;
};
