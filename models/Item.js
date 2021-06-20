const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    default: "Indonesia",
  },
  city: {
    type: String,
  },
  isPopular: {
    type: Boolean,
  },
  description: {
    type: String,
  },
  imageId: [{ type: ObjectId, ref: "Image" }],
  featureId: [{ type: ObjectId, ref: "Feature" }],
  activityId: [{ type: ObjectId, ref: "Activity" }],
});

module.exports = mongoose.model("Image", ItemSchema);
