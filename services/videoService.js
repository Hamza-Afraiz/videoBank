const { Video, Follow } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const getAllVideoLinks = async (userId) => {
  try {
    // Get user's own videos (private and public)
    const userVideos = await Video.findAll({
      where: {
        user_id: userId,
      },
    });

    // Get followed users' public videos
    const followedVideos = await Video.findAll({
      where: {
        user_id: {
          [Op.in]: Sequelize.literal(`(
            SELECT followed_id FROM follows WHERE follower_id = ${userId}
          )`),
        },
        visibility: "public",
      },
    });

    return [...userVideos, ...followedVideos];
  } catch (error) {
    throw new Error("Error fetching video links: " + error.message);
  }
};

const getPrivateVideoLinks = async (userId) => {
  try {
    return await Video.findAll({
      where: {
        user_id: userId,
        visibility: "private",
      },
    });
  } catch (error) {
    throw new Error("Error fetching private video links: " + error.message);
  }
};
const getVideoById = async (id) => {
  return await Video.findByPk(id);
};

const createVideo = async (videoData) => {
  return await Video.create(videoData);
};

const updateVideo = async (id, videoData) => {
  const video = await Video.findByPk(id);
  if (!video) return null; // Video not found
  return await video.update(videoData);
};

const deleteVideo = async (id) => {
  const video = await Video.findByPk(id);
  if (!video) return null; // Video not found
  await video.destroy();
  return true; // Successfully deleted
};

module.exports = {
  getAllVideoLinks,
  getPrivateVideoLinks,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
};
