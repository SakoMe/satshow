import { requireAuth, validateRequest } from '@kythera/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { ICoordinate } from '../../../../ts';
import { updateRegion } from '../../services';

const router = express.Router();

router.patch(
  '/region/:id',
  requireAuth,
  [
    body('region_name')
      .optional({ checkFalsy: true, nullable: true })
      .isString()
      .withMessage('Region name must be a string'),
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
      .withMessage(
        'Coordinates need to be an array of objects with lat and lng properties',
      ),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const region = await updateRegion(Number(id), request.body);

    return response.status(200).json(region);
  },
);

export { router as updateRegionRouter };
