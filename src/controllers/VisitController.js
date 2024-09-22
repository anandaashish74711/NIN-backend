
const { findPatientByEhrId } = require('../models/FindehrModel'); 
const { fetchVisitsByPatient } = require('../services/VisitServices');
const { postVisitData} = require('../services/VisitServices');

const handlePostVisitData = async (req, res) => {
  console.log('Received a request to handlePostVisitData');
  console.log('Request method:', req.method);
  console.log('Request query parameters:', req.query);
  console.log('Request body:', req.body);

  const ehrId = req.query.ehrId; d
  const visitData = req.body; 
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




// Fetch visits for a specific patient based on ehrId or patientId
const handleFetchVisitsByPatient = async (req, res) => {
  const { ehrId } = req.query; 
console.log(ehrId)
  if (!ehrId) {
    return res.status(400).json({ error: 'ehrId is required' });
  }

  try {
   
    const patient = await findPatientByEhrId(ehrId);
    console.log(patient)
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Fetch visits related to this patient
    const visits = await fetchVisitsByPatient(patient.id);
    
    if (visits.length === 0) {
      return res.status(200).json({ message: 'No visits found for this patient', visits: [] });
    }

    res.status(200).json({ visits });
  } catch (error) {
    console.error('Error fetching visits:', error.message);
    res.status(500).json({ error: 'Error fetching visits' });
  }
};


module.exports = {
  handlePostVisitData,
  handleFetchVisitsByPatient
};
