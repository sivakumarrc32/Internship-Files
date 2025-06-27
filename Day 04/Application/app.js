const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./config/connectDB');
const user = require('./routers/userRouter');

dotenv.config({path:path.join(__dirname,'config','config.env')}); // Load environment variables from.env file

// Create an Express application instance
const app = express();

connectDB(); // Connect to MongoDB

// Define routes
app.use(express.json());
app.use('/api/v1', user);

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})