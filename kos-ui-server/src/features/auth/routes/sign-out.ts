import { Request, Response, Router } from 'express';

const router = Router();

router.post('/users/signout', async (request: Request, response: Response) => {
  request.session = null;
  response.sendStatus(204);
});

export { router as signOutRouter };
