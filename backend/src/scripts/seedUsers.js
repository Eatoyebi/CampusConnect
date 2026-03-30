import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const UNIVERSITY_ID = "UC";

const seed = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error("Missing MONGO_URL in .env");
    }

    await connectDB(mongoUrl);

    const users = [

      {
        name: "Nicole Test",
        email: "studentNicole@test.com",
        password: "Password123!",
        role: "student",
        universityId: UNIVERSITY_ID,
        housing: { building: "Turner", roomNumber: "512", raId: "" },
      },
      {
        name: "Window Technician",
        email: "maintWin@test.com",
        password: "Password123!",
        role: "maintenance",
        universityId: UNIVERSITY_ID,
      },
    ];

    for (const u of users) {
      const existing = await User.findOne({ email: u.email, universityId: u.universityId });

      const passwordHash = await bcrypt.hash(u.password, 10);

      if (existing) {
        await User.updateOne(
          { _id: existing._id },
          {
            $set: {
              name: u.name,
              role: u.role,
              universityId: u.universityId,
              passwordHash,
              raAssignment: u.raAssignment,
              housing: u.housing,
            },
          }
        );
        console.log(`Updated: ${u.email}`);
      } else {
        await User.create({
          name: u.name,
          email: u.email,
          role: u.role,
          universityId: u.universityId,
          passwordHash,
          raAssignment: u.raAssignment,
          housing: u.housing,
        });
        console.log(`Created: ${u.email}`);
      }
    }

    console.log("Seed complete");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
};

seed();