const express = require('express');
const route = express.Router();
const { userSignUp, userLogin, getAllUser, getSingleUser } = require('../controllers/controllers');
const { userSignUpvalidate, userLoginvalidate } = require('../middleware/validation'); // 
const auth = require('../middleware/auth')

route.post('/signup', userSignUpvalidate, userSignUp); 
route.post('/login', userLoginvalidate, auth, userLogin);
route.get('/users',getAllUser)
route.get('/user',auth,getSingleUser) 

module.exports = route;

