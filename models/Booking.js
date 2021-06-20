const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
  bookingStartDate: {
    type: Date,
    required: true,
  },
  bookingEndDate: {
    type: Date,
    required: true,
  },
  itemId: [
    {
      _id: { type: ObjectId, ref: "Item" },
      price: {
        type: Number,
        require: true,
      },
      night: {
        type: Number,
        required: true,
      },
    },
  ],
  memberId: [{ type: ObjectId, ref: "Member" }],
  bankId: [{ type: ObjectId, ref: "Bank" }],
  proofPayment: {
    type: String,
    require: true,
  },
  bankFrom: {
    type: String,
    required: true,
  },
  accountHolder: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
