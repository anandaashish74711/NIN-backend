"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { handleUpdatePatientData, handleFetchAllPatients } = require('../controllers/PatientController');
const router = express_1.default.Router();
router.patch('/update-patient', handleUpdatePatientData);
router.get('/getallpatients', handleFetchAllPatients);
module.exports = router;
