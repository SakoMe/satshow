import { requireAuth } from '@kythera/common';
import { Request, Response, Router } from 'express';

import { deleteServiceSegmentGroup } from '../../services';

const router = Router();

router.delete(
  '/segment-group/:id',
  requireAuth,
  async (request: Request, response: Response) => {
    const { id } = request.params;

    const serviceSegmentGroup = await deleteServiceSegmentGroup(Number(id));

    return response.status(200).json(serviceSegmentGroup);
  },
);

export { router as deleteServiceSegmentGroupRouter };
