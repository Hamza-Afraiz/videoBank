const { Follow, User } = require("../models");
const sequelize = require("../config/db");

// Follow a user
const followUser = async (followerId, followedId) => {
  // Check if the follow relationship already exists
  const existingFollow = await Follow.findOne({
    where: { follower_id: followerId, followed_id: followedId },
  });

  if (existingFollow) {
    throw new Error("You are already following this user.");
  }

  // Create a new follow relationship
  return await Follow.create({
    follower_id: followerId,
    followed_id: followedId,
  });
};

// Unfollow a user
const unfollowUser = async (followerId, followedId) => {
  const follow = await Follow.findOne({
    where: { follower_id: followerId, followed_id: followedId },
  });

  if (!follow) {
    return null; // Follow relationship not found
  }

  await follow.destroy(); // Delete the follow relationship
  return true; // Successfully unfollowed
};

// Get followers of a user
const getFollowers = async (userId) => {
  return await User.findAll({
    logging: console.log,
    where: { id: userId },
    include: [
      {
        model: User,
        as: "Followers",
        attributes: ["id", "username"],
        through: { attributes: [] },
      },
    ],
  });
};

// Get followers count for a user
const getFollowersCount = async (userId) => {
  try {
    // Fetch the user along with the followers count
    const user = await User.findOne({
      where: { id: userId },
      attributes: [
        "id",
        "username",
        "password",
        "created_at",
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM follows WHERE follows.followed_id = ${userId})`
          ),
          "FollowersCount",
        ],
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Convert Sequelize instance to plain JSON and return
    return user.get({ plain: true });
    // const user = await User.findOne({
    //   where: { id: userId },
    //   attributes: [
    //     "id",
    //     "username",
    //     "password",
    //     "created_at",
    //     [
    //       sequelize.fn("COUNT", sequelize.col("Followers.id")),
    //       "FollowersCount",
    //     ],
    //   ],
    //   include: [
    //     {
    //       model: User,
    //       as: "Followers",
    //       through: {
    //         attributes: ["id", "created_at"], // Include Follow table columns here
    //       },
    //     },
    //   ],
    //   group: [
    //     "User.id",
    //     "User.username",
    //     "User.password",
    //     "User.created_at",
    //     "Followers->Follow.id",
    //     "Followers->Follow.created_at",
    //     "Followers->Follow.follower_id",
    //     "Followers->Follow.followed_id",
    //     "Followers.id",
  } catch (error) {
    console.error("Error fetching user with followers count:", error);
    throw error;
  }
};

// Get users followed by a user
const getFollowedUsers = async (userId) => {
  return await Follow.findAll({
    where: { follower_id: userId },
    include: [{ model: User, as: "Followed", attributes: ["id", "username"] }],
  });
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowedUsers,
  getFollowersCount,
};
