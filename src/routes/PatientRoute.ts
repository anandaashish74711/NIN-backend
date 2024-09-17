
import  express  from "express";
const { handleUpdatePatientData } = require('../controllers/PatientController');

const router = express.Router();

router.patch('/update-patient',  handleUpdatePatientData);

module.exports = router;

