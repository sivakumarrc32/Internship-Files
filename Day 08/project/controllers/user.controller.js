const User = require('../models/user.model');

module.exports = ({ logger }) => {
  return {
    updateProfilePic: async (req, res) => {
      try {
        const userId = req.user.id;
        const profilePicPath = req.file.filename;
        const profilePicUrl = `http://localhost:${process.env.PORT}/uploads/profile/${profilePicPath}`;

        await User.findByIdAndUpdate(userId, { profilePic: profilePicUrl });
        logger.info(`Profile pic updated: ${userId}`);
        res.json({ 
          code : 200, 
          message: 'Profile picture updated',    
          username: req.user.username,
          url: profilePicUrl,});
      } catch (err) {
        logger.error('Profile update failed:', err.message);
        res.status(400).json({ error: err.message });
      }
    }
  };
};
