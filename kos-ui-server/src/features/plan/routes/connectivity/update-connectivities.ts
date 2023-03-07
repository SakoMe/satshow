import { requireAuth, validateRequest } from '@kythera/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { IConnectivity } from '../../../../ts';
import { updateManyConnectivities } from '../../services';

const router = express.Router();

router.patch(
  '/connectivity-collection',
  requireAuth,
  [
    body()
      .notEmpty()
      .isArray()
      .custom((connectivities: IConnectivity[]) => {
        return connectivities.every((connectivity) => {
          return typeof connectivity === 'object' && typeof connectivity.id === 'number';
        });
      })
      .withMessage('Please provide valid connectivities to update'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const connectivities = await updateManyConnectivities(request.body);
    return response.status(200).json(connectivities);
  },
);

export { router as updateManyConnectivitiesRouter };
