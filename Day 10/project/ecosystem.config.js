module.exports = {
  apps: [
    {
      name: "daily-report-api",
      script: "./app.js",
      watch: true,
      env: {
        NODE_ENV: "development"
      }
    }
  ]
};