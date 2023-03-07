import { NotFoundError, requireAuth } from '@kythera/common';
import express, { Request, Response } from 'express';

import { getAllGateways } from '../../services';

const router = express.Router();

router.get(
  '/segment-gateway',
  requireAuth,
  async (_request: Request, response: Response) => {
    const gateways = await getAllGateways();
    if (!gateways) throw new NotFoundError('No gateways found.');

    return response.status(200).json(gateways);
  },
);

export { router as getAllSegmentGatewaysRouter };
