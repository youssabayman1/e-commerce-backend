const mongoose = require("mongoose");

// 1. Create Schema
const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand is required"],
      unique: [true, "Brand must be unique"],
      minlength: [3, "To short Brand name"],
      maxlength: [32, "To long Brand name"],
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
const brand = mongoose.model("Brand", BrandSchema);

// Export the model
module.exports = brand;
