const fs = require('fs');
const path = require('path');
const express = require('express');

module.exports = (logger, models, io) => {
  const router = express.Router();

  const files = fs.readdirSync(__dirname);

  files.forEach(file => {
    if (file !== 'index.js' && file.endsWith('.route.js')) {
      const routeFactory = require(path.join(__dirname, file));
      const route = routeFactory(logger, models, io); 
      const routePath = '/' + file.replace('.route.js', '');
      router.use(routePath, route); 
    }
  });

  return router;
}