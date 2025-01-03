const { User, Video, Follow } = require("./models"); // Import necessary models
const sequelize = require("./config/db");

// Define dummy data for sources (Direct insert into the Source table)
const dummySources = [
  { name: "YouTube" },
  { name: "Facebook" },
  { name: "Instagram" },
];

// Define dummy data for users
const dummyUsers = [
  {
    username: "john_doe",
    email: "john@example.com",
    password: "hashedpassword1",
  },
  {
    username: "jane_doe",
    email: "jane@example.com",
    password: "hashedpassword2",
  },
  {
    username: "alex_smith",
    email: "alex@example.com",
    password: "hashedpassword3",
  },
];

// Define dummy data for video links (without source_id initially)
const dummyVideoLinks = [
  {
    userId: 1,
    sourceName: "YouTube",
    url: "https://youtube.com/video1",
    visibility: "public",
  },
  {
    userId: 2,
    sourceName: "Facebook",
    url: "https://facebook.com/video2",
    visibility: "private",
  },
  {
    userId: 3,
    sourceName: "Instagram",
    url: "https://instagram.com/video3",
    visibility: "public",
  },
];

// Define dummy follow relationships
const dummyFollows = [
  { followerId: 1, followedId: 2 }, // john_doe follows jane_doe
  { followerId: 2, followedId: 3 }, // jane_doe follows alex_smith
];

// Function to seed the database
async function seedDatabase() {
  try {
    // Start the database transaction using the Sequelize instance
    const transaction = await sequelize.transaction();

    // Insert sources and get their ids
    const sourceResults = await sequelize.query(
      'INSERT INTO "Sources" ("name") VALUES (:name) RETURNING id',
      {
        replacements: { name: "YouTube" },
        transaction,
        type: sequelize.QueryTypes.INSERT,
      }
    );
    const youtubeId = sourceResults[0][0].id;

    const sourceResultsFacebook = await sequelize.query(
      'INSERT INTO "Sources" ("name") VALUES (:name) RETURNING id',
      {
        replacements: { name: "Facebook" },
        transaction,
        type: sequelize.QueryTypes.INSERT,
      }
    );
    const facebookId = sourceResultsFacebook[0][0].id;

    const sourceResultsInstagram = await sequelize.query(
      'INSERT INTO "Sources" ("name") VALUES (:name) RETURNING id',
      {
        replacements: { name: "Instagram" },
        transaction,
        type: sequelize.QueryTypes.INSERT,
      }
    );
    const instagramId = sourceResultsInstagram[0][0].id;

    // Now we can add the correct source_id to video links
    const updatedVideoLinks = dummyVideoLinks.map((video) => {
      let sourceId;
      if (video.sourceName === "YouTube") sourceId = youtubeId;
      if (video.sourceName === "Facebook") sourceId = facebookId;
      if (video.sourceName === "Instagram") sourceId = instagramId;

      return { ...video, sourceId };
    });

    // Create users
    await User.bulkCreate(dummyUsers, { transaction });
    console.log("Dummy users created!");

    // Create video links with correct source_id
    await Video.bulkCreate(updatedVideoLinks, { transaction });
    console.log("Dummy video links created!");

    // Create follow relationships
    await Follow.bulkCreate(dummyFollows, { transaction });
    console.log("Dummy follow relationships created!");

    // Commit the transaction
    await transaction.commit();
    console.log("Database seeding successful!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run the seed function
seedDatabase();
