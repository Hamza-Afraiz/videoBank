const Queue = require("bull");

const userQueue = new Queue("user management queue", {
  redis: {
    host: "127.0.0.1", // Your Redis server host
    port: 6379, // Your Redis server port
  },
});

module.exports = userQueue;
