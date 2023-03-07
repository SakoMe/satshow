import {
  GAIN_MODE_TYPE,
  SERVICE_SEGMENT_DATA_TYPE,
  SERVICE_SEGMENT_TYPE,
} from '@prisma/client';
import request from 'supertest';

import app from '../../../../app';
import { createUser } from '../../../auth/services/users';

describe('POST /api/v1/connectivity', () => {
  jest.setTimeout(10000);

  it('has a route handler listening to /api/v1/connectivity', async () => {
    const response = await request(app).post('/api/v1/connectivity');

    expect(response.status).not.toEqual(404);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    await request(app).post('/api/v1/connectivity').expect(401);
  });

  it('returns a 422 if invalid or incomplete connectivity data is sent', async () => {
    await request(app)
      .post('/api/v1/connectivity')
      .set('Cookie', global.setAuthCookie())
      .send({})
      .expect(422);
  });

  it('returns a 201 if a connectivity is created under a valid user', async () => {
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

    const terminalResponse1 = await request(app)
      .post('/api/v1/segment-terminal')
      .set('Cookie', cookie)
      .send({
        latitude: 40,
        longitude: 40,
        eirp: 1,
        gt: 1,
        service_segment_id: segment.id,
      });
    const terminal1 = terminalResponse1.body;

    const terminalResponse2 = await request(app)
      .post('/api/v1/segment-terminal')
      .set('Cookie', cookie)
      .send({
        latitude: 40,
        longitude: 40,
        eirp: 1,
        gt: 1,
        service_segment_id: segment.id,
      });
    const terminal2 = terminalResponse2.body;

    await request(app)
      .post('/api/v1/connectivity')
      .set('Cookie', cookie)
      .send({
        uplink_terminals: [{ ...terminal1 }],
        downlink_terminals: [{ ...terminal2 }],
        mir: 0,
        cir: 0,
        availability: 0,
        satellite_eirp: 0,
        bandwidth: 0,
        temporal_variations: [{ time: 'time', demand: 0 }],
        modcods: [{ name: 'modcod', spec_eff_ideal: 1, spec_eff: 0, esno: 0 }],
        service_segment_id: segment.id,
      })
      .expect(201);
  });
});