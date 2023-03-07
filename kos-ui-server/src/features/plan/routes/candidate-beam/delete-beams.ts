import { requireAuth, validateRequest } from '@kythera/common';
import { CandidateBeam } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { deleteManyBeams } from '../../services';

const router = express.Router();

router.delete(
  '/candidate-beam-collection',
  requireAuth,
  [
    body()
      .notEmpty()
      .isArray()
      .custom((beams: CandidateBeam[]) => {
        return beams.every((beam) => {
          return typeof beam === 'object' && typeof beam.id === 'number';
        });
      })
      .withMessage('Beams must be an array of valid beam objects with ids'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const beams = await deleteManyBeams(request.body);

    return response.status(200).json(beams);
  },
);

export { router as deleteManyBeamsRouter };
