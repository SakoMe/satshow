import {
  GAIN_MODE_TYPE,
  LINK_DIRECTION_TYPE,
  POLARIZATION_TYPE,
  SERVICE_SEGMENT_DATA_TYPE,
  SERVICE_SEGMENT_TYPE,
} from '@prisma/client';
import request from 'supertest';

import app from '../../../../app';
import { createUser } from '../../../auth/services/users';

describe('DELETE /api/v1/constraint-collection', () => {
  jest.setTimeout(10000);

  it('has a route handler listening to /api/v1/constraint-collection', async () => {
    const response = await request(app).del('/api/v1/constraint-collection');

    expect(response.status).not.toEqual(404);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    await request(app).del('/api/v1/constraint-collection').expect(401);
  });

  it('returns a 500 if invalid or incomplete constraints data is sent for deletion', async () => {
    await request(app)
      .del('/api/v1/constraint-collection')
      .set('Cookie', global.setAuthCookie())
      .send({ region_name: 'fail' })
      .expect(500);
  });

  it('returns a 200 if constraints are deleted', async () => {
    const cookie = await getAuthCookie();
    const credentials = { email: 'valid@mail.com', password: 'hello123' };
    const user = await createUser(credentials.email, credentials.password);
    const planResponse = await request(app)
      .post('/api/v1/plan')
      .set('Cookie', cookie)
      .send({
        plan_name: 'plan name',
        number_segments: 1,
        time_period_start: new Date(2023, 2, 8),
        time_period_end: new Date(2023, 2, 9),
        user_id: user.id,
      });
    const plan = planResponse.body;

    const groupResponse = await request(app)
      .post('/api/v1/segment-group')
      .set('Cookie', cookie)
      .send({ service_segment_group_name: 'test group' })
      .expect(201);
    const group = groupResponse.body;

    const segmentResponse = await request(app)
      .post('/api/v1/service-segment')
      .set('Cookie', cookie)
      .send({
        service_segment_name: 'test segment',
        service_segment_type: SERVICE_SEGMENT_TYPE.DTH,
        service_segment_data_type: SERVICE_SEGMENT_DATA_TYPE.Bandwidth,
        service_segment_priority: 0,
        service_segment_gateway_handover: false,
        defrag_userlink_allowed: false,
        service_segment_gain_mode: GAIN_MODE_TYPE.ALC,
        plan_id: plan.id,
        group_id: group.id,
      });
    const segment = segmentResponse.body;

    const constraintsResponse = await request(app)
      .post('/api/v1/constraint-collection')
      .set('Cookie', cookie)
      .send([
        {
          regulatory_constraint_name: 'test constraint 1',
          direction: LINK_DIRECTION_TYPE.UpLink,
          polarization: POLARIZATION_TYPE.LHCP,
          min_frequency: 10,
          max_frequency: 20,
          max_copol_directivity: 1,
          min_crosspol_discrimination: 0,
          pfd_level: 0,
          coordinates: [
            { lat: 0, lng: 0 },
            { lat: 0, lng: 10 },
            { lat: 5, lng: 5 },
          ],
          service_segment_id: segment.id,
        },
        {
          regulatory_constraint_name: 'test constraint 2',
          direction: LINK_DIRECTION_TYPE.DownLink,
          polarization: POLARIZATION_TYPE.LHCP,
          min_frequency: 40,
          max_frequency: 47,
          max_copol_directivity: 1,
          min_crosspol_discrimination: 2,
          pfd_level: 0,
          coordinates: [
            { lat: 0, lng: 0 },
            { lat: 0, lng: 10 },
            { lat: 5, lng: 5 },
          ],
          service_segment_id: segment.id,
        },
      ]);
    const constraints = constraintsResponse.body;

    const response = await request(app)
      .del('/api/v1/constraint-collection')
      .set('Cookie', cookie)
      .send(constraints);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(constraints);
  });
});
