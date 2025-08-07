module.exports = (schema) => (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        code: 400,
        error: error.details[0].message 
      });
    }
    next();
  }catch (err) {
    logger.error('Validation error:', err.message);
    return res.status(400).json({ 
      code: 400,
      error: err.message 
    });
  }
};