const jwt = require("jsonwebtoken");
require('../controllers/controllers')

module.exports = (req, res, next) => {
  const token = req.header("Authorization") ?.split(" ")[1];
  console.log(token)
  if (!token) return res.status(400).json({ 
    code : 400,
    message: "Access Denied" });

  try {
    console.log("entry");
    const verified = jwt.verify(token,process.env.TOKEN_SECRET);
    console.log(verified)
    req.user = verified; // inject decoded data
    next();
  } catch (err) {
    return res.status(400).json({ 
        code : 400,
        message: err.message });
  }
};
