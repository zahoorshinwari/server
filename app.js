const express = require('express');
const cors = require('cors');
const customerRoutes = require('./routes/customerRoutes');
const userRoutes = require('./routes/userRoutes');
const { connectToDatabase } = require('./config/db');

const app = express();
const PORT = 8000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/about', (req, res) => {
  res.send('About route 🎉');
});

app.use(express.json())
// Use the route files
app.use('/customer', customerRoutes);
app.use('/users', userRoutes);


// Connect to MongoDB before starting the server
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);  // Exit the application on connection failure
  });

// app.listen(PORT, () => {
//   console.log(`✅ Server is running on port ${PORT}`);
// });