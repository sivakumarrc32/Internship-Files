const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports = (models, logger) => (

  {
  register: async (req, res, next) => {
    const User = models.User;
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const existingUser = await User.findOne({email});
      if (existingUser) {
        return res.status(400).json({ 
          code: 400,
          message: 'User already exists',
          error: 'Email already registered' 
        });
      }
      await User.create({ username, email, password: hashedPassword });
      logger.info(`User registered: ${email}`);
      res.status(200).json({ 
        code : 200,
        message: 'User registered successfully',
        data: { username, email } 
      });
    } catch (err) {
      logger.error('Register error', err);
      return res.status(400).json({
        code: 400,
        message: 'Registration failed',
        error: err.message
      });
    }
  },
  login: async (req, res, next) => {
    const User = models.User;
    try {
      const { username, email, password } = req.body;
      const user = await User.findOne({ $or: [{ email }, { username }] });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '60d' });
      logger.info(`User logged in: ${user.email}`);
      res.json({ 
        code: 200,
        message: 'Login successful',
        user: {
          id: user._id,
          username: user.username,
        },
        token : token,
      });
    } catch (err) {
      logger.error('Login error', err.message);
      return res.status(400).json({
        code: 400,
        message: 'Login failed',
        error: err.message
      });
    }
  },
  getUsers: async (req, res, next) => { 
    const User = models.User;
    try {
      const users = await User.find({}, {username: 1,_id:1});
      res.json(users);
    } catch (err) {
      logger.error('Fetching users failed', err);
      return res.status(400).json({
        code: 400,
        message: 'Fetching users failed',
        error: err.message
      });
    }
  },
  uploadProfile: async (req, res, next) => {
    const User = models.User;
    try {
      if (!req.file) {
        return res.status(400).json({
          code: 400,
          message: 'No file uploaded',
          error: 'Please upload a profile image'
        });
      }
      const user = await User.findById(req.user.id);
      const imageUrl = `http://localhost:6262/profile/${req.file.filename}`;
      user.profileImage = imageUrl;
      await user.save();
      logger.info(`Profile image uploaded: ${user.email}`);
      res.json({ 
        code :200,
        message: 'Profile image uploaded successfully',
        user: {
          id: user._id,
          username: user.username,
        },
        imageUrl });
    } catch (err) {
      logger.error('Image upload error', err);
      return res.status(400).json({
        code: 400,
        message: 'Image upload failed',
        error: err.message
      });
    }
  }
});