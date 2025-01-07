const { Video, Follow, User } = require("../models");
const Sequelize = require("sequelize");
const fs = require("fs");
const csv = require("csv-parser");

const Op = Sequelize.Op;
const getRandomUserId = async () => {
  const users = await User.findAll({ attributes: ["id"] }); // Fetch all user IDs
  if (users.length === 0) {
    throw new Error("No users found in the database.");
  }
  const randomIndex = Math.floor(Math.random() * users.length); // Get a random index
  return users[randomIndex].id; // Return the random user ID
};

const generateRandomVideo = async () => {
  const randomVideoLink = `https://example.com/video/${Math.floor(
    Math.random() * 1000
  )}`; // Generate a random video link
  const randomVisibility = Math.random() < 0.5 ? "public" : "private"; // Randomly choose visibility
  const randomSource = ["YouTube", "Facebook", "Instagram"][
    Math.floor(Math.random() * 3)
  ]; // Randomly choose source

  try {
    const userId = await getRandomUserId(); // Get a random user ID from the database

    const videoData = {
      user_id: userId, // Use the random user ID
      video_link: randomVideoLink,
      visibility: randomVisibility,
      source: randomSource,
      created_at: new Date(),
    };

    await createVideo(videoData); // Call the service to create a video
    console.log(`Added video: ${randomVideoLink} for user ID: ${userId}`);
  } catch (error) {
    console.error("Error adding video:", error);
  }
};

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
const importVideosFromCSV = async (buffer) => {
  const videos = [];

  return new Promise((resolve, reject) => {
    // Use the buffer to create a readable stream
    const stream = require("stream");
    const readableStream = new stream.Readable();
    readableStream.push(buffer);
    readableStream.push(null); // Signal the end of the stream

    readableStream
      .pipe(csv())
      .on("data", (row) => {
        const { user_id, video_link, visibility, source } = row;

        // Basic validation
        if (!user_id || !video_link || !visibility || !source) {
          return reject(new Error("Missing required fields in CSV"));
        }

        videos.push({
          user_id: parseInt(user_id, 10),
          video_link,
          visibility,
          source,
          created_at: new Date(),
        });
      })
      .on("end", async () => {
        try {
          await Video.bulkCreate(videos);
          resolve(videos.length);
        } catch (error) {
          reject(new Error("Error importing videos: " + error.message));
        }
      })
      .on("error", (error) => {
        reject(new Error("Error reading CSV file: " + error.message));
      });
  });
};

module.exports = {
  getAllVideoLinks,
  getPrivateVideoLinks,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  importVideosFromCSV,
  generateRandomVideo,
};
