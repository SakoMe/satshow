import { requireAuth, validateRequest } from '@kythera/common';
import {
  GAIN_MODE_TYPE,
  SERVICE_SEGMENT_DATA_TYPE,
  SERVICE_SEGMENT_TYPE,
} from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { updateServiceSegment } from '../../services';

const router = express.Router();

router.patch(
  '/service-segment/:id',
  requireAuth,
  [
    body('service_segment_name')
      .optional({ checkFalsy: true, nullable: true })
      .isString()
      .withMessage('Name must be a string'),
    body('service_segment_type')
      .optional({ checkFalsy: true, nullable: true })
      .isIn(Object.values(SERVICE_SEGMENT_TYPE))
      .withMessage('Please choose a valid Service Segment Type'),
    body('service_segment_data_type')
      .optional({ checkFalsy: true, nullable: true })
      .isIn(Object.values(SERVICE_SEGMENT_DATA_TYPE))
      .withMessage('Please choose a valid Service Segment Data Type'),
    body('service_segment_priority')
      .optional({ checkFalsy: true, nullable: true })
      .isInt({ min: -10, max: 10 })
      .withMessage('Priority must be an integer between -10 and 10'),
    body('service_segment_gateway_handover')
      .optional({ checkFalsy: true, nullable: true })
      .isBoolean()
      .withMessage('Gateway handover must be true or false'),
    body('defrag_userlink_allowed')
      .optional({ checkFalsy: true, nullable: true })
      .isBoolean()
      .withMessage('Defrag userlink allowed must be true or false'),
    body('service_segment_gain_mode')
      .optional({ checkFalsy: true, nullable: true })
      .isIn(Object.values(GAIN_MODE_TYPE))
      .withMessage('Please choose a valid Gain Mode Type'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const serviceSegment = await updateServiceSegment(Number(id), request.body);

    return response.status(200).json(serviceSegment);
  },
);

export { router as updateServiceSegmentRouter };
