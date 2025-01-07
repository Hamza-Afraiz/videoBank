const Queue = require("bull");

const userCreationQueue = new Queue("user creation queue", {
  redis: {
    host: "127.0.0.1", // Your Redis server host
    port: 6379, // Your Redis server port
  },
});

module.exports = userCreationQueue;
