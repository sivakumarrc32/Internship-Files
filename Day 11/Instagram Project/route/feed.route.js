

module.exports = (logger,models) => {
    const express = require('express');
    const router = express.Router();
    const auth = require('../middleware/auth.middleware')(models.User);
    const {getFeed} = require('../controller/feed.controller')(logger, models);

    router.get('/posts', auth,getFeed);

    return router;
}