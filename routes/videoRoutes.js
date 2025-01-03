const express = require("express");
const videoController = require("../controllers/videoController");

const router = express.Router();

// Routes for video links
router.get("/all", videoController.getAllVideoLinks);
router.get("/private", videoController.getPrivateVideoLinks);
router.get("/:id", videoController.getVideoById);
router.post("/", videoController.createVideo);
router.put("/:id", videoController.updateVideo);
router.delete("/:id", videoController.deleteVideo);
router.post("/import", videoController.importVideos);

module.exports = router;
