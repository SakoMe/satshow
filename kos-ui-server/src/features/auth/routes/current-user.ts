import { getCurrentUser } from '@kythera/common';
import { Router } from 'express';

const router = Router();

router.get('/users/currentuser', getCurrentUser, (request, response) => {
  return response.status(200).json(request.currentUser || null);
});

export { router as currentUserRouter };
