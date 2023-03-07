import { requireAuth, validateRequest } from '@kythera/common';
import { ServiceParam } from '@prisma/client';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { updateManyServiceParams } from '../../services';

const router = express.Router();

router.patch(
  '/service-param-collection',
  requireAuth,
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
        'Invalid service param collection, must be an array of service params with ids & fields to update',
      ),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const params = await updateManyServiceParams(request.body);

    return response.status(200).json(params);
  },
);

export { router as updateManyServiceParamsRouter };
