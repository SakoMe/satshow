import { requireAuth, validateRequest } from '@kythera/common';
import { LINK_DIRECTION_TYPE, POLARIZATION_TYPE } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { ICoordinate } from '../../../../ts';
import { createConstraint } from '../../services';

const router = express.Router();

router.post(
  '/constraint',
  requireAuth,
  [
    body('regulatory_constraint_name')
      .notEmpty()
      .isString()
      .withMessage('Constraint name is required'),
    body('direction')
      .notEmpty()
      .isIn(Object.values(LINK_DIRECTION_TYPE))
      .withMessage('Invalid Link Direction type'),
    body('polarization')
      .notEmpty()
      .isIn(Object.values(POLARIZATION_TYPE))
      .withMessage('Invalid Polarization type'),
    body('min_frequency')
      .notEmpty()
      .isFloat({ min: 0, max: 70 })
      .withMessage('Min frequency is required and must be between 0 and 70'),
    body('max_frequency')
      .notEmpty()
      .isFloat({ min: 0, max: 70 })
      .withMessage('Max frequency is required and must be between 0 and 70'),
    body('max_copol_directivity')
      .notEmpty()
      .isFloat()
      .withMessage('Max copol directivity is required'),
    body('min_crosspol_discrimination')
      .notEmpty()
      .isFloat()
      .withMessage('Min crosspol discrimination is required'),
    body('pfd_level').notEmpty().isFloat().withMessage('PFD level is required'),
    body('coordinates')
      .notEmpty()
      .isArray()
      .custom((coordinates: ICoordinate[]) => {
        return coordinates.every((coordinate) => {
          return (
            typeof coordinate === 'object' &&
            typeof coordinate.lat === 'number' &&
            typeof coordinate.lng === 'number'
          );
        });
      })
      .withMessage(
        'Coordinates are required and must be an array of objects with lat and lng properties',
      ),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const constraint = await createConstraint(request.body);

    return response.status(201).json(constraint);
  },
);

export { router as createConstraintRouter };
