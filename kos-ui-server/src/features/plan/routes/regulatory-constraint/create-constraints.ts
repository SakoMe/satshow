import { requireAuth, validateRequest } from '@kythera/common';
import { RegulatoryConstraint } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { createManyConstraints } from '../../services';

const router = express.Router();

router.post(
  '/constraint-collection',
  requireAuth,
  [
    body()
      .notEmpty()
      .isArray()
      .custom((constraints: RegulatoryConstraint[]) => {
        return constraints.every((constraint) => {
          return (
            typeof constraint === 'object' &&
            typeof constraint.regulatory_constraint_name === 'string' &&
            typeof constraint.direction === 'string' &&
            typeof constraint.polarization === 'string' &&
            typeof constraint.min_frequency === 'number' &&
            typeof constraint.max_frequency === 'number' &&
            typeof constraint.max_copol_directivity === 'number' &&
            typeof constraint.min_crosspol_discrimination === 'number' &&
            typeof constraint.pfd_level === 'number' &&
            typeof constraint.coordinates === 'object'
          );
        });
      }),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const constraints = await createManyConstraints(request.body);

    return response.status(201).json(constraints);
  },
);

export { router as createManyConstraintsRouter };
