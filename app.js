const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const videoRoutes = require("./routes/videoRoutes");
const sequelize = require("./config/db"); // Import the Sequelize instance
const auth = require("./middleware/auth");
const followRoutes = require("./routes/followRoutes"); // Import follow routes

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic Route
app.get("/", (req, res) => {
  res.send("Welcome to the Node.js Boilerplate");
});

// Sync the database (optional)
sequelize
  .sync()
  .then(() => console.log("Database synced successfully"))
  .catch((err) => console.error("Error syncing the database:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/auth", authRoutes);
app.use(auth);
app.use("/videoLinks", videoRoutes);
app.use("/follow", followRoutes); // Use follow routes
