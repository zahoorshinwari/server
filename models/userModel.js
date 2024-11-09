// models/UserModel.js
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const { connectToDatabase } = require('../config/db');






// Get all users
const getUsers = async () => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('users');
    return await collection.find().toArray();
  } catch (error) {
    console.error('Error fetching users:', error.message);
    throw new Error('Failed to fetch users');
  }
};

// Get a user by email
const getUserByEmail = async (email) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('users');
    return await collection.findOne({ email });
  } catch (error) {
    console.error('Error fetching user by email:', error.message);
    throw new Error('Failed to fetch user by email');
  }
};

// Create a new user (signup) with hashed password
const createUser = async (username, profession, phoneNumber, email, address, city, password) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('users');
    const hashedPassword = await bcrypt.hash(password, 10);
    return await collection.insertOne({
      username,
      profession,
      phoneNumber,
      email,
      address,
      city,
      password: hashedPassword,
      isApproved: false, // Field to track approval status
    });
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw new Error('Failed to create user');
  }
};

// Authenticate user (login)
const authenticateUser = async (email, password) => {
  try {
    const user = await getUserByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user; // User authenticated
    }
    throw new Error('Invalid email or password'); // Authentication failed
  } catch (error) {
    console.error('Authentication error:', error.message);
    throw new Error('Failed to authenticate user');
  }
};

// Approve a user by updating the isApproved field
const approveUser = async (email) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('users');
    return await collection.updateOne({ email }, { $set: { isApproved: true } });
  } catch (error) {
    console.error('Error approving user:', error.message);
    throw new Error('Failed to approve user');
  }
};

// Reject a user by deleting their record from the database
const rejectUser = async (email) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('users');
    return await collection.deleteOne({ email });
  } catch (error) {
    console.error('Error rejecting user:', error.message);
    throw new Error('Failed to reject user');
  }
};

module.exports = {
  getUsers,
  getUserByEmail,
  createUser,
  authenticateUser,
  approveUser,
  rejectUser
};
