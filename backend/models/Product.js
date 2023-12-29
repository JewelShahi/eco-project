const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: true,
    },
    brand: {
      type: Array,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    released: { type: Date },
    cpu: { type: String },
    storage: { type: String },
    ram: { type: String },
    camera: {
      count: {
        type: Number,
        default: 0, // Provide a default value if needed
        min: 0,
      },
      resolution: {
        type: String,
        required: true,
      },
    },
    size: { type: String },
    battery: { type: String },
    color: { type: String },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    available: {
      type: Boolean,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
