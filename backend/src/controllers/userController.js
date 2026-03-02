import User from "../models/User.js";
import MaintenanceUser from "../models/MaintenanceUser.js";
import StaffUserModel from "../models/StaffUser.js";
import StudentUser from "../models/StudentUser.js"; 
/**
 * Helper: attach a usable URL for profile images
 */
const attachProfileImageUrl = (req, user) => {
  if (!user) return user;

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const u = user.toObject ? user.toObject() : user;

  if (u.profileImage && !String(u.profileImage).startsWith("http")) {
    u.profileImageUrl = `${baseUrl}/uploads/${u.profileImage}`;
  } else {
    u.profileImageUrl = u.profileImage || null;
  }

  return u;
};


export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      mNumber,
      major,
      graduationYear,
      department,
      jobTitle,
      phoneNumber
    } = req.body;

    const profileImage = req.file ? req.file.filename : null;

    const allowedRoles = ["student", "maintenance", "staff"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // create base user
    const user = await User.create({ name, email, role, password, profileImage });

    if (role === "student") {
      const studentProfile = await StudentProfile.create({
        user: user._id,
        mNumber: String(mNumber ?? "").trim(),
        major: String(major ?? "").trim(),
        graduationYear,
      });
    
      user.studentProfile = studentProfile._id;
      await user.save();
    } else if (role === "maintenance") {
      const maintenanceProfile = await MaintenanceUser.create({
        user: user._id,
        tickets: [],
      });

      user.maintenanceProfile = maintenanceProfile._id;
      await user.save();

    } else if (role === "staff") {
      const staffProfile = await StaffUserModel.create({
        user: user._id,
        department,
        jobTitle,
        email,
        phoneNumber,
      });

      user.staffProfile = staffProfile._id;
      await user.save();
    }

    return res.status(201).json({
      message: "User created successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error while creating user" });
  }
};


export const getUserById = async (req, res) => {
  try {
    const user = await User
      .findById(req.params.id)
      .populate("studentProfile maintenanceProfile staffProfile");

    if (user) {
      if (user.role === "student") {
        await user.populate("studentProfile");
      } else if (user.role === "maintenance") {
        await user.populate("maintenanceProfile");
      } else if (user.role === "staff") {
        await user.populate("staffProfile");
      }
      return res.json(attachProfileImageUrl(req, user));
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("getUserById error:", error);
    return res.status(500).json({ message: "Internal server error while fetching user" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users.map(u => attachProfileImageUrl(req, u)));
  } catch (error) {
    console.error("getAllUsers error:", error);
    return res.status(500).json({ message: "Internal server error while fetching users" });
  }
};

/**
 * Admin/ID-based update: PUT /api/users/:id
 * (keeps /me separate via updateMe)
 */
export const updateUser = async (req, res) => {
  try {
    const { name, email, bio, major, graduationYear } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (bio !== undefined) updates.bio = bio;
    if (major !== undefined) updates.major = major;
    if (graduationYear !== undefined) updates.graduationYear = graduationYear;

    if (req.file) {
      updates.profileImage = req.file.filename;
    } else if (req.body.profileImage === "") {
      updates.profileImage = null;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    return res.json(attachProfileImageUrl(req, updatedUser));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }

    console.error("updateUser error:", error);
    return res.status(500).json({
      message: "Error updating user profile",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      message: "User deleted successfully",
      deletedUser: user,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error while deleting user" });
  }
};


export const searchUsers = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
    })
      .limit(20)
      .lean();

    const userIds = users.map(u => u._id);

    const studentProfiles = await StudentUser
      .find({ user: { $in: userIds } })
      .lean();

    const profileMap = new Map(
      studentProfiles.map(p => [String(p.user), p])
    );

    const merged = users.map(u => ({
      ...u,
      studentProfile: profileMap.get(String(u._id)) || null
    }));

    return res.json(merged);
  } catch (error) {
    console.error("searchUsers error:", error);
    return res.status(500).json({ message: "Search failed", error: error.message });
  }
};

/**
 * /me endpoints
 */
export const getMe = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(attachProfileImageUrl(req, user));
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({ message: "Internal server error while fetching current user" });
  }
};

export const updateMe = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { name, email, bio, major, graduationYear } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (bio !== undefined) updates.bio = bio;
    if (major !== undefined) updates.major = major;
    if (graduationYear !== undefined) updates.graduationYear = graduationYear;

    if (req.file) {
      updates.profileImage = req.file.filename;
    } else if (req.body.profileImage === "") {
      updates.profileImage = null;
    }

    // prevent role escalation through /me
    delete updates.role;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    return res.json(attachProfileImageUrl(req, updatedUser));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }

    console.error("updateMe error:", error);
    return res.status(500).json({
      message: "Error updating your profile",
      error: error.message,
    });
  }
};