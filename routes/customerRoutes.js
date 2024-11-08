const express = require('express');
const { getCompanies } = require('../models/customerModel');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await getCompanies();
    res.send(data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    console.error(error.stack);
    res.status(500).send('Error fetching data');
  }
});

module.exports = router;