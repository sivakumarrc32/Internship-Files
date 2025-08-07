const io = require('socket.io-client');

// Example MongoDB userId
const userId = '6890b0a19c46ce669cfe4d6a';

const socket = io('http://localhost:3000', {
  query: { userId }
});

socket.on('connect', () => {
  console.log('Connected to server as:', userId);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
