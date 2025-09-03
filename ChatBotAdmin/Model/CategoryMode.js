const mongoose = require('mongoose');

// Define the schema for the Category model
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true, // Ensures each category is unique
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create the Category model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
