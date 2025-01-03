const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // Your PostgreSQL port (default: 5432)
    dialect: "postgres", // Specify the dialect as PostgreSQL
    logging: false, // Disable logging for cleaner console output
  }
);

(async () => {
  try {
    await sequelize.sync();
    console.log("Connected to PostgreSQL database");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
