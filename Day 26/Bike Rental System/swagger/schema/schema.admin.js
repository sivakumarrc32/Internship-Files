/**
 * @swagger
 * 
 * components:
 *   schemas:
 *     AdminSignup:
 *       type: object
 *       required:
 *         - superAdminId
 *         - userName
 *         - email
 *         - mobile
 *         - secretCode
 *         - role
 *         - isVerified
 *       properties:
 *         superAdminId:
 *           type: string
 *           example: 8747hd78yyewy78y8y73
 *         userName:
 *           type: string
 *           example: yourname
 *         email:
 *           type: string
 *           example: yourmail@gmail.com
 *         mobile:
 *           type: string
 *           example: 1234567890
 *         secretCode:
 *           type: string
 *           example: secreat key to create Admin
 *         role:
 *           type: string
 *           example: admin
 *         isVerified:
 *           type: boolean
 *           example: true
 * 
 * 
 *     AdminLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - secretCode
 *       properties:
 *         email:
 *           type: string
 *           example: yourmail@gmail.com
 *         password:
 *           type: string
 *           example: Bikesystem123
 *         secretCode:
 *           type: string
 *           example: secreat key to login
 * 
 *     ChangePassword:
 *       type: object
 *       required:
 *         - password
 *         - newPassword
 *         - secretCode
 *       properties:
 *         password:
 *           type: string
 *           example: Bikesystem123
 *         newPassword:
 *           type: string
 *           example: New Password
 *         secretCode:
 *           type: string
 *           example: secreat key of login 
 * 
 * 
 */