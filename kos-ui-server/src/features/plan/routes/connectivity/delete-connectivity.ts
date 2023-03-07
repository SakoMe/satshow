import { requireAuth } from '@kythera/common';
import express, { Request, Response } from 'express';

import { deleteConnectivity } from '../../services';

const router = express.Router();

router.delete(
  '/connectivity/:id',
  requireAuth,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const connectivity = await deleteConnectivity(Number(id));

    return response.status(200).json(connectivity);
  },
);

export { router as deleteConnectivityRouter };
