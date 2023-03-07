import { requireAuth, validateRequest } from '@kythera/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { IConnectivity } from '../../../../ts';
import { createManyConnectivities } from '../../services';

const router = express.Router();

router.post(
  '/connectivity-collection',
  requireAuth,
  [
    body()
      .notEmpty()
      .isArray()
      .custom((connectivities: IConnectivity[]) => {
        return connectivities.every((connectivity) => {
          return (
            typeof connectivity === 'object' &&
            typeof connectivity.mir === 'number' &&
            typeof connectivity.cir === 'number' &&
            typeof connectivity.availability === 'number' &&
            typeof connectivity.satellite_eirp === 'number' &&
            typeof connectivity.bandwidth === 'number' &&
            typeof connectivity.modcods === 'object' &&
            typeof connectivity.temporal_variations === 'object'
          );
        });
      })
      .withMessage('Please provide valid connectivities'),
  ],
  validateRequest,
  async (request: Request, response: Response) => {
    const connectivities = await createManyConnectivities(request.body);
    return response.status(201).json(connectivities);
  },
);

export { router as createManyConnectivitiesRouter };
