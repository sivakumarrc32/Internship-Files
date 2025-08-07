module.exports = {
  apps: [
    {
      name: "instagram-api",
      script: "./app.js",
      watch: true,
      env: {
        NODE_ENV: "development"
      }
    }
  ]
};