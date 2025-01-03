const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Video = sequelize.define(
  "Video",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    video_link: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true, // Built-in URL validation
      },
    },
    visibility: {
      type: DataTypes.ENUM("public", "private"),
      allowNull: false,
      defaultValue: "private",
    },
    source: {
      type: DataTypes.ENUM("YouTube", "Facebook", "Instagram"),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "videos",
    timestamps: false,
  }
);

module.exports = Video;
