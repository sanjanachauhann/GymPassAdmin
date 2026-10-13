import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["superadmin", "admin"],
      default: "admin",
    },

    status: {
      type: String,
      enum: ["invited", "active"],
      default: "invited",
    },

    inviteToken: {
      type: String,
      default: null,
    },

    inviteExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Admin", adminSchema);
