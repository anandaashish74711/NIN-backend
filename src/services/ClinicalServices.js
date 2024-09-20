const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const EHRBASE_URL = 'http://localhost:8080/ehrbase/rest/ecis/v1/composition';
const TEMPLATE_ID = 'Clinical1.v1';
const AUTH_CREDENTIALS = Buffer.from('ehrbase:ehrbase').toString('base64');

// Helper function to fetch visit and patient data by visitId
const fetchVisitById = async (visitId) => {
    const visitIdInt = parseInt(visitId, 10);
    const visit = await prisma.visit.findUnique({
        where: { id: visitIdInt },
        include: { patient: true },
    });

    if (!visit) {
        throw new Error('Visit not found for the given visitId');
    }
    return visit;
};

// Helper function to post clinical data to EHRbase
const postToEhrbase = async (ehrId, clinicalData) => {
    const response = await axios.post(
        `${EHRBASE_URL}?format=FLAT&templateId=${TEMPLATE_ID}&ehrId=${ehrId}`,
        clinicalData,
        {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Basic ${AUTH_CREDENTIALS}`,
            },
        }
    );

    if (response.data && response.data.compositionUid) {
        return response.data.compositionUid;
    } else {
        throw new Error('Failed to get compositionUid from EHRbase');
    }
};

// Helper function to save clinical data in the database
const saveClinicalData = async (visitId, compositionUid) => {
    const clinicalDataRecord = await prisma.clinicalData.create({
        data: {
            visitId,
            compositionId: compositionUid,
        },
    });

    return clinicalDataRecord;
};

// Main function to post clinical data, now reusing visit fetching
const postClinicalData = async (visitId, clinicalData) => {
    try {
        // Step 1: Fetch visit and patient data
        const visit = await fetchVisitById(visitId);
        const ehrId = visit.patient.ehrId;
        console.log('ehrId:', ehrId);

        // Step 2: Post clinical data to EHRbase
        const compositionUid = await postToEhrbase(ehrId, clinicalData);
        console.log('Composition UID:', compositionUid);

        // Step 3: Save clinical data in the database
        const clinicalDataRecord = await saveClinicalData(visit.id, compositionUid);
        console.log('Clinical data saved successfully:', clinicalDataRecord);

        return clinicalDataRecord;
    } catch (error) {
        console.error('Error posting clinical data:', error.message);
        throw new Error('Error posting clinical data');
    }
};

// Function to fetch all clinical data associated with a specific visit
const fetchAllClinicalData = async (visitId) => {
    try {
        // Step 1: Fetch visit data (only once now)
        const visit = await fetchVisitById(visitId);

        // Step 2: Fetch all clinical data linked to this visit
        const clinicalDataRecords = await prisma.clinicalData.findMany({
            where: { visitId: visit.id },
        });

        if (clinicalDataRecords.length === 0) {
            console.log('No clinical data found for this visit');
            return [];
        }

        console.log('Clinical data records for visit:', clinicalDataRecords);
        return clinicalDataRecords;
    } catch (error) {
        console.error('Error fetching clinical data:', error.message);
        throw new Error('Error fetching clinical data');
    }
};

module.exports = { postClinicalData, fetchAllClinicalData, fetchVisitById };
