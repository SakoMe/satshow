import { requireAuth } from '@kythera/common';
import express, { Request, Response } from 'express';

import { deleteBeam } from '../../services';

const router = express.Router();

router.delete(
  '/candidate-beam/:id',
  requireAuth,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const beam = await deleteBeam(Number(id));

    return response.status(200).json(beam);
  },
);

export { router as deleteBeamRouter };
