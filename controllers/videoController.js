const videoService = require("../services/videoService");
const {
  NotFoundError,
  ValidationError,
  AuthorizationError,
  DatabaseError,
} = require("../utils/CustomErrors");
const { response } = require("../helpers/csvHelper");

const getAllVideoLinks = async (req, res) => {
  const userId = req.user.id;
  const { export: exportCsv } = req.query;

  try {
    const videoLinks = await videoService.getAllVideoLinks(userId);

    if (exportCsv === "true") {
      // Export video links to CSV
      return response(videoLinks, res);
    }

    return res.json(videoLinks);
  } catch (error) {
    console.error(error);
    return res.status(500).json(new DatabaseError("Internal server error"));
  }
};

const getPrivateVideoLinks = async (req, res) => {
  const userId = req.user.id;
  const { export: exportCsv } = req.query;

  try {
    const privateVideos = await videoService.getPrivateVideoLinks(userId);

    if (exportCsv === "true") {
      // Export video links to CSV
      return response(privateVideos, res);
    }

    return res.json(privateVideos);
  } catch (error) {
    console.error(error);
    return res.status(500).json(new DatabaseError("Internal server error"));
  }
};

const getVideoById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Get user ID from token

  try {
    const video = await videoService.getVideoById(id);
    if (!video) {
      throw new NotFoundError("Video not found");
    }

    // Check if the video belongs to the user
    if (video.user_id !== userId) {
      throw new AuthorizationError("Access denied");
    }

    return res.json(video);
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const createVideo = async (req, res) => {
  const { video_link, visibility, source } = req.body;
  const userId = req.user.id; // Get user ID from token

  try {
    // Validate input (example)
    if (!video_link) {
      throw new ValidationError("Video link is required");
    }

    const newVideo = await videoService.createVideo({
      userId,
      video_link,
      visibility,
      source,
    });
    return res.status(201).json(newVideo);
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 400).json({ message: error.message });
  }
};

const updateVideo = async (req, res) => {
  const { id } = req.params;
  const { video_link, visibility, source } = req.body;
  const userId = req.user.id; // Get user ID from token

  try {
    const video = await videoService.getVideoById(id);
    if (!video) {
      throw new NotFoundError("Video not found");
    }

    // Check if the video belongs to the user
    if (video.user_id !== userId) {
      throw new AuthorizationError("Access denied");
    }

    const updatedVideo = await videoService.updateVideo(id, {
      video_link,
      visibility,
      source,
    });
    return res.json(updatedVideo);
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 400).json({ message: error.message });
  }
};

const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Get user ID from token

  try {
    const video = await videoService.getVideoById(id);
    if (!video) {
      throw new NotFoundError("Video not found");
    }

    // Check if the video belongs to the user
    if (video.user_id !== userId) {
      throw new AuthorizationError("Access denied");
    }

    const deleted = await videoService.deleteVideo(id);
    if (!deleted) {
      throw new NotFoundError("Video not found");
    }
    return res.status(204).send(); // No content
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  getAllVideoLinks,
  getPrivateVideoLinks,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
};
