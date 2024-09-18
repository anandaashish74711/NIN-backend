const axios = require('axios');
const { addVisit } = require('../models/VisitModel');
const { findPatientByEhrId } = require('../models/FindehrModel')


const postVisitData = async (ehrId, visitData) => {
  const credentials = Buffer.from('ehrbase:ehrbase').toString('base64');

  try {
    // Replace `ehr_projectX_visit_registration_v1` with your actual templateId
    const response = await axios.post(`http://localhost:8080/ehrbase/rest/ecis/v1/composition?format=FLAT&templateId=visit.v1&ehrId=${ehrId}`, visitData, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Basic ${credentials}`
      }
    });

    if (response.data && response.data.compositionUid) {
      const compositionUid = response.data.compositionUid;
      console.log(response.data)

      // Retrieve the patientId from the ehrId
      const patient = await findPatientByEhrId(ehrId); 
      if (!patient) {
        throw new Error('Patient not found');
      }

      // Add visit record to the database
      const newVisit = await addVisit(patient.id, compositionUid);

      return {
        success: true,
        compositionUid,
        newVisit
      };
    } else {
      throw new Error('Invalid response from EHRbase');
    }
  } catch (error) {
    console.error('Error sending visit data to EHRbase', error);
    throw new Error('Error sending visit data to EHRbase');
  }
};
// src/controllers/VisitController.js
const handlePostVisitData = async (req, res) => {
  console.log('Received a request to handlePostVisitData');
  console.log('Request method:', req.method);
  console.log('Request query parameters:', req.query);
  console.log('Request body:', req.body);

  const ehrId = req.query.ehrId; // Extract ehrId from query parameters
  const visitData = req.body; // Extract visitData from request body

  if (!ehrId) {
    return res.status(400).json({ error: 'ehrId is required' });
  }

  try {
    const result = await postVisitData(ehrId, visitData);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error posting visit data:', error);
    res.status(500).json({ error: 'Error posting visit data' });
  }
};


module.exports = {
  handlePostVisitData
};
