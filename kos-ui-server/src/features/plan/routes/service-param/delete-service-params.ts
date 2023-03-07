import { requireAuth } from '@kythera/common';
import { ServiceParam } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { deleteManyServiceParams } from '../../services';

const router = express.Router();

router.delete(
  '/service-param-collection',
  [
    body()
      .notEmpty()
      .isArray()
      .custom((params: ServiceParam[]) => {
        return params.every((param) => {
          return typeof param === 'object' && typeof param.id === 'number';
        });
      })
      .withMessage(
        'Invalid service param collection, must be an array of service params objects with ids',
      ),
  ],
  requireAuth,
  async (request: Request, response: Response) => {
    const params = await deleteManyServiceParams(request.body);

    return response.status(200).json(params);
  },
);

export { router as deleteManyServiceParamsRouter };
