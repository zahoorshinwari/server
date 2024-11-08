const { MongoClient, ObjectId } = require('mongodb');
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

// Get all companies
const getCompanies = async () => {
  const database = await connectToDatabase();
  const collection = database.collection('companies');
  return collection.find().toArray();
};

// Get a single company by ID
const getCompanyById = async (id) => {
  const database = await connectToDatabase();
  const collection = database.collection('companies');
  return collection.findOne({ _id: new ObjectId(id) });
};

// Create a new company
const createCompany = async (companyData) => {
  const database = await connectToDatabase();
  const collection = database.collection('companies');
  return collection.insertOne(companyData);
};

// Update a company by ID
const updateCompany = async (id, companyData) => {
  const database = await connectToDatabase();
  const collection = database.collection('companies');
  return collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: companyData }
  );
};

// Delete a company by ID
const deleteCompany = async (id) => {
  const database = await connectToDatabase();
  const collection = database.collection('companies');
  return collection.deleteOne({ _id: new ObjectId(id) });
};

module.exports = { getCompanies, getCompanyById, createCompany, updateCompany, deleteCompany };
