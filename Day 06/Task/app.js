// Basic registration with a username and password using Node.js and Express.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const logger = require('./')


const app = express();
const connect = require('./Database/config');
const registerRouter = require('./routes/routes');
const uploadRouter = require('./routes/uploadRoute');
const postRouter = require('./routes/postRoutes')
const { limitEroor } = require('./middleware/uploadErrorHandle');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const folderlocation=path.join(__dirname,"uploads");
const folderlocation2=path.join(__dirname,"upload");
app.use('/uploads',express.static(folderlocation));
app.use('/upload',express.static(folderlocation2));

connect();


app.use("/", registerRouter);
app.use("/",uploadRouter);
app.use("/", postRouter);


app.use(limitEroor)



app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});