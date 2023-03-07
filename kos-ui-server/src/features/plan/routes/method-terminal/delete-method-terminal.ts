import { requireAuth } from '@kythera/common';
import express, { Request, Response } from 'express';

import { deleteMethodTerminal } from '../../services';

const router = express.Router();

router.delete(
  '/method-terminal/:id',
  requireAuth,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const methodTerminal = await deleteMethodTerminal(Number(id));

    return response.status(200).json(methodTerminal);
  },
);

export { router as deleteMethodTerminalRouter };
