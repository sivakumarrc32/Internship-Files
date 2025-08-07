const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

module.exports = (logger, models) => {

    const AddLocation = async (city, address, mapLink) => {
        const { Location } = models;
        try {
            const checkLocation = await Location.findOne({ city: city , address: address});
            if (checkLocation) {
                return { status: 400, data:{messsage : "Location already exists"} }
            }
            const location = await Location.create({
                city: city,
                address: address,
                mapLink: mapLink
            })
            return { status: 200, data: location }
        } catch (e) {
            logger.error(`Add Location Error: ${e.message}`);
            return { status: 400, data: e.message }
        }
    }

    const AddPlan = async (planData) => {
        const { planName, charges, bikeModel,bikeBrand, minHour, extraCharge, kmLimit, city } = planData;
        const { Plan } = models;
        try {
            const checkPlan = await Plan.findOne({ planName: planName, bikeModel: bikeModel, bikeBrand: bikeBrand, city: city });
            if (checkPlan) {
                return { status: 400, data:{messsage : "Plan already exists"} }
            }
            const plan = await Plan.create({
                planName,
                charges,
                bikeModel,
                bikeBrand,
                minHour,
                extraCharge,
                kmLimit,
                city
            })
            return { status: 200, data: {
                status : 200,
                message : "Plan added successfully",
                plan
            } }
        } catch (e) {
            logger.error(`Add Plan Error: ${e.message}`);
            return { status: 400, data: e.message }
        }
    }

    // const AddBike = async (bikeName, bikeImage, bikeCount,city) => {
    //     const { Bike,Plan } = models;
    //     try{
    //         let filePath;
    //         if(bikeImage){
    //             const filename = bikeImage.originalname.split('.')[0] + path.extname(bikeImage.originalname);
    //             const filepath = path.join(__dirname, '..', 'uploads', 'bikes', filename);
    //             fs.mkdirSync(path.join(__dirname, '..', 'uploads', 'bikes'), { recursive: true });

    //             await sharp(bikeImage.buffer)
    //                 .resize(800, 800)
    //                 .jpeg({ quality: 90 })
    //                 .toFile(filepath);

    //             filePath = `http://localhost:3000/uploads/bikes/${filename}`;
    //         }

    //         const bikePlan = await Plan.find({ bikeName: bikeName });
    //         const bikePlans = [];

    //         if (bikePlan.length > 0) {
    //             for (const plan of bikePlan) {
    //                 if (plan.bikeName === bikeName) {
    //                     bikePlans.push(plan._id);
    //                 }
    //             }
    //         }
    //         const checkBike = await Bike.findOne({ bikeName: bikeName , city: city});
    //         if (checkBike) {
    //             return { status: 400, data: {message :"Bike already exists"} }
    //         }
    //         const bike = await Bike.create({
    //             bikeName,
    //             bikeImage: filePath,
    //             city,
    //             isAvailable: true,
    //             bikeCount,
    //             plans: bikePlans
    //         })
    //         return { status: 200, data: bike };

    //     }catch(e){
    //         logger.error(`Add Bike Error: ${e.message}`);
    //         return { status: 400, data: e.message }
    //     }
    // }

    const EditPlan = async (updateData) => {
        const { Plan } = models;
        try{
            const planId = updateData.planId;
            
            const allowedFields = ['planName', 'charges','bikeModel', 'bikeBrand', 'minHour', 'extraCharge', 'kmLimit', 'city'];

            const update ={};

            for (const key of allowedFields) {
                if (updateData[key] !== undefined) {
                    update[key] = updateData[key];
                }
            }

            const updatedPlan = await Plan.findByIdAndUpdate(planId, update, { new: true });
            return { status: 200, data: {
                status: 200,
                message: "Plan updated successfully",
                updatedPlan
            } };
        }catch(e){
            logger.error(`Edit Plan Error: ${e.message}`);
            return { status: 400, data: e.message }
        }
    }


    const EditLocation = async (updateData) => {
        const { Location } = models;
        try{
            const locationId = updateData.locationId;
            const allowedFields = ['city', 'address', 'mapLink'];

            const update = {}

            for(const key of allowedFields){
                if (updateData[key] !== undefined) {
                    update[key] = updateData[key];
                }
            }

            const updatedLocation = await Location.findByIdAndUpdate(locationId, update, { new: true });
            return { status: 200, data: {
                status: 200,
                message: "Location updated successfully",
                updatedLocation
            } };
        }catch(e){
            logger.error(`Edit Location Error: ${e.message}`);
            return { status: 400, data: e.message }
        }
    }

    const EditBike = async (updateData) => {
        const { Bike,Plan } = models;
        try{
            const bikeId = updateData.bikeId;
            const bikeImage = updateData.bikeImage;

            const allowedFields = ['bikeModel', 'bikeBrand','city', 'isAvailable'];

            const update = {}

            for(const key of allowedFields){
                if (updateData[key] !== undefined) {
                    update[key] = updateData[key];
                }
            }

            if(bikeImage){
                const filename = bikeImage.originalname.split('.')[0] + path.extname(bikeImage.originalname);
                const filepath = path.join(__dirname, '..', 'uploads', 'bikes', filename);
                fs.mkdirSync(path.join(__dirname, '..', 'uploads', 'bikes'), { recursive: true });

                await sharp(bikeImage.buffer)
                    .resize(800, 800)
                    .jpeg({ quality: 90 })
                    .toFile(filepath);

                update.bikeImage = `http://localhost:3000/uploads/bikes/${filename}`;
            }  

            const oldBike = await Bike.findById(bikeId);
            if((update.bikeModel && oldBike.bikeModel !== update.bikeModel) ||(update.bikeBrand && oldBike.bikeBrand !== update.bikeBrand) ||(update.city && oldBike.city !== update.city))
                {
                const plans = await Plan.find({ bikeModel: update.bikeModel, city: update.city, bikeBrand: update.bikeBrand });

                if(!plans){
                    return { status: 400, data:{messsage : "Plans not found"} }
                }
    
                const planIds = plans.map(plan => plan._id);
    
                update.plans = planIds;
            }
            const updatedBike = await Bike.findByIdAndUpdate(bikeId, update, { new: true });
            return { status: 200, data: {
                status: 200,
                message: "Bike updated successfully",
                updatedBike
            } 
        };
        }catch(e){
            logger.error(`Edit Bike Error: ${e.message}`);
            return { status: 400, data: e.message }
        }
    }

    const DeleteBike = async (bikeId) => {
        const { Bike } = models;
        try{
            const bike = await Bike.findByIdAndDelete(bikeId);
            return { status: 200, data: {
                    status: 200,
                    message: "Bike deleted successfully",
                    bike} };
        }catch(e){
            logger.error(`Delete Bike Error: ${e.message}`);
            return { status: 400, data: e.message }
        }
    }

    const DeleteLocation = async (locationId) => {
        const { Location } = models;
        try{
            const location = await Location.findByIdAndDelete(locationId);
            return { status: 200, data: {
                    status: 200,
                    message: "Location deleted successfully",
                    location
            } };
        }catch(e){
            logger.error(`Delete Location Error: ${e.message}`);
            return { status: 400, data: e.message }
        }
    }

    const DeletePlan = async (planId) => {
        const { Plan } = models;
        try{
            const plan = await Plan.findByIdAndDelete(planId);
            return { status: 200, data: {
                    status: 200,
                    message: "Plan deleted successfully",
                    plan
            } };
        }catch(e){
            logger.error(`Delete Plan Error: ${e.message}`);
            return { status: 400, data: e.message }
        }
    }


    const BikeTariffs = async (locationId) => {
        const { Bike } = models;
        try{
            const bike = await Bike.find({ city:locationId }).populate('plans city');
            if(bike.length === 0){
                return { status: 400, data:{messsage : "No Bikes found"} }
            }
            return { status: 200, data: {
                    status: 200,
                    message: "Bikes",
                    bike
            }}
        }catch(e){
            logger.error(`Get Bike Error: ${e.message}`);
            return { status: 400, data: e.message }
        }
    }

    const GetAllLocation = async () => {
        const { Location } = models;
        try{
            const location = await Location.find({}).populate('city');
            if(!location){
                return { status: 400, data: {message :"Location not found"} }
            }
            return { status: 200, data: {
                    status: 200,
                    message: "All Location",
                    location
            } };
        }catch(e){
            logger.error(`Get Location Error: ${e.message}`);
            return { status: 400, data: e.message }
        }
    }

    const GetLocationByCity = async (city) => {
        const { Location } = models;
        try{
            const lowerCaseCity = city.toLowerCase();
            console.log(lowerCaseCity)
            const location = await Location.findOne({city: lowerCaseCity})
            if(!location){
                return { status: 400, data: {message :"Location not found"} }
            }
            return { status: 200, data: {
                    status: 200,
                    message: `Location by city ${city}`,
                    location
            } };
        }catch(e){
            logger.error(`Get Location By City Error: ${e.message}`);
            return { status: 400, data: e.message }
        }
    }

    const AddReview = async (userId,bikeId, review, rating) => {
        const { Review, Booking } = models;
        try{
            const checkReview = await Review.findOne({userId, bikeId});
            if (checkReview) {
                return { status: 400, data:{messsage : "Review already exists"} }
            }
            const checkRideCompleted = await Booking.findOne({userId, bikeId, rideStatus: "completed"});
            if (!checkRideCompleted) {
                return { status: 400, data:{messsage : "Ride not completed"} }
            }
            const reviews = await Review.create({userId, bikeId, review, rating });
            return { status: 200, data: {
                status: 200,
                message: "Review added successfully",
                reviews
            } };
        }catch(e){
            logger.error(`Add Review Error: ${e.message}`);
            return { status: 400, data: e.message }
        }
    }

    const GetAllBikes = async () => {
        const { Bike } = models;
        try{
            const bike = await Bike.find({}).populate('city plans');
            return { status: 200, data: {
                    status: 200,
                    message: "Bikes",
                    bike
            } };
        }catch(e){
            logger.error(`Get Bike Error: ${e.message}`);
            return { status: 400, data: e.message }
        }
    }

    const AddAgentBike = async(body, bikeImage) => {
        const {agentId,modelName,brandName,cc,mileage,year,fuelType,bikeType,bikeNumber,engineDetails,city} = body;
        const { AgentBike,User ,Plan,Location } = models;
        try{
            const agent = await User.findById(agentId);
            if(!agent){
                return { status: 400, data:{messsage : "Agent not found"} }
            }
            if(agent.role !== 'agent'){
                return { status: 400, data:{messsage : "You are not an agent"} }
            }

            const location = await Location.findOne({city:city});

            if(!location){
                return { status: 400, data:{messsage : "Location not found"} }
            }

            const checkPlan = await Plan.find({bikeModel:modelName,bikeBrand:brandName,city:location._id});
            if(checkPlan.length === 0){
                return { status: 400, data:{messsage : `We are not have Plan for this bike in this city ${city}`} }
            }

            let filePath;
            if(bikeImage){
                const filename = bikeImage.originalname.split('.')[0] + path.extname(bikeImage.originalname);
                const filepath = path.join(__dirname, '..', 'uploads', 'bikes', filename);
                fs.mkdirSync(path.join(__dirname, '..', 'uploads', 'bikes'), { recursive: true });

                await sharp(bikeImage.buffer)
                    .resize(800, 800)
                    .jpeg({ quality: 90 })
                    .toFile(filepath);

                filePath = `http://localhost:3000/uploads/bikes/${filename}`;
            }

            const bike = await AgentBike.create({
                agentId,modelName,brandName,cc,mileage,year,fuelType,bikeType,bikeNumber,engineDetails,
                bikeImage: filePath,
                city
            })
            return { status: 200, data: {
                status: 200,
                message: "Bike added successfully, please wait for admin approval",
                bike
            } };
            
        }catch(e){
            logger.error(`Add Agent Bike Error: ${e.message}`);
            return { status: 400, data: e.message }

        }
    }
    const ViewAgentBike = async () => {
        const { AgentBike,User } = models;
        try{
            const bike = await AgentBike.find({isApproved: 'pending'}).populate({
                path: 'agentId',
                select: '-password -otp -otpExpire -__v'  // exclude these fields
              });
            if(bike.length === 0){
                return { status: 400, data: {
                    status: 400,
                    message: "No Bikes Request Found"
                } };
            }else{
                return { status: 200, data: {
                    status: 200,
                    message: "Bikes",
                    bike
                } };
            }
        }catch(e){
            logger.error(`Get Agent Bike Error: ${e.message}`);
            return { status: 400, data: e.message }
        }
    }

    const ApproveAgentBike = async (id, approval) => {
        console.log(id,approval);
        const { AgentBike,Bike,Plan,Location } = models;
        try{
            const bike = await AgentBike.findById(id);
            if(!bike){
                console.log("Bike not found");
                return { status: 400, data:{messsage : "Bike not found"} }
            }

            if(approval === 'rejected'){
                bike.isApproved = 'rejected';
                await bike.save();
                return { status: 200, data: {
                    status: 200,
                    message: "Bike rejected",
                    bike
                } };
            }
            if(approval === 'approved'){

                bike.isApproved = 'approved';
                await bike.save();

                const location = await Location.findOne({ city: bike.city });
                if(!location){
                    return { status: 400, data:{messsage : "Location not found"} }
                }

                const plans = await Plan.find({ bikeModel: bike.modelName, bikeBrand: bike.brandName,city: location._id });
                if(!plans){
                    return { status: 400, data:{messsage : "Plans not found"} }
                }

                const planIds = plans.map(plan => plan._id);

                

                const addedBike = await Bike.create({
                    agentId: bike._id,
                    bikeModel : bike.modelName,
                    bikeBrand : bike.brandName,
                    bikeImage : bike.bikeImage,
                    bikeNumber : bike.bikeNumber,
                    city : location._id,
                    isAvailable : true,
                    plans : planIds
                })

                return { status: 200, data: {
                    status: 200,
                    message: "Bike approved successfully",
                    addedBike
                }};   
            }
            
        }catch(e){
            logger.error(`Approve Agent Bike Error: ${e.message}`);
            return { status: 400, data: e.message }
        }
    }

    return { 
        AddLocation,AddPlan,
        // AddBike,
        AddReview,AddAgentBike,
        EditPlan,EditBike,EditLocation,
        DeleteBike,DeleteLocation,DeletePlan,
        BikeTariffs,
        GetAllLocation,GetLocationByCity,GetAllBikes,ViewAgentBike,ApproveAgentBike
    };
}