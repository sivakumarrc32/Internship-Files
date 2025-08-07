/**
 * @swagger
 * 
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       required:
 *         - city
 *         - address
 *         - mapLink
 *       properties:
 *         city:
 *           type: string
 *           example: Madurai
 *         address:
 *           type: string
 *           example: 123 Main Street, Madurai
 *         mapLink:
 *           type: string
 *           example: https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d...
 * 
 *     Plan:
 *       type: object
 *       required:
 *         - planName
 *         - bikeBrand
 *         - bikeModel
 *         - charges
 *         - minHour
 *         - extraCharge
 *         - kmLimit
 *         - city
 *       properties:
 *         planName:
 *           type: string
 *           enum: ['Hourly', '7Days','15Days','30Days']
 *           example: Hourly
 *         bikeBrand:
 *           type: string
 *           example: Hero
 *         bikeModel:
 *           type: string
 *           example: Splendor
 *         charges:
 *           type: string
 *           example: 10
 *         minHour:
 *           type: string
 *           example: 1
 *         extraCharge:
 *           type: string
 *           example: 5
 *         kmLimit:
 *           type: string
 *           example: 50
 *         city:
 *           type: string
 *           reference: Location
 * 
 * 
 *     EditLocation:
 *       type: object
 *       required:
 *         - locationid
 *         - city
 *         - address
 *         - mapLink
 *       properties:
 *         locationid:
 *           type: string
 *           example: 8747hd78yyewy78y8y73
 *         city:
 *           type: string
 *           example: Madurai
 *         address:
 *           type: string
 *           example: 123 Main Street, Madurai
 *         mapLink:
 *           type: string
 *           example: https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d...
 * 
 * 
 * 
 *     EditPlan:
 *       type: object
 *       required:
 *         - planid
 *       properties:
 *         planid:
 *           type: string
 *           example: 8747hd78yyewy78y8y73
 *         planName:
 *           type: string
 *           enum: ['Hourly', '7Days','15Days','30Days']
 *           example: Hourly
 *         bikeBrand:
 *           type: string
 *           example: Hero
 *         bikeModel:
 *           type: string
 *           example: Splendor
 *         charges:
 *           type: string
 *           example: 10
 *         minHour:
 *           type: string
 *           example: 1
 *         extraCharge:
 *           type: string
 *           example: 5
 *         kmLimit:
 *           type: string
 *           example: 50
 *         city:
 *           type: string
 *           reference: Location
 * 
 * 
 *     BikeTariffs:
 *        type: object
 *        required:
 *          - locationId
 *        properties:
 *          locationId:
 *            type: string
 *            example: 8747hd78yyewy78y8y73
 * 
 *     Review:
 *       type: object
 *       required:
 *         - bikeId
 *         - review
 *         - rating
 *       properties:
 *         bikeId:
 *           type: string
 *           example: 8747hd78yyewy78y8y73
 *         review:
 *           type: string
 *           example: This is a good bike
 *         rating:
 *           type: number
 *           example: 4.5(out of 5)
 * 
 * 
 *     AgentBike:
 *       type: object
 *       required:
 *         - agentId
 *         - modelName
 *         - brandName
 *         - bikeImage
 *         - bikeNumber
 *         - cc
 *         - mileage
 *         - year
 *         - fuelType
 *         - bikeType
 *         - city
 *       properties:
 *         agentId:
 *           type: string
 *           example: 8747hd78yyewy78y8y73
 *         modelName:
 *           type: string
 *           example: Splendor
 *         brandName:
 *           type: string
 *           example: Hero
 *         bikeImage:
 *           type: string
 *           example: https://example.com/bike-image.jpg
 *           format: binary
 *         bikeNumber:
 *           type: string
 *           example: TN 01 AB 1234
 *         cc:
 *           type: string
 *           example: 55 cc
 *         mileage:
 *           type: string
 *           example: 55 kmpl
 *         year:
 *           type: number
 *           example: 2022
 *         fuelType:
 *           type: string
 *           enum: ['Petrol', 'Diesel', 'Electric']
 *           example: Petrol
 *         bikeType:
 *           type: string
 *           enum: ['Gear', 'Scooty']
 *           example: Gear
 *         engineDetails:
 *           type: string
 *           example: 1234 cc
 *         city:
 *           type: string
 *           enum: ['madurai', 'chennai', 'coimbatore']
 *           example: Chennai
 * 
 * 
 *     BikeApproval:
 *       type: object
 *       required:
 *         - bikeId
 *         - approval
 *       properties:
 *         bikeId:
 *           type: string
 *           example: 8747hd78yyewy78y8y73
 *         approval:
 *           type: string
 *           enum: ['approved', 'rejected']
 *           example: approved
 * 
 * 
 *     BikeEdit:
 *       type: object
 *       required:
 *         - bikeId
 *       properties:
 *         bikeId:
 *           type: string
 *           example: 8747hd78yyewy78y8y73
 *         bikeModel:
 *           type: string
 *           example: Splendor
 *         bikeBrand:
 *           type: string
 *           example: Hero
 *         bikeImage:
 *           type: string
 *           example: https://example.com/bike-image.jpg
 *           format: binary
 *         city:
 *           type: string
 *           reference: Location
 *         isAvailable:
 *           type: boolean
 *           example: true
 */