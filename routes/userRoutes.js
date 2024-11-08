// routes/userRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getUsers, getUserByEmail, createUser, approveUser, rejectUser } = require('../models/userModel');

const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// Middleware to verify JWT token
const verifyUser = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.status(401).json({ status: false, message: 'No token provided' });
    }

    await jwt.verify(token, process.env.JWT_SECRET);  // Use environment variable for the secret
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await getUsers();
    res.json({ status: true, users });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Error fetching users');
  }
});

// Get a single user by email
router.get('/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.send(user);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Error fetching user');
  }
});

// Sign up route
router.post('/signup', async (req, res) => {
  const { username, profession, phoneNumber, email, address, city, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    await createUser(username, profession, phoneNumber, email, address, city, password);
    return res.json({ status: true, message: 'User registered. Please wait for admin approval.' });
  } catch (error) {
    console.error('Error during signup:', error.message);
    res.status(500).json({ message: 'Internal server error during signup' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'User not registered' });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: 'Your account is not approved by the admin' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
    return res.json({ status: true, message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Internal server error during login' });
  }
});

// Route to verify the token
router.get('/verify', verifyUser, (req, res) => {
  return res.json({ status: true, message: 'Authorized' });
});

// Logout route
router.get('/logout', (req, res) => {
  try {
    res.clearCookie('token');
    return res.json({ status: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error.message);
    res.status(500).json({ message: 'Error logging out' });
  }
});

// Approve a user
router.post('/approve/:email', async (req, res) => {
  const { email } = req.params;
  try {
    await approveUser(email);
    res.json({ status: true, message: 'User approved' });
  } catch (error) {
    console.error('Error approving user:', error.message);
    res.status(500).json({ status: false, message: 'Error approving user' });
  }
});

// Reject a user
router.delete('/reject/:email', async (req, res) => {
  const { email } = req.params;
  try {
    await rejectUser(email);
    res.json({ status: true, message: 'User rejected and deleted' });
  } catch (error) {
    console.error('Error rejecting user:', error.message);
    res.status(500).json({ status: false, message: 'Error rejecting user' });
  }
});

module.exports = router;
