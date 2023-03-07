import { requireAuth, validateRequest } from '@kythera/common';
import { GatewayModem } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { createManyGatewayModems } from '../../services';

const router = express.Router();

router.post(
  '/gateway-modem-collection',
  requireAuth,
  [
    body()
      .notEmpty()
      .isArray()
      .custom((modems: GatewayModem[]) => {
        return modems.some((modem) => {
          return (
            typeof modem === 'object' &&
            typeof modem.latitude === 'number' &&
            typeof modem.longitude === 'number' &&
            typeof modem.rof === 'number' &&
            typeof modem.polarization === 'string' &&
            typeof modem.direction === 'string' &&
            typeof modem.min_frequency === 'number' &&
            typeof modem.max_frequency === 'number' &&
            typeof modem.max_span === 'number' &&
            typeof modem.max_agg_tot_sym === 'number' &&
            typeof modem.max_sym_rate === 'number' &&
            typeof modem.min_sym_rate === 'number'
          );
        });
      }),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const modems = await createManyGatewayModems(request.body);

    return response.status(201).json(modems);
  },
);

export { router as createManyGatewayModemsRouter };
