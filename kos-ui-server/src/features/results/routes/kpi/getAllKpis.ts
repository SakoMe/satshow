import { NotFoundError, requireAuth } from '@kythera/common';
import { Request, Response, Router } from 'express';

import {
  getKpiBeams,
  getKpiGateways,
  getKpiRegions,
  getKpiTerminals,
} from '../../services/kpi';

const router = Router();

router.get('/kpi', requireAuth, async (_request: Request, response: Response) => {
  const regions = await getKpiRegions();
  if (!regions) throw new NotFoundError('KPI Regions not found');

  const beams = await getKpiBeams();
  if (!beams) throw new NotFoundError('KPI Beams found');

  const terminals = await getKpiTerminals();
  if (!terminals) throw new NotFoundError('KPI Terminals not found');

  const gateways = await getKpiGateways();
  if (!gateways) throw new NotFoundError('KPI Gateways not found');

  return response.status(200).json({ regions, beams, terminals, gateways });
});

export { router as getKpisRouter };
