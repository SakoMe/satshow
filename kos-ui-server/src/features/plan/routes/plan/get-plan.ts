import { NotFoundError, requireAuth } from '@kythera/common';
import { Request, Response, Router } from 'express';

import { getPlan } from '../../services';

const router = Router();

router.get('/plan/:id', requireAuth, async (request: Request, response: Response) => {
  const { id } = request.params;
  const plan = await getPlan(Number(id));
  if (!plan) throw new NotFoundError('Plan not found');

  return response.status(200).json(plan);
});

export { router as getPlanRouter };
