const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


async function sendSMS(phone, message) {
    try {
        await twilio.messages.create({
            body: message,
            from:'+13158971464',
            to:  phone
        });
        console.log('SMS sent successfully');
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
}

module.exports = {sendSMS};