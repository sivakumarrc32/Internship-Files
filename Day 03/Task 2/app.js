// Basic registration with a username and password using Node.js and Express.js
const express = require('express');
const app = express();

const connect = require('./config');
const registerRouter = require('./routes');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connect();

app.use('/', registerRouter);
app.use("/register", registerRouter);



app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});