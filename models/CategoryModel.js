const mongoose = require("mongoose");

// 1. Create Schema
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category is required"],
      unique: [true, "category must be unique"],
      minlength: [3, "To short category name"],
      maxlength: [32, "too long category name"],
    },

    // A and B  => shopping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
      unique: true, // Enforce uniqueness
    },

    image: String,
  },
  { timestamps: true }
);

// 2. Create Model
const category = mongoose.model("Category", CategorySchema);

// Export the model
module.exports = category;
