import { requireAuth } from '@kythera/common';
import express, { Request, Response } from 'express';

import { deleteRegion } from '../../services';

const router = express.Router();

router.delete(
  '/region/:id',
  requireAuth,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const region = await deleteRegion(Number(id));

    return response.status(200).json(region);
  },
);

export { router as deleteRegionRouter };
