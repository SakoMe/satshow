import { requireAuth, validateRequest } from '@kythera/common';
import { LINK_DIRECTION_TYPE, POLARIZATION_TYPE } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { createGatewayModem } from '../../services';

const router = express.Router();

router.post(
  '/gateway-modem',
  requireAuth,
  [
    body('latitude').notEmpty().isFloat().withMessage('Latitude must be a float'),
    body('longitude').notEmpty().isFloat().withMessage('Longitude must be a float'),
    body('polarization')
      .notEmpty()
      .isIn(Object.values(POLARIZATION_TYPE))
      .withMessage('Invalid Polarization type'),
    body('direction')
      .notEmpty()
      .isIn(Object.values(LINK_DIRECTION_TYPE))
      .withMessage('Invalid Link Direction type'),
    body('min_frequency').notEmpty().isFloat().withMessage('Spacing must be a float'),
    body('max_frequency').notEmpty().isFloat().withMessage('Spacing must be a float'),
    body('max_span').notEmpty().isFloat().withMessage('Spacing must be a float'),
    body('max_agg_tot_sym').notEmpty().isFloat().withMessage('Spacing must be a float'),
    body('max_num_carrier')
      .if(body('direction').equals(LINK_DIRECTION_TYPE.UpLink))
      .notEmpty()
      .isFloat()
      .withMessage('Max num carrier is required for Uplink & must be a float'),
    body('max_num_slice')
      .if(body('direction').equals(LINK_DIRECTION_TYPE.DownLink))
      .notEmpty()
      .isFloat()
      .withMessage('Max num slice must be a float'),
    body('max_sym_rate')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Max sym rate must be a float'),
    body('min_sym_rate')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Max sym rate must be a float'),
    body('max_term')
      .if(body('direction').equals(LINK_DIRECTION_TYPE.DownLink))
      .notEmpty()
      .isFloat()
      .withMessage('Max term is required for DownLinks & must be a float'),
    body('rof').notEmpty().isFloat().withMessage('ROF must be a float'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const modem = await createGatewayModem(request.body);

    return response.status(201).json(modem);
  },
);

export { router as createGatewayModemRouter };
