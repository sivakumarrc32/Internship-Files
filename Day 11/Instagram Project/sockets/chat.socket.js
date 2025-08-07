const { encrypt, decrypt } = require('../utils/crypto.util');

module.exports = (io, models) => {
  const { Message } = models;
  global.onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`Connected: ${socket.id}`);

    socket.on('addUser', async (userId) => {
      global.onlineUsers.set(userId, socket.id);
      console.log('User online:', userId);
      console.log('Current online users:', Array.from(global.onlineUsers.entries()));

      const missedMessages = await Message.find({
        $or: [{ sender: userId }, { receiver: userId }]
      }).sort({ createdAt: 1 });

      for (const msg of missedMessages) {
        try {
          const decryptedText = msg.text?.iv && msg.text?.encrypted ? decrypt(msg.text) : '';
          const decryptedMsg = {
            ...msg.toObject(),
            text: decryptedText
          };

          io.to(socket.id).emit('getMessage', decryptedMsg);
        } catch (e) {
          console.warn('Skipping invalid message:', e.message);
        }
      }
    });

    socket.on('sendMessage', async (data) => {
      const { senderId, receiverId, text, media = [] } = data;

      const encryptedText = encrypt(text);

      const message = await Message.create({
        sender: senderId,
        receiver: receiverId,
        text: encryptedText,
        media
      });

      const finalMessage = message.toObject();

      const receiverSocket = global.onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit('getMessage', finalMessage);
      }

      socket.emit('getMessage', finalMessage);
    });

    socket.on('read', async ({ messageId }) => {
      await Message.findByIdAndUpdate(messageId, { read: true });
    });

    socket.on('disconnect', () => {
      for (const [key, value] of global.onlineUsers.entries()) {
        if (value === socket.id) {
          global.onlineUsers.delete(key);
          break;
        }
      }
      console.log(`🔌 Disconnected: ${socket.id}`);
    });
  });
};
