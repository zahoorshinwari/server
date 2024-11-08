const { MongoClient } = require('mongodb');
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

const getUsers = async () => {
  const database = await connectToDatabase();
  const collection = database.collection('users');
  return collection.find().toArray();
};

module.exports = { getUsers };
