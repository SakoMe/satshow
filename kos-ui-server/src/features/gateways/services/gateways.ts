import prisma from '../../../client';
import { formatBigInts } from '../../../utils';

async function getAllGateways() {
  const data = await prisma.gateway.findMany({});

  await prisma.$disconnect();
  return formatBigInts(data);
}

export { getAllGateways };
