const { postClinicalData, fetchAllClinicalData } = require('../services/ClinicalServices');

// Handles posting of clinical data
const handlePostClinicalData = async (req, res) => {
    const visitId = req.query.compositionUid; 
    const clinicalData = req.body;

    if (!visitId) {
        return res.status(400).json({ error: 'visitId is required' });
    }

    try {
        const result = await postClinicalData(visitId, clinicalData);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error posting clinical data:', error);
        res.status(500).json({ error: 'Error posting clinical data' });
    }
};

// Handles fetching of all clinical data for a given visit
const handlefetchAllClinicalData = async (req, res) => {
    const visitId = req.query.compositionUid; 

    if (!visitId) {
        return res.status(400).json({ error: 'visitId is required' });
    }

    try {
        const clinicalDataRecords = await fetchAllClinicalData(visitId);
        res.status(200).json(clinicalDataRecords);
    } catch (error) {
        console.error('Error fetching clinical data:', error);
        res.status(500).json({ error: 'Error fetching clinical data' });
    }
};

module.exports = { handlePostClinicalData, handlefetchAllClinicalData };
