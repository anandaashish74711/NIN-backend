const axios = require('axios');
const { addVisit } = require('../models/VisitModel');
const { findPatientByEhrId } = require('../models/FindehrModel');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();  


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

const fetchVisitsByPatient = async (patientId) => {
  try {
    const visits = await prisma.visit.findMany({
      where: { patientId }, 
      
    });
    console.log('Fetched visits for patient:', visits);
    return visits;
  } catch (error) {
    console.error('Error fetching visits for patient:', error);
    throw new Error('Error fetching visits for patient');
  }
};

module.exports = { postVisitData, fetchVisitsByPatient };

