import { requireAuth, validateRequest } from '@kythera/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { IConnectivity } from '../../../../ts';
import { deleteManyConnectivities } from '../../services';

const router = express.Router();

router.delete(
  '/connectivity-collection',
  requireAuth,
  [
    body()
      .optional({ nullable: true, checkFalsy: true })
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
    const terminals = await deleteManyConnectivities(request.body);
    return response.status(200).json(terminals);
  },
);

export { router as deleteManyConnectivitiesRouter };
