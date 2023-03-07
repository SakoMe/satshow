import { getCurrentUser, NotFoundError, requireAuth } from '@kythera/common';
import { Request, Response, Router } from 'express';

import { getAllLogs } from '../services/logs';

const router = Router();

router.get(
  '/logs',
  getCurrentUser,
  requireAuth,
  async (_request: Request, response: Response) => {
    const logs = await getAllLogs();
    if (!logs) throw new NotFoundError('Gateways not found');

    return response.status(200).json(logs);
  },
);

export { router as getAllLogsRouter };
