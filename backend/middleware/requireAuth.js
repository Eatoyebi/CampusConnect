import User from "../models/User.js";

export default async function requireAuth(req, res, next) {
  try {
    // Dev shortcut: allow passing a user id in a header
    const userId = req.header("x-user-id");

    if (!userId) {
      return res.status(401).json({
        message: "Missing auth. Provide x-user-id header for development.",
      });
    }

    const user = await User.findById(userId).select("_id role email name");
    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
}
