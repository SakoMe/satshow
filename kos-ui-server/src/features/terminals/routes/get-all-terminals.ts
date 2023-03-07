import { NotFoundError, requireAuth } from '@kythera/common';
import { Request, Response, Router } from 'express';

import { getAllTerminals } from '../services/terminals';

const router = Router();

router.get('/terminals', requireAuth, async (_request: Request, response: Response) => {
  const terminals = await getAllTerminals();
  if (!terminals) throw new NotFoundError('Gateways not found');

  return response.status(200).json(terminals);
});

export { router as getAllTerminalsRouter };
