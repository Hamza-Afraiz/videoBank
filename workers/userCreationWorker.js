const userCreationQueue = require("../queues/userCreationQueue");
const { User } = require("../models"); // Import the User model

userCreationQueue.process(async (job) => {
  const { username, email, password } = job.data; // Get user details from job data

  console.log(`Creating user: ${username}, ${email}`);

  try {
    await User.create({ username, email, password }); // Create the user in the database
    console.log(`User created: ${username}`);
  } catch (error) {
    console.error("Error creating user:", error);
  }
});
