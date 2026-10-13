import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

dotenv.config();

const email = "admin@gympass.com";
const password = "ChangeThisPassword123!";

async function activateAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (!admin) {
      console.log(`Admin not found: ${email}`);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    admin.password = hashedPassword;
    admin.role = "superadmin";
    admin.status = "active";
    admin.inviteToken = null;
    admin.inviteExpires = null;

    await admin.save();

    console.log("================================");
    console.log("Admin activated successfully");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);
    console.log("Status:", admin.status);
    console.log("================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Failed to activate admin:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

activateAdmin();
