import User from '../models/User.js';
import StudentProfile from '../models/StudentUser.js';
import MaintenanceUser from '../models/MaintenanceUserModel.js';
import StaffUserModel from '../models/StaffUser.js';

export const createUser = async (req, res) => {

try {
    //create base user
    const { name, email, password, role, mNumber, major, graduationYear, department, jobTitle, phoneNumber } = req.body;

    const profileImage = req.file ? req.file.filename : null;

    const allowedRoles = ['student', 'maintenance', 'staff'];

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.create({ name, email, role, password });

    if (role === 'student') {
        await StudentProfile.create({
            user: user._id,
            mNumber,
            major,
            graduationYear,
    });
}

    else if (role === 'maintenance') {
        await MaintenanceUser.create({
            user: user._id,
            tickets: []
        });
    }
    else if (role === 'staff') {
        await StaffUserModel.create({
            user: user._id,
            department,
            jobTitle,
            email,
            phoneNumber
        });
    }
    return res.status(201).json({messag: 'User created succesfully', userId: user._id});
}
    catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({message: 'Interal server error while creating user'});
    }
};
 
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
        const allowedFields = [
            'name',
            'email',
            'major',
            'graduationYear',
            'department',
            'jobTitle',
            'phoneNumber',
            'profileImageURL',
            'bio'
        ];

        const updates = {};
        if (req.file) {
            updates.profileImageURL = req.file.filename;
        }
        for(const key of allowedFields) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }
        const user = await User.findByIDAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true,
                runValidators: true
            }
        );
        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.json({message: 'User updated successfully', user});
    } catch (error) {
        res.status(500).json({message: 'Internal server error while updating user'});
    }
}

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