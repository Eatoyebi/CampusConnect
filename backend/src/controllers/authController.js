import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import MaintenanceUser from '../models/MaintenanceUserModel.js';
import StaffUserModel from '../models/StaffUser.js';
import jwt from 'jsonwebtoken';

export const createUser = async (req, res) => {

try {
    //create base user
    const { name, email, password, role, mNumber, major, graduationYear, department, jobTitle, phoneNumber } = req.body;

    const profileImage = req.file ? req.file.filename : null;

    const allowedRoles = ['student', 'maintenance', 'ra', 'admin'];

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.create({ name, email, role, password });

    if (role === 'student') {
        await StudentProfile.create({
            user: user._id,
            mNumber,
            major,
            graduationYear, //add password fields?
    });
}

    else if (role === 'maintenance') {
        await MaintenanceUser.create({
            user: user._id,
            tickets: []
        });
    }
    else if (role === 'ra') {
        await StaffUserModel.create({
            user: user._id,
            department,
            jobTitle,
            email,
            phoneNumber
        });
    }
    return res.status(201).json({message: 'User created succesfully', userId: user._id});
}
    catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({message: 'Interal server error while creating user'});
    }
};


export const loginUser = async( req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({message: "Invalid email or password"});

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({
        token,
        user: {
            id: user._id,
            name: user.name,
            role: user.role
        }
    })
};