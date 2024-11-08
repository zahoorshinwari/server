const express = require('express');
const { getUsers, getUserByEmail } = require('../models/userModel');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await getUsers();
    res.send(data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    console.error(error.stack);
    res.status(500).send('Error fetching data');
  }
});


// Get a single user by email
router.get('/:email', async (req, res) => {
  const { email } = req.params; // Get the email from route params
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.send(user);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    console.error(error.stack);
    res.status(500).send('Error fetching data');
  }
});




module.exports = router;