const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const RECEPTIONIST_EMAILS = [
  'digbijoy2003@gmail.com',
  'mugdho@gmail.com',
  'omi@gmail.com'
];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (for now)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const assignedRole = role || 'normal';

    if (assignedRole === 'receptionist') {
      if (!RECEPTIONIST_EMAILS.includes(email)) {
        return res.status(403).json({ message: 'Email not authorized for Receptionist role' });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Role checking logic
      if (role && user.role !== role) {
        return res.status(403).json({ message: `Access denied. Registered role is ${user.role}` });
      }
      
      // Receptionist double-check
      if (user.role === 'receptionist' && !RECEPTIONIST_EMAILS.includes(user.email)) {
         return res.status(403).json({ message: 'Email not authorized for Receptionist role' });
      }

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
