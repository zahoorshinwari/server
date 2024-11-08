const { MongoClient } = require('mongodb');
const { MONGODB_URI } = require('../config/db');

let db;

async function connectToDatabase() {
  if (!db) {
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db('customer');
    console.log('✅ Connected to MongoDB');
  }
  return db;
}

const getCompanies = async () => {
  const database = await connectToDatabase();
  const collection = database.collection('companies');
  return collection.find().toArray();
};

module.exports = { getCompanies };