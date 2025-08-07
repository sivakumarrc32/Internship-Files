const express = require('express');

module.exports = (Report, User,logger, validate, database, authMiddleware) => {
  const router = express.Router();
  const reportController = require('../controllers/report.controller')(Report, User, logger);
  const { reportSchema } = database;

  router.post('/', authMiddleware, validate(reportSchema), reportController.submitReport);
  router.get('/', authMiddleware, reportController.getSummary);

  return router;
};