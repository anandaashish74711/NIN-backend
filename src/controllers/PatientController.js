const axios = require('axios');
const { updatePatient } = require('../models/PatientModel');

const updatePatientData = async (rawData) => {
  const credentials = Buffer.from('ehrbase:ehrbase').toString('base64');

  try {
    const response = await axios.post('http://localhost:8080/ehrbase/rest/ecis/v1/composition?format=FLAT&templateId=ehr_projectX_patient_registration_v1&ehrId=af6d28ed-7854-4535-aac0-fa930dd31731', rawData, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Basic ${credentials}`
      }
    });

    if (response.data && response.data.compositionUid) {
      const compositionUid = response.data.compositionUid;

      // Update patient record in the database
      const id = 'c3c078ff-a09e-485e-a32b-36c30d5df75a';
      const name = 'kartik'
      const updatedPatient = await updatePatient(id,compositionUid,name);

      return {
        success: true,
        compositionUid,
        updatedPatient
      };
    } else {
      throw new Error('Invalid response from EHRbase');
    }
  } catch (error) {
    console.error('Error sending data to EHRbase', error);
    throw new Error('Error sending data to EHRbase');
  }
};

// Middleware function to handle the request and response
const handleUpdatePatientData = async (req, res) => {
  const { ehrId, rawData } = req.body;

  try {
    const result = await updatePatientData(ehrId,rawData);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating patient data:', error);
    res.status(500).json({ error: 'Error updating patient data' });
  }
};

module.exports = {
  handleUpdatePatientData
};
