const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
module.exports = (logger, models) => {

    const getMyProfile = async (userId) => {
      const { Profile } = models;
      try {
        const profile = await Profile.findOne({ user: userId });
        if (!profile) {
          logger.error(`Profile not found: ${userId}`);
          return {
            status: 400,
            data: { message: 'Profile not found' },
          };
        }
        logger.info(`Profile found: ${userId}`);
        return {
          status: 200,
          message: 'Profile found',
          data: { profile },
        };
      } catch (err) {
        logger.error('Service Error:', err);
        throw err;
      }
    }

    const getProfileByUsername = async ( username, userId) => {
      const { Profile } = models;
      try {
        const profile = await Profile.findOne({ userName: username })
        if (!profile) {
          logger.error(`Username not found: ${username}`);
          return {
            status: 400,
            data: { message: 'Username Not Found' },
          };
        }

        const visitor = await Profile.findOne({ user: userId });

        logger.info(`Username found: ${username}`);

        return {
          status: 200,
          message: 'Profile found',
          visitor: visitor.userName,
          data: { profile },
        };
  
      } catch (err) {
        logger.error('Service Error:', err);
        throw err;
      }
    }
    const updateProfile = async (profileId, updateData, file) => {
        const { Profile } = models;
        try {
          const allowedFields = ['name', 'userName', 'bio', 'accountType', 'links', 'gender', 'DOB'];
          const updates = {};
      
          for (const key of allowedFields) {
            if (updateData[key] !== undefined) {
              updates[key] = updateData[key];
            }
          }
      
          if (Object.keys(updates).length === 0) {
            logger.error('No fields to update');
            return { status : 400,data: { message: 'No fields to update' } };
          }

          if (file) {
            
            const fileName = `${profileId}-${Date.now()}.jpeg`;
            const filePath = path.join(__dirname, '..', 'uploads','profiles', fileName);
      
            // Create uploads folder if not exists
            fs.mkdirSync(path.join(__dirname, '..', 'uploads', 'profiles'), { recursive: true });
      
            await sharp(file.buffer)
              .resize(500, 500)
              .jpeg({ quality: 90 })
              .toFile(filePath);
      
            updates.profilePic = {
              url: `${process.env.BASE_URL}/uploads/profiles/${fileName}`, 
            };
          }
      
          const updated = await Profile.findOneAndUpdate({user: profileId}, updates, {
            new: true,
            runValidators: true,
          });
      
          if (!updated) {
            logger.error('Profile not found');
            return { data: { message: 'Profile not found' } };
          }
      
          return { status : 200,data: { message: 'Profile updated successfully', profile: updated } };
        } catch (err) {
          logger.error('Update Service Error:', err.message);
          return {message : err.message}
        }
    };
    const Follow = async (userId, username) => {
        const { Profile } = models;
    try {
      const targetProfile = await Profile.findOne({ userName: username }).select('+request');;

      if (!targetProfile) {
        logger.error(`Target profile not found: ${username}`);
        return { status: 400, data: { message: 'Target profile not found' } };
      }

      const currentProfile = await Profile.findOne({ user: userId });

      if (targetProfile.userName === currentProfile.userName) {
        logger.error('You cannot follow yourself');
        return { status: 400, data: { message: 'You cannot follow yourself' }};
      }
    
      if (!currentProfile) {
        logger.error(`Current user profile not found: ${userId}`);
        return { status: 400, data: { message: 'Your profile not found' } };
      }

      const targetId = targetProfile._id.toString();
      const currentId = currentProfile._id.toString();

      const isFollowing = currentProfile.following.has(targetId);
      if (isFollowing) {
        currentProfile.following.delete(targetId);
        targetProfile.follower.delete(currentId);

        await currentProfile.save();
        await targetProfile.save();

        logger.info(`Unfollowed successfully: ${username}` + ' (Public account)');
        return {
          status: 200,
          data: { message: 'Unfollowed successfully (Public account)' },
        };
      }

      if (targetProfile.accountType === 'Public') {
        currentProfile.following.set(targetId, { userId: targetProfile._id });
        targetProfile.follower.set(currentId, { userId: currentProfile._id });

        await currentProfile.save();
        await targetProfile.save();

        logger.info(`Followed successfully: ${username}` + ' (Public account)');

        return {
          status: 200,
          data: { message: 'Followed successfully (Public account)' },
        };
      }

      if (!targetProfile.request.includes(currentProfile._id)) {
        logger.info(`Follow request sent: ${username}` + ' (Private account)');
        targetProfile.request.push(currentProfile._id);
        await targetProfile.save();
      }

      logger.info(`Follow request sent: ${username}` + ' (Private account)');

      return {
        status: 200,
        data: { message: 'Follow request sent (Private account)' },
      };

    } catch (err) {
      logger.error('Follow User Error:', err.message);
      return { status: 400, data: { message: err.message } };
    }
  }
  const showAllRequest = async (currentUserId) => {
    const { Profile } = models;
  
    try {
      const currentProfile = await Profile
        .findOne({ user: currentUserId })
        .select('+request')
        .populate('request', 'userName name profilePic');

  
      if (!currentProfile) {
        logger.error(`Current user profile not found: ${currentUserId}`);
        return { status: 400, data: { message: 'Your profile not found' } };
      }
  
      const requests = currentProfile.request.map(user => ({
        _id: user._id,
        name: user.name,
        userName: user.userName,
        profilePic: user.profilePic || '',
      }));

      if (requests.length === 0) {
        logger.info('No follow requests found');
        return { status: 200, data: { message: 'No follow requests found' } };
      }
  
      logger.info(`Follow requests found: ${requests.length}`);
  
      return { status: 200, data: {requests}  };

    } catch (err) {
      logger.error('Show All Request Error:', err.message);
      return { status: 400, data: { message: err.message } };
    }
  }

  const acceptRequest = async (currentUserId, requesterProfileId) => {
    const { Profile } = models;
  
    try {
      const currentProfile = await Profile
        .findOne({ user: currentUserId })
        .select('+request'); 
  
      if (!currentProfile) {
        logger.error(`Current user profile not found: ${currentUserId}`);
        return { status: 400, data: { message: 'Your profile not found' } };
      }
  
      const requesterProfile = await Profile.findById(requesterProfileId);
      if (!requesterProfile) {
        logger.error(`Requester profile not found: ${requesterProfileId}`);
        return { status: 400, data: { message: 'Requester profile not found' } };
      }
  
      const currentId = currentProfile._id.toString();
      const requesterId = requesterProfile._id.toString();
  
      
      const index = currentProfile.request.findIndex(
        id => id.toString() === requesterId
      );
  
      if (index === -1) {
        logger.error('No such follow request');
        return { status: 400, data: { message: 'No such follow request' } };
      }
  
      currentProfile.follower.set(requesterId, { userId: requesterProfile._id });
      requesterProfile.following.set(currentId, { userId: currentProfile._id });
  
      currentProfile.request.splice(index, 1);
  
      await currentProfile.save();
      await requesterProfile.save();
  
      logger.info(`Follow request accepted: ${requesterProfile.userName}`);
  
      return {
        status: 200,
        data: { message: 'Follow request accepted' },
      };
  
    } catch (err) {
      logger.error('Accept Request Error:', err.message);
      return { status: 500, data: { message: 'Something went wrong' } };
    }
  };
  
  const showAllFollowers = async (username, requesterId) => {
    const { Profile } = models;
  
    try {
      const targetProfile = await Profile.findOne({ userName: username });
  
      if (!targetProfile) {
        logger.error(`Username not found: ${username}`);
        return {
          status: 400,
          data: { message: 'Username not found' },
        };
      }

      const requestId = await Profile.findOne({ user: requesterId });
   
      const request = requestId._id.toString();
  
  
      const isOwner = targetProfile.user.toString() === requesterId;
  
      const isFollower = targetProfile.follower.has(request);
  
      const isPublic = targetProfile.accountType === 'Public';
  
      if (!isPublic && !isOwner && !isFollower) {
        logger.error(`Access denied: ${username}`);
        return {
          status: 400,
          data: { message: 'This account is private. Access denied.' },
        };
      }
  
      const followersIds = Array.from(targetProfile.follower.values()).map(f => f.userId.toString());
  
      const followers = await Profile.find({ _id: { $in: followersIds } }).select(
        'userName name profilePic'
      );

      if (followers.length === 0) {
        logger.info('No followers found');
        return { status: 200, data: { message: 'No followers found' } };
      }
  
      logger.info(`Followers found: ${followers.length}`);
  
      return {
        status: 200,
        data: {
          count: followers.length,
          followers,
        },
      };
  
    } catch (err) {
      logger.error('Show Followers Error:', err.message);
      return { status: 400, data: { message: err.message } };
    }
  };
  
  const showAllFollowing = async (username, requesterId) => {
    const { Profile } = models;
  
    try {
      const targetProfile = await Profile.findOne({ userName: username });
  
      if (!targetProfile) {

        logger.error(`Username not found: ${username}`);
        return {
          status: 400,
          data: { message: 'Username not found' },
        };
      }

      const requestId = await Profile.findOne({ user: requesterId });
   
      const request = requestId._id.toString();
  
      const isOwner = targetProfile.user.toString() === requesterId;
  
      const isFollower = targetProfile.follower.has(request);
  
      const isPublic = targetProfile.accountType === 'Public';
  
      if (!isPublic && !isOwner && !isFollower) {
        logger.error(`Access denied: ${username}`);
        return {
          status: 400,
          data: { message: 'This account is private. Access denied.' },
        };
      }
  
      const followingIds = Array.from(targetProfile.following.values()).map(f => f.userId.toString());
  
      const following = await Profile.find({ _id: { $in: followingIds } }).select(
        'userName name profilePic'
      );
  
      if (following.length === 0) {
        logger.info('No following found');
        return { status: 200, data: { message: 'No following found' } };
      }
  
      logger.info(`Following found: ${following.length}`);
  
      return {
        status: 200,
        data: {
          count: following.length,
          following,
        },
      };
    } catch (err) {
      logger.error('Show Following Error:', err.message);
      return { status: 400, data: { message: err.message } };
    }
  }  

  
  return {
    getMyProfile,
    getProfileByUsername,
    updateProfile,
    Follow,
    showAllRequest,
    acceptRequest,
    showAllFollowers,
    showAllFollowing,
  };
  };
  