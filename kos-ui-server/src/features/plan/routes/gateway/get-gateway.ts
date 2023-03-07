import { NotFoundError, requireAuth } from '@kythera/common';
import express, { Request, Response } from 'express';

import { getGatewayById } from '../../services';

const router = express.Router();

router.get(
  '/segment-gateway/:id',
  requireAuth,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const gateway = await getGatewayById(Number(id));
    if (!gateway) throw new NotFoundError('Gateway not found');

    return response.status(200).json(gateway);
  },
);

export { router as getGatewayRouter };
