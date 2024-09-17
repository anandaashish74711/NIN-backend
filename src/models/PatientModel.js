const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updatePatient=  async (id, compositionId, name) => {
    return prisma.patient.update({
      where: { ehrId : id },
      data: { compositionId, name },
    });
  }

module.exports = {
  updatePatient
};
