import { requireAuth, validateRequest } from '@kythera/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { ICoordinate } from '../../../../ts';
import { createRegion } from '../../services';

const router = express.Router();

router.post(
  '/region',
  requireAuth,
  [
    body('region_name').notEmpty().withMessage('Region name is required'),
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
      .withMessage('Coordinates are required'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const region = await createRegion(request.body);

    return response.status(201).json(region);
  },
);

export { router as createRegionRouter };
