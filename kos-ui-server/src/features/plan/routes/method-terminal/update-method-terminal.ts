import { requireAuth, validateRequest } from '@kythera/common';
import { SegmentTerminal, TERMINAL_METHOD_TYPE } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { updateMethodTerminal } from '../../services';

const router = express.Router();

router.patch(
  '/method-terminal/:id',
  requireAuth,
  [
    body('terminal_method')
      .optional({ checkFalsy: true, nullable: true })
      .isIn(Object.values(TERMINAL_METHOD_TYPE))
      .withMessage('Please choose a valid Terminal Method Type'),
    body('avg_num_of_termninals_per_square_km')
      .optional({ checkFalsy: true, nullable: true })
      .isInt()
      .withMessage('Average number of terminals per square km must be an integer'),
    body('method_terminals')
      .optional({ checkFalsy: true, nullable: true })
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
            typeof terminal.target_availability_return === 'number' &&
            typeof terminal.modcods_return === 'object' &&
            typeof terminal.temporal_variations_forward === 'object' &&
            typeof terminal.temporal_variations_return === 'object' &&
            typeof terminal.flight_paths === 'object' &&
            typeof terminal.modcods_forward === 'object'
          );
        });
      })
      .withMessage('Please provide valid method terminals'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const terminal = await updateMethodTerminal(Number(id), request.body);

    return response.status(200).json(terminal);
  },
);

export { router as updateMethodTerminalRouter };
