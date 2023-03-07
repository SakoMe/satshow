import { KpiBeam, KpiGateway, KpiRegion, KpiTerminal } from '@prisma/client';

import prisma from '../../../client';
import { formatBigInts } from '../../../utils';

export async function getKpiRegions(): Promise<KpiRegion[]> {
  const regions = await prisma.kpiRegion.findMany();

  await prisma.$disconnect();

  return formatBigInts(regions);
}

export async function getKpiBeams(): Promise<KpiBeam[]> {
  const beams = await prisma.kpiBeam.findMany();

  await prisma.$disconnect();

  return formatBigInts(beams);
}

export async function getKpiTerminals(): Promise<KpiTerminal[]> {
  const terminals = await prisma.kpiTerminal.findMany();

  await prisma.$disconnect();

  return formatBigInts(terminals);
}

export async function getKpiGateways(): Promise<KpiGateway[]> {
  const gateways = await prisma.kpiGateway.findMany();

  await prisma.$disconnect();

  return formatBigInts(gateways);
}
