import { requireAuth, validateRequest } from '@kythera/common';
import { LINK_DIRECTION_TYPE, POLARIZATION_TYPE } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { createGateway } from '../../services';

const router = express.Router();

router.post(
  '/segment-gateway',
  requireAuth,
  [
    body('gateway_name').isString().notEmpty().withMessage('Name is required'),
    body('latitude')
      .notEmpty()
      .isFloat()
      .withMessage('Latitude is required & must be a float'),
    body('longitude')
      .notEmpty()
      .isFloat()
      .withMessage('Longitude is required & must be a float'),
    body('polarization')
      .notEmpty()
      .isIn(Object.values(POLARIZATION_TYPE))
      .withMessage('Invalid Polarization type'),
    body('direction')
      .notEmpty()
      .isIn(Object.values(LINK_DIRECTION_TYPE))
      .withMessage('Invalid Link Direction type'),
    body('min_frequency')
      .notEmpty()
      .isFloat()
      .withMessage('Min frequency is required & must be a float'),
    body('max_frequency')
      .notEmpty()
      .isFloat()
      .withMessage('Max frequency is required & must be a float'),
    body('eirp').notEmpty().isFloat().withMessage('EIRP is required & must be a float'),
    body('gt').notEmpty().isFloat().withMessage('G/T is required & must be a float'),
    body('npr').notEmpty().isFloat().withMessage('NPR is required & must be a float'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const gateway = await createGateway(request.body);

    return response.status(201).json(gateway);
  },
);

export { router as createGatewayRouter };
