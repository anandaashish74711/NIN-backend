const express = require('express');
const { createEhrAndStore } = require('../controllers/ehrController');

const router = express.Router();

// Route to create EHR and store in the database
router.post('/create-ehr', createEhrAndStore);

module.exports = router;
