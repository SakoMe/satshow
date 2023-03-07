import prisma from '../../../client';
import { formatBigInts } from '../../../utils';

async function getAllTerminals() {
  const data = await prisma.terminal.findMany({
    select: {
      terminal_id: true,
      location: true,
      mobile_user: true,
      terminal_placement: {
        select: {
          terminal_name: true,
        },
      },
    },
  });
  await prisma.$disconnect();
  return formatBigInts(data);
}

export { getAllTerminals };
