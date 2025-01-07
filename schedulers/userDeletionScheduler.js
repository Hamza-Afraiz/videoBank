const cron = require("node-cron");
const userQueue = require("../queues/userQueue");
const { User } = require("../models"); // Import the User model

// Function to get a random user ID from the database
const getRandomUserId = async () => {
  const users = await User.findAll({ attributes: ["id"] }); // Fetch all user IDs
  if (users.length === 0) {
    throw new Error("No users found in the database.");
  }
  const randomIndex = Math.floor(Math.random() * users.length); // Get a random index
  return users[randomIndex].id; // Return the random user ID
};

// Schedule a task to run every 10 seconds
cron.schedule("*/60 * * * * *", async () => {
  try {
    const userId = await getRandomUserId(); // Get a random user ID
    await userQueue.add({ userId }); // Add the user ID to the queue
    console.log(`Added user ID: ${userId} to the queue.`);

    // Log current queue details
    const queueCount = await userQueue.count(); // Get the current number of jobs in the queue
    console.log(`Current queue length: ${queueCount}`);
  } catch (error) {
    console.error("Error adding user to queue:", error);
  }
});
