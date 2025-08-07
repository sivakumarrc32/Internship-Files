module.exports = (logger, models) => {
    const services = require('../services/post.service')(logger, models);

    const createNewPost = async (req, res) => {
        const userId = req.user.id;
        
      
        const result = await services.createPost(userId, req.body, req.files, models);
        return res.status(result.status).json(result.data);
      };
    
    const deletePost = async (req, res) => {
        const userId = req.user.id;
        const { postId } = req.params;
      
        const result = await services.deletePost(userId, postId);
        return res.status(result.status).json(result.data);
    };

    const getSinglePost = async (req, res) => {                                                                                                                                                             
        const userId = req.user.id; 
        const postId = req.params.id;
    
        const result = await services.getSinglePost(postId, userId);
        return res.status(result.status).json(result.data);
    };

    const getPostsByProfile = async (req, res) => {
        const targetProfileId = req.params.profileId;
        const currentUserId = req.user.id;
      
        const result = await services.getPostsByProfile(targetProfileId, currentUserId);
        return res.status(result.status).json(result.data);
      };

    
      const likePost = async (req, res) => {
        const postId = req.params.id;
        const userId = req.user._id; 
      
        const result = await services.likePost({ postId, userId });
      
        return res.status(result.status).json(result.data);
      };
      
      

    return { createNewPost, deletePost, getSinglePost, getPostsByProfile, likePost };
}