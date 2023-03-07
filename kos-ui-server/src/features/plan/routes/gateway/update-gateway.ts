import { requireAuth, validateRequest } from '@kythera/common';
import { LINK_DIRECTION_TYPE, POLARIZATION_TYPE } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { updateGateway } from '../../services';

const router = express.Router();

router.patch(
  '/segment-gateway/:id',
  requireAuth,
  [
    body('gateway_name')
      .optional({ checkFalsy: true, nullable: true })
      .isString()
      .withMessage('Name must be a string'),
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
      .withMessage('Min frequency must be a float'),
    body('max_frequency')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Max frequency must be a float'),
    body('eirp')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('EIRP must be a float'),
    body('gt')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('G/T must be a float'),
    body('npr')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('NPR must be a float'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const param = await updateGateway(Number(id), request.body);

    return response.status(200).json(param);
  },
);

export { router as updateGatewayRouter };
