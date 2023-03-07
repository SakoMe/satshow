import { requireAuth } from '@kythera/common';
import express, { Request, Response } from 'express';

import { deletePlan } from '../../services';

const router = express.Router();

router.delete('/plan/:id', requireAuth, async (request: Request, response: Response) => {
  const { id } = request.params;

  const plan = await deletePlan(Number(id));

  return response.status(200).json(plan);
});

export { router as deletePlanRouter };
