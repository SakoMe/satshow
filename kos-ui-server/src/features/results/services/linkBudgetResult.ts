import { LinkBudgetResult } from '@prisma/client';

import prisma from '../../../client';
import { formatBigInts } from '../../../utils';

export async function getLinkBudgetResults(): Promise<LinkBudgetResult[]> {
  const linkBudgetResults = await prisma.linkBudgetResult.findMany();

  await prisma.$disconnect();

  return formatBigInts(linkBudgetResults);
}
