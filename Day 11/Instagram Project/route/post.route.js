module.exports = (logger, models) =>{
    const express = require('express');
    const router = express.Router();
    const controller = require('../controller/post.controller')(logger, models);
    const upload = require('../middleware/post.middleware');
    const auth = require('../middleware/auth.middleware')(models.User);
    const commentController = require('../controller/comment.controller')(logger, models);

    router.post('/create',auth,upload.array('media',20), controller.createNewPost);
    router.delete('/delete/:postId',auth, controller.deletePost);
    router.post('/posts/:id/like', auth, controller.likePost);
    router.get('/post/:id', auth, controller.getSinglePost);
    router.get('/:profileId', auth, controller.getPostsByProfile);


    router.post('/:postId/comment', auth, commentController.addComment);
    router.post('/comments/:id/like', auth, commentController.likeComment);
    router.delete('/comments/:id', auth, commentController.deleteComment);
    router.post('/comments/:id/reply', auth, commentController.replyComment);
    router.post('/comments/:commentId/reply/:replyIndex/like', auth, commentController.likeReply);




    return router;
}