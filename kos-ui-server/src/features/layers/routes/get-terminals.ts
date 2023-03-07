import { NotFoundError, requireAuth } from '@kythera/common';
import { Request, Response, Router } from 'express';

import { getTerminals } from '../services/layers';

const router = Router();

router.get('/terminals', requireAuth, async (_request: Request, response: Response) => {
  const terminals = await getTerminals();
  if (!terminals) throw new NotFoundError('Terminals not found');
  return response.status(200).json(terminals);
});

export { router as layerTerminalsRouter };
