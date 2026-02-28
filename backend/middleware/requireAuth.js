// backend/middleware/requireAuth.js
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

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
    req.auth = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}