const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = ({ logger }) => {
  return {
    register: async (req, res) => {
      try {
        const { username, email, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashed });
        await newUser.save();
        logger.info(`User registered: ${username}`);
        res.status(200).json({ 
          code:200,
          message: 'User created',
          user: {
            username: newUser.username,
            email: newUser.email,
            profilePic: newUser.profilePic || null
          }
          });
      } catch (err) {
        logger.error('Registration failed:', err.message);
        res.status(400).json({ error: err.message });
      }
    },
    login: async (req, res) => {
      try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password)))
          return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id , username: user.username}, process.env.JWT_SECRET, { expiresIn: '60d' });
        user.token = token;
        await user.save();

        logger.info(`User logged in: ${username}`);
        res.json({ 
          code : 200,
          message: 'Login successful',
          user: {
            username: user.username,
            email: user.email,
            profilePic: user.profilePic || null
          },
          token : token });
      } catch (err) {
        logger.error('Login failed:', err.message);
        res.status(400).json({ error: err.message });
      }
    }
  };
};
