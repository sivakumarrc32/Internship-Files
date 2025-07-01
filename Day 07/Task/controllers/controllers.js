const { collection, loginCollection } = require("../model/model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const logger = require("../logger/logs");

//creating token for user
const createToken = (id) => {
  return jwt.sign({id}, process.env.TOKEN_SECRET, {
    expiresIn: "60d",
  });
};

exports.userSignUp = async (req, res) => {
  const data = {
    username: req.body.username,
    password: req.body.password,
  };

  //check if user already exists
  const existingUser = await collection.findOne({ username: data.username });
  if (existingUser) {
    logger.warn(`User already exists: ${data.username}`);
    return res.status(400).json({
      code: 400,
      message: "User already exists",
    });
  } else {
    const newUser = new collection(data);
    await newUser.save();
    logger.info(`New user registered: ${data.username}`);
    res.status(200).json({
      code: 200,
      user: newUser._id,
      message: "User registered successfully",
    });
    console.log(newUser);
  }
};

exports.userLogin = async (req, res) => {
  const data = {
    username: req.body.username,
    password: req.body.password,
  };

  try {
    const user = await collection.findOne({ username: data.username });

    if (!user) {
      logger.warn(`Login attempt failed: User not found - ${data.username}`);
      return res.status(400).json({ code: 400, message: "User Not Found" });
    }

    const match = await bcrypt.compare(data.password, user.password);

    if (!match) {
      logger.error(
        `Login attempt failed: Wrong password for user - ${data.username}`
      );
      return res.status(400).json({ code: 400, message: "Wrong password" });
    }

    const token = createToken(user._id);
    const logindata = await loginCollection.create({
      username: data.username,
      token: token,
    });
    logger.info(`User logged in successfully: ${data.username}`);
    res.status(200).json({
      code: 200,
      message: "Login successful",
      data: logindata,
    });
  } catch (error) {
    logger.error(`Login attempt failed: ${error.message}`);
    res.status(400).json({ code: 400, message: "Login Unsuccessful" });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const Users = await collection.find({});
    logger.info("Fetched all registered users");
    res.status(200).json({
      code: 200,
      message: "Get All Registered Users",
      Data: Users,
    });
  } catch {
    logger.error("Failed to fetch all registered users");
    return res.status(400).json({
      code: 400,
      message: "cannot get all users",
    });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const userName = req.body.username;

    const User = await collection.find({ username: userName }).select("-token");
    console.log(User);
    if (!User) {
      logger.warn(`User not found: ${userName}`);
      return res.status(400).json({
        code: 400,
        message: "User Not Found",
      });
    }
    logger.info(`Fetched single user: ${userName}`);
    res.status(200).json({
      code: 200,
      message: "Single USer",
      Data: User,
    });
  } catch {
    logger.error("Failed to fetch single user");
    return res.status(400).json({
      code: 400,
      message: "Cannot Get Single User",
    });
  }
};
