import { requireAuth, validateRequest } from '@kythera/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { IFlightPath, IModCod, ITemporalVariation } from '../../../../ts';
import { updateTerminal } from '../../services';

const router = express.Router();

router.patch(
  '/segment-terminal/:id',
  requireAuth,
  [
    body('latitude')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Latitude must be a number'),
    body('longitude')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Longitude must be a number'),
    body('eirp')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('EIRP must be a number'),
    body('gt')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('G/T must be a number'),
    body('satellite_eirp')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Satellite EIRP must be a number'),
    body('bandwidth_forward')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Bandwidth forward must be a number'),
    body('bandwidth_return')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Bandwidth return must be a number'),
    body('mir_forward')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('MIR forward must be a number'),
    body('mir_return')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('MIR return must be a number'),
    body('cir_forward')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('CIR forward must be a number'),
    body('cir_return')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('CIR return must be a number'),
    body('target_availability_forward')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Target availability forward must be a number'),
    body('target_availability_return')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Target availability return must be a number'),
    body('flight_paths')
      .optional({ checkFalsy: true, nullable: true })
      .isArray()
      .custom((paths: IFlightPath[]) => {
        return paths.every((path) => {
          return (
            typeof path === 'object' &&
            typeof path.time === 'string' &&
            typeof path.lat === 'number' &&
            typeof path.lng === 'number' &&
            typeof path.alt === 'number'
          );
        });
      })
      .withMessage(
        'Flight paths must be an array of objects with time, lat, lng, and alt properties',
      ),
    body('temporal_variations_forward')
      .optional({ checkFalsy: true, nullable: true })
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
        'Temporal variations forward must be an array of objects with time and demand properties',
      ),
    body('temporal_variations_return')
      .optional({ checkFalsy: true, nullable: true })
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
        'Temporal variations return must be an array of objects with time and demand properties',
      ),
    body('modcods_forward')
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
        'Modcods forward must be an array of ModCod objects with name, spec_eff_ideal, spec_eff, and esno properties',
      ),
    body('modcods_return')
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
        'Modcods forward must be an array of ModCod objects with name, spec_eff_ideal, spec_eff, and esno properties',
      ),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const terminal = await updateTerminal(Number(id), request.body);

    return response.status(200).json(terminal);
  },
);

export { router as updateTerminalRouter };
