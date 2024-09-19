// src/routes/VisitRoute.js
import express from 'express';
const { handlePostVisitData ,handleFetchVisitsByPatient } = require('../controllers/VisitController');
const router = express.Router();



router.post('/create-visit', handlePostVisitData);
router.get('/getvisitsbypatientid',handleFetchVisitsByPatient);


module.exports = router;
