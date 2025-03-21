const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "To short products title "],
      maxlength: [100, "To short products title "],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      required: [true, "product description is required"],
      minlength: [20, "To short product description "],
    },
    quantity: {
      type: Number,
      required: [true, "product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      reqired: [true, "product price is required"],
      trim: true,
      max: [1000, "to long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "product image is required"],
    },
    image: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to category"],
    },
    SubCategories: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal to 1.0"],
      max: [5, "Rating must be below or equal to 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category", // The field to populate
    select: "name", // Only select the 'name' field from the populated category
  });
  next();
});
// Mongoose query middleware

module.exports = mongoose.model("product", productSchema);
