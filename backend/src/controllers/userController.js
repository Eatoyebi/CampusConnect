import User from '../models/User.js';
import StudentProfile from '../models/StudentUser.js';
import MaintenanceUser from '../models/MaintenanceUserModel.js';
import StaffUserModel from '../models/StaffUser.js';


 
export const getUserById = async (req, res) => {
    try {
        const user = await User
        .findById(req.params.id)
        .populate('studentProfile maintenanceProfile staffProfile');
        if(user) {
            if(user.role==='student') {
                await user.populate('studentProfile');
            }
            else if(user.role=='maintenance') {
                await user.populate('maintenanceProfile');
            }
            else if(user.role==='staff') {
                await user.populate('staffProfile');
            }  
            res.json(user);
        } else {
            res.status(404).json({message: 'User not found'});
        }
    }
    catch (error) {
        res.status(500).json({message: 'Internal server error while fetching user'});
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching users' });
    }
};

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
    } 
    else if (req.body.profileImage === "") {
      updates.profileImage = null;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json(attachProfileImageUrl(req, updatedUser));

  } catch (error) {

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already in use",
      });
    }

    res.status(500).json({
      message: "Error updating user profile",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByIdAndDelete(userId);
        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }

        res.json({
            message: 'User deleted succesfully',
            deletedUser: user
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({message: 'Internal server error while deleting user'});
    }
}

export const searchUsers = async (req, res) => {
  const q = (req.query.q || "").trim();

  const filter = q
    ? {
        $or: [
          { email: new RegExp(q, "i") },
          { name: new RegExp(q, "i") },
          { major: new RegExp(q, "i") }
        ]
      }
    : {};

  const users = await User.find(filter).limit(25);

  res.json(users);
};

