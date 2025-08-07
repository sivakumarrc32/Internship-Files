module.exports = (logger,models) => {
    const services = require('../services/admin.service')(logger,models);

    const createAdmin = async(req,res) => {
        const adminData = req.body;
        try{
            const result = await services.CreateAdmin(adminData);
            return res.status(result.status).json(result.data);
        }catch{
            logger.error(`Create Admin Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const changePassword = async (req,res) => {
        const data = req.body;
        const {userId} = req.user;
        try{
            console.log(userId);
            const result = await services.ChangePassword(data,userId);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Change Password Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const adminLogin = async (req,res) => {
        const {email,password,secretCode} = req.body;
        try{
            const result = await services.AdminLogin(email,password,secretCode);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Admin Login Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const adminLogout = async (req,res) => {
        const {userId,sessionId} = req.user;
        try{
            const result = await services.AdminLogout(userId,sessionId);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Admin Logout Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }
    const getAllUsers = async (req,res) => {
        try{
            const result = await services.GetAllUsers();
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Get All Users Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const getAllBikes = async (req,res) => {
        try{
            const result = await services.GetAllBikes();
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Get All Bikes Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const getAllReviews = async (req,res) => {
        try{
            const result = await services.GetAllReviews();
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Get All Reviews Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const getAllPlans = async (req,res) => {
        try{
            const result = await services.GetAllPlans();
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Get All Plans Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    return {
        createAdmin,
        changePassword,
        adminLogin,
        adminLogout,
        getAllUsers,
        getAllBikes,
        getAllReviews,
        getAllPlans
    };
}