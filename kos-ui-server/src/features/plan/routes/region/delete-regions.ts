import { requireAuth } from '@kythera/common';
import { Region } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { deleteManyRegions } from '../../services';

const router = express.Router();

router.delete(
  '/region-collection',
  body()
    .notEmpty()
    .isArray()
    .custom((regions: Region[]) => {
      return regions.every((region) => {
        return typeof region === 'object' && typeof region.id === 'number';
      });
    })
    .withMessage(
      'Invalid region collection, must be an array of region objects with ids',
    ),
  requireAuth,
  async (request: Request, response: Response) => {
    const regions = await deleteManyRegions(request.body);

    return response.status(200).json(regions);
  },
);

export { router as deleteManyRegionsRouter };
