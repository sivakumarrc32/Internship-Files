const fs = require('fs');
const path = require('path');

module.exports = (mongoose) => {
  const models = {};
  const files = fs.readdirSync(__dirname);

  files.forEach((file) => {
    if (file !== 'index.js' && file.endsWith('.model.js')) {
      const modelFactory = require(path.join(__dirname, file));
      const modelExports = modelFactory(mongoose); 

      for (const key in modelExports) {
        models[key] = modelExports[key];
      }
    }
  });

  return models;
};
