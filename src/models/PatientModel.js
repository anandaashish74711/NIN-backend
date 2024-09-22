const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updatePatient=  async (id, compositionId, name ,email ,age, gender) => {
    return prisma.patient.update({
      where: { ehrId : id },
      data: { compositionId, name , email , age ,gender },
    });
  }

module.exports = {
  updatePatient
};
