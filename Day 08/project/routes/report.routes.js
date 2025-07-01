const express = require('express');
const reportController = require('../controllers/report.controller');
const { reportSchema } = require('../validations/report.validation');

module.exports = ({ logger, auth, validate }) => {
  const router = express.Router();
  const controller = reportController({ logger });

  router.post('/', auth, validate(reportSchema), controller.submitReport);
  router.get('/', controller.getReports);

  return router;
};
