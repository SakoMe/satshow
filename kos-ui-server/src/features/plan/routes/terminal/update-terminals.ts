import { requireAuth, validateRequest } from '@kythera/common';
import { SegmentTerminal } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { updateManyTerminals } from '../../services';

const router = express.Router();

router.patch(
  '/segment-terminal-collection',
  requireAuth,
  [
    body()
      .notEmpty()
      .isArray()
      .custom((terminals: SegmentTerminal[]) => {
        return terminals.every((terminal) => {
          return typeof terminal === 'object' && typeof terminal.id === 'number';
        });
      })
      .withMessage(
        'Invalid terminal collection, must be an array of terminals with ids & fields to update',
      ),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const terminals = await updateManyTerminals(request.body);

    return response.status(200).json(terminals);
  },
);

export { router as updateManyTerminalsRouter };
