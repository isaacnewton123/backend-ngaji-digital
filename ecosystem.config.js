module.exports = {
  apps: [{
    name: "ngaji-digital-api",
    script: "server.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "256M",
    env: {
      NODE_ENV: "production",
      PORT: 5001
    }
  }]
}; 