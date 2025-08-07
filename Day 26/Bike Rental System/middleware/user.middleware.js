const jwt = require('jsonwebtoken');

module.exports = (models) =>async (req, res, next) => {
  const {User, Session} = models;
  try {
    // console.log(req.headers.authorization);
    const token = req.headers.authorization?.split(' ')[1];
    // console.log(token);
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    const {userId, sessionId} = decoded;

    const user = await User.findById(userId);
    // console.log(user);
    if (!user) {
      return res.status(400).json({ message: 'User not found or Invalid token' });
    }
    
    const session = await Session.findOne({_id : sessionId});
    if(!session || session.userId.toString() !== userId || session.activeStatus === false){ 
      return res.status(400).json({ message: 'Session not found or Invalid token' }); 
    }

    const now = new Date();
    const diffInHours = (now - session.lastActive) / (1000 * 60 * 60);
    if (diffInHours > 24) {
      session.activeStatus = false;
      await session.save();
      return res.status(401).json({ message: "Session expired due to inactivity" });
    }

    await session.save();

    req.user = decoded; 
    next();
  } catch (err) {
    
    res.status(401).json({ message: 'Invalid token' });
  }
};
