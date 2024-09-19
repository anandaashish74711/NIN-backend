const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // Initialize PrismaClient

const { updatePatient } = require('../models/PatientModel');

const updatePatientData = async (ehrId, rawData) => {
  const credentials = Buffer.from('ehrbase:ehrbase').toString('base64');
  const url = `http://localhost:8080/ehrbase/rest/ecis/v1/composition?format=FLAT&templateId=ehr_projectX_patient_registration_v1&ehrId=${ehrId}`;

  try {
    console.log(rawData)
    // Extract the name from rawData
     const name = rawData["ehr_projectx_patient_registration_v1/personal_details/demographics_container/person_name_isa/full_name"] || 'Unknown';

    
    // Validate that name is present
    if (!name) {
      throw new Error('Name not found in rawData');
    }

    // Send data to EHRbase
    const response = await axios.post(url, rawData, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Basic ${credentials}`
      }
    });

    if (response.data && response.data.compositionUid) {
      const { compositionUid } = response.data;

      // Assuming `updatePatient` is a function to update the patient in your system
      const updatedPatient = await updatePatient(ehrId, compositionUid, name);

      return {
        success: true,
        compositionUid,
        updatedPatient
      };
    } else {
      throw new Error('Invalid response from EHRbase');
    }
  } catch (error) {
    console.error('Error sending data to EHRbase:', error.message);
    throw new Error('Error sending data to EHRbase');
  }
};

const fetchAllPatients = async () => {
  try {
    const allUsers = await prisma.patient.findMany();
    console.log('Fetched patients:', allUsers);
    return allUsers;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw new Error('Error fetching patients');
  }
};


module.exports = {
  updatePatientData,
  fetchAllPatients
};
