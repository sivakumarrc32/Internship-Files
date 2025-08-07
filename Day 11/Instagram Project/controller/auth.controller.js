
module.exports = (logger, models) => {
    
    const userService = require('../services/userService')(logger, models);
  
    return {
        signup: async (req, res) => 
        {
            try {
            const userData = await userService.signup(req.body);
    
            return res.status(userData.status).json(userData);
            } catch (e) {
            logger.error(`Signup Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
            }
        },
  
        otpverify: async (req, res) => 
        {
            try {
            const { userName, otp } = req.body;
    
            if (!userName || !otp) {
                return res.status(400).json({
                status: 400,
                message: 'Username and OTP are required',
                });
            }
    
            const result = await userService.verifyOtp({ userName, otp });
    
            logger.info(`User ${userName} verified successfully`);
    
            return res.status(result.status).json({

                data: result,
            });
    
            } catch (e) {
            logger.error(`OTP Verify Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
            }
        },
        reSendOtp: async (req, res) =>{
            try {
            const { userName } = req.body;
            const result = await userService.resendOtp({ userName });
            return res.status(result.status).json({
                data: result,
            });
            } catch (e) {
            logger.error(`Resend OTP Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
            }
        },
        login: async (req, res) => 
        {
           const body = req.body;
            try {
            const  userData = await userService.login(body);
            return res.status(userData.status).json({
                data: userData,
            });
            } catch (e) {
            logger.error(`Login Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
            }
        },
        facebookCallback: async (req, res) => {
            if (!req.user) {
              logger.error('Facebook login failed');
              return res.status(400).json({ message: 'Facebook login failed' });
            }
            logger.info('User logged in successfully');
            return res.status(200).json({ message: 'User logged in successfully' });
        },
        facebookComplete: async (req, res) => {
            try {
              const result = await userService.completeSignup(req.body, models);
              logger.info('Signup completed successfully');
              return res.status(200).json({
                status: 200,
                message: 'Signup completed successfully',
                result});
            } catch (e) {
              logger.error(e.message);
              return res.status(400).json({ message: e.message });
            }
          }
    }
};