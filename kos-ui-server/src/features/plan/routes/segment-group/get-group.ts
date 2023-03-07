import { NotFoundError, requireAuth } from '@kythera/common';
import { Request, Response, Router } from 'express';

import { getServiceSegmentGroupById } from '../../services';

const router = Router();

router.get(
  '/segment-group/:id',
  requireAuth,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const serviceSegmentGroup = await getServiceSegmentGroupById(Number(id));
    if (!serviceSegmentGroup) throw new NotFoundError('Segment group not found');

    return response.status(200).json(serviceSegmentGroup);
  },
);

export { router as getServiceSegmentGroupRouter };
