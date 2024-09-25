"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { handlePostClinicalData, handlefetchAllClinicalData, handlegetClinicaldataehrbase } = require('../controllers/clinicalController');
//post clinicaldata
router.post('/postClinicalData', handlePostClinicalData);
//get compositionUid of clinicaldata
router.get('/getallClinicalData', handlefetchAllClinicalData);
//get  clinical Data
router.get('/getClinicalData', handlegetClinicaldataehrbase);
module.exports = router;
