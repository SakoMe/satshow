import { requireAuth, validateRequest } from '@kythera/common';
import { SegmentTerminal, TERMINAL_METHOD_TYPE } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { createMethodTerminal } from '../../services';

const router = express.Router();

router.post(
  '/method-terminal',
  requireAuth,
  [
    body('terminal_method')
      .notEmpty()
      .isIn(Object.values(TERMINAL_METHOD_TYPE))
      .withMessage('Please choose a valid Terminal Method Type'),
    body('avg_num_of_termninals_per_square_km')
      .notEmpty()
      .isInt()
      .withMessage(
        'Average number of terminals per square km is required and must be an integer',
      ),
    body('method_terminals')
      .notEmpty()
      .isArray()
      .custom((terminals: SegmentTerminal[]) => {
        return terminals.every((terminal) => {
          return (
            typeof terminal === 'object' &&
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
            typeof terminal.target_availability_return === 'number' &&
            typeof terminal.modcods_return === 'object' &&
            typeof terminal.temporal_variations_forward === 'object' &&
            typeof terminal.temporal_variations_return === 'object' &&
            typeof terminal.flight_paths === 'object' &&
            typeof terminal.modcods_forward === 'object'
          );
        });
      })
      .withMessage('Please provide valid terminals'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const methodTerminal = await createMethodTerminal(request.body);

    return response.status(201).json(methodTerminal);
  },
);

export { router as createMethodTerminalRouter };
