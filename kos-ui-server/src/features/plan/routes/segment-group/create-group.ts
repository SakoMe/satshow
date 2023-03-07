import { requireAuth, validateRequest } from '@kythera/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';

import { createServiceSegmentGroup } from '../../services';

const router = Router();

router.post(
  '/segment-group',
  requireAuth,
  [body('service_segment_group_name').notEmpty().withMessage('Name is required')],
  validateRequest,
  async (request: Request, response: Response) => {
    const serviceSegmentGroup = await createServiceSegmentGroup(request.body);

    return response.status(201).json(serviceSegmentGroup);
  },
);

export { router as createServiceSegmentGroupRouter };
