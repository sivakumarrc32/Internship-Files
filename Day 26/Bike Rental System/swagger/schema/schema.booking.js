/**
 * @swagger
 * 
 * components:
 *   schemas:
 *     Book Bike:
 *       type: object
 *       required:
 *         - bikeModel
 *         - bikeBrand
 *         - planName
 *         - locationId
 *         - pickupDate
 *         - dropDate
 *         - paymentType
 *         - pickupTime
 *         - dropTime
 *       properties:
 *         bikeModel:
 *           type: string
 *           example: Activa 6G
 *         bikeBrand:
 *           type: string
 *           example: Honda
 *         planName:
 *           type: string
 *           example: Hourly or 7Days or 15Days or 30Days
 *         locationId:
 *           type: string
 *           example: 8747hd78yyewy78y8y73
 *         pickupDate:
 *           type: string
 *           example: 2022-12-12
 *         dropDate:
 *           type: string
 *           example: 2022-12-12
 *         paymentType:
 *           type: string
 *           example: Cash or Online
 *         pickupTime:
 *           type: string
 *           example: 10:00 AM
 *         dropTime:
 *           type: string
 *           example: 10:00 AM
 * 
 *     ConformCashAndReturnBike:
 *       type: object
 *       required:
 *         - bookingId
 *       properties:
 *         bookingId:
 *           type: string
 *           example: 8747hd78yyewy78y8y73
 */