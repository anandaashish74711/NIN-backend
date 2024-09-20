// clinicalDataModel.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


const findVisitById = async (visitId) => {
    const visitIdInt = parseInt(visitId, 10);
    const visit = await prisma.visit.findUnique({
        where: {
            id: visitIdInt,
        },
        include: {
            patient: true,
        },
    });

    if (!visit) {
        throw new Error('Visit not found for the given visitId');
    }

    return visit;
};

const saveClinicalData = async (visitId, compositionUid) => {
    const clinicalDataRecord = await prisma.clinicalData.create({
        data: {
            visitId: visitId,  // Link to the correct visit
            compositionId: compositionUid,  // Store the composition UID
        },
    });

    return clinicalDataRecord;
};

module.exports = {
    findVisitById,
    saveClinicalData,
};
