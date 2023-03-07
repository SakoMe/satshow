import { NotFoundError, requireAuth } from '@kythera/common';
import { Request, Response, Router } from 'express';

import { getGateways } from '../services/layers';

const router = Router();

router.get('/gateways', requireAuth, async (_request: Request, response: Response) => {
  const gateways = await getGateways();
  if (!gateways) throw new NotFoundError('Gateways not found');
  return response.status(200).json(gateways);
});

export { router as layerGatewaysRouter };
