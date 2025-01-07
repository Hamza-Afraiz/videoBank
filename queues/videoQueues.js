// queues/videoQueue.js
const Queue = require("bull");
const videoQueue = new Queue("video import queue", {
  redis: {
    host: "127.0.0.1", // Your Redis server host
    port: 6379, // Your Redis server port
  },
});

module.exports = videoQueue;
