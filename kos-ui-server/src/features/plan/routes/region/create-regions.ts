import { requireAuth, validateRequest } from '@kythera/common';
import { Region } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { createManyRegions } from '../../services';

const router = express.Router();

router.post(
  '/region-collection',
  requireAuth,
  [
    body()
      .notEmpty()
      .isArray()
      .custom((regions: Region[]) => {
        return regions.every((region) => {
          return (
            typeof region === 'object' &&
            typeof region.region_name === 'string' &&
            typeof region.coordinates === 'object'
          );
        });
      }),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const regions = await createManyRegions(request.body);

    return response.status(201).json(regions);
  },
);

export { router as createManyRegionsRouter };
