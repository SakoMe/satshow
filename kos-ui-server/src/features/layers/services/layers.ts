import prisma from '../../../client';
import { formatBigInts } from '../../../utils';

export async function getTerminals() {
  const terminal = await prisma.terminal.findMany({
    include: {
      mobility_histories: { select: { position: true } },
    },
  });

  return formatBigInts(terminal);
}
export async function getBeams() {
  const beam = await prisma.cell.findMany({
    select: {
      cell_id: true,
      polygon_coordinates: true,
    },
  });

  return formatBigInts(beam);
}

export async function getGateways() {
  const gateway = await prisma.gateway.findMany({
    select: {
      gateway_id: true,
      location: true,
    },
  });

  return formatBigInts(gateway);
}
