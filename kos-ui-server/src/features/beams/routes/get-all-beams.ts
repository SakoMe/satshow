import { getCurrentUser, NotFoundError, requireAuth } from '@kythera/common';
import { Request, Response, Router } from 'express';

import { getAllBasebandBeams } from '../services/beams';

const router = Router();

router.get(
  '/beams',
  getCurrentUser,
  requireAuth,
  async (_request: Request, response: Response) => {
    const beams = await getAllBasebandBeams();
    if (!beams) throw new NotFoundError('Beams not found');

    return response.status(200).json(beams);
  },
);

export { router as getAllBasebandBeamsRouter };
