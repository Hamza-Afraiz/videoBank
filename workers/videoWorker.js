const videoQueue = require("../queues/videoQueue");
const videoService = require("../services/videoService");

videoQueue.process(async (job) => {
  const { fileBuffer } = job.data;
  try {
    const count = await videoService.importVideosFromCSV(fileBuffer);
    console.log(`${count} videos imported successfully.`);
  } catch (error) {
    console.error("Error importing videos:", error);
    throw error; // This will mark the job as failed
  }
});
