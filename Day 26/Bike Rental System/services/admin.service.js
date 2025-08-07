const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const generator = require('generate-password');
const { sendMail } = require('../config/mail.config');


module.exports = (logger, models) => {

    const CreateAdmin = async(adminData) => {
        const {superAdminId,userName,email,secretCode,mobile,role,isVerified} = adminData;
        const { User,Session } = models;
        try{
            const superAdmin = await User.findOne({ _id: superAdminId });
            if (superAdmin.role !== 'superadmin') {
                return {
                    status: 400,
                    data: {
                        message: 'Unauthorized'
                    }
                }
            }
            if(secretCode !== process.env.ADMIN_CREATE_SECRET){
                return {
                    status: 400,
                    data: {
                        message: 'Invalid secret code, Unauthorized'
                    }
                }
            }
            const hashedPassword = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 10);
            const admin = await User.create({
                userName,
                email,
                password: hashedPassword,
                mobile,
                role,
                isVerified
            });

            const session = await Session.create({ userId: admin._id, role});
            return {
                status: 200,
                data: {
                    message: 'Admin created successfully',
                    admin
                }
            }
        }catch(e){
            logger.error(`Create Admin Error: ${e.message}`);
            return {
                status: 400,
                data: {
                    message: e.message
                }
            }      
        }
    }

    const ChangePassword = async(data,userId) => {
        const { User } = models;
        const {password,newPassword,secretCode} = data;
        try{
            const admin = await User.findOne({_id: userId});
            if(!admin){
                return {
                    status: 400,
                    data: {
                        message: 'Admin not found'
                    }
                }
            }
            if(secretCode !== process.env.ADMIN_LOGIN_SECRET){
                return {
                    status: 400,
                    data: {
                        message: 'Invalid secret code'
                    }
                }
            }

            const compareOldPassword = await bcrypt.compare(password, admin.password);
            if(!compareOldPassword){
                return {
                    status: 400,
                    data: {
                        message: 'Invalid password'
                    }
                }
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await admin.updateOne({password: hashedPassword});
            await admin.save();
            return {
                status: 200,
                data: {
                    message: 'Password changed successfully',
                    adminId: admin._id,
                    adminName: admin.userName

                }
            }
        }catch{
            logger.error(`Change Password Error: ${e.message}`);
            return {
                status: 400,
                data: {
                    message: e.message
                }
            }
        }
        
    }


    const AdminLogin = async(email,password,secretCode) => {
        const { User,Session } = models;
        try{
            if(secretCode !== process.env.ADMIN_LOGIN_SECRET){
                return {
                    status: 400,
                    data: {
                        message: 'Invalid secret code'
                    }
                }
            }

            const admin = await User.findOne({email});
            if(!admin){
                return {
                    status: 400,
                    data: {
                        message: 'Admin not found'
                    }
                }
            }

            const isPasswordMatch = await bcrypt.compare(password, admin.password);
            if(!isPasswordMatch){
                return {
                    status: 400,
                    data: {
                        message: 'Invalid password'
                    }
                }
            }

            const adminSession = await Session.findOne({userId: admin._id});
            if(!adminSession){
                return {
                    status: 400,
                    data: {
                        message: 'Admin session not found'
                    }
                }
            }

            await adminSession.updateOne({activeStatus: true, lastActive: new Date()});
            await adminSession.save();

            const token = jwt.sign({ userId: admin._id, sessionId: adminSession._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '3d' });

            if(password === process.env.DEFAULT_PASSWORD){
                return{
                    status: 200,
                    data: {
                        status: 200,
                        token,
                        redirect : `http://localhost:3000/api/admin/change-password`
                    }
                }
            }
            return {
                status: 200,
                data: {
                    status: 200,
                    adminId: admin._id,
                    adminName: admin.userName,
                    token,
                    message: 'Admin login successful'
                }
            }

        }catch(e){
            logger.error(`Admin Login Error: ${e.message}`);
            return {
                status: 400,
                data: {
                    message: e.message
                }
            }
        }
    }

    const AdminLogout = async(adminId,sessionId) => {
        const { Session } = models;
        try{
            const adminSession = await Session.findOne({_id: sessionId});
            if(!adminSession){
                return {
                    status: 400,
                    data: {
                        message: 'Admin session not found'
                    }
                }
            }
            await Session.updateOne({_id: sessionId}, {activeStatus: false});
            return {
                status: 200,
                data: {
                    status: 200,
                    adminId,
                    message: 'Admin logout successful'
                }
            }
        }catch(e){
            logger.error(`Admin Logout Error: ${e.message}`);
            return {
                status: 400,
                data: {
                    message: e.message
                }
            }
        }
    }

    const GetAllUsers = async () => {
        const { User } = models;
        try{
            const user = await User.find({ role: { $in: ['customer', 'agent'] } }).populate('city');
            if(user.length === 0){
                return { status: 400, data: {
                    status: 400,
                    message: "No Users found"
                } };
            }else{
                return { status: 200, data: {
                    status: 200,
                    message: "users",
                    user
                } };
            }
        }catch(e){
            logger.error(`Get User Error: ${e.message}`);
            return { status: 400, data: e.message }
        }
    }

    const GetAllBikes = async () => {
        const { Bike } = models;
        try{
            const bike = await Bike.find({}).populate('city plans');
            if(bike.length === 0){
                return { status: 400, data: {
                    status: 400,
                    message: "No bikes found"
                } };
            }else{
                return { status: 200, data: {
                    status: 200,
                    message: "Bikes",
                    bike
                } };
            }
        }catch(e){
            logger.error(`Get Bike Error: ${e.message}`);
            return { status: 400, data: e.message }
        }
    }

    const GetAllReviews = async () => {
        const { Review } = models;
        try{
            const review = await Review.find({}).populate('bikeId');
            if(review.length === 0){
                return { status: 400, data: {
                    status: 400,
                    message: "No reviews found"
                } };
            }else{
                return { status: 200, data: {
                    status: 200,
                    message: "Reviews",
                    review
                } };
            }
        }catch(e){
            logger.error(`Get Review Error: ${e.message}`);
            return { status: 400, data: e.message }
        }
    }

    const GetAllPlans = async () => {
        const { Plan } = models;
        try{
            const plan = await Plan.find({});
            if(plan.length === 0){
                return { status: 400, data: {
                    status: 400,
                    message: "No plans found"
                } };
            }else{
                return { status: 200, data: {
                    status: 200,
                    message: "Plans",
                    plan
                } };
            }
        }catch(e){
            logger.error(`Get Plan Error: ${e.message}`);
            return { status: 400, data: e.message }
        }
    }

    return {
        CreateAdmin,
        ChangePassword,
        AdminLogin,
        AdminLogout,
        GetAllUsers,
        GetAllBikes,
        GetAllReviews,
        GetAllPlans
    };
}
