module.exports =(logger,models,io) => {
    const express = require('express');
    const router = express.Router();
    const upload = require('../middleware/multer.middleware');
    const auth = require('../middleware/auth.middleware')(models.User);
    const messageController = require('../controller/message.controller')(logger, models,io);

    router.get('/:receiverId',auth, messageController.getChat);


    router.post('/send', auth, upload.array('media',10), messageController.sendMessage);

    router.patch('/read/:messageId',auth, messageController.readMessage);

    return router;

}