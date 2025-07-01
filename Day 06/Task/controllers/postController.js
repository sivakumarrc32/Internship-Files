const {Post,Comment,Like }  = require('../model/postModel')
exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({
        content: req.body.content,
        userId: req.user.id.id,
        image: req.body.image
    });
    res.json({
        message: 'Post created successfully!',
        data: post,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      res.json({
        code: 200,
        message: 'Get all posts',
        data: posts,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};


exports.addComment = async (req, res) => {

  try {
    const comment = await Comment.create({
      postId: req.params.postId,
      comment: req.body.comment,
      userId: req.user.id.id,
    });
    res.json({
        code: 200,
        message: 'Comment added successfully!',
        data: comment,
    });
  } catch (err) {
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
        userId: req.user.id.id,
        liked: true,
     });
    res.json(like);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


