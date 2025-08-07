module.exports = (logger, models) => {
    const { Post, Comment, Profile } = models;
    const addComment = async ({ postId, commentText, userId }) => {
        try {
          const post = await Post.findById(postId).populate({
            path: 'user',
            select: 'userName fullName'
          });
    
          if (!post) {
            logger.error(`Post not found: ${postId}`);
            return { status: 400, data: { message: 'Post not found' } };
          }
    
          const postOwnerProfile = await Profile.findOne({ user: post.user });
          if (!postOwnerProfile) {
            logger.error(`Post owner profile not found: ${post.user}`);
            return { status: 400, data: { message: 'Post owner profile not found' } };
          }
    
    
          const currentUserProfile = await Profile.findOne({ user: userId });
          if (!currentUserProfile) {
            logger.error(`Current user profile not found: ${userId}`);
            return { status: 400, data: { message: 'Your profile not found' } };
          }
    
        
          if (postOwnerProfile.accountType === 'Private') {

            const isOwner = currentUserProfile._id.equals(postOwnerProfile._id);
            const isFollower = postOwnerProfile.follower.has(currentUserProfile._id.toString());
    
            if (!isOwner && !isFollower) {
              logger.error(`'This is a private account. You must follow to comment.`);
              return { status: 403, data: { message: 'This is a private account. You must follow to comment.' } };
            }
          }
          
          
          const newComment = new Comment({
            post: postId,
            comment: commentText,
            user: userId,
            profile: currentUserProfile._id
          });
    
          await newComment.save();

          post.comments.push(newComment._id);
          await post.save();

          logger.info('Comment added successfully');

          return { status: 200, data: { message: 'Comment added successfully', comment: newComment } };
    
        } catch (err) {
          logger.error('Add Comment Error:', err.message);
          return { status: 400, data: { message: err.message } };
        }
    };
    const likeComment = async ({ commentId, userId }) => {
        try {
          const comment = await Comment.findById(commentId);
          if (!comment) {
            logger.error(`Comment not found: ${commentId}`);
            return { status: 400, data: { message: 'Comment not found' } };
          }
      
          const currentUserProfile = await Profile.findOne({ user: userId });
          if (!currentUserProfile) {
            logger.error(`Current user profile not found: ${userId}`);
            return { status: 400, data: { message: 'Your profile not found' } };
          }
      
          const alreadyLiked = comment.likes.includes(currentUserProfile._id);
      
          if (alreadyLiked) {
            logger.info('Comment Removed');
            comment.likes.pull(currentUserProfile._id); // remove
          } else {
            logger.info('Comment liked');
            comment.likes.push(currentUserProfile._id); // add
          }
      
          await comment.save();
      
      
          return {
            status: 200,
            data: {
              message: alreadyLiked ? 'Unliked' : 'Liked',
              likesCount: comment.likes.length,
              commentId: comment._id
            }
          };
      
        } catch (err) {
          logger.error('Like Comment Error:', err.message);
          return { status: 500, data: { message: err.message } };
        }
    };
      
    const deleteComment = async (commentId, userId) => {
        try {

          const comment = await Comment.findById(commentId);
          if (!comment) {
            logger.error(`Comment not found: ${commentId}`);
            return { status: 404, data: { message: 'Comment not found' } };
          }
    
 
          const post = await Post.findById(comment.post);
          if (!post) {
            logger.error(`Post not found: ${comment.post}`);
            return { status: 404, data: { message: 'Post not found for this comment' } };
          }
    

          const isCommentOwner = comment.user.toString() === userId.toString();
          const isPostOwner = post.user.toString() === userId.toString();
    
          if (!isCommentOwner && !isPostOwner) {
            logger.error(`Not authorized to delete this comment`);
            return { status: 403, data: { message: 'Not authorized to delete this comment' } };
          }

          await Comment.findByIdAndDelete(commentId);
    
     
          await Post.findByIdAndUpdate(post._id, {
            $pull: { comments: comment._id }
          });
    
          logger.info('Comment deleted successfully');
    
          return { status: 200, data: { message: 'Comment deleted successfully' } };
        } catch (err) {
          logger.error('Delete Comment Error:', err.message);
          return { status: 500, data: { message: 'Server error while deleting comment' } };
        }
    };    
    const replyComment = async ({ commentId, commentText, userId }) => {
        const comment = await Comment.findById(commentId);
        if (!comment) {
          logger.error(`Comment not found: ${commentId}`);
          return { status: 404, data: { message: 'Comment not found' } };}
      
        const profile = await Profile.findOne({ user: userId });
      if (!profile) {
        logger.error(`Profile not found: ${userId}`);
        return { status: 404, data: { message: 'Profile not found' } };}
      
        const reply = {
          user: userId,
          profile: profile._id,
          comment: commentText,
          createdAt: new Date(),
          likes: []
        };
      
        comment.reply.push(reply);
        await comment.save();
      
        logger.info('Reply added successfully');
      
        return { status: 200, data: { reply } };
    };

    const likeReply = async ({ commentId, replyIndex, userId }) => {
        const comment = await Comment.findById(commentId);
        if (!comment) {
          logger.error(`Comment not found: ${commentId}`);
          return { status: 404, data: { message: 'Comment not found' } };
        }
        const profile = await Profile.findOne({ user: userId });
        if (!profile) {
          logger.error(`Profile not found: ${userId}`);
          return { status: 404, data: { message: 'Profile not found' } };}
      
        const reply = comment.reply[replyIndex];
        if (!reply) {
          logger.error(`Reply not found: ${replyIndex}`);
          return { status: 404, data: { message: 'Reply not found' } };}
      
        const likedIndex = reply.likes.findIndex((id) => id.toString() === profile._id.toString());
      
        if (likedIndex >= 0) {
          logger.info('Reply unliked');
          reply.likes.splice(likedIndex, 1); 
        } else {
          logger.info('Reply liked');
          reply.likes.push(profile._id); 
        }
      
        await comment.save();
      
        return { status: 200, data: { likes: reply.likes } };
      };
      
      
    
  
    return { addComment, likeComment, deleteComment, replyComment, likeReply };
};
  