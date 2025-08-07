const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const generateOtp = require('otp-generator')
require('dotenv').config();


module.exports = (logger, models) => {

  const { User, Profile } = models;

  const generateOTP = () => {
    return generateOtp.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true
    })
  };

  const signup = async ({ mobileNo, email, password, fullName, userName }) => {
    
    const existingUser = await User.findOne({ userName });

    if (existingUser) {
      return { status: 400, message: 'Username already taken' };
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 30 * 1000); 

    const user = {fullName,userName,password: hashPassword,otp,otpExpiry};

    if (mobileNo) user.mobileNo = mobileNo;

    if (email) user.email = email;
    

    const userdata = await User.create(user);

    await Profile.create({
      user : userdata._id,
      userName: userdata.userName,
      name: userdata.fullName,
    });

    logger.info('User created successfully');
    logger.info('Profile created successfully');

    return {
      status: 200,
      message: 'User created successfully',
      userName: userdata.userName,
      fullName: userdata.fullName,
      email: userdata.email || null, 
      otp,
      otpExpiry: otpExpiry,
    };
  };

const verifyOtp = async ({ userName, otp }) => {
    const user = await User.findOne({ userName });

    if (!user) return { status: 400, message: 'User not found' };
    if (user.otp !== otp)return { status: 400, message: 'Invalid OTP' };
    if (new Date(user.otpExpiry).getTime() < new Date()){
      return { status: 400, message: 'OTP expired' };
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null; 

    await user.save();

    return {
      status: 200,
      message: 'User verified successfully',
      userName: user.userName,
      fullName: user.fullName,
    };
  };

const resendOtp = async ({ userName }) => {
    const user = await User.findOne({ userName });

    if (!user) throw new Error('User not found');
    if(user.isVerified){
      return {
        status: 400,
        message: 'User already verified',
      };
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 30 * 1000); 

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    logger.info(`OTP resent for user ${userName}`);

    return {
      status: 200,
      message: 'OTP resent successfully',
      otp,
      otpExpiry: otpExpiry.toISOString(),
    };
}
const login = async (body) => {
    const { mobileNo, email, userName, password } = body;
    const User = models.User;
    try{

      let query = {};

      if (mobileNo) {
        logger.info(`User logging in with mobile number: ${mobileNo}`);
        query.mobileNo = mobileNo;
      } else if (email) {
        logger.info(`User logging in with email: ${email}`);
        query.email = email;
      } else if (userName) {
        logger.info(`User logging in with userName: ${userName}`);
        query.userName = userName;
      } else {
        logger.error('User logging in without providing mobileNo, email, or userName');  
        return { status: 400, message: 'Please provide mobileNo, email, or userName' };
      }

        const user = await User.findOne(query);
        if (!user) {
          logger.error('User not found');
          return { status: 400, message: 'User not found' };}

        if(user.loginProvider !== 'facebook' && user.otp !==null){
            logger.error('Please verify your account using OTP');
            return { status: 400, message: 'Please verify your account using OTP' };
        }
       
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.error('Invalid credentials');
            return { status: 400, message: 'Invalid credentials' };
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '60d' });

    
        user.updateAt = new Date();
        await user.save();

        logger.info(`User logged in successfully: ${user.userName}`);

        return {
            status: 200,
            message: 'User logged in successfully',
            user: {
                id: user._id,
                userName: user.userName,
                fullName: user.fullName,
                email: user.email || null,
            },
            token
        };

    }catch(e){
        return { status: 400, message: e.message };
    }
}
const handleFacebookLogin = async (profile, User, logger) => {
  const { id, displayName, emails } = profile;
  const email = emails && emails[0]?.value;

  let user = await User.findOne({ email });

  if (!user) {
    user = new User({
      fullName: displayName,
      email,
      userName: `fb_${id}`,
      loginProvider: 'facebook',
      isVerified: true
    });
    await user.save();
    const profileData = {
      user: user._id,
      userName: user.userName,
      name: user.fullName,
    };
    await Profile.create(profileData);
    logger.info(`New Facebook user created: ${user.userName}`);
  }
  return {
    id: user._id,
    userName: user.userName,
    fullName: user.fullName,
    email: user.email,
  };
};
const completeSignup = async (body, models) => {
  const { email, userName, fullName, password } = body;
  const User = models.User;
  const Profile = models.Profile;

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('User not found.');
    error.status = 400;
    throw error;
  }

  if (user.password) {
    const error = new Error('Signup already completed.');
    error.status = 400;
    throw error;
  }

  const existing = await User.findOne({ userName });
  if (existing) {
    const error = new Error('Username already taken.');
    error.status = 400;
    throw error;
  }

  user.userName = userName;
  user.fullName = fullName;
  user.password = await bcrypt.hash(password, 10);
  await user.save();

  const profile = await Profile.findOne({ user: user._id });
  if (!profile) {
    return { status: 400, message: 'Profile not found' };
  }
  profile.userName = userName;
  profile.name = fullName;
  await profile.save();



  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '60d' });

  return {
    id: user._id,
    userName: user.userName,
    fullName: user.fullName,
    email: user.email,
    token,
  };
}

  return { signup, verifyOtp,resendOtp,login, handleFacebookLogin ,completeSignup };
};
