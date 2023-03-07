import { requireAuth, validateRequest } from '@kythera/common';
import { CandidateBeam } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { createManyBeams } from '../../services';

const router = express.Router();

router.post(
  '/candidate-beam-collection',
  requireAuth,
  [
    body()
      .notEmpty()
      .isArray()
      .custom((beams: CandidateBeam[]) => {
        return beams.every((beam) => {
          return (
            typeof beam === 'object' &&
            typeof beam.beam_diameter === 'number' &&
            typeof beam.latitude === 'number' &&
            typeof beam.longitude === 'number'
          );
        });
      })
      .withMessage(
        'Invalid beam collection, must be an array of beams with beam_diameter, latitude, and longitude',
      ),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const beams = await createManyBeams(request.body);

    return response.status(201).json(beams);
  },
);

export { router as createManyBeamsRouter };
