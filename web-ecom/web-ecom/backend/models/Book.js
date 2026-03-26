const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    default: "Uncategorized",
  },
  image: {
    type: String,
    default: "",
  }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
