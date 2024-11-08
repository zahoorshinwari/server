const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URL;

async function testConnection() {
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    await client.close();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

testConnection();
