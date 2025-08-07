const cron = require('node-cron');
const axios = require('axios');

module.exports =(logger,models) => {
    const token = require('../services/booking.service')(logger,models);
    const { sendSMS } = require('../config/twilio.config');
    const holdBooking = () => {
        const { Booking, Bike } = models;
        cron.schedule('* * * * *', async () => {
            console.log('Checking for expired bookings...');
            const now = new Date();
    
            const expiredBookings = await Booking.find({ rideStatus: 'upcoming' });
    
            for (const booking of expiredBookings) {
                const pickupDateTime = parse12HourTime(booking.pickupDate, booking.pickupTime);
                const oneHourLater = new Date(pickupDateTime.getTime() + 60 * 1000); 
    
                if (now >= oneHourLater) {
                    booking.rideStatus = 'cancelled';
                    await booking.save();
    
                    await Bike.updateOne({ bikeModel: booking.bikeModel, city: booking.city,bikeBrand: booking.bikeBrand, isAvailable: false }, { $set: {updatedAt: new Date() ,isAvailable: true }});
    
                    if (
                        booking.paymentMode === "online" &&
                        booking.paymentStatus === "paid"
                    ) {
                        try {
                            const refundId = await processRefund(booking.captureId); 
                            booking.paymentStatus = "refunded";
                            booking.refundId = refundId;
                            await booking.save();
                            console.log(`Refund processed for booking ${booking._id}`);
                        }catch (err) {
                            console.error("Refund failed for booking", booking._id, err.message);
                            console.error("PayPal Response:", err.response?.data || "No response");
                          }
                    }
                }
            }
        })
    }
    
    const overTime = () => {
        const { Booking, Bike } = models;
        cron.schedule('*/1 * * * *', async () => {
            console.log('Checking for ongoing bookings...');
            const now = new Date();
    
            const ongoingBookings = await Booking.find({ rideStatus: 'ongoing' });
    
            for (const booking of ongoingBookings) {
                const dropDateTime = parse12HourTime(booking.returnDate, booking.dropTime);
                const oneHourLater = new Date(dropDateTime.getTime() + 60  * 1000);
    
                if (now >= oneHourLater) {
                    booking.rideStatus = 'overtime';
                    await booking.save();
    
                    await Bike.updateOne({ bikeModel: booking.bikeModel, city: booking.city,bikeBrand: booking.bikeBrand, isAvailable: false }, { $set: {updatedAt: new Date() ,isAvailable: true }});
                    
                }
            }
    
        })
    }

    const bookingReminders = () => {
        const { Booking, User } = models;
      
        cron.schedule("* * * * *", async () => {
          const now = new Date();
      
          const pickupBookings = await Booking.find({
            rideStatus: "upcoming",
          });
      
          for (const booking of pickupBookings) {
            const pickupDateTime = parse12HourTime(booking.pickupDate, booking.pickupTime);
            
            const timeDiffInMs = pickupDateTime.getTime() - now.getTime();
            const timeDiffInMinutes = Math.floor(timeDiffInMs / (60 * 1000)); // convert ms to minutes
      
            if ((timeDiffInMinutes >= 59 && timeDiffInMinutes <= 61)&& !booking.pickupReminderSent)
            {
              const user = await User.findById(booking.userId);
              const PickupDate = booking.pickupDate.toISOString().split("T")[0];
              await sendSMS(user.mobile, `Reminder: Your bike pickup is at ${booking.pickupTime} on ${PickupDate}. Please be ready.`);
      
              booking.pickupReminderSent = true;
              await booking.save();
            }
          }
      
          const dropBookings = await Booking.find({
            rideStatus: "ongoing",
          });
      
          for (const booking of dropBookings) {
            const dropDateTime = parse12HourTime(booking.returnDate, booking.dropTime);
            
            const timeDiffInMs = dropDateTime.getTime() - now.getTime();
            const timeDiffInMinutes = Math.floor(timeDiffInMs / (60 * 1000)); 
            if ((timeDiffInMinutes >= 59 && timeDiffInMinutes <= 61) && !booking.dropReminderSent)
            {
              const user = await User.findById(booking.userId);
              const DropDate = booking.returnDate.toISOString().split("T")[0];
              await sendSMS(user.mobile, `Reminder: Your bike drop is at ${booking.dropTime} on ${DropDate}. Please be ready.`);
      
              booking.dropReminderSent = true;
              await booking.save();
            }
          }

        });
      };
      


    function parse12HourTime(pickupDate, pickupTime) {
        const [time, modifier] = pickupTime.trim().split(" ");
        let [hours, minutes] = time.split(":").map(Number);
      
        if (modifier === "PM" && hours < 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
      
       
        const dateObj = new Date(pickupDate);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth(); 
        const day = dateObj.getDate();
      
    
        const date = new Date(year, month, day, hours, minutes, 0);
        return date;
    }
    
    async function processRefund(paypalPaymentId) {
        try{
            console.log("Processing refund...");
            const accessToken = await token.generateAccessToken(); 
            const url = `https://api-m.sandbox.paypal.com/v2/payments/captures/${paypalPaymentId}/refund`;
        
            const res = await axios.post(
                url,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log("Refund Success:", res.data);
            return res.data.id; // refundId
        }catch(e){
            console.error("❌ Refund failed:");
            console.error("Message:", e.message);
            console.error("PayPal Response:", e.response?.data || "No response");
            throw e;
        }
    }
    
    return {holdBooking,overTime,bookingReminders};
}

  


