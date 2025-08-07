/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management routes for Customers and Agents
 */

/**
 * @swagger
 * /user/user-signup:
 *   post:
 *     summary: User Signup
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignup'
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * /user/verify:
 *   post:
 *     summary: Verify Customer and Agent Accounts via OTP before login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyUser'
 *     responses:
 *       200:
 *         description: User verified successfully
 *       400:
 *         description: Bad request
 * 
 * /user/resend-otp:
 *   post:
 *     summary: Resend OTP to Customer and Agent
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendOtp'
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *       400:
 *         description: Bad request
 * 
 * /user/forgot-password:
 *   post:
 *     summary: Forgot Password API is Common for all users (Customer and Agent) 
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPassword'
 *     responses:
 *       200:
 *         description: New Password sent to your email successfully
 *       400:
 *         description: Bad request
 * 
 * /user/change-password:
 *   post:
 *     summary: Change Password API is Common for all users (Customer and Agent)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Change-Password'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request
 * 
 * /user/user-login:
 *   post:
 *     summary: User Login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Bad request
 * 
 * /user/google:
 *   get:
 *     summary: Google Login
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Google logged in successfully
 *       400:
 *         description: Bad request
 * 
 * /user/google/callback:
 *   get:
 *     summary: After Google Login Redirect to  Callback Route will be Generate Jwt Token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Google logged in successfully
 *       400:
 *         description: Bad request
 * 
 * 
 * /user/profile:
 *   get:
 *     summary: Get User Profile
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       400:
 *         description: Bad request
 * 
 * /user/profile-edit:
 *   patch:
 *     summary: Edit User Profile
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditProfile'
 *     responses:
 *       200:
 *         description: User profile edited successfully
 *       400:
 *         description: Bad request
 * 
 * /user/logout:
 *   post:
 *     summary: Logout User
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: Bad request
 */