import { requireAuth, validateRequest } from '@kythera/common';
import { BEAM_TYPE } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { updateBeam } from '../../services';

const router = express.Router();

router.patch(
  '/candidate-beam/:id',
  requireAuth,
  [
    body('beam_type')
      .optional({ checkFalsy: true, nullable: true })
      .isIn(Object.values(BEAM_TYPE))
      .withMessage('Invalid beam type'),
    body('beam_diameter')
      .if(body('beam_type').equals(BEAM_TYPE.Uniform || BEAM_TYPE.Follow_me))
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Beam diameter must be a float'),
    body('spacing')
      .if(body('beam_type').equals(BEAM_TYPE.Uniform))
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Spacing must be a float'),
    body('latitude')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Latitude must be a float'),
    body('longitude')
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Longitude must be a float'),
    body('beam_diameter_range_min')
      .if(body('beam_type').equals(BEAM_TYPE.Non_uniform))
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Beam diameter min must be a float'),
    body('beam_diameter_range_max')
      .if(body('beam_type').equals(BEAM_TYPE.Non_uniform))
      .optional({ checkFalsy: true, nullable: true })
      .isFloat()
      .withMessage('Beam diameter max must be a float'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const beam = await updateBeam(Number(id), request.body);

    return response.status(200).json(beam);
  },
);

export { router as updateBeamRouter };
