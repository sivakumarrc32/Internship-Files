const express = require('express');

module.exports = (models,logger, validate, schemas, authMiddleware) => {
  const router = express.Router();
  const reportController = require('../controllers/report.controller')(models, logger);

  router.post('/', authMiddleware, validate(schemas.reportSchema), reportController.submitReport);
  router.get('/', authMiddleware, reportController.getSummary);

  return router;
};