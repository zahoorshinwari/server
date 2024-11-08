const express = require('express');
const cors = require('cors');
const customerRoutes = require('./routes/customerRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 8000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/about', (req, res) => {
  res.send('About route 🎉');
});

// Use the route files
app.use('/customer', customerRoutes);
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});