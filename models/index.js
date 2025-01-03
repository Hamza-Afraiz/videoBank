const User = require("./User");
const Video = require("./Video");
const Follow = require("./Follow");

// Define associations
User.hasMany(Video, { foreignKey: "user_id" });
Video.belongsTo(User, { foreignKey: "user_id" });

User.belongsToMany(User, {
  through: Follow,
  as: "Followers",
  foreignKey: "followed_id",
  otherKey: "follower_id",
});

User.belongsToMany(User, {
  through: Follow,
  as: "Followed",
  foreignKey: "follower_id",
  otherKey: "followed_id",
});
// Follow.belongsTo(User, { foreignKey: "follower_id", as: "Follower" });
// Follow.belongsTo(User, { foreignKey: "followed_id", as: "Followed" });

// Skip associations for Source as it doesn't have a model
// If you still need to store source data, it must be done directly via query or separate logic

module.exports = { User, Video, Follow };
