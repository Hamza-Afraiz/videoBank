const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const videoRoutes = require("./routes/videoRoutes");
const sequelize = require("./config/db"); // Import the Sequelize instance
const auth = require("./middleware/auth");
const followRoutes = require("./routes/followRoutes");
const videoScheduler = require("./schedulers/videoScheduler"); // Import follow routes
const userDeletionScheduler = require("./schedulers/userDeletionScheduler"); // Import the user scheduler
const userCreationScheduler = require("./schedulers/userCreationScheduler"); // Import the user creation scheduler
require("./workers/userWorker"); // Import the user worker to start processing jobs
require("./workers/userCreationWorker"); // Import the user creation worker to start processing jobs
const http = require("http");
const { Server } = require("socket.io");
const User = require("./models/User"); // Import the User model

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server); // Initialize Socket.IO

io.on("connection", (socket) => {
  console.log("A user connected");

  // Emit the current number of users when a new client connects
  socket.emit("userCount", { count: 0 }); // Initial count (will be updated)

  // Listen for user count updates
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(5001, () => {
  console.log(`Server is running on port ${PORT}`);
});

// // Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files (like the client script)
// app.use(express.static("public"));
// Basic Route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html"); // Serve the HTML file
});

// Sync the database (optional)
sequelize
  .sync()
  .then(() => console.log("Database synced successfully"))
  .catch((err) => console.error("Error syncing the database:", err));

videoScheduler;
app.use("/auth", authRoutes);
app.use(auth);
app.use("/videoLinks", videoRoutes);
app.use("/follow", followRoutes); // Use follow routes
app.get("/health", (req, res) => {
  console.info(io);
  res.status(200).send({
    serverStatus: "Running",
    socketClients: io.engine.clientsCount, // Number of connected clients
  });
});
// Socket.IO connection

// Function to update user count
const updateUserCount = async () => {
  const userCount = await User.count(); // Get the current number of users
  // console.warn("here");
  // console.log(`Emitting user count: ${userCount}`);
  io.emit("userCount", { count: userCount }); // Emit the updated count to all connected clients
};

// Schedule user count updates every 2 seconds
setInterval(updateUserCount, 2000);
// app.use((req, res, next) => {
//   // Allow access to specific routes without authentication
//   if (req.path === "/socket.io/" || req.path.startsWith("/api/")) {
//     return next(); // Skip authentication for these routes
//   }

//   // Your authentication logic here
//   if (!req.headers.authorization) {
//     return res.status(401).send("Unauthorized");
//   }

//   // If authenticated, proceed to the next middleware
//   next();
// });

// Start the scheduler
userDeletionScheduler; // This will run the scheduled tasks
userCreationScheduler; // This will run the scheduled tasks for user creation
