import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import adminRoutes from "./routes/admin.js";

const app = express();
const requiredEnv = ["MONGO_URI", "JWT_SECRET"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnv.join(", ")}`,
  );
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// Register routes
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

//const PORT = 5001;
const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected DB:", mongoose.connection.db.databaseName);

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    console.log("Collections:");
    collections.forEach((c) => console.log(c.name));

    const indexes = await mongoose.connection.db.collection("gyms").indexes();

    console.log(indexes);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(console.error);
