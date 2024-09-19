
import  express  from "express";
const { handleUpdatePatientData , handleFetchAllPatients} = require('../controllers/PatientController');

const router = express.Router();

router.patch('/update-patient', handleUpdatePatientData);
 router.get('/getallpatients', handleFetchAllPatients);

module.exports = router;

