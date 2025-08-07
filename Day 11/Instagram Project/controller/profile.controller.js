module.exports = (logger, models) => {
    const { Profile } = models;
    const services = require('../services/profile.service')(logger, models);

    const getMyProfile = async(req, res) =>{
        const userId = req.user.id;
        try {
            const result = await services.getMyProfile(userId);
            res.status(result.status).json(result);
        }catch(e){
            logger.error(`Get Profile Error: ${e.message}`);
            res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const getProfile = async(req, res) => {
        const userId = req.user.id;
        const { username } = req.params;
        try {
            const result = await services.getProfileByUsername(username, userId);
            res.status(result.status).json(result);
        }catch(e){
            logger.error(`Get Profile Error: ${e.message}`);
            res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }
    const editProfile = async(req, res) => {
        const profileId = req.user.id;
        const updateData = req.body;
        const file = req.file;

      
        try {
          const result = await services.updateProfile(profileId, updateData, file);
          res.status(result.status).json(result);
        } catch (err) {
          logger.error('Update Error:', err);
          res.status(400).json({ status: 400, message: err.message});
        }
    }
    const follow = async (req, res) => {
        try {
            const userId = req.user.id;
            const { username } = req.params;
      
            const result = await services.Follow(userId, username);


      
            return res.status(result.status).json(result.data);
          } catch (err) {
            logger.error('Follow Controller Error:', err.message);
            return res.status(400).json({ message: 'Internal Server Error' });
          }
    }

    const showRequest = async (req, res) => {
        const currentUserId = req.user.id;

        const result = await services.showAllRequest(currentUserId);
        return res.status(result.status).json(result.data);
    }

    const followRequest = async (req, res) => {
        const { requesterId } = req.params
        const currentUserId = req.user.id;
      
        const result = await services.acceptRequest(currentUserId, requesterId);
        return res.status(result.status).json(result.data);
    };

    const showFollowers = async (req, res) => {
        const username = req.params.username;
        const requesterId = req.user.id;
      
        const result = await services.showAllFollowers(username, requesterId);
        return res.status(result.status).json(result.data);
    };
      
    const showFollowing = async (req, res) => {
        const username = req.params.username;
        const requesterId = req.user.id;
      
        const result = await services.showAllFollowing(username, requesterId);
        return res.status(result.status).json(result.data);
    }

      
    return {
        getMyProfile,
        getProfile,
        editProfile,
        follow,
        showRequest,
        followRequest,
        showFollowers,
        showFollowing,
    };
}