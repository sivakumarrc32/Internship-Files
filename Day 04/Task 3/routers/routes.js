const express = require('express');
const route= express.Router();
const { userSignUp, userLogin } = require('../control/controllers');
// Define a route for the home page

route.post('/signup',userSignUp); //  route.post('/signup',verify ,validation ,userLogin);
route.post('/login', userLogin); // route.post('/login',verify ,validation ,userLogin);


module.exports = route;
