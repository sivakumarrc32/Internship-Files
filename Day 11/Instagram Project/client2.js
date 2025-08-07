const { io } = require('socket.io-client');
const readline = require('readline');
const { decrypt } = require('./utils/crypto.util');
require('dotenv').config();

const socket = io('http://localhost:3000');

const myUserId = '6870c8dc5c83cb643ce18727'; // client1
const receiverId = '6870c8c55c83cb643ce18722'; // client2

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

socket.on('connect', () => {
  console.log('Connected as client2 (Receiver):', socket.id);
  socket.emit('addUser', myUserId);
  console.log('Type message and press Enter:');
});

rl.on('line', (input) => {
  const trimmed = input.trim();
  if (trimmed !== '') {
    socket.emit('sendMessage', {
      senderId: myUserId,
      receiverId,
      text: trimmed,
      media: []
    });
  } else {
    console.log('Cannot send empty message');
  }
});

socket.on('getMessage', (msg) => {
  try{
    if (msg.media?.length > 0) {
      const isSender = msg.sender === myUserId;
      if (isSender) {
        console.log('Sent media:', msg.media);
      } else {
        console.log('Received media:', msg.media);
      }
    }
  }catch(e){
    console.log('Error:', e.message);
  }

  if (msg.text?.iv && msg.text?.encrypted) {
    try {
      const decryptedText = decrypt(msg.text);
      const isSender = msg.sender === myUserId;
      if (isSender) {
        console.log('Sent message:', decryptedText);
      } else {
        console.log('Received text:', decryptedText);
      }
    } catch (e) {
      console.log('Decryption failed:', e.message);
    }
  }

  if (msg._id && msg.sender !== myUserId) {
    socket.emit('read', { messageId: msg._id });
  }
});
