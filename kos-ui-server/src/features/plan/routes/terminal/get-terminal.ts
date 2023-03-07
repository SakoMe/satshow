import { NotFoundError, requireAuth } from '@kythera/common';
import { Request, Response, Router } from 'express';

import { getTerminal } from '../../services';

const router = Router();

router.get(
  '/segment-terminal/:id',
  requireAuth,
  async (request: Request, response: Response) => {
    const { id } = request.params;

    const terminal = await getTerminal(Number(id));

    if (!terminal) throw new NotFoundError('Terminal not found');

    return response.status(200).json(terminal);
  },
);

export { router as getTerminalRouter };
