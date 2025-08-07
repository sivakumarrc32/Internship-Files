module.exports = (logger, models,io) => {
    const messageService = require('../services/message.service')(logger, models);
    const { Message } = models;
    const getChat = async (req, res) => {
        try {
          const { receiverId } = req.params;
          const senderId = req.user;
          const messages = await messageService.getChatHistory(senderId, receiverId);
          res.status(200).json(messages);
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch messages' });
        }
      };
      
      // Create message (used by REST API, not socket)
    const sendMessage = async (req, res) => {

        try {
          const senderId = req.user;
          const { receiverId, text } = req.body;
          const media = req.files?.map(file => file.path) || [];
      
          const newMessage = await messageService.createMessage({
            senderId,
            receiverId,
            text,
            media,
            io
          });
      
          res.status(201).json(newMessage);
        } catch (error) {
          res.status(500).json({ error: error.message});
        }
      };
      
      // Mark as read
      const readMessage = async (req, res) => {
        try {
          const { messageId } = req.params;
          const currentUserProfileId = req.user; 
      
          const updated = await messageService.markMessageAsRead(messageId, currentUserProfileId);
          res.status(updated.status).json(updated.data);
        } catch (error) {
          res.status(403).json({ error: error.message || "Failed to mark as read" });
        }
      };
      
      
      return { getChat, sendMessage, readMessage };
}