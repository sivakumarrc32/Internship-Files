const sharp = require('sharp');
const path = require('path');
const fs = require('fs');


module.exports = (logger, models) => {
  const createPost = async (userId, body, files, models) => {
    const { Profile, Plan, Post, TempPost } = models;
  
    try {
      const profile = await Profile.findOne({ user: userId }).populate('planName');
      if (!profile) {
        return { status: 400, data: { message: 'Profile not found' } };
      }
  
      // Check if media uploaded
      if (!files || files.length === 0) {
        return { status: 400, data: { message: 'No media uploaded' } };
      }
  
      // Upload folder
      const uploadDir = path.join(__dirname, '..', 'uploads', 'posts');
      fs.mkdirSync(uploadDir, { recursive: true });
  
      const mediaData = [];
  
      for (const file of files) {
        const ext = file.mimetype.startsWith('image/') ? '.jpg' : path.extname(file.originalname);
        const fileName = `${Date.now()}-${Math.random().toString(36)}${ext}`;
        const filePath = path.join(uploadDir, fileName);
  
        if (file.mimetype.startsWith('image/')) {
          await sharp(file.buffer).jpeg({ quality: 90 }).toFile(filePath);
        } else if (file.mimetype.startsWith('video/')) {
          fs.writeFileSync(filePath, file.buffer);
        } else {
          continue;
        }
  
        mediaData.push({
          url: `${process.env.BASE_URL}/uploads/posts/${fileName}`,
          type: file.mimetype.startsWith('video/') ? 'video' : 'image'
        });
      }
  
      const now = new Date();
  
      
  if (!profile ||
    !profile.planName ||
    profile.planName === 'Free' ||
    new Date(profile.planEndDate) < now) {
        // Save to TempPost
        const tempPost = await TempPost.create({
          user: profile.user,
          profile: profile._id,
          caption: body.caption || '',
          hashtags: body.hashtags || [],
          media: mediaData,
        });
  
        return {
          status: 200,
          data: {
            message: 'Plan not active. Post saved temporarily. Complete payment to publish.',
            tempPostId: tempPost._id,
            redirectUrl: `${process.env.BASE_URL}/api/payment/choose-plan?tempPostId=${tempPost._id}`
          }
        };
      }
      // Save to Post
      const post = await Post.create({
        user: profile.user,
        profile: profile._id,
        caption: body.caption || '',
        hashtags: body.hashtags || [],
        media: mediaData,
      });
  
      return {
        status: 200,
        data: {
          message: 'Post created successfully',
          postId: post._id,
          caption: post.caption,
          hashtags: post.hashtags,
          userName: profile.userName,
          mediaUrls: post.media.map(m => m.url)

        }
      };
  
    } catch (err) {
      return { status: 500, data: { message: 'Server error: ' + err.message } };
    }
  };
  const deletePost = async (userId, postId) => {
    const { Post } = models;
  
    try {
      const post = await Post.findById(postId);

  
      if (!post) {
        logger.error(`Post not found: ${postId}`);
        return { status: 400, data: { message: 'Post Not Found' } };
      }
  
      if (post.user.toString() !== userId) {
        logger.error('Access Denied for this post deletion');
        return { status: 400, data: { message: 'Access Denied for this post deletion' } };
      }
  
      await post.deleteOne();

      logger.info('Post Deleted Successfully');
  
      return {
        status: 200,
        data: { message: 'Post Deleted Successfully' }
      };
  
    } catch (err) {
      logger.error('Delete Post Error:', err.message);
      return {
        status: 400,
        data: { message: err.message }
      };
    }
  };
  
  const getSinglePost = async (postId, UserId) => {
    const { Post, Profile } = models;
  
    try {
      const post = await Post.findById(postId).populate({
        path: 'user',
        select: 'userName fullName'
      });
      if (!post) {
        logger.error(`Post not found: ${postId}`);
        return { status: 400, data: { message: 'Post not found' } };
      }
  
      const postedUser = await Profile.findOne({ user: post.user });
      if (!postedUser) {
        logger.error(`Profile not found: ${post.user}`);
        return { status: 400, data: { message: 'Profile not found' } };
      }
  
      const currentUser = await Profile.findOne({ user: UserId });
  
      if (!currentUser) {
        logger.error(`Profile not found: ${UserId}`);
        return { status: 400, data: { message: 'Your profile not found' } };
      }
  
      if (postedUser.accountType === 'Private') {
        const isOwner = currentUser._id.equals(postedUser._id);

        const isFollower = postedUser.follower.has(currentUser._id.toString());
   
  
        if (!isOwner && !isFollower) {
          logger.error('This account is private');
          return { status: 400, data: { message: 'This account is private' } };
        }
      }
  
      return { status: 200, data: { post } };
    } catch (err) {
      logger.error('Get Post Error:', err.message);
      return { status: 400, data: { message: err.message } };
    }
  };
  const getPostsByProfile = async (postedProfileId, UserId) => {
    const { Post, Profile } = models;
  
    try {
      const postedProfile = await Profile.findById(postedProfileId);
      if (!postedProfile) {
        logger.error(`Target profile not found: ${postedProfileId}`);
        return { status: 400, data: { message: 'Target profile not found' } };
      }
  
      const currentUser = await Profile.findOne({ user: UserId });

      if (!currentUser) {
        logger.error(`Profile not found: ${UserId}`);
        return { status: 400, data: { message: 'Your profile not found' } };
      }
  
      if (postedProfile.accountType === 'Private') {
        const isOwner = currentUser._id.equals(postedProfile._id);
        const isFollower = postedProfile.follower.has(currentUser._id.toString());
   
  
        if (!isOwner && !isFollower) {
          logger.error('This account is private');
          return { status: 400, data: { message: 'This account is private' } };
        }
      }
  
      const posts = await Post.find({ user: postedProfile.user })
        .sort({ createdAt: -1 })
        .populate('user', 'userName fullName');

      logger.info('Posts fetched successfully');
  
      return { status: 200, data: { posts } };
  
    } catch (err) {
      logger.error('Get Posts By Profile Error:', err.message);
      return { status: 400, data: { message: err.message } };
    }
  };
  

      const likePost = async ({ postId, userId }) => {
        const { Post, Profile } = models;
        try {
          const post = await Post.findById(postId);
          if (!post) {
            logger.error(`Post not found: ${postId}`);
            return { status: 400, data: { message: 'post not found' } };
          }

          const postProfile = await Profile.findOne({ user: post.user });
          if (!postProfile) {
            logger.error(`Profile not found: ${post.user}`);
            return { status: 400, data: { message: 'Profile not found' } };
          }
      
          const currentUserProfile = await Profile.findOne({ user: userId });
          if (!currentUserProfile) {
            logger.error(`Current user profile not found: ${userId}`);
            return { status: 400, data: { message: 'Your profile not found' } };
          }

          if (postProfile.accountType === 'Private') {
            const isOwner = currentUserProfile._id.equals(post.user._id);

            const isFollower = postProfile.follower.has(currentUserProfile._id.toString());

      
            if (!isOwner && !isFollower) {
              logger.error('This account is private');
              return { status: 400, data: { message: 'This account is private' } };
            }
          }


      
          const alreadyLiked = post.likes.includes(currentUserProfile._id);
      
          if (alreadyLiked) {
            logger.info('Post Like Removed');
            post.likes.pull(currentUserProfile._id); // remove
          } else {
            logger.info('Post liked');
            post.likes.push(currentUserProfile._id); // add
          }
      
          await post.save();

          logger.info('Post liked successfully');
      
          return {
            status: 200,
            data: {
              message: alreadyLiked ? 'Unliked' : 'Liked',
              likesCount: post.likes.length,
              postId: post._id
            }
          };
      
        } catch (err) {
          logger.error('Like Post Error:', err.message);
          return { status: 500, data: { message: err.message } };
        }
      };
  
  return { createPost, deletePost, getSinglePost, getPostsByProfile, likePost };
};
