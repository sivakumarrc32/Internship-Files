const express = require('express');
const authController = require('../controllers/auth.controller');
const { registerSchema, loginSchema } = require('../validations/auth.validation');

module.exports = ({ logger, validate }) => {
  const router = express.Router();
  const controller = authController({ logger });

  router.post('/register',validate(registerSchema), controller.register);
  router.post('/login', validate(loginSchema), controller.login);

  return router;
};
