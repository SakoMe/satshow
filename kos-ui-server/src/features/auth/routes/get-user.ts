import { getCurrentUser, NotFoundError, requireAuth } from '@kythera/common';
import { Request, Response, Router } from 'express';

import { getUserById } from '../services/users';

const router = Router();

router.get(
  '/users/:user_id',
  getCurrentUser,
  requireAuth,
  async (request: Request, response: Response) => {
    const { user_id } = request.params;

    const user = await getUserById(+user_id);
    if (!user) throw new NotFoundError('User not found');

    return response.status(200).json(user);
  },
);

export { router as getUserRouter };
