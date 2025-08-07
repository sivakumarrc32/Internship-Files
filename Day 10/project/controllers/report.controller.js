const nodemailer = require('nodemailer');

module.exports = (models, logger) => ({
  submitReport: async (req, res, next) => {
    const { User, Report } = models;
    try {
      const { email, userid, date, report, otherNotes, confirmSubmit } = req.body;
      if (!confirmSubmit) {
        return res.status(400).json({ error: 'You must confirm submission' });
      }
      const user = await User.findById(req.user.id);
      if(req.user.id !== userid){
        return res.status(400).json({ 
          code: 400,
          message: 'User ID does not match the authenticated user' 
        });

      }
      await Report.create({ userId: user._id, email,userid, report, otherNotes, date, time: new Date().toLocaleTimeString() });
      logger.info(`Report submitted: ${user.email}`);
    

      const transporter = nodemailer.createTransport({
        secure: true,
        host: 'smtp.gmail.com',
        port: 465,
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });

      
      function sendMail(to, subject, text) 
      {
        console.log(`Sending email to ${to} with subject "${subject}"`);
        return transporter.sendMail({
          from: process.env.MAIL_USER,
          to,
          subject,
          text
        });
      }

      sendMail(user.email, 'Daily Report Submitted ', `Hi ${user.username},\n\nYour report for ${date} has been successfully submitted.\n\n- Daily Report System`)
      

      res.status(200).json({ 
        code : 200,
        userId: user._id,
        message: 'Report submitted and email send successfully' });

    } catch (err) {
      logger.error('Report submission error', err.message);
      return res.status(400).json({
        code: 400,
        message: 'Report submission failed',
        error: err.message
      });
    }
  },
  getSummary: async (req, res, next) => {
    const { Report } = models;
    try {
      const userId = req.user.id;  
      const reports = await Report.find({ userId })
      .populate('userId', {_id: 1, username: 1, email: 1, profilePicture: 1})

      if (!reports || reports.length === 0) {
        return res.status(400).json({
          code: 400,
          message: 'No reports found for this user'
        });
      }
  
      res.json({
        code : 200,
        message: 'Report summary fetched successfully',
        reports
       });
    } catch (err) {
      logger.error('Error fetching report summary', err.message);
      return res.status(400).json({
        code: 400,
        message: 'Fetching report summary failed',
        error: err.message
      });
    }
  }
  
});