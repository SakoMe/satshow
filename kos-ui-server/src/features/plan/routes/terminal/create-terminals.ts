import { requireAuth, validateRequest } from '@kythera/common';
import { SegmentTerminal } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { createManyTerminals } from '../../services';

const router = express.Router();

router.post(
  '/segment-terminal-collection',
  requireAuth,
  [
    body()
      .notEmpty()
      .isArray()
      .custom((terminals: SegmentTerminal[]) => {
        return terminals.every((terminal) => {
          return (
            typeof terminal === 'object' &&
            typeof terminal.latitude === 'number' &&
            typeof terminal.longitude === 'number' &&
            typeof terminal.eirp === 'number' &&
            typeof terminal.gt === 'number' &&
            typeof terminal.satellite_eirp === 'number' &&
            typeof terminal.bandwidth_forward === 'number' &&
            typeof terminal.bandwidth_return === 'number' &&
            typeof terminal.mir_forward === 'number' &&
            typeof terminal.mir_return === 'number' &&
            typeof terminal.cir_forward === 'number' &&
            typeof terminal.cir_return === 'number' &&
            typeof terminal.target_availability_forward === 'number' &&
            typeof terminal.target_availability_return === 'number'
            // typeof terminal.modcods_return === 'object' &&
            // typeof terminal.temporal_variations_forward === 'object' &&
            // typeof terminal.temporal_variations_return === 'object' &&
            // typeof terminal.flight_paths === 'object' &&
            // typeof terminal.modcods_forward === 'object'
          );
        });
      }),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const terminals = await createManyTerminals(request.body);

    return response.status(201).json(terminals);
  },
);

export { router as createManyTerminalsRouter };
