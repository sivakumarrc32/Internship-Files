const fs = require('fs');
const path = require('path');
const { encrypt } = require('../utils/crypto.util'); // 

module.exports = (logger, models, io) => {
  const uploadMedia = async (req, res) => {
    try {
      const { receiverId, text } = req.body;
      const senderId = req.user;

      const sendid = await models.Profile.findOne({ user: senderId });

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const mediaPaths = [];

      for (const file of req.files) {
        const fileName = `media-${Date.now()}-${file.originalname}`;
        const savePath = path.join(__dirname, '..', 'uploads', 'media', fileName);

        fs.mkdirSync(path.dirname(savePath), { recursive: true });
        fs.writeFileSync(savePath, file.buffer);

        mediaPaths.push(`http://localhost:3000/uploads/media/${fileName}`);
      }

      if (text && text.trim()) {
        encryptedText = encrypt(text.trim());
      }

      const message = {
        sender: sendid._id,
        receiver: receiverId,
        text: encryptedText,      
        media: mediaPaths,
      };

      // Save to DB
      const savedMessage = await models.Message.create(message);

      const receiverSocket = global.onlineUsers?.get(receiverId);

      if (receiverSocket && io?.to) {
        io.to(receiverSocket).emit('getMessage', savedMessage); // send full message
      } else {
        console.log('Receiver not online or socket not mapped yet');
      }

      res.status(200).json({
        status: 200,
        message: 'Media uploaded successfully',
        text: encryptedText,
        mediaPaths
      });
    } catch (err) {
      res.status(400).json({ error: 'Upload failed', message: err.message });
    }
  };

  return { uploadMedia };
};
