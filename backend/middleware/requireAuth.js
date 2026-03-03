import jwt from "jsonwebtoken";
import User from "../src/models/User.js";

const cookieName = "cc_token";

export default async function requireAuth(req, res, next) {
  try {
    const token =
      req.cookies?.[cookieName] ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null);

    // If token exists, do real auth
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.sub).lean();
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      req.user = {
        _id: user._id,
        id: user._id.toString(),
        role: (user.role || "STUDENT").toUpperCase(),
      };

      req.auth = payload;
      return next();
    }

    // No token, dev fallback for now
    const devUser = await User.findOne();
    if (!devUser) {
      return res.status(401).json({
        message: "Unauthorized (no users exist yet). Create a user first.",
      });
    }

    req.user = {
      _id: devUser._id,
      id: devUser._id.toString(),
      role: (devUser.role || "STUDENT").toUpperCase(),
    };

    return next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}