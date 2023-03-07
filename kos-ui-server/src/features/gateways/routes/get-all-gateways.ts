import { getCurrentUser, NotFoundError, requireAuth } from '@kythera/common';
import { Request, Response, Router } from 'express';

import { getAllGateways } from '../services/gateways';

const router = Router();

router.get(
  '/gateways',
  getCurrentUser,
  requireAuth,
  async (_request: Request, response: Response) => {
    const gateways = await getAllGateways();
    if (!gateways) throw new NotFoundError('Gateways not found');

    return response.status(200).json(gateways);
  },
);

export { router as getAllGatewaysRouter };
