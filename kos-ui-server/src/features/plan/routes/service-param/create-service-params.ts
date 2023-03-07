import { requireAuth, validateRequest } from '@kythera/common';
import { ServiceParam } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { createManyServiceParams } from '../../services';

const router = express.Router();

router.post(
  '/service-param-collection',
  requireAuth,
  [
    body()
      .notEmpty()
      .isArray()
      .custom((params: ServiceParam[]) => {
        return params.every((param) => {
          return (
            typeof param === 'object' &&
            typeof param.band === 'string' &&
            typeof param.direction === 'string' &&
            typeof param.polarization === 'string' &&
            typeof param.frequency_start === 'number' &&
            typeof param.frequency_end === 'number'
          );
        });
      }),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const params = await createManyServiceParams(request.body);

    return response.status(201).json(params);
  },
);

export { router as createManyServiceParamsRouter };
