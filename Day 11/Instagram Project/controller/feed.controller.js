module.exports = (logger, models) => {
    const { Profile, Post } = models;
  
    const getFeed = async (req, res) => {
      const userId = req.user.id;
  
      try {

        const currentUserProfile = await Profile.findOne({ user: userId });
        if (!currentUserProfile) {
          logger.error(`Current user profile not found: ${userId}`);
          return res.status(400).json({ message: 'Your profile not found' });
        }

   
        const followingIds = Array.from(currentUserProfile.following.values()).filter(f => f?.userId).map(f => f.userId.toString());


       
        const myProfileId = currentUserProfile._id.toString();
        const feedProfileIds = [...followingIds, myProfileId];
  

        const posts = await Post.find({ profile: { $in: feedProfileIds } })
          .sort({ createdAt: -1 })
          .populate({
            path: 'profile',
            select: 'userName fullName profilePic'
          })
          .limit(20);
         
        
          logger.info('Feed fetched successfully');
  
        return res.status(200).json({ feed: posts });
  
      } catch (err) {
        logger.error('Feed Error:', err.message);
        return res.status(400).json({ message: err.message });
      }
    };
  
    return { getFeed };
  };
  