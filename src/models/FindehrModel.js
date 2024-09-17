const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // Initialize PrismaClient

async function findPatientByEhrId(ehrId) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { ehrId }
    });
    return patient;
  } catch (error) {
    console.error('Error fetching patient:', error);
    throw error; // Rethrow the error after logging it
  } finally {
    await prisma.$disconnect(); // Ensure PrismaClient disconnects after the query
  }
}

module.exports = { findPatientByEhrId };
