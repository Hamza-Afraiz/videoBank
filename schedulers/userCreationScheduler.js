const cron = require("node-cron");
const userCreationQueue = require("../queues/userCreationQueue");

// Function to generate random user details
const generateRandomUserDetails = () => {
  const randomUsername = `user${Math.floor(Math.random() * 10000)}`; // Generate a random username
  const randomEmail = `${randomUsername}@example.com`; // Generate a random email
  const randomPassword = Math.random().toString(36).slice(-8); // Generate a random password

  return {
    username: randomUsername,
    email: randomEmail,
    password: randomPassword,
  };
};

// Schedule a task to run every 2 seconds
cron.schedule("*/40 * * * * *", async () => {
  const { username, email, password } = generateRandomUserDetails(); // Generate random user details
  await userCreationQueue.add({ username, email, password }); // Add the user details to the queue
  console.log(`Added user to creation queue: ${username}`);
});
