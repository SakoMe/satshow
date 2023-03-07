import { requireAuth, validateRequest } from '@kythera/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';

import { updateServiceSegmentGroup } from '../../services';

const router = Router();

router.patch(
  '/segment-group/:id',
  requireAuth,
  [
    body('service_segment_group_name')
      .optional({ checkFalsy: true, nullable: true })
      .isString()
      .withMessage('Name must be a string'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { id } = request.params;

    const serviceSegmentGroup = await updateServiceSegmentGroup(Number(id), request.body);

    return response.status(200).json(serviceSegmentGroup);
  },
);

export { router as updateServiceSegmentGroupRouter };
