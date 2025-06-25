const express = require('express');
const route= express.Router();
const collection = require('./model');
const {registerSchema} =require('./validation');
// Define a route for the home page
route.get('/', (req, res) => {
    res.send(
        `
        <center>
            <h1>Welcome to the Registration Page</h1>
            <form method="POST" action="/register">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username"><br><br>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password"><br><br>
                <input type="submit" value="Submit">
            </form>
        </center>
        `
    );
});

route.post('/',async (req, res) => {
    const data ={
        username: req.body.username,
        password: req.body.password
    }
    //validate the data

    const result = await registerSchema.validateAsync(data)
    console.log(result);

    //check if user already exists
    const existingUser = await collection.findOne({username: data.username});
    if(existingUser){
        return res.status(409).send('User already exists');
    }else{
        const userdata =await collection.insertMany(data);
        console.log(userdata);
        res.send("User registered successfully");
    }


})

module.exports = route;
