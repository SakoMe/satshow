import { requireAuth, validateRequest } from '@kythera/common';
import { SegmentTerminal } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { IModCod, ITemporalVariation } from '../../../../ts';
import { createConnectivity } from '../../services';

const router = express.Router();

router.post(
  '/connectivity',
  requireAuth,
  [
    body('uplink_terminals')
      .notEmpty()
      .isArray()
      .custom((terminals: SegmentTerminal[]) => {
        return terminals.every((terminal) => {
          return typeof terminal === 'object' && typeof terminal.id === 'number';
        });
      })
      .withMessage('Please provide valid terminals'),
    body('downlink_terminals')
      .notEmpty()
      .isArray()
      .custom((terminals: SegmentTerminal[]) => {
        return terminals.every((terminal) => {
          return typeof terminal === 'object' && typeof terminal.id === 'number';
        });
      })
      .withMessage('Please provide valid terminals'),
    body('mir')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('MIR must be a float'),
    body('cir')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('CIR must be a float'),
    body('availability')
      .optional({ checkFalsy: true, nullable: true })
      .isInt()
      .withMessage('Availability must be an integer'),
    body('satellite_eirp')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Satellite EIRP must be a float'),
    body('bandwidth')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Bandwidth must be a float'),
    body('temporal_variations')
      .notEmpty()
      .isArray()
      .custom((variations: ITemporalVariation[]) => {
        return variations.every((variation) => {
          return (
            typeof variation === 'object' &&
            typeof variation.time === 'string' &&
            typeof variation.demand === 'number'
          );
        });
      })
      .withMessage(
        'Temporal variations must be an array of objects with time and demand properties',
      ),
    body('modcods')
      .optional({ checkFalsy: true, nullable: true })
      .isArray()
      .custom((modcods: IModCod[]) => {
        return modcods.every((modcod) => {
          return (
            typeof modcod === 'object' &&
            typeof modcod.name === 'string' &&
            typeof modcod.spec_eff_ideal === 'number' &&
            typeof modcod.spec_eff === 'number' &&
            typeof modcod.esno === 'number'
          );
        });
      })
      .withMessage(
        'Modcods must be an array of ModCod objects with name, spec_eff_ideal, spec_eff, and esno properties',
      ),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const connectivity = await createConnectivity(request.body);
    return response.status(201).json(connectivity);
  },
);

export { router as createConnectivityRouter };
