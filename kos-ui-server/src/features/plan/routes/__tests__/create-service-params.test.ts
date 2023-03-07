import {
  FREQUENCY_BAND_TYPE,
  GAIN_MODE_TYPE,
  LINK_DIRECTION_TYPE,
  POLARIZATION_TYPE,
  SERVICE_SEGMENT_DATA_TYPE,
  SERVICE_SEGMENT_TYPE,
} from '@prisma/client';
import request from 'supertest';

import app from '../../../../app';
import { createUser } from '../../../auth/services/users';

describe('POST /api/v1/service-param-collection', () => {
  it('has a route handler listening to /api/v1/service-param-collection', async () => {
    const response = await request(app).post('/api/v1/service-param-collection');

    expect(response.status).not.toEqual(404);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    await request(app).post('/api/v1/service-param-collection').expect(401);
  });

  it('returns a 422 if invalid or incomplete params data is sent', async () => {
    await request(app)
      .post('/api/v1/service-param-collection')
      .set('Cookie', global.setAuthCookie())
      .send({ band: 'fail' })
      .expect(422);
  });

  it('returns a 201 if params are created under a valid user', async () => {
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

    await request(app)
      .post('/api/v1/service-param-collection')
      .set('Cookie', cookie)
      .send([
        {
          band: FREQUENCY_BAND_TYPE.Ku,
          direction: LINK_DIRECTION_TYPE.UpLink,
          polarization: POLARIZATION_TYPE.HLP,
          frequency_start: 5,
          frequency_end: 10,
          service_segment_id: segment.id,
        },
        {
          band: FREQUENCY_BAND_TYPE.C,
          direction: LINK_DIRECTION_TYPE.DownLink,
          polarization: POLARIZATION_TYPE.VLP,
          frequency_start: 20,
          frequency_end: 25,
          service_segment_id: segment.id,
        },
      ])
      .expect(201);
  });
});
