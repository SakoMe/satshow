import { requireAuth, validateRequest } from '@kythera/common';
import { MethodTerminal } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { createManyMethodTerminals } from '../../services';

const router = express.Router();

router.post(
  '/method-terminal-collection',
  requireAuth,
  [
    body()
      .notEmpty()
      .isArray()
      .custom((terminals: MethodTerminal[]) => {
        return terminals.every((terminal) => {
          return (
            typeof terminal === 'object' &&
            typeof terminal.terminal_method === 'string' &&
            typeof terminal.avg_num_of_termninals_per_square_km === 'number' &&
            typeof terminal.method_terminals === 'object'
          );
        });
      }),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const methodTerminals = await createManyMethodTerminals(request.body);

    return response.status(201).json(methodTerminals);
  },
);

export { router as createManyMethodTerminalsRouter };
