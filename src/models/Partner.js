import mongoose from "mongoose";

const PartnerSchema = new mongoose.Schema(
  {
    ownerName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["invited", "active"],
      default: "invited",
    },

    inviteToken: String,

    inviteExpires: Date,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Partner", PartnerSchema);
