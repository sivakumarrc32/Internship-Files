const { encrypt, decrypt } = require('../utils/crypto.util');
module.exports = (logger, models) => {
    const { Message, Profile } = models;
    const getChatHistory = async (senderId, receiverId) => {

        const sendId = await Profile.find({user : senderId});
        return await Message.find({
          $or: [
            { sender: sendId, receiver: receiverId },
            { sender: receiverId, receiver: sendId }
          ]
        }).sort({ createdAt: 1 });
      };
      
      const createMessage = async ({ senderId, receiverId, text, media,io }) => {

        if (text && text.trim()) {
          text = encrypt(text.trim());
        }
        
        const sendId = await Profile.findOne({user : senderId});
        const message = await Message.create({
          sender: sendId._id,
          receiver: receiverId,
          text
        });

        const decryptedMessage = {
          ...message.toObject(),
          text: decrypt(text)
        };
      
        const receiverSocket = global.onlineUsers.get(receiverId.toString());
        const senderSocket = global.onlineUsers.get(sendId._id.toString());
      
        if (receiverSocket) {
          io.to(receiverSocket).emit('getMessage', decryptedMessage);
        }
        if (senderSocket) {
          io.to(senderSocket).emit('getMessage', decryptedMessage);
        }

        return message;
      };
      
      // Mark message as read
      const markMessageAsRead = async (messageId, currentUserId) => {
        try {
          const message = await Message.findById(messageId);
      
          if (!message) {
            logger.error('Message not found');
            return { status: 400, data: { message: 'Message not found' } };
          }
      
          const profile = await Profile.findOne({ user: currentUserId });
      
          if (!profile) {
            logger.error('Profile not found for the current user');
            return { status: 400, data: { message: 'Profile not found for the current user' } };
          }
      
          if (message.receiver.toString() !== profile._id.toString()) {
            logger.error('You are not the receiver of this message');
            return { status: 403, data: { message: 'You are not the receiver of this message' } };
          }
      
          const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            { read: true },
            { new: true }
          );
      
          return { status: 200, data: updatedMessage }; 
        } catch (e) {
          logger.error("Error in markMessageAsRead", e);
          return { status: 500, data: { message: e.message } };
        }
      };
      
      
      
      
      return { getChatHistory, createMessage, markMessageAsRead };      
}