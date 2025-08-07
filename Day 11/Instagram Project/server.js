// server.js
const http = require('http');
const { Server } = require('socket.io');
const {app, models,logger} = require('./app');
const chatSocket = require('./sockets/chat.socket');
require('dotenv').config();

const server = http.createServer(app);

const io = new Server(server);




global.onlineUsers = new Map(); 
chatSocket(io, models);


const routes = require('./route')(logger, models, io);
app.use('/api',routes)


server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
