// schedulers/videoScheduler.js
const cron = require("node-cron");
const videoService = require("../services/videoService");

// Schedule a task to run every day at midnight
cron.schedule("*/50 * * * * *", async () => {
  try {
    console.log("Running scheduled task: generating videos...");
    await videoService.generateRandomVideo(); // Implement this function in your videoService
    console.log("generated successfully.");
  } catch (error) {
    console.error("Error generating video:", error);
  }
});
