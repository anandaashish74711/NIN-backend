"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/VisitRoute.js
const express_1 = __importDefault(require("express"));
const { handlePostVisitData, handleFetchVisitsByPatient } = require('../controllers/VisitController');
const router = express_1.default.Router();
router.post('/create-visit', handlePostVisitData);
router.get('/getvisitsbypatientid', handleFetchVisitsByPatient);
module.exports = router;
