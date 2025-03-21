const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "subcategory must be unique"],
      minlength: [2, "To short subcategory name"],
      maxlength: [32, "To long subcategory name"],
      trim: true,
    },

    // A and B  => shopping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "subCategory must be belong to parent category"],
    },
  },
  { timestamps: true }
);

// 2. Create Model
module.exports = mongoose.model("SubCategory", subCategorySchema);
