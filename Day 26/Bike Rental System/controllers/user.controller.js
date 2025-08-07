const jwt = require('jsonwebtoken');
module.exports = (logger,models) => {
    const services = require('../services/user.service')(logger,models);
    
    const userSignup = async (req,res) => {
        const {userName,email,mobile,password,role} = req.body;
        try{
            const result =await services.UserSignup(userName,mobile, email, password,role);

            return res.status(result.status).json(result.data);

        }catch(e){
            logger.error(`Signup Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }

    }

    // const agentSignup = async (req,res) => {
    //     const {email,mobile,password} = req.body;
    //     try{
    //         const result =await services.AgentSignup(mobile, email, password);

    //         return res.status(result.status).json(result.data); 

    //     }catch(e){
    //         logger.error(`Agent Signup Error: ${e.message}`);
    //         return res.status(400).json({
    //             status: 400,
    //             message: e.message,
    //         });
    //     }
    // }

    
    const userVerify = async(req,res) => {
        const {email,otp} = req.body;
        try{
            const result = await services.UserVerify(email,otp);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Verify Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const reSendOtp = async(req,res) => {
        const {mobile} = req.body;
        try{
            const result = await services.ReSendOtp(mobile);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Resend OTP Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const userLogin = async (req,res) => {
        const {email,password,role} = req.body;
        try{
            const result = await services.UserLogin(email,password,role);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Login Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }


    const forgotPassword = async (req,res) => {
        const {email} = req.body;
        try{
            const result = await services.ForgotPassword(email);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Forgot Password Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const changePassword = async (req,res) => {
        const {email,password,newPassword} = req.body;
        try{
            const result = await services.ChangePassword(email,password,newPassword);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Change Password Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const googleCallBack = async (req,res) => {
        if (!req.user) {
            return res.status(400).json({
              status: 400,
              message: 'Google Login Failed',
            });
          }
        
          const { _id, email } = req.user;
          const session = await models.Session.create({
            userId: _id,
            activeStatus: true,
            lastActive: new Date()
          });
        
          const token = jwt.sign(
            { userId: _id, sessionId: session._id, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
          );
        
          return res.status(200).json({
            status: 200,
            message: 'Google Login Successful',
            user: {
              id: _id,
              email
            },
            token
          });
    }

    const userProfile = async (req,res) => {
        const { userId } = req.user;
        try{
            const result = await services.UserProfile(userId);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Profile Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const userEditProfile = async (req,res) => {
        const updateData = req.body;
        const { userId } = req.user;
        try{
            const result = await services.UserEditProfile(userId,updateData);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Edit Profile Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const userLogout = async (req,res) => {
        const { userId, sessionId } = req.user;
        try{
            const result = await services.UserLogout(userId,sessionId);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Logout Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    return {
        userSignup,
        userVerify,
        reSendOtp,
        userLogin,
        forgotPassword,
        changePassword,
        googleCallBack,
        userProfile,
        userEditProfile,
        userLogout
    };
}