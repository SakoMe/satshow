import { requireAuth, validateRequest } from '@kythera/common';
import {
  FREQUENCY_BAND_TYPE,
  LINK_DIRECTION_TYPE,
  POLARIZATION_TYPE,
} from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { createServiceParam } from '../../services';

const router = express.Router();

router.post(
  '/service-param',
  requireAuth,
  [
    body('band')
      .notEmpty()
      .isIn(Object.values(FREQUENCY_BAND_TYPE))
      .withMessage('Invalid Frequency Band type'),
    body('direction')
      .notEmpty()
      .isIn(Object.values(LINK_DIRECTION_TYPE))
      .withMessage('Invalid Link Direction type'),
    body('polarization')
      .notEmpty()
      .isIn(Object.values(POLARIZATION_TYPE))
      .withMessage('Invalid Polarization type'),
    body('frequency_start')
      .notEmpty()
      .isFloat({ min: 0, max: 70 })
      .withMessage('Frequency start is required and must be between 0 and 70'),
    body('frequency_end')
      .notEmpty()
      .isFloat({ min: 0, max: 70 })
      .withMessage('Frequency end is required and must be between 0 and 70'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const param = await createServiceParam(request.body);

    return response.status(201).json(param);
  },
);

export { router as createServiceParamRouter };
