// models/UserModel.js
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const { MONGODB_URI } = require('../config/db');

let db;

async function connectToDatabase() {
  if (!db) {
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db('auth');
    console.log('✅ Connected to MongoDB');
  }
  return db;
}

// Get all users
const getUsers = async () => {
  const database = await connectToDatabase();
  const collection = database.collection('users');
  return collection.find().toArray();
};

// Get a user by email
const getUserByEmail = async (email) => {
  const database = await connectToDatabase();
  const collection = database.collection('users');
  return collection.findOne({ email });
};

// Create a new user (signup) with hashed password
const createUser = async (username, profession, phoneNumber, email, address, city, password) => {
  const database = await connectToDatabase();
  const collection = database.collection('users');
  const hashedPassword = await bcrypt.hash(password, 10);
  return collection.insertOne({
    username,
    profession,
    phoneNumber,
    email,
    address,
    city,
    password: hashedPassword,
    isApproved: false, // Field to track approval status
  });
};

// Authenticate user (login)
const authenticateUser = async (email, password) => {
  const user = await getUserByEmail(email);
  if (user && await bcrypt.compare(password, user.password)) {
    return user; // User authenticated
  }
  throw new Error('Invalid email or password'); // Authentication failed
};

// Approve a user by updating the isApproved field
const approveUser = async (email) => {
  const database = await connectToDatabase();
  const collection = database.collection('users');
  return collection.updateOne({ email }, { $set: { isApproved: true } });
};

// Reject a user by deleting their record from the database
const rejectUser = async (email) => {
  const database = await connectToDatabase();
  const collection = database.collection('users');
  return collection.deleteOne({ email });
};

module.exports = {
  getUsers,
  getUserByEmail,
  createUser,
  authenticateUser,
  approveUser,
  rejectUser
};
