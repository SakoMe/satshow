import { requireAuth, validateRequest } from '@kythera/common';
import { LINK_DIRECTION_TYPE, POLARIZATION_TYPE } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { updateGatewayModem } from '../../services';

const router = express.Router();

router.patch(
  '/gateway-modem/:id',
  requireAuth,
  [
    body('latitude')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Latitude must be a float'),
    body('longitude')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Longitude must be a float'),
    body('polarization')
      .optional({ checkFalsy: true, nullable: true })
      .isIn(Object.values(POLARIZATION_TYPE))
      .withMessage('Invalid Polarization type'),
    body('direction')
      .optional({ checkFalsy: true, nullable: true })
      .isIn(Object.values(LINK_DIRECTION_TYPE))
      .withMessage('Invalid Link Direction type'),
    body('min_frequency')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Spacing must be a float'),
    body('max_frequency')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Spacing must be a float'),
    body('max_span')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Spacing must be a float'),
    body('max_agg_tot_sym')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Spacing must be a float'),
    body('max_num_carrier')
      .if(body('direction').equals(LINK_DIRECTION_TYPE.UpLink))
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Max num carrier is required for Uplink & must be a float'),
    body('max_num_slice')
      .if(body('direction').equals(LINK_DIRECTION_TYPE.DownLink))
      .optional({ checkFalsy: true, nullable: true })
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
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Max term is required for DownLinks & must be a float'),
    body('rof')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('ROF must be a float'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const modem = await updateGatewayModem(Number(id), request.body);

    return response.status(200).json(modem);
  },
);

export { router as updateGatewayModemRouter };
