import { requireAuth, validateRequest } from '@kythera/common';
import { GatewayModem } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { deleteManyGatewayModems } from '../../services';

const router = express.Router();

router.delete(
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
      .withMessage('Please provide valid modems to delete'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const modems = await deleteManyGatewayModems(request.body);

    return response.status(200).json(modems);
  },
);

export { router as deleteManyGatewayModemsRouter };
