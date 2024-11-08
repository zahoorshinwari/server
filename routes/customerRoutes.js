const express = require('express');
const { getCompanies, getCompanyById, createCompany, updateCompany, deleteCompany } = require('../models/customerModel');
const router = express.Router();

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await getCompanies();
    res.json({ status: true, companies });
  } catch (error) {
    console.error('Error fetching companies:', error.message);
    console.error(error.stack);
    res.status(500).json({ status: false, message: 'Error fetching companies' });
  }
});

// Get company by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const company = await getCompanyById(id);
    if (!company) {
      return res.status(404).json({ status: false, message: 'Company not found' });
    }
    res.json({ status: true, company });
  } catch (error) {
    console.error('Error fetching company:', error.message);
    console.error(error.stack);
    res.status(500).json({ status: false, message: 'Error fetching company' });
  }
});

// Create a new company
router.post('/', async (req, res) => {
  const companyData = req.body; // Extract company data from request body
  try {
    await createCompany(companyData);
    res.json({ status: true, message: 'Company created successfully' });
  } catch (error) {
    console.error('Error creating company:', error.message);
    console.error(error.stack);
    res.status(500).json({ status: false, message: 'Error creating company' });
  }
});

// Update a company
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const companyData = req.body; // Extract updated company data from request body
  try {
    const result = await updateCompany(id, companyData);
    if (result.modifiedCount === 0) {
      return res.status(404).json({ status: false, message: 'Company not found or no changes made' });
    }
    res.json({ status: true, message: 'Company updated successfully' });
  } catch (error) {
    console.error('Error updating company:', error.message);
    console.error(error.stack);
    res.status(500).json({ status: false, message: 'Error updating company' });
  }
});

// Delete a company
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteCompany(id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ status: false, message: 'Company not found' });
    }
    res.json({ status: true, message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error.message);
    console.error(error.stack);
    res.status(500).json({ status: false, message: 'Error deleting company' });
  }
});

module.exports = router;
