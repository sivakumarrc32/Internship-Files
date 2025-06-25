// Basic registration with a username and password using Node.js and Express.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const fs=require('fs');


dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.send(
        `
        <center>
            <h1>Welcome to the Registration Page</h1>
            <form method="POST" action="/register">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username"><br>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password"><br>
                <input type="submit" value="Submit">
            </form>
        </center>
        `
    );
});


app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username ||!password) {
        return res.status(400).send('Please provide both username and password');
    }

    fs.appendFile('data.txt', `Username : ${username}, Password : ${password}\n`, (err) => {
        if (err) throw err;
        console.log('User added to data.txt');
    });

    res.status(201).send('User registered successfully');
    console.log('New user registered:', users);
    console.log('Total users:', users.length);
});



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});