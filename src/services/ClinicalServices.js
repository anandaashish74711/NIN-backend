const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const EHRBASE_URL = 'http://localhost:8080/ehrbase/rest/ecis/v1/composition';
const TEMPLATE_ID = 'Clinical1.v1';
const AUTH_CREDENTIALS = Buffer.from('ehrbase:ehrbase').toString('base64');

// Helper function to fetch visit and patient data by visitId
const fetchVisitById = async (visitId) => {
    // Log the incoming visitId
    console.log('Incoming visitId (string):', visitId);

    // No need to convert to integer if visitId is a UUID
    // const visitIdInt = parseInt(visitId, 10); // Remove this line
    // console.log('Converted visitId (integer):', visitIdInt); // Remove this line

    const visit = await prisma.visit.findUnique({
        where: { compositionId: visitId }, // Use visitId directly if it is a UUID
       include: {
            patient: {
                select: { 
                    ehrId: true // Only include ehrId from the patient
                },
            },
        },
    });

    // Log the fetched visit data
    console.log('Fetched visit data:', visit);

    if (!visit) {
        console.error('Visit not found for the given visitId:', visitId);
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
const getClinicalData = async (visitId) => {
    try {
        // Step 1: Fetch visit data (only once now)
        const visit = await fetchVisitById(visitId);
        
        // Step 2: Prepare the AQL query
        const sqlQuery = `
        SELECT 
            c/uid/value as CID, 
            c/content[openEHR-EHR-OBSERVATION.body_temperature.v2]/data/events/data/items[at0004]/value/magnitude as Temperature,  
            c/content[openEHR-EHR-OBSERVATION.blood_pressure.v2]/data/events/data/items[at0004]/value/magnitude as SystolicPressure,
            c/content[openEHR-EHR-OBSERVATION.blood_pressure.v2]/data/events/data/items[at0005]/value/magnitude as DiastolicPressure  
        FROM 
            EHR e 
        CONTAINS 
            COMPOSITION c[openEHR-EHR-COMPOSITION.encounter.v1] 
        WHERE  
            e/ehr_id/value = '${visit.patient.ehrId}' 
            AND c/uid/value='${visit.compositionId}'
        `;

        // Step 3: Post the AQL query to the EHRbase
        const response = await fetch('http://localhost:8080/ehrbase/rest/openehr/v1/query/aql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ aql: sqlQuery }),
        });

        // Step 4: Check for a successful response
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Step 5: Parse the response
        const clinicalData = await response.json();
        
        return clinicalData;
    } catch (error) {
        console.error('Error fetching clinical data:', error);
    }
};



module.exports = { postClinicalData, fetchAllClinicalData, fetchVisitById , getClinicalData};
