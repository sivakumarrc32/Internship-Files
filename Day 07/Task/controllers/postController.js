const {Post,Comment,Like }  = require('../model/postModel')
const logger = require('../logger/logs');
exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({
        content: req.body.content,
        image: req.body.image,
        userId : req.user.id,
    });
    logger.info(`Post created successfully by user: ${req.user.id}`);

    res.json({
        message: 'Post created successfully!',
        data: post,
    });
  } catch (err) {
    logger.error(`Error creating post: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      logger.info(`Fetched all posts successfully`);
      res.json({
        code: 200,
        message: 'Get all posts',
        data: posts,
      });
    } catch (err) {
      logger.error(`Error fetching posts: ${err.message}`);
      res.status(400).json({ message: err.message });
    }
};


exports.addComment = async (req, res) => {

  try {
    const comment = await Comment.create({
      postId: req.params.postId,
      comment: req.body.comment,
      userId: req.user.id,
    });
    logger.info(`Comment added successfully by user: ${req.user.id} on post: ${req.params.postId}`);
    res.json({
        code: 200,
        message: 'Comment added successfully!',
        data: comment,
    });
  } catch (err) {
    logger.error(`Error adding comment: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
};


exports.likePost = async (req, res) => {
  let likeCount = await Like.countDocuments({ postId: req.params.postId, liked: true });
  try {
    const existingLike = await Like.findOne({ postId: req.params.postId });

    if (existingLike) {
      existingLike.liked = !existingLike.liked;
      await existingLike.save();
      return res.json(existingLike);
    }

    const like = await Like.create({ 
        code: 200,
        postId: req.params.postId,
        userId: req.user.id,
        liked: true,
     });
     logger.info(`Post liked successfully by user: ${req.user.id} on post: ${req.params.postId}`);
    res.json(like);
  } catch (err) {
    logger.error(`Error liking post: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
};


