const express = require('express');
const { createPost, getAllPosts } = require('../controllers/postController');
const { upload, resizeImage } = require('../middleware/postMiddleware');
const { addComment, likePost } = require('../controllers/postController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/post', upload.single('post'),auth,resizeImage, createPost);
router.get('/post',auth, getAllPosts);
router.post('/comment/:postId',auth, addComment);
router.post('/like/:postId', auth, likePost);

module.exports = router;
