const crypto = require('crypto');
require('dotenv').config();

const secret = process.env.ENCRYPT_KEY;

if (!secret || secret.length !== 32) {
  throw new Error('ENCRYPT_KEY must be exactly 32 characters long');
}

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secret), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    iv: iv.toString('hex'),
    encrypted
  };
}

function decrypt(encryptedObj) {
  if (!encryptedObj || typeof encryptedObj !== 'object' || !encryptedObj.iv || !encryptedObj.encrypted) {
    throw new Error('Invalid encrypted message format (expecting { iv, encrypted })');
  }

  const iv = Buffer.from(encryptedObj.iv, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secret), iv);

  let decrypted = decipher.update(encryptedObj.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}


module.exports = { encrypt, decrypt };
