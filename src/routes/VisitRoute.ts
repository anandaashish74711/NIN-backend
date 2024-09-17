// src/routes/VisitRoute.js
import express from 'express';
const { handlePostVisitData } = require('../controllers/VisitController');
const router = express.Router();



router.post('/create-visit', handlePostVisitData);

module.exports = router;
