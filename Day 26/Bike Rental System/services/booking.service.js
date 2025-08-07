const axios = require('axios');
const e = require('express');

module.exports = (logger,models) => {
    const  { validateBooking, checkAvailability } = require('../utils/validateBookingDates')(models);
    const { sendMail } = require('../config/mail.config');
const generateAccessToken = async () => {
        try {
          const response = await axios({
            url: `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
            method: 'post',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: 'grant_type=client_credentials',
            auth: {
              username: process.env.PAYPAL_CLIENT_ID,
              password: process.env.PAYPAL_SECRET,
            },
          });
    
          return response.data.access_token;
        } catch (e) {
          logger.error(`Access Token Error: ${e.message}`);
          return {
            status: 400,
            data: {
              status: 400,
              message: `Access Token Error: ${e.message}`,
            },
          }
        }
      }
    const Booking = async (userId,bookingData) => {
        


        const { Booking, User, Plan, Location, Bike } = models;
        
        const {bikeModel,bikeBrand, planName,locationId, pickupDate, dropDate, paymentType,pickupTime,dropTime} = bookingData;

        console.log("Booking Data",bookingData);


        try{

            const validation = await validateBooking(pickupDate,dropDate,pickupTime,dropTime);

            if (!validation.valid) {
                return {
                    status: 400,
                    data: {
                        status: 400,
                        message: validation.message,
                    },
                }
            }

            const user = await User.findById(userId);
            const plan = await Plan.findOne({ planName, bikeModel, bikeBrand, city: locationId });
            const city = await Location.findById(locationId);
            let bike = await Bike.findOneAndUpdate(
                { bikeModel, bikeBrand, city: locationId, isAvailable: true },
                { $set: { isAvailable: false } },
                { new: true }
              );

            if (!bike) {
                const available = await checkAvailability(pickupDate, dropDate, bikeModel, bikeBrand);
                
                if (!available) {
                  return {
                    status: 400,
                    data: {
                      status: 400,
                      message: "Bike not available for selected dates",
                    },
                  };
                }

                bike = await Bike.findOneAndUpdate(
                    { bikeModel, bikeBrand, city: locationId, isAvailable: false },
                    { $set: { isAvailable: false } },
                    { new: true }
                );

                if (!bike) {
                  return {
                    status: 400,
                    data: {
                      status: 400,
                      message: "Bike not available for selected dates",
                    },
                  };
                }
            }
            const bikeName = bike.bikeBrand + " " + bike.bikeModel;


            if(!user || !plan || !city){ 
                console.log(`User : ${user}, Plan : ${plan}, Location : ${city}`);
                return { 
                    status: 400, 
                    data : {
                        status: 400,
                        message: "User/Plan/Location/ not found" 
                    }
                };
            }

            let amount;
        
            if(plan.planName === 'Hourly'){
                const money = parseFloat(plan.charges.replace(/[^\d.]/g, ''));
                amount = money * 10;
            }else{
                amount = parseFloat(plan.charges.replace(/[^\d.]/g, ''));
            }

            if(paymentType === 'cash'){

                const book = await Booking.create({
                    userId : userId, 
                    bikeModel : bike.bikeModel,
                    bikeBrand : bike.bikeBrand,
                    planName : planName, 
                    city : city,
                    pickupTime,
                    dropTime,
                    pickupDate, 
                    returnDate : dropDate, 
                    totalAmount : amount, 
                    paymentMode : paymentType, 
                    paymentStatus : 'pending',
                    rideStatus : 'upcoming'
                })

                await sendMail(
                    user.email,
                    "Booking Confirmation",
                    `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <h3 style="color: #2E86C1;">Booking Confirmed 🚀</h3>
                        <p>Hi ${user.userName || 'User'},</p>

                        <p>Your booking has been <b>confirmed</b> with the following details:</p>

                        <p>
                        <b>Bike:</b> ${bikeName}<br>
                        <b>City:</b> ${city.city}<br>
                        <b>Pickup:</b> ${pickupDate}<br>
                        <b>Drop:</b> ${dropDate}<br>
                        <b>Plan:</b> ${planName}<br>
                        <b>Amount:</b> ₹${amount}<br>
                        <b>Booking ID:</b> ${book._id}
                        </p>

                        <p style="color: #D35400;">
                        💵 Cash payment confirmed. Payment status is <b>pending</b>.
                        </p>

                        <p>Please pay cash to the driver at pickup.</p>

                        <p>Questions? <a href="mailto:0Pq0U@example.com">Contact us</a></p>

                        <p>Thanks for choosing us!<br>- Bike Rental Team</p>
                    </div>
                    `
                  );
                  

                return { status: 200, data: book };
            }else if(paymentType === 'online'){
                const book = await Booking.create({
                    userId : userId, 
                    bikeModel : bike.bikeModel,
                    bikeBrand : bike.bikeBrand,
                    planName,
                    pickupTime,
                    dropTime, 
                    city : city, 
                    pickupDate, 
                    returnDate : dropDate, 
                    totalAmount : amount, 
                    paymentMode : paymentType, 
                    paymentStatus : 'pending',
                    rideStatus : 'upcoming'
                })

                const accessToken = await generateAccessToken();

                const response = await axios({
                    url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    data: {
                        intent: 'CAPTURE',
                        purchase_units: [
                            {
                                reference_id:`${book._id}`,
                                items:[
                                    {
                                        name:bikeName,
                                        description: planName,
                                        quantity: 1,
                                        unit_amount: {
                                            currency_code: 'USD',
                                            value: (amount/86).toFixed(2)
                                        }
                                    }
                                ],
                                amount: {
                                    currency_code: 'USD',
                                    value: (amount/86).toFixed(2),
                                    breakdown: {
                                        item_total: {
                                            currency_code: 'USD',
                                            value: (amount/86).toFixed(2)
                                        }
                                    }
                                }
                            }
                        ],
                        application_context: {
                            brand_name: 'Bike Rental System',
                            shipping_preference: 'NO_SHIPPING',
                            user_action: 'PAY_NOW',
                            return_url: `${process.env.BASE_URL}/api/booking/payment-success?bookingId=${book._id}`,
                            cancel_url: process.env.PAYPAL_CANCEL_URL
                        }
                    }
                });

                const paymentId = response.data.id;

                await Booking.updateOne({ _id: book._id }, { $set: { paymentId: paymentId }});

                const approveUrl = response.data.links.find(link => link.rel === 'approve').href;

                return { status: 200, data: { 
                    redirect: approveUrl,
                    paymentId: paymentId,
                    bookingId: book._id
                } };

            }

        }catch(e){
            logger.error(`Booking Error: ${e.message}`);
            if (e.response) {
                logger.error(`Status: ${e.response.status}`);
                logger.error(`Data: ${JSON.stringify(e.response.data)}`);
            } else {
                logger.error(`No response from server`);
            }
            return { status: 400, data: e.message };
        }
    }

    const CapturePayment = async (bookingId) => {
        const { Booking, Bike, Plan, User, Location, Payment } = models;
        try{

            const book = await Booking.findById(bookingId);
            const userId = book.userId;
            const user = await User.findById(userId);
            const location = await Location.findById(book.city);
            const city = location.city;
            const bikeName = book.bikeBrand + " " + book.bikeModel;
            const accessToken = await generateAccessToken();

            const response = await axios({
                url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${book.paymentId}/capture`,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const status = response.data.status;
            const coptureid = response.data.purchase_units[0].payments.captures[0].id;
            

            if(status === 'COMPLETED'){
                const book = await Booking.findById(bookingId);
                book.paymentStatus = 'paid';
                book.captureId = coptureid;
                await book.save();

                await Payment.create({
                    userId : userId, 
                    bookingId : book._id, 
                    transactionId : coptureid, 
                    amount : book.totalAmount, 
                    paymentMode : book.paymentMode, 
                    paymentStatus : book.paymentStatus
                });

            await sendMail(
                user.email,
                'Payment Received',
                `<div style="font-family: Arial, sans-serif; color: #333;">
                    <h3 style="color: #27AE60;">Payment Received ✅</h3>
                    <p>Hi ${user.userName || 'User'},</p>

                    <p>Thank you for your payment. Your booking is now <b>confirmed</b> with the following details:</p>

                    <p>
                        <b>Booking ID:</b> ${book._id}<br>
                        <b>Bike:</b> ${bikeName}<br>
                        <b>City:</b> ${city}<br>
                        <b>Plan:</b> ${book.planName}<br>
                        <b>Pickup:</b> ${book.pickupDate}<br>
                        <b>Drop:</b> ${book.returnDate}<br>
                        <b>Amount:</b> ₹${book.totalAmount}<br>
                        <b>Payment Mode:</b> ${book.paymentMode}<br>
                        <b>Payment Status:</b> ${book.paymentStatus}<br>
                        <b>Ride Status:</b> ${book.rideStatus}
                    </p>

                    <p style="color: #2980B9;">
                        📩 A confirmation email has been sent to you. Enjoy your ride!
                    </p>

                    <p>if you want to cancel the ride, please click the link below:</p>

                    <p><a href="${process.env.BASE_URL}/api/booking/cancel-ride/${book._id}/${user._id}">Cancel Ride</a></p>

                    <p>Need help? <a href="mailto:support@example.com">Contact support</a></p>

                    <p>Thanks for choosing us!<br>- Bike Rental Team</p>
                    </div>`
            )

                return { status: 200, data: book };
            }

            

        }catch(e){
            logger.error(`Booking Capture Error: ${e.message}`);   
            return { status: 400, data: e.message };

        }
    }

    const ConfirmCashPayment = async (bookingId,) => {
        const { Booking } = models;
        try{
            const book = await Booking.findById(bookingId);
            if(!book){
                return { status: 400, data: {meassage : 'Booking Not Found'} };
            }
            book.paymentStatus = 'paid';
            book.isCashPaymentConfirmed = true;
            await book.save();
            return { status: 200, data: book };
        }catch(e){
            logger.error(`Confirm Cash Payment Error: ${e.message}`);   
            return { status: 400, data: e.message };
        }
    }

    const VerifyDocument = async (bookingId,) => {
        const { Booking } = models;
        try{
            const book = await Booking.findById(bookingId);
            if(!book){
                return { status: 400, data: {meassage : 'Booking Not Found'} };
            }
            book.rideStatus = 'ongoing';
            book.isverified = true;
            await book.save();
            return { status: 200, data: book };
        }catch(e){
            logger.error(`Verify Document Error: ${e.message}`);   
            return { status: 400, data: e.message };
        }
    }

    async function refundPayment(captureId) {
        try {
    
            const accessToken = await generateAccessToken();
            // Step 2: Call refund API
            const refundRes = await axios({
                url: `${process.env.PAYPAL_BASE_URL}/v2/payments/captures/${captureId}/refund`,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
    
            return { status: true, data: refundRes.data };
        } catch (error) {
            console.error('Refund Error:', error.response?.data || error.message);
            return { status: false, error: error.message };
        }
    }



    const CancelBooking = async (bookingId,userId  ) => {
        const { Booking, Bike ,User } = models;
        try{
            const book = await Booking.findOne({ _id: bookingId, userId });
            const user = await User.findById(userId);
            if(!book){
                return { status: 400, data: {meassage : 'Booking Not Found'} };
            }
            if (book.paymentStatus === 'refunded') {
                return { status: 400, data: {meassage : 'Booking Already Refunded'} };
            }
              
            if(book.captureId){
                const refund = await refundPayment(book.captureId);
                if (refund.status) {
                    book.paymentStatus = 'refunded';
                    book.rideStatus = 'cancelled';
                    await book.save();
                    await Bike.updateOne({ bikeModel: book.bikeModel, city: book.city,bikeBrand: book.bikeBrand, isAvailable: false }, { $set: {updatedAt: new Date() ,isAvailable: true }});

                    await sendMail(
                        user.email,
                        'Ride Cancelled',
                        `
                        <div style="background-color: #f2f2f2; padding: 20px; font-family: Arial, sans-serif; font-size: 14px;">
                            <h2 style="color: #333;">Ride Cancelled</h2>
                            <p>Hi ${user.userName || 'User'},</p>

                            <p>Thank you for using our service. We regret to inform you that your booking has been cancelled.</p>

                            <p>Your Payment has been <b style="color: red;">refunded</b> to your account.</p>

                            <p>Booking Details:</p>

                            <p><b>Booking ID:</b> ${book._id}</p>
                            <p><b>Amount:</b> ₹${book.totalAmount}</p>
                            <p><b>Payment Mode:</b> ${book.paymentMode}</p>
                            <p><b>Payment Status:</b> ${book.paymentStatus}</p>
                            <p><b>Ride Status:</b> ${book.rideStatus}</p>

                            <p>We hope to see you again soon!</p>

                            <p>Best regards,<br>Bike Rental Team</p>
                        </div>

                        `
                    )
                    
                    return { status: 200, data: book };
                } else {
                    return { status: 400, data: {meassage : refund.error} };
                }
            }


        }catch(e){
            logger.error(`Cancel Booking Error: ${e.message}`);   
            return { status: 400, data: {meassage : e.message} };
        }
    }

    const ReturnBike = async (bookingId) => {
        const { Booking, Bike } = models;
        try{

            const book = await Booking.findById(bookingId);
            if(!book){
                return { status: 400, data: {meassage : 'Booking Not Found'} };
            }

            const now = new Date();
            const bikeReturnDate = now.toISOString().split('T')[0]
            const bikeReturnTime = now.toISOString().split('T')[1].split('.')[0];
            const bikeReturnDateTime = `${bikeReturnDate} ${bikeReturnTime}`;
            
            if(book.rideStatus === 'overtime'){
                book.isOverTime = true;
                book.bikeReturnDateTime = bikeReturnDateTime;
                book.rideStatus = 'completed';
                await book.save();
            }else{
                book.bikeReturnDateTime = bikeReturnDateTime;
                book.rideStatus = 'completed';
                await book.save();
            }
            await Bike.updateOne({ bikeModel: book.bikeModel, city: book.city,bikeBrand: book.bikeBrand, isAvailable: false }, { $set: { updatedAt: new Date() ,isAvailable: true }});

            return { status: 200, data: book };

        }catch(e){
            logger.error(`Return Bike Error: ${e.message}`);   
            return { status: 400, data: e.message };
        }
    }

    const BookingHistory = async (userId) => {
        const { Booking } = models;
        try{
            const book = await Booking.find({ userId }).populate('city');
            if(!book){
                return { status: 400, data: {meassage : 'Booking Not Found'} };
            }
            return { status: 200, data: book };
        }catch(e){
            logger.error(`Booking History Error: ${e.message}`);   
            return { status: 400, data: e.message };
        }
    }

    return { 
        Booking,
        CapturePayment,
        ConfirmCashPayment,
        VerifyDocument,
        ReturnBike,
        BookingHistory,
        CancelBooking,
        generateAccessToken
     };

}