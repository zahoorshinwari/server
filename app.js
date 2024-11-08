const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const PORT =  8000;

// Get MongoDB URI from environment variables
const MONGODB_URI = 'mongodb+srv://khanzshinwari5371:XK4nYA2ok8M1Imnz@auth.xa8qt.mongodb.net/?retryWrites=true&w=majority&appName=auth'


// Initialize MongoDB Client
let db;

async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db('auth'); 
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
}

// Connect to MongoDB
connectToDatabase();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/about', (req, res) => {
  res.send('About route 🎉');
});

app.get('/users', async (req, res) => {
  try {
    const collection = db.collection('users'); // replace with your collection name
    const data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
