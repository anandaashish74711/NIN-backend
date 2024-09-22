const { PrismaClient } = require('@prisma/client');
const date = require('date-and-time');

const prisma = new PrismaClient();

async function addVisit(patientId, compositionId) {
  try {
   
    
    const now = new Date();
    console.log("time",now)

    // Create a new visit record
    const newVisit = await prisma.visit.create({
      data: {
        patientId,
        compositionId,
        visitDate: now // Use the formatted date
      }
    });

    return newVisit;
  } catch (error) {
    console.error('Error creating visit:', error);
    throw error; 
  } finally {
    await prisma.$disconnect(); 
  }
}

module.exports = { addVisit };
