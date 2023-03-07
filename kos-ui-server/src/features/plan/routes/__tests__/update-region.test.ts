import {
  GAIN_MODE_TYPE,
  SERVICE_SEGMENT_DATA_TYPE,
  SERVICE_SEGMENT_TYPE,
} from '@prisma/client';
import request from 'supertest';

import app from '../../../../app';
import { createUser } from '../../../auth/services/users';

describe('PATCH /api/v1/region/:id', () => {
  it('has a route handler listening to /api/v1/region/:id', async () => {
    const response = await request(app).patch('/api/v1/region/:id');

    expect(response.status).not.toEqual(404);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    await request(app).patch('/api/v1/region/:id').expect(401);
  });

  it('returns a 500 if the region does not exist', async () => {
    await request(app)
      .patch('/api/v1/region/0')
      .set('Cookie', global.setAuthCookie())
      .expect(500);
  });

  it('returns a 500 if the region is updated with invalid or incomplete data', async () => {
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

    const regionResponse = await request(app)
      .post('/api/v1/region')
      .set('Cookie', cookie)
      .send({
        region_name: 'test region',
        coordinates: [
          { lat: 0, lng: 0 },
          { lat: 0, lng: 10 },
          { lat: 5, lng: 5 },
        ],
        service_segment_id: segment.id,
      });
    const region = regionResponse.body;

    await request(app)
      .patch(`/api/v1/region/${region.id}`)
      .set('Cookie', cookie)
      .send({ region_name: 0 })
      .expect(500);
  });

  it('returns a 200 if the region is updated', async () => {
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

    const regionResponse = await request(app)
      .post('/api/v1/region')
      .set('Cookie', cookie)
      .send({
        region_name: 'test region',
        coordinates: [
          { lat: 0, lng: 0 },
          { lat: 0, lng: 10 },
          { lat: 5, lng: 5 },
        ],
        service_segment_id: segment.id,
      });
    const region = regionResponse.body;

    const response = await request(app)
      .patch(`/api/v1/region/${region.id}`)
      .set('Cookie', cookie)
      .send({
        region_name: 'different region',
        coordinates: [
          { lat: 0, lng: 0 },
          { lat: 10, lng: 10 },
          { lat: 0, lng: 5 },
        ],
        service_segment_id: segment.id,
      });

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(region.id);
    expect(response.body).not.toEqual(region);
  });
});