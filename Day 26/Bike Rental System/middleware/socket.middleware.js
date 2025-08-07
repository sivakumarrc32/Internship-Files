const socketIO = require("socket.io");

module.exports = (server, models, logger) => {
  const io = socketIO(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log(`User connected: ${userId}`);

    // Set user online
    if (userId) {
      models.Session.updateOne(
        { userId },
        { $set: { activeStatus: true, lastActive: new Date() } },
        { upsert: true }
      ).catch(err => logger.error("Session update error: " + err.message));
    }

    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${userId}`);
      if (userId) {
        try {
          await models.Session.updateOne(
            { userId },
            {
              $set: {
                activeStatus: false,
                lastActive: new Date()
              }
            }
          );
        } catch (e) {
          logger.error("Disconnect update error: " + e.message);
        }
      }
    });
  });
};
