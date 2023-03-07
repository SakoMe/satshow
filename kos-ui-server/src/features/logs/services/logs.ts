import prisma from '../../../client';

async function getAllLogs() {
  const data = await prisma.eventLog.findMany({});

  await prisma.$disconnect();
  return data;
}

export { getAllLogs };
