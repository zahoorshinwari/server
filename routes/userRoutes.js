const express = require('express');
const { getUsers } = require('../models/userModel');
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

module.exports = router;
