import { NotFoundError, requireAuth } from '@kythera/common';
import { Request, Response, Router } from 'express';

import { getAllGatewaysForServiceSegment } from '../../services';

const router = Router();

router.get(
  '/service-segment/segment-gateway/:service_segment_id',
  requireAuth,
  async (request: Request, response: Response) => {
    const { service_segment_id } = request.params;
    const gateways = await getAllGatewaysForServiceSegment(Number(service_segment_id));
    if (!gateways) throw new NotFoundError('Gateways not found');

    return response.status(200).json(gateways);
  },
);

export { router as getServiceSegmentGatewaysRouter };
