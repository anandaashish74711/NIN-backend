const { updatePatientData, fetchAllPatients } = require('../services/PatientServices');
const handleUpdatePatientData = async (req, res) => {
  const rawData = req.body;
  console.log(rawData);
  const { ehrId } = req.query;
  console.log(ehrId);
  try {
    const result = await updatePatientData(ehrId, rawData);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating patient data:', error.message);
    res.status(500).json({ error: 'Error updating patient data' });
  }
};

 
const handleFetchAllPatients = async (req, res) => {
  try {
    const patients = await fetchAllPatients(); 
    res.status(200).json(patients); 
  } catch (error) {
    console.error('Error fetching all patients:', error.message);
    res.status(500).json({ error: 'Error fetching all patients' });
  }
};


module.exports = {
  handleUpdatePatientData,
  handleFetchAllPatients
};
