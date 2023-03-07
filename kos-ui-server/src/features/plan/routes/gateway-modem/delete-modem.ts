import { requireAuth } from '@kythera/common';
import express, { Request, Response } from 'express';

import { deleteGatewayModem } from '../../services';

const router = express.Router();

router.delete(
  '/gateway-modem/:id',
  requireAuth,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const modem = await deleteGatewayModem(Number(id));

    return response.status(200).json(modem);
  },
);

export { router as deleteGatewayModemRouter };
