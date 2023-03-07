import { NotFoundError, requireAuth } from '@kythera/common';
import { Request, Response, Router } from 'express';

import { getAllServiceSegmentGroups } from '../../services';

const router = Router();

router.get(
  '/segment-group',
  requireAuth,
  async (_request: Request, response: Response) => {
    const serviceSegmentGroups = await getAllServiceSegmentGroups();
    if (!serviceSegmentGroups) throw new NotFoundError('Segment groups not found');

    return response.status(200).json(serviceSegmentGroups);
  },
);

export { router as getAllServiceSegmentGroupsRouter };
