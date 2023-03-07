import { NotFoundError, requireAuth } from '@kythera/common';
import axios from 'axios';
import { Request, Response, Router } from 'express';

const router = Router();

router.get('/rainviewer', requireAuth, async (_request: Request, response: Response) => {
  const { data } = await axios.get('https://api.rainviewer.com/public/weather-maps.json');

  if (!data) throw new NotFoundError('No Rain Data Found');

  return response.status(200).json(data);
});

export { router as getRainViewerDataRouter };
