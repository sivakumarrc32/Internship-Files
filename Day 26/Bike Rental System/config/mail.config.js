const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
})

function sendMail(to, subject, html) {
    console.log(`Sending email to ${to} with subject "${subject}"`);
    return transporter.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject,
        html
    });
}

module.exports = {
    sendMail
}