/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management routes for creating and managing admin accounts
 */


/**
 * @swagger
 * 
 * /admin/create:
 *   post:
 *     summary: Create Admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminSignup'
 *     responses:
 *       200:
 *         description: Admin created successfully
 *       400:
 *         description: Bad request
 * 
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLogin'
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * /admin/change-password:
 *   post:
 *     summary: Change admin password
 *     tags: [Admin]
 *     security:     
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePassword'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request
 * 
 * /admin/all-users:
 *   get:
 *     summary: Get all users details of (customers and agents)
 *     tags: [Admin]
 *     security:     
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: All users details fetched successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * /admin/all-bikes:
 *   get:
 *     summary: Get all bikes details
 *     tags: [Admin]
 *     security:     
 *       - ApiKeyAuth: []   
 *     responses:
 *       200:
 *         description: All bikes details fetched successfully
 *       400:
 *         description: Bad request
 *
 * 
 * /admin/all-reviews:
 *   get:
 *     summary: Get all reviews details
 *     tags: [Admin]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: All reviews details fetched successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * /admin/all-plans:
 *   get:
 *     summary: Get all plans details
 *     tags: [Admin]
 *     security:     
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: All plans details fetched successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * 
 * /admin/logout:
 *   post:
 *     summary: Admin logout
 *     tags: [Admin]
 *     security:     
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Admin logged out successfully
 *       400:
 *         description: Bad request
 */