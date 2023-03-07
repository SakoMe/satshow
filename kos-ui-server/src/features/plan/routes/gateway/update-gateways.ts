import { requireAuth, validateRequest } from '@kythera/common';
import { SegmentGateway } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { updateManyGateways } from '../../services';

const router = express.Router();

router.patch(
  '/segment-gateway-collection',
  requireAuth,
  [
    body()
      .notEmpty()
      .isArray()
      .custom((gatways: SegmentGateway[]) => {
        return gatways.some((gatway) => {
          return typeof gatway === 'object' && typeof gatway.id === 'number';
        });
      })
      .withMessage(
        'Invalid gateway collection, must be an array of gateway objects & fields to update',
      ),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const gateways = await updateManyGateways(request.body);

    return response.status(200).json(gateways);
  },
);

export { router as updateManyGatewaysRouter };
