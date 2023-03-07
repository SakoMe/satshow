import { requireAuth, validateRequest } from '@kythera/common';
import { SegmentGateway } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { deleteManyGateways } from '../../services';

const router = express.Router();

router.delete(
  '/segment-gateway-collection',
  requireAuth,
  [
    body()
      .notEmpty()
      .isArray()
      .custom((gatways: SegmentGateway[]) => {
        return gatways.every((gatway) => {
          return typeof gatway === 'object' && typeof gatway.id === 'number';
        });
      })
      .withMessage(
        'Invalid gateway collection, must be an array of gateway objects with ids',
      ),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const gateways = await deleteManyGateways(request.body);

    return response.status(200).json(gateways);
  },
);

export { router as deleteManyGatewaysRouter };
