

module.exports = (logger, models) => {

    const express = require('express');
    const router = express.Router();

    const upload = require('../middleware/profile.middleware');
    const auth = require('../middleware/auth.middleware')(models.User);
    const controller = require('../controller/profile.controller')(logger, models);


    router.get('/me',auth, controller.getMyProfile);
    router.get('/user/:username',auth,controller.getProfile );
    router.patch('/edit',auth,upload.single('profilePic'),controller.editProfile);
    router.post('/follow/:username', auth, controller.follow);
    router.get('/all-request', auth, controller.showRequest);
    router.post('/accept/:requesterId', auth, controller.followRequest);
    router.get('/:username/followers', auth, controller.showFollowers);
    router.get('/:username/followings', auth, controller.showFollowing);
    return router;
}
