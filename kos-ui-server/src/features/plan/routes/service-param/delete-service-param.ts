import { requireAuth } from '@kythera/common';
import express, { Request, Response } from 'express';

import { deleteServiceParam } from '../../services';

const router = express.Router();

router.delete(
  '/service-param/:id',
  requireAuth,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const param = await deleteServiceParam(Number(id));

    return response.status(200).json(param);
  },
);

export { router as deleteServiceParamRouter };
