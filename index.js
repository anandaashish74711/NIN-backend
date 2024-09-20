"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.js or app.js
const express_1 = __importDefault(require("express"));
const ehrRouter = require('./src/routes/ehrRoutes');
const bodyParser = require('body-parser');
const patientRoutes = require('./src/routes/PatientRoute');
const visitroute = require('./src/routes/VisitRoute');
const clinicalRoute = require('./src/routes/clinicalRoute');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3002;
// Middleware to parse JSON bodies
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.use(bodyParser.json());
app.use('/api', patientRoutes);
app.use('/api', ehrRouter);
app.use('/api', visitroute);
app.use('/api', clinicalRoute);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
