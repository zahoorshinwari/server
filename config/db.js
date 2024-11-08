require('dotenv').config();



// // MongoDB URI
// module.exports.MONGODB_URI = process.env.MONGODB_URL

const { MongoClient } = require('mongodb');
// const { MONGODB_URI } = require('../config/db');

let db;

async function connectToDatabase() {
  if (db) return db;  // Return cached connection if it exists

  try {
    const client = new MongoClient(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    db = client.db('auth');
    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Error connecting to database:', error.message);
    throw new Error('Failed to connect to the database');
  }
}

module.exports = { connectToDatabase };
