const mongoose = require("mongoose");
const Product = require("./productModel"); // Import the Product model

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "product", // Reference to the Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0, // Represents the discount percentage
    },
    customerDetails: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      Name: {
        type: String,
        required: true,
      },
      Phone: {
        type: String,
        required: true,
      },
      Email: {
        type: String,
        required: true,
        lowercase: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "inprogress", "out-for-delivery", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Middleware to calculate the total amount before saving
orderSchema.pre("save", async function (next) {
  let totalAmount = 0;

  // Populate the product details, especially the price
  await this.populate({
    path: "products.product", // Populating the referenced product field
    select: "price quantity", // Select price and quantity from the product
  });

  // Loop through the products array and calculate the total
  for (let productItem of this.products) {
    const productPrice = productItem.product.price; // Get price from populated product
    productItem.total = productItem.quantity * productPrice;
    totalAmount += productItem.total;

    // Decrease the stock quantity after the order is placed
    const product = await Product.findById(productItem.product); // Fetch the product
    if (product.quantity < productItem.quantity) {
      throw new Error(`Not enough stock for product ${productItem.product}`);
    }

    product.quantity -= productItem.quantity; // Reduce the quantity of the product
    await product.save(); // Save the updated product document
  }

  // Apply discount if there is one, using percentage
  if (this.discountPercentage > 0) {
    totalAmount = totalAmount - totalAmount * (this.discountPercentage / 100);
  } else {
    // Apply a flat discount if no percentage discount is applied
    totalAmount = totalAmount - this.discount;
  }

  this.totalAmount = totalAmount;
  next();
});

module.exports = mongoose.model("Order", orderSchema);
