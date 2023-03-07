import { requireAuth } from '@kythera/common';
import express, { Request, Response } from 'express';

import { deleteServiceSegment } from '../../services';

const router = express.Router();

router.delete(
  '/service-segment/:id',
  requireAuth,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const serviceSegment = await deleteServiceSegment(Number(id));

    return response.status(200).json(serviceSegment);
  },
);

export { router as deleteServiceSegmentRouter };
