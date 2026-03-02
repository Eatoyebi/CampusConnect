import User from "../src/models/User.js";

export default async function requireAuth(req, res, next) {
  try {

    const devUser = await User.findOne();
    if (!devUser) {
      return res.status(401).json({
        message: "Unauthorized (no users exist yet). Create a user first.",
      });
    }

    req.user = { id: devUser._id.toString(), role: devUser.role || "student" };
    next();
  } catch (err) {
    console.error("requireAuth error:", err);
    res.status(500).json({ message: "Auth middleware failed" });
  }
}
