import mongoose from "mongoose";
const gymSchema = new mongoose.Schema(
  {
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
    },

    placeId: {
      type: String,
      required: true,
      unique: true,
    },

    gymName: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    rating: Number,

    passes: {
      daily: Number,
      weekly: Number,
      monthly: Number,
      yearly: Number,
    },
  },
  {
    timestamps: true,
  },
);
export default mongoose.model("gyms", gymSchema);
