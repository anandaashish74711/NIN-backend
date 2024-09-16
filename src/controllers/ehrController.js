const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');

/* The `async function createEhrAndStore(req, res)` function is responsible for creating a new
Electronic Health Record (EHR) and storing its ID in a PostgreSQL database using Prisma. Here is a
breakdown of what the function does: */
async function createEhrAndStore(req, res) {
  try {
    // Generate a new UUID for each request
    const uniquePartyId = uuidv4();
    console.log('Generated uniquePartyId:', uniquePartyId);

    // Define the payload to send in the POST request
    const payload = {
      "_type": "EHR_STATUS",
      "name": {
        "_type": "DV_TEXT",
        "value": "EHR Status"
      },
      "subject": {
        "_type": "PARTY_SELF",
        "external_ref": {
          "namespace": "DEMOGRAPHIC",
          "type": "PERSON",
          "id": {
            "_type": "HIER_OBJECT_ID",
            "value": uniquePartyId  // Use the variable here
          }
        }
      },
      "archetype_node_id": "openEHR-EHR-EHR_STATUS.generic.v1",
      "uid": {
        "_type": "HIER_OBJECT_ID",
        "value": `${uniquePartyId}::local.ehrbase.org::1`  // Use the variable here
      },
      "is_modifiable": true,
      "is_queryable": true
    };

    // Make the POST request to EHRbase to create a new EHR and receive the ehrId
    const ehrResponse = await axios.post('http://localhost:8080/ehrbase/rest/openehr/v1/ehr', payload, {
      headers: {
        'Content-Type': 'application/json',
        'prefer': 'return=representation'
      }
    });

    // Log the full response for debugging
    console.log('EHR Response:', ehrResponse.data);

    // Extract ehrId
    const ehrId = ehrResponse?.data?.ehr_id?.value;
    if (!ehrId) {
      throw new Error('EHR ID not found in response');
    }

    // Store the ehrId in PostgreSQL using Prisma
    await prisma.patient.create({
      data: {
        ehrId: ehrId,
        compositionId:"",
        name:""
      },
    });

    // Send the ehrId back to the frontend
    res.status(201).json({
      message: 'Patient created successfully',
      ehrId: ehrId,
    });

  } catch (error) {
    // Detailed error logging
    console.error('Error details:', error.response ? error.response.data : error.message);
    res.status(500).json({
      message: 'Error creating patient',
      error: error.response ? error.response.data : error.message,
    });
  }
}

module.exports = { createEhrAndStore };
