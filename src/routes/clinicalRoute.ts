import  express  from "express";
const router = express.Router();
const { handlePostClinicalData ,handlefetchAllClinicalData} = require('../controllers/clinicalController');

router.post('/postClinicalData', handlePostClinicalData);
router.get('/getallClinicalData', handlefetchAllClinicalData);


module.exports = router;