import { requireAuth, validateRequest } from '@kythera/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { updatePlan } from '../../services';

const router = express.Router();

router.patch(
  '/plan/:id',
  requireAuth,
  [
    body('plan_name')
      .optional({ checkFalsy: true, nullable: true })
      .isString()
      .withMessage('Plan name must be a string'),
    body('number_segments')
      .optional({ checkFalsy: true, nullable: true })
      .isInt()
      .withMessage('Number of segments must be an integer'),
    body('time_period_start')
      .optional({ checkFalsy: true, nullable: true })
      .isString()
      .withMessage('Time period start must be a Date'),
    body('time_period_end')
      .optional({ checkFalsy: true, nullable: true })
      .isString()
      .withMessage('Time period end must be a Date'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { id } = request.params;

    const plan = await updatePlan(Number(id), request.body);

    return response.status(200).json(plan);
  },
);

export { router as updatePlanRouter };
