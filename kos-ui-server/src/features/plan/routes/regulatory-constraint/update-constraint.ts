import { requireAuth, validateRequest } from '@kythera/common';
import { LINK_DIRECTION_TYPE, POLARIZATION_TYPE } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { ICoordinate } from '../../../../ts';
import { updateConstraint } from '../../services';

const router = express.Router();

router.patch(
  '/constraint/:id',
  requireAuth,
  [
    body('regulatory_constraint_name')
      .optional({ checkFalsy: true, nullable: true })
      .isString()
      .withMessage('Constraint name must be a string'),
    body('direction')
      .optional({ checkFalsy: true, nullable: true })
      .isIn(Object.values(LINK_DIRECTION_TYPE))
      .withMessage('Invalid Link Direction type'),
    body('polarization')
      .optional({ checkFalsy: true, nullable: true })
      .isIn(Object.values(POLARIZATION_TYPE))
      .withMessage('Invalid Polarization type'),
    body('min_frequency')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Min frequency must be a number'),
    body('max_frequency')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Max frequency must be a number'),
    body('max_copol_directivity')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Max copol directivity must be a number'),
    body('min_crosspol_discrimination')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Min crosspol discrimination must be a number'),
    body('pfd_level')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('PFD level must be a number'),
    body('coordinates')
      .optional({ checkFalsy: true, nullable: true })
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
      .withMessage('Coordinates must be an array of objects with lat and lng properties'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const constraint = await updateConstraint(Number(id), request.body);

    return response.status(200).json(constraint);
  },
);

export { router as updateConstraintRouter };
