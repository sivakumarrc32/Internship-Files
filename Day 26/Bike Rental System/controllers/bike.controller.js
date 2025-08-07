module.exports = (logger, models) => {
    const services = require('../services/bike.service')(logger, models);
    const addLocation = async (req,res) =>{
        const {city,address,mapLink} = req.body;
        try{
            const result = await services.AddLocation(city,address,mapLink);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Add Location Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const addPlan = async (req,res) =>{
        const planData = req.body;
        try{
            const result = await services.AddPlan(planData);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Add Plan Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const editPlan = async (req,res) =>{
        const updateData = req.body;
        try{
            const result = await services.EditPlan(updateData);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Edit Plan Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const editLocation = async (req,res) =>{
        const updateData = req.body;
        try{
            const result = await services.EditLocation(updateData);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Edit Location Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const editBike = async (req,res) =>{
        const updateData = req.body;
        try{
            const result = await services.EditBike(updateData);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Edit Bike Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    // const addBike = async (req,res) =>{
    //     const {bikeName, bikeCount,city} = req.body;
    //     const file = req.file;
    //     try{
    //         const result = await services.AddBike(bikeName, file, bikeCount,city);
    //         return res.status(result.status).json(result.data);
    //     }catch(e){
    //         logger.error(`Add Bike Error: ${e.message}`);
    //         return res.status(400).json({
    //             status: 400,
    //             message: e.message,
    //         });
    //     }
    // }


    const deleteBike = async (req,res) =>{
        const {bikeId} = req.params;
        try{
            const result = await services.DeleteBike(bikeId);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Delete Bike Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const deleteLocation = async (req,res) =>{
        const {locationId} = req.params;
        try{
            const result = await services.DeleteLocation(locationId);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Delete Location Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const deletePlan = async (req,res) =>{
        const {planId} = req.params;
        try{
            const result = await services.DeletePlan(planId);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Delete Plan Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }


    const bikeTariffs = async (req,res) =>{
        const {locationId} = req.body;
        try{
            const result = await services.BikeTariffs(locationId);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Get Bikes Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const getAllLocation = async (req,res) =>{
        try{
            const result = await services.GetAllLocation();
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Get All Location Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }
    const getLocationByCity = async (req,res) =>{
        const { city } = req.params;
        try{
            const result = await services.GetLocationByCity(city);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Get Location By City Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const addReview = async (req,res) =>{
        const {bikeId, review, rating} = req.body;
        const {id} = req.user;
        try{
            const result = await services.AddReview(id,bikeId, review, rating);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Add Review Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const getAllBikes = async (req,res) =>{
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

    const addAgentBike = async (req,res) =>{
        const body = req.body;
        const file = req.file;
        try{
            const result = await services.AddAgentBike(body, file);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Add Agent Bike Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const viewAgentBike = async (req,res) =>{
        try{
            const result = await services.ViewAgentBike();
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Get Agent Bike Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    const approveAgentBike = async (req,res) =>{
        const {bikeId, approval} = req.body;
        try{
            const result = await services.ApproveAgentBike(bikeId, approval);
            return res.status(result.status).json(result.data);
        }catch(e){
            logger.error(`Approve Agent Bike Error: ${e.message}`);
            return res.status(400).json({
                status: 400,
                message: e.message,
            });
        }
    }

    return {
        addLocation,addPlan,
        // addBike,
        addReview,addAgentBike,
        editBike,editLocation,editPlan,
        deleteBike,deleteLocation, deletePlan,
        bikeTariffs,
        getAllLocation,getLocationByCity,getAllBikes,viewAgentBike,
        approveAgentBike
    }
}