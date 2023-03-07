import { NotFoundError, requireAuth } from '@kythera/common';
import { Request, Response, Router } from 'express';

import { getAllTerminals } from '../../services';

const router = Router();

router.get(
  '/segment-terminal',
  requireAuth,
  async (_request: Request, response: Response) => {
    const terminals = await getAllTerminals();

    if (!terminals) throw new NotFoundError('Terminals not found');

    return response.status(200).json(terminals);
  },
);

export { router as getAllSegmentTerminalsRouter };
