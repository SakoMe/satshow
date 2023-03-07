import { requireAuth } from '@kythera/common';
import express, { Request, Response } from 'express';

import { deleteTerminal } from '../../services';

const router = express.Router();

router.delete(
  '/segment-terminal/:id',
  requireAuth,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const terminal = await deleteTerminal(Number(id));

    return response.status(200).json(terminal);
  },
);

export { router as deleteTerminalRouter };
