import { NotAuthorizedError, requireAuth, validateRequest } from '@kythera/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { createPlan } from '../../services';

const router = express.Router();

router.post(
  '/plan',
  requireAuth,
  [
    body('plan_name')
      .notEmpty()
      .isString()
      .withMessage('Plan name is required and must be a string'),
    body('number_segments')
      .notEmpty()
      .isInt()
      .withMessage('Number of segments is required and must be an integer'),
    body('time_period_start')
      .not()
      .isEmpty()
      .isString()
      .withMessage('Time period start is required and must be a Date'),
    body('time_period_end')
      .not()
      .isEmpty()
      .isString()
      .withMessage('Time period end is required and must be a Date'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    let userId: number;
    if (request.currentUser) {
      userId = request.currentUser.id;
    } else {
      throw new NotAuthorizedError('You are not authorized to perform this action');
    }

    const plan = await createPlan(request.body, userId);

    return response.status(201).json(plan);
  },
);

export { router as createPlanRouter };
