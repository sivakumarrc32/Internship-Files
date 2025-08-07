const { valid } = require('joi');

module.exports =(logger, models) => {
    const express = require('express');
    const router = express.Router();
    const adminAuth = require('../middleware/admin.niddleware')(models);
    const userAuth = require('../middleware/user.middleware')(models);
    const controller = require('../controllers/bike.controller')(logger, models);
    const upload = require('../middleware/bikeImage.middleware');
    const { locationValidation, planValidation, reviewValidation,editBikeValidation ,editPlanValidation,editLocationValidation, validate } = require('../validation/bike.validation');

    // ADD
    router.post('/admin/add-location', adminAuth,validate(locationValidation) ,controller.addLocation);
    router.post('/admin/add-plan', adminAuth,validate(planValidation) ,controller.addPlan);
    // router.post('/admin/add-bike', adminAuth,validate(bikeValidation) ,upload.single('bikeImage'), controller.addBike);

    // EDIT
    router.patch('/admin/edit-bike', adminAuth,validate(editBikeValidation),upload.single('bikeImage'), controller.editBike);
    router.patch('/admin/edit-location', adminAuth,validate(editLocationValidation),controller.editLocation);
    router.patch('/admin/edit-plan', adminAuth ,validate(editPlanValidation),controller.editPlan);

    // DELETE
    router.delete('/admin/delete-bike/:bikeId', adminAuth, controller.deleteBike);
    router.delete('/admin/delete-location/:locationId', adminAuth, controller.deleteLocation);
    router.delete('/admin/delete-plan/:planId', adminAuth, controller.deletePlan);

    router.post('/bike-tariffs',controller.bikeTariffs);

    router.get('/location', controller.getAllLocation);
    router.get('/location/:city', controller.getLocationByCity);
    router.get('/all-bike', controller.getAllBikes);

    router.post('/review', userAuth,validate(reviewValidation) ,controller.addReview);


    router.post('/agent-add-bike',userAuth, upload.single('bikeImage'),controller.addAgentBike);
    router.get('/admin/view-agent-bike',adminAuth, controller.viewAgentBike);
    router.post('/admin/approval',adminAuth, controller.approveAgentBike);


    return router;
}