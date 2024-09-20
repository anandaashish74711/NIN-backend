// server.js or app.js
import express, { Request, Response } from 'express';
const ehrRouter = require('./src/routes/ehrRoutes');
const bodyParser = require('body-parser');
const patientRoutes = require('./src/routes/PatientRoute');
const visitroute = require('./src/routes/VisitRoute');
const clinicalRoute=require('./src/routes/clinicalRoute')

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.use(bodyParser.json());

app.use('/api', patientRoutes);
app.use('/api', ehrRouter);
app.use('/api', visitroute);
app.use('/api',clinicalRoute);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
