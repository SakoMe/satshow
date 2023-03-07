import { requireAuth, validateRequest } from '@kythera/common';
import { GatewayModem } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { updateManyGatewayModems } from '../../services';

const router = express.Router();

router.patch(
  '/gateway-modem-collection',
  requireAuth,
  [
    body()
      .notEmpty()
      .isArray()
      .custom((modems: GatewayModem[]) => {
        return modems.every((modem) => {
          return typeof modem === 'object' && typeof modem.id === 'number';
        });
      })
      .withMessage(
        'Invalid modem collection, must be an array of modems with ids & fields to update',
      ),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const modems = await updateManyGatewayModems(request.body);

    return response.status(200).json(modems);
  },
);

export { router as updateManyGatewayModemsRouter };
