const mongoose = require('mongoose');



const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
    
});



const commentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    comment : String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const likeSchema = new mongoose.Schema({
    postId :{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    liked: Boolean,
});


const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Like = mongoose.model('Like', likeSchema);

module.exports = { Post, Comment, Like };