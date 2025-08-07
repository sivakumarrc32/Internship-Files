module.exports = (logger,models) => {
    const services = require('../services/comment.service')(logger,models);
    const addComment =  async (req, res) => {
        try {
          const { postId } = req.params;
          const { comment } = req.body;
          const userId = req.user.id;
  
          const result = await services.addComment({
            postId,commentText: comment,userId
          });
  
          res.status(result.status).json(result.data);
        } catch (err) {
          logger.error('Add Comment Error:', err.message);
          res.status(err.status || 500).json({ message: err.message || 'Something went wrong' });
        }
    };

    const likeComment = async (req, res) => {
        const commentId = req.params.id;
        const userId = req.user._id; // assuming auth.middleware sets req.user
      
        const result = await services.likeComment({ commentId, userId });
      
        return res.status(result.status).json(result.data);
    };

    const deleteComment = async (req, res) => {
        const commentId = req.params.id;
        const userId = req.user._id;
    
        const result = await services.deleteComment(commentId, userId);
        res.status(result.status).json(result.data);
    };
    const replyComment = async (req, res) => {
        const { id: commentId } = req.params;
        const { commentText } = req.body;
        const userId = req.user._id;
      
        try {
          const result = await services.replyComment({ commentId, commentText, userId });
          res.status(result.status).json(result.data);
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
    };
    
    const likeReply = async (req, res) => {
        const { commentId, replyIndex } = req.params;
        const userId = req.user._id;
      
        try {
          const result = await services.likeReply({ commentId, replyIndex, userId });
          res.status(result.status).json(result.data);
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      };
      
      
      
    return { addComment, likeComment, deleteComment, replyComment, likeReply };
}
  