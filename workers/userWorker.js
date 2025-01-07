const userQueue = require("../queues/userQueue");
const { User } = require("../models"); // Import the User model

userQueue.process(async (job) => {
  const { userId } = job.data; // Get userId from job data

  console.log(`Processing user ID: ${userId}`);

  // Wait for 4 seconds
  await new Promise((resolve) => setTimeout(resolve, 4000));

  try {
    await User.destroy({ where: { id: userId } }); // Delete the user from the database
    console.log(`Deleted user ID: ${userId}`);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
});
