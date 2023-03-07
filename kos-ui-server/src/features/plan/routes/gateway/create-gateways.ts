import { requireAuth, validateRequest } from '@kythera/common';
import { SegmentGateway } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { createManyGateways } from '../../services';

const router = express.Router();

router.post(
  '/segment-gateway-collection',
  requireAuth,
  [
    body()
      .notEmpty()
      .isArray()
      .custom((gatways: SegmentGateway[]) => {
        return gatways.every((gatway) => {
          return (
            typeof gatway === 'object' &&
            typeof gatway.gateway_name === 'string' &&
            typeof gatway.latitude === 'number' &&
            typeof gatway.longitude === 'number' &&
            typeof gatway.polarization === 'string' &&
            typeof gatway.direction === 'string' &&
            typeof gatway.min_frequency === 'number' &&
            typeof gatway.max_frequency === 'number' &&
            typeof gatway.eirp === 'number' &&
            typeof gatway.gt === 'number' &&
            typeof gatway.npr === 'number'
          );
        });
      })
      .withMessage(
        'Invalid gateway collection, must be an array of gateway objects with gateway_name, latitude, longitude, polarization, direction, min_frequency, max_frequency, eirp, gt, and npr',
      ),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const gateways = await createManyGateways(request.body);

    return response.status(201).json(gateways);
  },
);

export { router as createManyGatewaysRouter };
