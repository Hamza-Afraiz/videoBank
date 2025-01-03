const followService = require("../services/followService");

// Follow a user
const followUser = async (req, res) => {
  const followerId = req.user.id; // Get the ID of the user who is following
  const { followedId } = req.body; // Get the ID of the user to be followed

  try {
    const follow = await followService.followUser(followerId, followedId);
    return res.status(201).json(follow);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error following user" });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  const followerId = req.user.id; // Get the ID of the user who is unfollowing
  const { followedId } = req.body; // Get the ID of the user to be unfollowed

  try {
    const result = await followService.unfollowUser(followerId, followedId);
    if (result) {
      return res.status(204).send(); // No content
    } else {
      return res.status(404).json({ message: "Follow relationship not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error unfollowing user" });
  }
};

// Get followers of a user
const getFollowers = async (req, res) => {
  const userId = req.user.id; // Get the user ID from the request parameters

  try {
    const followers = await followService.getFollowers(userId);
    return res.json(followers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getFollowersCount = async (req, res) => {
  const userId = req.user.id; // Get the user ID from the request parameters

  try {
    const followers = await followService.getFollowersCount(userId);
    return res.json(followers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get users followed by a user
const getFollowedUsers = async (req, res) => {
  const userId = req.params.id; // Get the user ID from the request parameters

  try {
    const followedUsers = await followService.getFollowedUsers(userId);
    return res.json(followedUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowedUsers,
  getFollowersCount,
};
