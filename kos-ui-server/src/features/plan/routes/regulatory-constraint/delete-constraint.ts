import { requireAuth } from '@kythera/common';
import express, { Request, Response } from 'express';

import { deleteConstraint } from '../../services';

const router = express.Router();

router.delete(
  '/constraint/:id',
  requireAuth,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const constraint = await deleteConstraint(Number(id));

    return response.status(200).json(constraint);
  },
);

export { router as deleteConstraintRouter };
