import { requireAuth, validateRequest } from '@kythera/common';
import {
  GAIN_MODE_TYPE,
  SERVICE_SEGMENT_DATA_TYPE,
  SERVICE_SEGMENT_TYPE,
} from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { createServiceSegment } from '../../services';

const router = express.Router();

router.post(
  '/service-segment',
  requireAuth,
  [
    body('service_segment_name').notEmpty().withMessage('Name is required'),
    body('service_segment_type')
      .notEmpty()
      .isIn(Object.values(SERVICE_SEGMENT_TYPE))
      .withMessage('Please choose a valid Service Segment Type'),
    body('service_segment_data_type')
      .isIn(Object.values(SERVICE_SEGMENT_DATA_TYPE))
      .notEmpty()
      .withMessage('Please choose a valid Service Segment Data Type'),
    body('service_segment_priority')
      .notEmpty()
      .isInt({ min: -10, max: 10 })
      .withMessage('Priority is required and must be an integer between -10 and 10'),
    body('service_segment_gateway_handover')
      .notEmpty()
      .isBoolean()
      .withMessage('Gateway handover is required and must be a true or false'),
    body('defrag_userlink_allowed')
      .notEmpty()
      .isBoolean()
      .withMessage('Defrag userlink allowed is required and must be a true or false'),
    body('service_segment_gain_mode')
      .notEmpty()
      .isIn(Object.values(GAIN_MODE_TYPE))
      .withMessage('Please choose a valid Gain Mode Type'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const serviceSegment = await createServiceSegment(request.body);

    return response.status(201).json(serviceSegment);
  },
);

export { router as createServiceSegmentRouter };
