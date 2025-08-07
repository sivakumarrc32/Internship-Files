module.exports = {
  apps: [
    {
      name: "Bike-Rental-System",
      script: "./app.js",
      watch: true,
      env: {
        NODE_ENV: "development"
      }
    }
  ]
};