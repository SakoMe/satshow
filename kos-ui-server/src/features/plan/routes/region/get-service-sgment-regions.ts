import { NotFoundError, requireAuth } from '@kythera/common';
import { Request, Response, Router } from 'express';

import { getAllRegionsForServiceSegment } from '../../services';

const router = Router();

router.get(
  '/service-segment/region/:service_segment_id',
  requireAuth,
  async (request: Request, response: Response) => {
    const { service_segment_id } = request.params;
    const regions = await getAllRegionsForServiceSegment(Number(service_segment_id));
    if (!regions) throw new NotFoundError('Regions not found');

    return response.status(200).json(regions);
  },
);

export { router as getServiceSegmentRegionsRouter };
