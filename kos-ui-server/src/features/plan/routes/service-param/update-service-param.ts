import { requireAuth, validateRequest } from '@kythera/common';
import {
  FREQUENCY_BAND_TYPE,
  LINK_DIRECTION_TYPE,
  POLARIZATION_TYPE,
} from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { updateServiceParam } from '../../services';

const router = express.Router();

router.patch(
  '/service-param/:id',
  requireAuth,
  [
    body('band')
      .optional({ checkFalsy: true, nullable: true })
      .isIn(Object.values(FREQUENCY_BAND_TYPE))
      .withMessage('Invalid Frequency Band type'),
    body('direction')
      .optional({ checkFalsy: true, nullable: true })
      .isIn(Object.values(LINK_DIRECTION_TYPE))
      .withMessage('Invalid Link Direction type'),
    body('polarization')
      .optional({ checkFalsy: true, nullable: true })
      .isIn(Object.values(POLARIZATION_TYPE))
      .withMessage('Invalid Polarization type'),
    body('frequency_start')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Frequency start is required'),
    body('frequency_end')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Frequency end is required'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const param = await updateServiceParam(Number(id), request.body);

    return response.status(200).json(param);
  },
);

export { router as updateServiceParamRouter };
