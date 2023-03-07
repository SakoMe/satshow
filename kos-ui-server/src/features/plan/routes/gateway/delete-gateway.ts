import { requireAuth } from '@kythera/common';
import express, { Request, Response } from 'express';

import { deleteGateway } from '../../services';

const router = express.Router();

router.delete(
  '/segment-gateway/:id',
  requireAuth,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const gateway = await deleteGateway(Number(id));

    return response.status(200).json(gateway);
  },
);

export { router as deleteGatewayRouter };
