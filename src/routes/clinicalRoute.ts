import  express  from "express";
const router = express.Router();
const { handlePostClinicalData ,handlefetchAllClinicalData,handlegetClinicaldataehrbase} = require('../controllers/clinicalController');
//post clinicaldata
router.post('/postClinicalData', handlePostClinicalData);

//get compositionUid of clinicaldata
router.get('/getallClinicalData', handlefetchAllClinicalData);                                                                                                                                                                                                                                                                                                                                                                                             

//get  clinical Data
router.get('/getClinicalData', handlegetClinicaldataehrbase);


module.exports = router;                                                                                                                                  