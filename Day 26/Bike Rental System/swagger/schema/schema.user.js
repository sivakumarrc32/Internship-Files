/**
 * @swagger
 * components:
 *   schemas:
 *     UserSignup:
 *       type: object
 *       required:
 *         - userName
 *         - email
 *         - password
 *         - mobile
 *         - role
 *       properties:
 *         userName:
 *           type: string
 *           example: yourname
 *         email:
 *           type: string
 *           example: yourmail@gmail.com
 *         mobile:
 *           type: string
 *           example: 123456789
 *         password:
 *           type: string
 *           example: Bikesystem123
 *           description: Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number
 *         role:
 *           type: string
 *           enum: ['customer', 'agent']
 *           example: customer
 * 
 * 
 *     VerifyUser:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *       properties:
 *         email:
 *           type: string
 *           example: yourmail@gmail.com
 *         otp:
 *           type: string
 *           example: 123456
 * 
 * 
 *     ResendOtp:
 *         type: object
 *         required:
 *           - mobile
 *         properties:
 *           mobile:
 *             type: string
 *             example: 123456789
 * 
 * 
 *     ForgotPassword:
 *         type: object
 *         required:
 *           - email
 *         properties:
 *           email:
 *             type: string
 *             example: yourmail@gmail.com
 * 
 * 
 *     Change-Password:
 *         type: object
 *         required:
 *           - email
 *           - password
 *           - newPassword
 *         properties:
 *           email:
 *             type: string
 *             example: yourmail@gmail.com
 *           password:
 *             type: string
 *             example: Password from the Mail
 *             description: Password from the Mail 
 *           newPassword:
 *             type: string
 *             example: New Password
 *             description: New Password, Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number
 * 
 * 
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: yourmail@gmail.com
 *         password:
 *           type: string
 *           example: Bikesystem123
 *           description: Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number
 *         role:
 *           type: string
 *           enum: ['customer', 'agent']
 *           example: customer
 * 
 * 
 *     EditProfile:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *            example: yourmail@gmail.com
 *            description: Email must be a valid email address
 *          userName:
 *            type: string
 *            example: yourname
 *          city:
 *            type: string
 *            example: yourcity
 *          address:
 *            type: string
 *            example: youraddress 
 *          
 */