const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const generator = require('generate-password');
const { sendMail } = require('../config/mail.config');
const { sendSMS } = require('../config/twilio.config');


module.exports = (logger, models) => {
    

    const generateOtp = () => {
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        return otp;
    }

    const generatePassword = () => {
        const password = generator.generate({
            length: 8,
            numbers: true,
            uppercase: true,
            lowercase: true,
            symbols: false,      
            strict: true         
          });
        return password;
    }

    

    const UserSignup =async (userName,mobile, email, password,role) => {
        const { User,Session } = models;

        const existingMobile = await User.find({mobile});
        if(!existingMobile){
            return {
                status: 400, 
                data :{
                    message: 'Mobile number already exists, please use another number'
                }
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = generateOtp();

        const user  = await User.create({
            userName,
            mobile, 
            email,
            role, 
            password : hashedPassword,
            otp,
            otpExpire: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendSMS(mobile, `Your OTP is ${otp}. This OTP is valid for 5 minutes.`);

        await sendMail(email, `OTP Verification for ${role}` , `Your OTP is ${otp}. This OTP is valid for 5 minutes.`);

        await Session.create({
            userId: user._id,
            role: user.role
        });

        return{
            status: 200,
            data: {
                userId : user._id,
                mobile,
                email,
                otp,
                message: 'Customer created successfully'
            }
        }
    }

 

    const UserVerify = async (email, otp) => {
        const { User } = models;
        try{
            const user = await User.findOne({email});
            if(!user){
                return {
                    status: 400,
                    data: {
                        message: 'User not found'
                    }
                }
            }
            const role = user.role;
            const now = new Date();
            if(user.otp !== otp || now > user.otpExpire){
                return {
                    status: 400,
                    data: {
                        message: 'Invalid OTP or OTP expired'
                    }
                }
            }
            await user.updateOne({isVerified: true, otp: null, otpExpire: null});
            await user.save();
            return {
                status: 200,
                data: {
                    userId: user._id,
                    email: user.email,
                    isVerified: true,
                    message: `${role} verified successfully`
                }
            }
           
        }catch(e){
            logger.error(`Verify Error: ${e.message}`);
            return {
                status: 400,
                data: {
                    message: e.message
                }
            }
        }
    }

    const ReSendOtp = async (mobile) => {
        const { User } = models;
        try{
            const user = await User.findOne({mobile});
            if(!user){
                return {
                    status: 400,
                    data: {
                        message: 'User not found'
                    }
                }
            }

            const otp = generateOtp();

            await sendSMS(mobile, `Your OTP is ${otp}.This OTP is valid for 5 minutes.`);
            await user.updateOne({otp, otpExpire: new Date(Date.now() + 5 * 60 * 1000)});
            await user.save();
            return {
                status: 200,
                data: {
                    userId: user._id,
                    email: user.email,
                    otp,
                    message: `OTP resent successfully to your mobile number`
                }
            }
        }catch(e){
            logger.error(`Resend OTP Error: ${e.message}`);
            return {
                status: 400,
                data: {
                    message: e.message
                }
            }
        }
    }

    const UserLogin = async (email, password, role) => {
        const { User, Session } = models;
        try {
            const user = await User.findOne({email});
            
            if(!user){
                return {
                    status: 400,
                    data: {
                        message: 'User not found'
                    }
                }
            }
            if(user.loginProvider !== 'google')
                {
                    if(!user.isVerified || user.otp !== null){
                        return {
                            status: 400,
                            data: {
                                message: 'User not verified, please verify your account'
                            }
                        }
                    }
                }

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if(!isPasswordMatch){
                return {
                    status: 400,
                    data: {
                        message: 'Invalid password'
                    }
                }
            }

            const session = await Session.findOne({userId: user._id});
            if(!session){
                return {
                    status: 400,
                    data: {
                        message: 'Session not found'
                    }
                }
            }

            let token;

            if(role === 'customer'){
                token = jwt.sign({userId: user._id,sessionId: session._id ,role: "customer"}, process.env.JWT_SECRET, {expiresIn: '3d'});
            }else if(role === 'agent'){
                token = jwt.sign({userId: user._id,sessionId: session._id,role: "agent"}, process.env.JWT_SECRET, {expiresIn: '3d'});
            }
            await session.updateOne({
                activeStatus: true,
                lastActive: new Date()
            });
            
            await session.save();

            await user.updateOne({updatedAt: new Date()});
            await user.save();
            return {
                status: 200,
                data: {
                    message: `Login successful for ${role}`,
                    user: {
                        id: user._id,
                        email: user.email,
                    },
                    token
                }
            }
        }catch(e){
            logger.error(`Login Error: ${e.message}`);
            return {
                status: 400,
                data: {
                    message: e.message
                }
            }

        }
    }


    const ForgotPassword = async (email) => {
        const { User } = models;
        try{
            const user = await User.findOne({email});
            if(!user){
                return {
                    status: 400,
                    data: {
                        message: 'User not found'
                    }
                }
            }
            const password = generatePassword();
            const hashedPassword = await bcrypt.hash(password, 10);
            await user.updateOne({password: hashedPassword});
            await user.save();
            await sendMail(email, `Password Reset for ${user.role}`, `Your new password is ${password} <br>. <b>Change Your Password as soon as possible</b>`);
            return {
                status: 200,
                data: {
                    message: `Password reset successfully to your email ${email}`
                }
            }

        }catch(e){
            logger.error(`Forgot Password Error: ${e.message}`);
            return {
                status: 400,
                data: {
                    message: e.message
                }
            }

        }
    }

    const ChangePassword = async (email,password,newPassword) => {
        const { User } = models;
        try{
            const user = await User.findOne({email})
            if(!user){
                return {
                    status: 400,
                    data: {
                        message: 'User not found'
                    }
                }
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if(!isPasswordMatch){
                return {
                    status: 400,
                    data: {
                        message: 'Invalid password'
                    }
                }
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await user.updateOne({password: hashedPassword});
            await user.save();
            return {
                status: 200,
                data: {
                    message: 'Password changed successfully'
                }
            }
        }catch(e){
            logger.error(`Change Password Error: ${e.message}`);
            return {
                status: 400,
                data: {
                    message: e.message
                }
            }

        }
    }


    const handleGoogleLogin = async (profile, models, logger) => {
        const { User, Session } = models;
        const { name, emails, id } = profile;
        const email = emails && emails[0]?.value;
        const userName = name?.givenName || email.split('@')[0];
        try{
            let user = await User.findOne({ email });
            if(!user){
                user = await User.create({ userName, email, loginProvider: 'google', isVerified: true, googleId: id , role: 'customer'});
            }

            return {
                user
            };
        }catch(e){
            logger.error(`Google Login Error: ${e.message}`);
            return {
                status: 400,
                data: {
                    message: e.message
                }
            }

        }
    } 
    

    const UserProfile = async (userId) => {
        const { User } = models;
        try{
            const user = await User.findById(userId).select('userName city email mobile address');

            if(!user){
                return {
                    status: 400,
                    data: {
                        message: 'User not found'
                    }
                }
            }
            return {
                status: 200,
                data: {
                    status: 200,
                    message: 'Profile fetched successfully',
                    user
                }
            }
        }catch(e){
            logger.error(`Profile Error: ${e.message}`);
            return {
                status: 400,
                data: {
                    
                }
            }
        }
    }

    const UserEditProfile = async (userId,updateData) => {
        const { User } = models;
        try{
            const user = await User.findById(userId);
            if(!user){
                return {
                    status: 400,
                    data: {
                        message: 'User not found'
                    }
                }
            }
            const allowedFields = ['userName', 'city', 'email', 'address'];
            const update = {}
            for(const key of allowedFields){
                if (updateData[key] !== undefined) {
                    update[key] = updateData[key];
                }
            }
            const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true }).select('userName city email mobile address');
            return {
                status: 200,
                data: {
                    status: 200,
                    message: 'Profile updated successfully',
                    updatedUser
                }
            }
        }catch(e){
            logger.error(`Edit Profile Error: ${e.message}`);
            return {
                status: 400,
                data: {
                    message: e.message
                }
            }
        }
    }

    const UserLogout = async (userId,sessionId) => {
        const { Session } = models;
        try{
            const session = await Session.findOne({userId, _id: sessionId});
            if(!session){
                return {
                    status: 400,
                    data: {
                        message: 'Session not found'
                    }
                }
            }
            await session.updateOne({activeStatus: false, lastActive: new Date()});
            await session.save();
            return {
                status: 200,
                data: {
                    status: 200,
                    userId,
                    message: 'Logout successful'
                }
            }
        }catch(e){
            logger.error(`Logout Error: ${e.message}`);
            return {
                status: 400,
                data: {
                    message: e.message
                }
            }
        }
    }

   

   

    return {
        generateOtp,
        generatePassword,
        UserSignup,
        UserVerify,
        ReSendOtp,
        UserLogin,
        ForgotPassword,
        ChangePassword,
        handleGoogleLogin,
        UserProfile,
        UserEditProfile,
        UserLogout
    }
}