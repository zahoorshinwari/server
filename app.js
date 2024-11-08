const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const PORT =  8000;

const cors = require('cors');


// Get MongoDB URI from environment variables
const MONGODB_URI = 'mongodb+srv://khanzshinwari5371:XK4nYA2ok8M1Imnz@authentication.jhj9h.mongodb.net/?retryWrites=true&w=majority&appName=authentication'


// Initialize MongoDB Client
let db;

async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db('customer'); 
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
}

// Connect to MongoDB
connectToDatabase();

app.use(cors());


app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/about', (req, res) => {
  res.send('About route 🎉');
});

app.get('/customer', async (req, res) => {
    try {
      const db = await connectToDatabase(); // Ensure db connection
      const collection = db.collection('companies');
      const data = await collection.find().toArray();
      res.json(data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      console.error(error.stack); // Log the full stack trace
      res.status(500).send('Error fetching data');
    }
  });
  
  

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
