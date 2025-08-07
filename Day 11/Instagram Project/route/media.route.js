
module.exports = (logger, models, io) => {
    const express = require('express');
    const upload = require('../middleware/post.middleware');
    const auth = require('../middleware/auth.middleware')(models.User);
    const controller = require('../controller/media.controller')(logger, models, io);
    const router = express.Router();

    router.post('/upload',auth, upload.array('media',10), controller.uploadMedia);

  return router;
};
