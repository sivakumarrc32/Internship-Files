const Report = require('../models/report.model');

module.exports = ({ logger }) => {
  return {
    submitReport: async (req, res) => {
      try {
        const { reportData } = req.body;
        const { username } = req.user;

        const now = new Date();
        // now.setDate(now.getDate() + 1);
        const report = new Report({
          username,
          reportData: reportData,
          date: now.toISOString().split('T')[0],
          time: now.toTimeString().split(' ')[0],
        });
        await report.save();
        logger.info(`Report submitted by ${username}`);
        res.status(200).json({ 
          code : 200,
          message: 'Report submitted',
          report: {
            username: report.username,
            reportData: report.reportData,
            date: report.date,
            time: report.time
          }
          });
      } catch (err) {
        logger.error('Report submission failed:', err.message);
        res.status(400).json({ error: err.message });
      }
    },

    getReports: async (req, res) => {
      try {
        const { username, date } = req.query;
        const query = {};
        if (username) query.username = username;
        if (date) query.date = date;

        const reports = await Report.find(query);
        res.json(reports);
      } catch (err) {
        logger.error('Fetching reports failed:', err.message);
        res.status(400).json({ error: err.message });
      }
    }
  };
};
