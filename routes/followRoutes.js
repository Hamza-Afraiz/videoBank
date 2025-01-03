const express = require("express");
const followController = require("../controllers/followController");
const auth = require("../middleware/auth"); // Ensure you have authentication middleware

const router = express.Router();

// Follow a user
router.post("/", auth, followController.followUser);

// Unfollow a user
router.delete("/unfollow", auth, followController.unfollowUser);

// Get followers of a user
router.get("/followers", followController.getFollowers);
router.get("/followers/count", followController.getFollowersCount);

// Get users followed by a user

module.exports = router;
