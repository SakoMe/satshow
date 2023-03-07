import { NotFoundError, requireAuth } from '@kythera/common';
import { Request, Response, Router } from 'express';

import { getBeams } from '../services/layers';

const router = Router();

router.get('/beams', requireAuth, async (_request: Request, response: Response) => {
  const beams = await getBeams();
  if (!beams) throw new NotFoundError('Beams not found');
  return response.status(200).json(beams);
});

export { router as layerBeamsRouter };
