
const fs = require('fs');
const path = require('path');

const schemas = {};
const files = fs.readdirSync(__dirname);

files.forEach((file) => {
  if (file !== 'index.js' && file.endsWith('.validation.js')) {
    const schemaExports = require(path.join(__dirname, file));
    Object.assign(schemas, schemaExports);
  }
});

module.exports = schemas;
