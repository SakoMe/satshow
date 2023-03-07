import { requireAuth } from '@kythera/common';
import { RegulatoryConstraint } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { deleteManyConstraints } from '../../services';

const router = express.Router();

router.delete(
  '/constraint-collection',
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
        'Invalid constraint collection, must be an array of constraint objects with ids',
      ),
  ],
  requireAuth,
  async (request: Request, response: Response) => {
    const constraints = await deleteManyConstraints(request.body);

    return response.status(200).json(constraints);
  },
);

export { router as deleteManyConstraintsRouter };
