/**
 * @swagger
 * tags:
 *   name: Bikes-Plans-Location-Management
 *   description: Bike management routes for creating and managing bikes, plans, and locations for renting bikes
 */

/**
 * @swagger
 * 
 * /bike/admin/add-location:
 *   post:
 *     summary: Add a new location
 *     tags: [Bikes-Plans-Location-Management]
 *     security:     
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       200:
 *         description: Location added successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * /bike/admin/add-plan:
 *   post:
 *     summary: Add a new plan
 *     tags: [Bikes-Plans-Location-Management]
 *     security:     
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plan'
 *     responses:
 *       200:
 *         description: Plan added successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * /bike/admin/edit-location:
 *   patch:
 *     summary: Edit a location
 *     tags: [Bikes-Plans-Location-Management]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditLocation'
 *     responses:
 *       200:
 *         description: Location edited successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * /bike/admin/edit-plan:
 *   patch:
 *     summary: Edit a plan
 *     tags: [Bikes-Plans-Location-Management]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditPlan'
 *     responses:
 *       200:
 *         description: Plan edited successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * /bike/admin/delete-location/{locationId}:
 *   delete:
 *     summary: Delete a location
 *     tags: [Bikes-Plans-Location-Management]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: locationId
 *         in: path
 *         description: ID of the location to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Location deleted successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * /bike/admin/delete-plan/{planId}:
 *   delete:
 *     summary: Delete a plan
 *     tags: [Bikes-Plans-Location-Management]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: planId
 *         in: path
 *         description: ID of the plan to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plan deleted successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * /bike/bike-tariffs:
 *   post:
 *     summary: Get bike tariffs details for a location.Anyone can get the details
 *     tags: [Bikes-Plans-Location-Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BikeTariffs'
 *     responses:
 *       200:
 *         description: Bike tariffs fetched successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * /bike/location:
 *   get:
 *     summary: Get all locations details.Anyone can get the details
 *     tags: [Bikes-Plans-Location-Management]
 *     responses:
 *       200:
 *         description: Locations fetched successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * /bike/location/{city} :
 *   get:
 *     summary: Get location details by city.Anyone can get the details
 *     tags: [Bikes-Plans-Location-Management]
 *     parameters:
 *       - name: city
 *         in: path
 *         description: City name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Location fetched successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * /bike/all-bike:
 *   get:
 *     summary: Get all bikes details.Anyone can get the details
 *     tags: [Bikes-Plans-Location-Management]
 *     responses:
 *       200:
 *         description: Bikes fetched successfully
 *       400:
 *         description: Bad request
 * 
 * /bike/review:
 *   post:
 *     summary: Add a new review
 *     tags: [Bikes-Plans-Location-Management]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:   
 *       200:
 *         description: Review added successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * 
 * /bike/agent-add-bike:
 *   post:
 *     summary: Add a new bike by agent
 *     tags: [Bikes-Plans-Location-Management]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/AgentBike'
 *     responses:
 *       200:
 *         description: Agent Bike added successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * /bike/admin/view-agent-bike:
 *   get:
 *     summary: Get all agent bikes details.It shows the bikes added by agent and those which are not approved
 *     tags: [Bikes-Plans-Location-Management]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Agent Bikes fetched successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * /bike/admin/approval:
 *   post:
 *     summary: Approve a bike by admin
 *     tags: [Bikes-Plans-Location-Management]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BikeApproval'
 *     responses:
 *       200:
 *         description: Bike approved successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * /bike/admin/edit-bike:
 *   patch:
 *     summary: Edit a bike by admin
 *     tags: [Bikes-Plans-Location-Management]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/BikeEdit'
 *     responses:
 *       200:
 *         description: Bike edited successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * /bike/admin/delete-bike/{bikeId}:
 *   delete:
 *     summary: Delete a bike by admin
 *     tags: [Bikes-Plans-Location-Management]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: bikeId
 *         in: path
 *         description: Bike ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bike deleted successfully
 *       400:
 *         description: Bad request
 */
