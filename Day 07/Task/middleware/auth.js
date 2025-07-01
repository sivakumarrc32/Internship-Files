const jwt = require("jsonwebtoken");
require('../controllers/controllers');
const logger = require("../logger/logs");

module.exports = (req, res, next) => {
  const token = req.header("Authorization") ?.split(" ")[1];
  if (!token) 
  {
    res.status(400).json({ 
      code : 400,
      message: "Access Denied" 
    });
    return logger.error("Access Denied: No token provided");
  }
  try {
    const verified = jwt.verify(token,process.env.TOKEN_SECRET);

    req.user = verified;
    console.log(verified);
    logger.info(`Token verified successfully - User Id : ${req.user.id}`);
    next();
  } catch (err) {
    logger.error(`Token verification failed: ${err.message}`);
    return res.status(400).json({ 
        code : 400,
        message: err.message });
  }
};
