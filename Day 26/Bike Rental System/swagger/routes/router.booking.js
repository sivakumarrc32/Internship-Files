/**
 * @swagger
 * 
 * tags:
 *   name: Booking
 *   description: Booking management routes for creating and managing bookings and returning bikes, and canceling bookings 
 */

/**
 * @swagger
 * 
 * /booking/book-bike:
 *   post:
 *     summary: Create a new booking
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book Bike'
 *     responses:
 *       200:
 *         description: Booking created successfully
 *       400:
 *         description: Bad request
 * 
 * /booking/payment-success:
 *   get:
 *     summary: Payment success page.It will show the success message for online payment and create the payment record in the database
 *     tags: [Booking]
 *     responses:
 *       200:
 *         description: Payment success
 *       400:
 *         description: Bad request
 * 
 * 
 * /booking/admin/conform-cash:
 *   post:
 *     summary: Conform the cash payment by admin 
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConformCashAndReturnBike'
 *     responses:
 *       200:
 *         description: Payment success
 *       400:
 *         description: Bad request 
 * 
 * /booking/admin/verify-documents:
 *   post:
 *     summary: Verify the documents by admin
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConformCashAndReturnBike'
 *     responses:
 *       200:
 *         description: Documents verified successfully
 *       400:
 *         description: Bad request
 * 
 * /booking/admin/return-bike:
 *   post:
 *     summary: Return the bike by admin
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConformCashAndReturnBike'
 *     responses:
 *       200:   
 *         description: Bike returned successfully
 *       400:
 *         description: Bad request
 * 
 * /booking/booking-history:
 *   get:
 *     summary: Get booking history of the Customer
 *     tags: [Booking]
 *     responses:
 *       200:
 *         description: Booking history fetched successfully
 *       400:
 *         description: Bad request
 * 
 * /booking/cancel-ride/{bookingId}/{userId}:
 *   get:
 *     summary: Cancel the ride by customer through link sent in email
 *     tags: [Booking]
 *     responses:
 *       200:
 *         description: Ride cancelled successfully
 *       400:
 *         description: Bad request
 */