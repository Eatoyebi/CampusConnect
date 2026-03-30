import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const cookieName = "cc_token";

function signToken(user) {
  const days = Number(process.env.JWT_EXPIRES_DAYS || 7);

  return jwt.sign(
    { sub: user._id.toString(), role: user.role, universityId: user.universityId },
    process.env.JWT_SECRET,
    { expiresIn: `${days}d` }
  );
}

export async function login(req, res) {
  try {
    const { email, password, universityId } = req.body;

    if (!email || !password || !universityId) {
      return res.status(400).json({ message: "email, password, universityId are required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      universityId: String(universityId).trim(),
      isActive: { $ne: false },
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);

    res.cookie("cc_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: (Number(process.env.JWT_EXPIRES_DAYS || 7) * 24 * 60 * 60 * 1000),
    });

    return res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        universityId: user.universityId,
      },
    });
  } catch (e) {
    console.error("login error", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function me(req, res) {
  // requireAuth attaches req.user
  return res.json(req.user);
}

export async function logout(req, res) {
  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ message: "Logged out" });
}