import { NotFoundError, requireAuth } from '@kythera/common';
import { Request, Response, Router } from 'express';

import { getAllServiceSegments } from '../../services';

const router = Router();

router.get(
  '/service-segment',
  requireAuth,
  async (_request: Request, response: Response) => {
    const serviceSegments = await getAllServiceSegments();
    if (!serviceSegments) throw new NotFoundError('Service Segments not found');

    return response.status(200).json(serviceSegments);
  },
);

export { router as getAllServiceSegementsRouter };
