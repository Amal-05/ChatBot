const mongoose = require('mongoose');

// Define the schema for the Avatar model
const avatarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Avatar name is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create the Avatar model
const Avatar = mongoose.model('Avatar', avatarSchema);

module.exports = Avatar;
