import { requireAuth, validateRequest } from '@kythera/common';
import { RegulatoryConstraint } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { updateManyConstraints } from '../../services';

const router = express.Router();

router.patch(
  '/constraint-collection',
  requireAuth,
  [
    body()
      .notEmpty()
      .isArray()
      .custom((constraints: RegulatoryConstraint[]) => {
        return constraints.every((constraint) => {
          return typeof constraint === 'object' && typeof constraint.id === 'number';
        });
      })
      .withMessage(
        'Invalid constraint collection, must be an array of constraints with ids & fields to update',
      ),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const constraints = await updateManyConstraints(request.body);

    return response.status(200).json(constraints);
  },
);

export { router as updateManyConstraintsRouter };
